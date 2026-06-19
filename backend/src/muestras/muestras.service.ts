import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import * as XLSX from 'xlsx';
import { Muestra } from './muestra.entity';
import { EvaluacionFisica } from './evaluacion-fisica.entity';
import { EvaluacionSensorial } from './evaluacion-sensorial.entity';
import { CreateMuestraDto } from './dto/create-muestra.dto';
import { UpdateMuestraDto } from './dto/update-muestra.dto';
import { FilterMuestrasDto } from './dto/filter-muestras.dto';
import { BatchSyncDto, OperacionSync } from './dto/batch-sync.dto';
import { PaginatedResult } from '../common/interfaces/api-response.interface';
import { paginate } from '../common/helpers/pagination.helper';
import { KardexService } from '../kardex/kardex.service';
import { TipoMovimientoKardex, ReferenciaTipoKardex } from '../kardex/movimiento-kardex.entity';

export type EstadoSync = 'OK' | 'CONFLICTO' | 'ERROR';

export interface SyncResultItem {
  clientId:  string;
  estado:    EstadoSync;
  serverId?: string;
  mensaje?:  string;
}

export interface BatchSyncResult {
  resultados: SyncResultItem[];
}

export interface DetalleMuestra {
  muestra:              Muestra;
  evaluacionFisica:     EvaluacionFisica | null;
  evaluacionSensorial:  EvaluacionSensorial | null;
}

export interface ImportResult {
  creadas:     number;
  actualizadas: number;
  errores:     string[];
}

export type UpsertEvalDto = {
  productoTipo:  string;
  camposJson:    Record<string, unknown>;
  puntajeTotal?: number;
  evaluadorId?:  number;
  fecha?:        string;
  observaciones?: string;
};

@Injectable()
export class MuestrasService {
  constructor(
    @InjectRepository(Muestra)
    private readonly repo: Repository<Muestra>,
    @InjectRepository(EvaluacionFisica)
    private readonly fisicaRepo: Repository<EvaluacionFisica>,
    @InjectRepository(EvaluacionSensorial)
    private readonly sensorialRepo: Repository<EvaluacionSensorial>,
    private readonly kardexService: KardexService,
  ) {}

  

  findAll(filter: FilterMuestrasDto): Promise<PaginatedResult<Muestra>> {
    const where: Record<string, unknown> = { activo: true };
    if (filter.campanaId)   where['campanaId']   = filter.campanaId;
    if (filter.productorId) where['productorId'] = filter.productorId;
    if (filter.loteFinalId) where['loteFinalId'] = filter.loteFinalId;
    if (filter.loteId)     where['loteId']     = filter.loteId;
    if (filter.tipoMuestra) where['tipoMuestra'] = filter.tipoMuestra;
    if (filter.estado)      where['estado']      = filter.estado;
    if (filter.search?.trim())   where['codigo']   = ILike(`%${filter.search.trim()}%`);
    if (filter.variedad?.trim()) where['variedad'] = ILike(`%${filter.variedad.trim()}%`);

    return paginate(this.repo, filter, {
      where,
      relations: ['campana', 'productor', 'parcela', 'loteFinal', 'lote', 'lote.tipoProducto'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Muestra> {
    const m = await this.repo.findOne({
      where: { id },
      relations: ['campana', 'productor', 'parcela', 'loteFinal', 'lote'],
    });
    if (!m) throw new NotFoundException(`Muestra #${id} no encontrada`);
    return m;
  }

  async findOneWithEvaluaciones(id: number): Promise<DetalleMuestra> {
    const muestra           = await this.findOne(id);
    const evaluacionFisica    = await this.fisicaRepo.findOne({ where: { muestraId: id } }) ?? null;
    const evaluacionSensorial = await this.sensorialRepo.findOne({ where: { muestraId: id } }) ?? null;
    return { muestra, evaluacionFisica, evaluacionSensorial };
  }

  private async generateCodigo(): Promise<string> {
    const year = new Date().getFullYear();
    const last = await this.repo
      .createQueryBuilder('m')
      .select('m.codigo', 'codigo')
      .where('m.codigo LIKE :p', { p: `M-${year}-%` })
      .orderBy('m.id', 'DESC')
      .limit(1)
      .getRawOne<{ codigo: string }>();

    if (last?.codigo) {
      const match = last.codigo.match(/^M-\d{4}-(\d+)$/);
      if (match) {
        const next = parseInt(match[1], 10) + 1;
        return `M-${year}-${String(next).padStart(4, '0')}`;
      }
    }
    return `M-${year}-0001`;
  }


  async create(dto: CreateMuestraDto): Promise<Muestra> {
    if (dto.clientId) {
      const existing = await this.repo.findOne({
        where: { clientId: dto.clientId },
        relations: ['campana', 'productor', 'parcela', 'loteFinal', 'lote'],
      });
      if (existing) return existing;
    }
    const codigo  = await this.generateCodigo();
    const muestra = this.repo.create({ ...dto, codigo });
    const saved   = await this.repo.save(muestra);

    if (saved.loteFinalId && saved.cantidadKg) {
      const fecha = saved.fechaRegistro ?? new Date().toISOString().slice(0, 10);
      await this.kardexService.registrar({
        loteFinalId:    saved.loteFinalId,
        tipoMovimiento: TipoMovimientoKardex.SALIDA,
        cantidadKg:     Number(saved.cantidadKg),
        referenciaTipo: ReferenciaTipoKardex.MUESTRA,
        referenciaId:   saved.id,
        fecha,
        observaciones:  `Envío de muestra ${saved.codigo}`,
      });
    }

    return saved;
  }

  async update(id: number, dto: UpdateMuestraDto): Promise<Muestra> {
    await this.findOne(id);
    await this.repo.update(id, dto as Partial<Muestra>);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const muestra = await this.findOne(id);
    await this.repo.update(id, { activo: false });

    if (muestra.loteFinalId && muestra.cantidadKg) {
      const fecha = muestra.fechaRegistro ?? new Date().toISOString().slice(0, 10);
      await this.kardexService.registrar({
        loteFinalId:    muestra.loteFinalId,
        tipoMovimiento: TipoMovimientoKardex.INGRESO,
        cantidadKg:     Number(muestra.cantidadKg),
        referenciaTipo: ReferenciaTipoKardex.MUESTRA,
        referenciaId:   muestra.id,
        fecha,
        observaciones:  `Reversa eliminación muestra ${muestra.codigo}`,
      });
    }
  }

  

   
  async batchSync(dto: BatchSyncDto): Promise<BatchSyncResult> {
    const resultados: SyncResultItem[] = [];

    for (const op of dto.operaciones) {
      try {
        switch (op.operacion) {
          case OperacionSync.CREATE: {
            const muestra = await this.create({
              ...(op.payload as unknown as CreateMuestraDto),
              clientId: op.clientId,
            });
            resultados.push({ clientId: op.clientId, estado: 'OK', serverId: String(muestra.id) });
            break;
          }

          case OperacionSync.UPDATE: {
            const existing = await this.repo.findOne({ where: { clientId: op.clientId } });
            if (!existing) {
              resultados.push({
                clientId: op.clientId, estado: 'ERROR',
                mensaje: `No se encontró una muestra con clientId "${op.clientId}"`,
              });
              break;
            }

            
            await this.update(existing.id, op.payload as UpdateMuestraDto);
            resultados.push({ clientId: op.clientId, estado: 'OK', serverId: String(existing.id) });
            break;
          }

          case OperacionSync.DELETE: {
            const toDelete = await this.repo.findOne({ where: { clientId: op.clientId } });
            if (toDelete) {
              await this.remove(toDelete.id);
              resultados.push({ clientId: op.clientId, estado: 'OK', serverId: String(toDelete.id) });
            } else {
              
              resultados.push({ clientId: op.clientId, estado: 'OK', mensaje: 'Ya no existe en servidor' });
            }
            break;
          }
        }
      } catch (err) {
        resultados.push({
          clientId: op.clientId,
          estado:   'ERROR',
          mensaje:  (err as Error).message ?? 'Error desconocido',
        });
      }
    }

    return { resultados };
  }

  

  async upsertEvaluacionFisica(muestraId: number, dto: UpsertEvalDto): Promise<EvaluacionFisica> {
    await this.findOne(muestraId);
    const existing = await this.fisicaRepo.findOne({ where: { muestraId } });
    if (existing) {
      await this.fisicaRepo.update(existing.id, dto);
      if (dto.puntajeTotal != null) {
        await this.repo.update(muestraId, { puntajeFisico: dto.puntajeTotal });
      }
      return this.fisicaRepo.findOne({ where: { muestraId } }) as Promise<EvaluacionFisica>;
    }
    const ef    = this.fisicaRepo.create({ ...dto, muestraId });
    const saved = await this.fisicaRepo.save(ef);
    if (dto.puntajeTotal != null) {
      await this.repo.update(muestraId, { puntajeFisico: dto.puntajeTotal });
    }
    return saved;
  }

  async updateEvaluacionFisica(
    muestraId: number,
    evalId: number,
    dto: UpsertEvalDto,
  ): Promise<EvaluacionFisica> {
    const ef = await this.fisicaRepo.findOne({ where: { id: evalId, muestraId } });
    if (!ef) throw new NotFoundException(`EvaluacionFisica #${evalId} no encontrada para muestra #${muestraId}`);
    await this.fisicaRepo.update(evalId, dto);
    if (dto.puntajeTotal != null) {
      await this.repo.update(muestraId, { puntajeFisico: dto.puntajeTotal });
    }
    return this.fisicaRepo.findOne({ where: { id: evalId } }) as Promise<EvaluacionFisica>;
  }

  async upsertEvaluacionSensorial(muestraId: number, dto: UpsertEvalDto): Promise<EvaluacionSensorial> {
    await this.findOne(muestraId);
    const existing = await this.sensorialRepo.findOne({ where: { muestraId } });
    if (existing) {
      await this.sensorialRepo.update(existing.id, dto);
      if (dto.puntajeTotal != null) {
        await this.repo.update(muestraId, { puntajeSensorial: dto.puntajeTotal });
      }
      return this.sensorialRepo.findOne({ where: { muestraId } }) as Promise<EvaluacionSensorial>;
    }
    const es    = this.sensorialRepo.create({ ...dto, muestraId });
    const saved = await this.sensorialRepo.save(es);
    if (dto.puntajeTotal != null) {
      await this.repo.update(muestraId, { puntajeSensorial: dto.puntajeTotal });
    }
    return saved;
  }

  async updateEvaluacionSensorial(
    muestraId: number,
    evalId: number,
    dto: UpsertEvalDto,
  ): Promise<EvaluacionSensorial> {
    const es = await this.sensorialRepo.findOne({ where: { id: evalId, muestraId } });
    if (!es) throw new NotFoundException(`EvaluacionSensorial #${evalId} no encontrada para muestra #${muestraId}`);
    await this.sensorialRepo.update(evalId, dto);
    if (dto.puntajeTotal != null) {
      await this.repo.update(muestraId, { puntajeSensorial: dto.puntajeTotal });
    }
    return this.sensorialRepo.findOne({ where: { id: evalId } }) as Promise<EvaluacionSensorial>;
  }

  

  async exportPreview(filter: FilterMuestrasDto): Promise<{
    data: Array<{ muestra: Muestra; evaluacionFisica: EvaluacionFisica | null; evaluacionSensorial: EvaluacionSensorial | null }>;
    meta: { total: number; page: number; lastPage: number; limit: number };
  }> {
    const result = await this.findAll(filter);
    const ids = result.data.map((m) => m.id);
    let fisicaMap    = new Map<number, EvaluacionFisica>();
    let sensorialMap = new Map<number, EvaluacionSensorial>();
    if (ids.length > 0) {
      const [fisicas, sensoriales] = await Promise.all([
        this.fisicaRepo.createQueryBuilder('ef').where('ef.muestraId IN (:...ids)', { ids }).getMany(),
        this.sensorialRepo.createQueryBuilder('es').where('es.muestraId IN (:...ids)', { ids }).getMany(),
      ]);
      fisicaMap    = new Map(fisicas.map((f) => [f.muestraId, f]));
      sensorialMap = new Map(sensoriales.map((s) => [s.muestraId, s]));
    }
    return {
      data: result.data.map((m) => ({
        muestra:             m,
        evaluacionFisica:    fisicaMap.get(m.id)    ?? null,
        evaluacionSensorial: sensorialMap.get(m.id) ?? null,
      })),
      meta: result.meta,
    };
  }

  async exportExcel(filter: FilterMuestrasDto): Promise<Buffer> {
    const { data } = await this.findAll({ ...filter, page: 1, limit: 5000 });

    let fisicaMap = new Map<number, EvaluacionFisica>();
    let sensorialMap = new Map<number, EvaluacionSensorial>();

    if (data.length > 0) {
      const ids = data.map((m) => m.id);
      const [fisicas, sensoriales] = await Promise.all([
        this.fisicaRepo.createQueryBuilder('ef')
          .where('ef.muestraId IN (:...ids)', { ids })
          .getMany(),
        this.sensorialRepo.createQueryBuilder('es')
          .where('es.muestraId IN (:...ids)', { ids })
          .getMany(),
      ]);
      fisicaMap    = new Map(fisicas.map((f) => [f.muestraId, f]));
      sensorialMap = new Map(sensoriales.map((s) => [s.muestraId, s]));
    }

    const str = (v: unknown): string =>
      v != null && v !== '' ? String(v) : '';

    const MC  = 23;
    const EFC = 15;
    const ESC = 19;

    const headerRow1: string[] = [
      'Muestra',          ...Array(MC  - 1).fill(''),
      'Evaluación Física', ...Array(EFC - 1).fill(''),
      'Evaluación Sensorial', ...Array(ESC - 1).fill(''),
    ];
    const headerRow2: string[] = [
      'Código','Fecha','Fecha Cata','Tipo Muestra','Categoría','Estado','Estado Lote',
      'Productor','Campaña','Lote','Lote Final','Cantidad (kg)','Rendimiento','Humedad%',
      'Variedad','Proceso','Base','Año Cosecha','País','Región',
      'Puntaje Físico','Puntaje Sensorial','Observaciones',
      'Tipo','Fecha Eval.','Puntaje','Humedad Grano','Actividad Grano',
      'Café-Def.Primarios','Café-Def.Secundarios','Café-Color Grano',
      'Cacao-Fermentación%','Cacao-Humedad%','Cacao-Peso 100g',
      'Cacao-Distrito','Cacao-Variedad','Cacao-Calificación','Observaciones',
      'Tipo','Fecha Eval.','Puntaje','Nota Sabor','Nota Sabor Residual','Nota Acidez',
      'Café-Fragancia/Aroma','Café-Sabor','Café-Sabor Residual',
      'Café-Acidez','Café-Cuerpo','Café-Balance',
      'Café-Uniformidad','Café-Taza Limpia','Café-Dulzor',
      'Cacao-Defectos','Cacao-Sabor/Calidad','Cacao-Puntos Catador','Observaciones',
    ];

    const dataRows = data.map((m) => {
      const fisica    = fisicaMap.get(m.id);
      const sensorial = sensorialMap.get(m.id);
      const fc        = (fisica?.camposJson    ?? {}) as Record<string, unknown>;
      const sc        = (sensorial?.camposJson ?? {}) as Record<string, unknown>;
      const cafeSca   = ((sc.cafeSca as Record<string, unknown>)?.sample ?? {}) as Record<string, unknown>;

      return [
        m.codigo,
        m.fechaRegistro    ?? '',
        m.fechaCata        ?? '',
        m.tipoMuestra      ?? '',
        m.categoriaMuestra ?? '',
        m.estado,
        m.estadoLote       ?? '',
        m.productor ? `${m.productor.nombre} ${m.productor.apellido ?? ''}`.trim() : String(m.productorId),
        m.campana?.nombre         ?? String(m.campanaId),
        m.lote?.codigo            ?? '',
        (m.loteFinal as any)?.codigo ?? '',
        m.cantidadKg    != null ? Number(m.cantidadKg).toFixed(3)    : '',
        m.rendimiento   != null ? Number(m.rendimiento).toFixed(3)   : '',
        m.humedad       != null ? Number(m.humedad).toFixed(2)       : '',
        m.variedad      ?? '',
        m.proceso       ?? '',
        m.base          ?? '',
        m.añoCosecha    ?? '',
        m.pais          ?? '',
        m.region        ?? '',
        m.puntajeFisico    != null ? Number(m.puntajeFisico).toFixed(2)    : '',
        m.puntajeSensorial != null ? Number(m.puntajeSensorial).toFixed(2) : '',
        m.observaciones    ?? '',
        fisica?.productoTipo ?? '',
        fisica?.fecha        ?? '',
        fisica?.puntajeTotal  != null ? Number(fisica.puntajeTotal).toFixed(2)  : '',
        str(fc.cafeHumedadGrano   ?? fc.cacaoHumedadGrano),
        str(fc.cafeActividadGrano ?? fc.cacaoActividadGrano),
        str(fc.cafeDefectosPrimarios),
        str(fc.cafeDefectosSecundarios),
        str(fc.cafeColorGrano),
        str(fc.cacaoFermentacionPct),
        str(fc.cacaoHumedadPct),
        str(fc.cacaoPesoCienGranos),
        str(fc.cacaoDistrito),
        str(fc.cacaoVariedad),
        str(fc.cacaoCalificacion),
        fisica?.observaciones ?? '',
        sensorial?.productoTipo ?? '',
        sensorial?.fecha        ?? '',
        sensorial?.puntajeTotal != null ? Number(sensorial.puntajeTotal).toFixed(2) : '',
        str(cafeSca.notaSabor),
        str(cafeSca.notaSaborResidual),
        str(cafeSca.notaAcidez),
        str(cafeSca.fragTotal),
        str(cafeSca.sabor),
        str(cafeSca.saborResidual),
        str(cafeSca.acidez),
        str(cafeSca.cuerpo),
        str(cafeSca.balance),
        str(cafeSca.uniformidad),
        str(cafeSca.tazaLimpia),
        str(cafeSca.dulzor),
        str(sc.defectos),
        str(sc.saborCalidad),
        str(sc.puntosCatador),
        sensorial?.observaciones ?? '',
      ];
    });

    const ws = XLSX.utils.aoa_to_sheet([headerRow1, headerRow2, ...dataRows]);
    ws['!merges'] = [
      { s: { r: 0, c: 0 },        e: { r: 0, c: MC - 1 } },
      { s: { r: 0, c: MC },       e: { r: 0, c: MC + EFC - 1 } },
      { s: { r: 0, c: MC + EFC }, e: { r: 0, c: MC + EFC + ESC - 1 } },
    ];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Muestras');
    return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' }) as Buffer;
  }

   
  async importHistorico(buffer: Buffer): Promise<ImportResult> {
    const result: ImportResult = { creadas: 0, actualizadas: 0, errores: [] };
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const rows: Record<string, unknown>[] = XLSX.utils.sheet_to_json(
      workbook.Sheets[workbook.SheetNames[0]],
      { defval: null },
    );

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      try {
        const clientId    = row['ClientId']    ? String(row['ClientId'])    : undefined;
        const codigo      = row['Codigo']      ? String(row['Codigo'])      : undefined;
        const productorId = Number(row['ProductorId']);
        const campanaId   = Number(row['CampanaId']);

        if (!productorId || !campanaId) {
          result.errores.push(`Fila ${i + 2}: ProductorId y CampanaId son requeridos`);
          continue;
        }

        
        const existing = clientId
          ? await this.repo.findOne({ where: { clientId } })
          : codigo
            ? await this.repo.findOne({ where: { codigo } })
            : null;

        const data: Partial<Muestra> = {
          productorId,
          campanaId,
          fechaRegistro: row['Fecha']       ? String(row['Fecha'])       : null,
          tipoMuestra:   row['TipoMuestra'] ? String(row['TipoMuestra']) : null,
          observaciones: row['Observaciones'] ? String(row['Observaciones']) : null,
        };

        if (existing) {
          await this.repo.update(existing.id, data);
          result.actualizadas++;
        } else {
          const newCodigo = codigo || await this.generateCodigo();
          await this.repo.save(this.repo.create({ ...data, codigo: newCodigo, clientId: clientId ?? null }));
          result.creadas++;
        }
      } catch (err) {
        result.errores.push(`Fila ${i + 2}: ${(err as Error).message}`);
      }
    }
    return result;
  }
}
