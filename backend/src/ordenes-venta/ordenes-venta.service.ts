import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { join } from 'path';
import { unlinkSync, existsSync } from 'fs';
import { OrdenVenta, EtapaOrden, EstadoEtapa } from './orden-venta.entity';
import { OrdenPaso, EstadoPaso, PASOS_LABELS } from './orden-paso.entity';
import { OrdenPreventa }        from './orden-preventa.entity';
import { OrdenCotizacion }      from './orden-cotizacion.entity';
import { OrdenAlistado }        from './orden-alistado.entity';
import { OrdenExportacion }     from './orden-exportacion.entity';
import { OrdenPostVenta }       from './orden-post-venta.entity';
import { Muestra }              from '../muestras/muestra.entity';
import { LoteFinal }            from '../lotes-finales/lote-final.entity';
import { CreateOrdenVentaDto }  from './dto/create-orden-venta.dto';
import { UpdateOrdenVentaDto }  from './dto/update-orden-venta.dto';
import { FilterOrdenesDto }     from './dto/filter-ordenes.dto';
import { UpdateEtapaDto }       from './dto/update-etapa.dto';
import { UpdatePasoDto }        from './dto/update-paso.dto';
import { UpsertPreventaDto }    from './dto/upsert-preventa.dto';
import { UpsertCotizacionDto }  from './dto/upsert-cotizacion.dto';
import { UpsertAlistadoDto }    from './dto/upsert-alistado.dto';
import { UpsertExportacionDto } from './dto/upsert-exportacion.dto';
import { UpsertPostVentaDto }   from './dto/upsert-post-venta.dto';
import { PaginatedResult }      from '../common/interfaces/api-response.interface';
import { KardexService }        from '../kardex/kardex.service';
import { TipoMovimientoKardex, ReferenciaTipoKardex } from '../kardex/movimiento-kardex.entity';

@Injectable()
export class OrdenesVentaService {
  constructor(
    @InjectRepository(OrdenVenta)
    private readonly repo: Repository<OrdenVenta>,
    @InjectRepository(OrdenPaso)
    private readonly pasoRepo: Repository<OrdenPaso>,
    @InjectRepository(OrdenPreventa)
    private readonly preventaRepo: Repository<OrdenPreventa>,
    @InjectRepository(OrdenCotizacion)
    private readonly cotizacionRepo: Repository<OrdenCotizacion>,
    @InjectRepository(OrdenAlistado)
    private readonly alistadoRepo: Repository<OrdenAlistado>,
    @InjectRepository(OrdenExportacion)
    private readonly exportacionRepo: Repository<OrdenExportacion>,
    @InjectRepository(OrdenPostVenta)
    private readonly postVentaRepo: Repository<OrdenPostVenta>,
    @InjectRepository(Muestra)
    private readonly muestraRepo: Repository<Muestra>,
    @InjectRepository(LoteFinal)
    private readonly loteFinalRepo: Repository<LoteFinal>,
    private readonly kardexService: KardexService,
  ) {}

  async findAll(filter: FilterOrdenesDto): Promise<PaginatedResult<OrdenVenta>> {
    const page  = filter.page  ?? 1;
    const limit = filter.limit ?? 20;

    const qb = this.repo.createQueryBuilder('ov').where('ov.activo = true');

    if (filter.etapaActual) qb.andWhere('ov."etapaActual" = :etapa', { etapa: filter.etapaActual });
    if (filter.campana)     qb.andWhere('ov.campana = :campana', { campana: filter.campana });
    if (filter.productor)   qb.andWhere('ov.productor ILIKE :prod', { prod: `%${filter.productor}%` });
    if (filter.lote)        qb.andWhere('ov.lote ILIKE :lote', { lote: `%${filter.lote}%` });
    if (filter.search?.trim()) {
      const s = `%${filter.search.trim()}%`;
      qb.andWhere('(ov.cliente ILIKE :s OR ov.productor ILIKE :s OR ov.codigo ILIKE :s)', { s });
    }

    qb.orderBy('ov."createdAt"', 'DESC').skip((page - 1) * limit).take(limit);

    const [data, total] = await qb.getManyAndCount();
    const lastPage = total === 0 ? 1 : Math.ceil(total / limit);
    return { data, meta: { total, page, lastPage, limit } };
  }

  async findOne(id: number): Promise<OrdenVenta> {
    const ov = await this.repo.findOne({ where: { id, activo: true } });
    if (!ov) throw new NotFoundException(`Orden ${id} no encontrada`);
    return ov;
  }

  async create(dto: CreateOrdenVentaDto): Promise<OrdenVenta> {
    const year   = new Date().getFullYear();
    const count  = await this.repo.count();
    const codigo = `ORD-${year}-${String(count + 1).padStart(3, '0')}`;
    const ov = await this.repo.save(this.repo.create({ ...dto, codigo }));
    await this.initPasos(ov.id);
    return ov;
  }

  async update(id: number, dto: UpdateOrdenVentaDto): Promise<OrdenVenta> {
    const ov = await this.findOne(id);
    Object.assign(ov, dto);
    return this.repo.save(ov);
  }

  async remove(id: number): Promise<{ ok: boolean }> {
    const ov = await this.findOne(id);
    ov.activo = false;
    await this.repo.save(ov);
    return { ok: true };
  }

  async updateEtapa(id: number, dto: UpdateEtapaDto): Promise<OrdenVenta> {
    const ov = await this.findOne(id);
    ov.etapas = {
      ...ov.etapas,
      [dto.etapa]: {
        estado:     dto.estado,
        porcentaje: dto.porcentaje ?? ov.etapas[dto.etapa]?.porcentaje ?? 0,
        fecha:      dto.fecha      ?? ov.etapas[dto.etapa]?.fecha      ?? null,
      },
    };
    if (dto.estado === EstadoEtapa.EN_PROCESO || dto.estado === EstadoEtapa.COMPLETADO) {
      ov.etapaActual = dto.etapa;
    }
    return this.repo.save(ov);
  }

  async findPasos(ordenId: number): Promise<OrdenPaso[]> {
    await this.findOne(ordenId);
    const pasos = await this.pasoRepo.find({
      where: { ordenVentaId: ordenId },
      order: { indice: 'ASC' },
    });
    if (pasos.length === 0) {
      await this.initPasos(ordenId);
      return this.pasoRepo.find({ where: { ordenVentaId: ordenId }, order: { indice: 'ASC' } });
    }
    return pasos;
  }

  async updatePaso(ordenId: number, indice: number, dto: UpdatePasoDto): Promise<OrdenPaso> {
    await this.findOne(ordenId);
    let paso = await this.pasoRepo.findOne({ where: { ordenVentaId: ordenId, indice } });
    if (!paso) {
      paso = this.pasoRepo.create({
        ordenVentaId: ordenId,
        indice,
        label: PASOS_LABELS[indice] ?? `Paso ${indice + 1}`,
        estado: EstadoPaso.PENDIENTE,
      });
    }
    paso.estado  = dto.estado;
    if (dto.fecha   !== undefined) paso.fecha   = dto.fecha ?? null;
    if (dto.usuario !== undefined) paso.usuario = dto.usuario ?? null;
    return this.pasoRepo.save(paso);
  }

  async initPasos(ordenId: number, completados = 0, enProceso = 1): Promise<void> {
    const existing = await this.pasoRepo.count({ where: { ordenVentaId: ordenId } });
    if (existing > 0) return;
    const rows = PASOS_LABELS.map((label, i) => {
      let estado = EstadoPaso.PENDIENTE;
      if (i < completados)                        estado = EstadoPaso.COMPLETADO;
      else if (i === completados && enProceso > 0) estado = EstadoPaso.EN_PROCESO;
      return this.pasoRepo.create({ ordenVentaId: ordenId, indice: i, label, estado, fecha: null, usuario: null });
    });
    await this.pasoRepo.save(rows);
  }

  async getPreventa(ordenId: number): Promise<{ preventa: OrdenPreventa | null; muestras: Muestra[] }> {
    const ov = await this.findOne(ordenId);
    const preventa = await this.preventaRepo.findOne({ where: { ordenVentaId: ordenId } }) ?? null;

    let muestras: Muestra[] = [];
    if (ov.lote) {
      const lf = await this.loteFinalRepo.findOne({ where: { codigo: ov.lote } });
      if (lf) {
        muestras = await this.muestraRepo.find({
          where: { loteFinalId: lf.id },
          relations: ['campana', 'productor'],
          order: { createdAt: 'ASC' },
        });
      }
    }

    return { preventa, muestras };
  }

  async upsertPreventa(ordenId: number, dto: UpsertPreventaDto): Promise<OrdenPreventa> {
    await this.findOne(ordenId);
    let preventa = await this.preventaRepo.findOne({ where: { ordenVentaId: ordenId } });

    if (!preventa) {
      preventa = this.preventaRepo.create({ ordenVentaId: ordenId });
    }
    Object.assign(preventa, dto);
    const saved = await this.preventaRepo.save(preventa);

    const newDetalle = dto.muestrasDetalle ?? [];
    if (newDetalle.length === 0) return saved;

    const allIds = [...new Set(newDetalle.map(d => d.muestraId))];
    const muestras = await this.muestraRepo.find({ where: { id: In(allIds) } });
    const muestraMap = new Map(muestras.map(m => [m.id, m.loteFinalId]));

    const fecha = dto.fechaEnvio ?? new Date().toISOString().slice(0, 10);

    for (const item of newDetalle) {
      const newQty      = item.cantidad ? Number(item.cantidad) : 0;
      const loteFinalId = muestraMap.get(item.muestraId);
      if (!loteFinalId) continue;

      // Cuánto ya está registrado para ESTA muestra específica (referenciaId = muestraId)
      const yaRegistrado = await this.kardexService.netSalidaPorReferencia(
        ReferenciaTipoKardex.PREVENTA_MUESTRA,
        item.muestraId,
        loteFinalId,
      );

      const diff = newQty - yaRegistrado;
      if (diff === 0) continue;

      await this.kardexService.registrar({
        loteFinalId,
        tipoMovimiento: diff > 0 ? TipoMovimientoKardex.SALIDA : TipoMovimientoKardex.INGRESO,
        cantidadKg:     Math.abs(diff),
        referenciaTipo: ReferenciaTipoKardex.PREVENTA_MUESTRA,
        referenciaId:   item.muestraId,
        fecha,
        observaciones:  `Envío muestra preventa orden #${ordenId} / muestra #${item.muestraId}`,
      });
    }

    return saved;
  }

  async getCotizacion(ordenId: number): Promise<OrdenCotizacion | null> {
    await this.findOne(ordenId);
    return this.cotizacionRepo.findOne({ where: { ordenVentaId: ordenId } }) ?? null;
  }

  async upsertCotizacion(ordenId: number, dto: UpsertCotizacionDto): Promise<OrdenCotizacion> {
    await this.findOne(ordenId);
    let cotizacion = await this.cotizacionRepo.findOne({ where: { ordenVentaId: ordenId } });
    const isNew = !cotizacion;
    if (!cotizacion) {
      cotizacion = this.cotizacionRepo.create({ ordenVentaId: ordenId });
    }
    Object.assign(cotizacion, dto);
    if (isNew && !cotizacion.nroCotizacion) {
      const year  = new Date().getFullYear();
      const count = await this.cotizacionRepo.count();
      cotizacion.nroCotizacion = `COT-${year}-${String(count + 1).padStart(3, '0')}`;
    }
    return this.cotizacionRepo.save(cotizacion);
  }

  async getAlistado(ordenId: number): Promise<OrdenAlistado | null> {
    await this.findOne(ordenId);
    return this.alistadoRepo.findOne({ where: { ordenVentaId: ordenId } }) ?? null;
  }

  async upsertAlistado(ordenId: number, dto: UpsertAlistadoDto): Promise<OrdenAlistado> {
    await this.findOne(ordenId);
    let row = await this.alistadoRepo.findOne({ where: { ordenVentaId: ordenId } });
    if (!row) row = this.alistadoRepo.create({ ordenVentaId: ordenId });
    Object.assign(row, dto);
    return this.alistadoRepo.save(row);
  }

  async getExportacion(ordenId: number): Promise<OrdenExportacion | null> {
    await this.findOne(ordenId);
    return this.exportacionRepo.findOne({ where: { ordenVentaId: ordenId } }) ?? null;
  }

  async upsertExportacion(ordenId: number, dto: UpsertExportacionDto): Promise<OrdenExportacion> {
    await this.findOne(ordenId);
    let row = await this.exportacionRepo.findOne({ where: { ordenVentaId: ordenId } });
    if (!row) row = this.exportacionRepo.create({ ordenVentaId: ordenId });
    Object.assign(row, dto);
    return this.exportacionRepo.save(row);
  }

  async uploadExportacionFile(
    ordenId: number,
    tipo: 'documentos' | 'reportes',
    file: any,
  ): Promise<{ name: string; file: string }[]> {
    await this.findOne(ordenId);
    let row = await this.exportacionRepo.findOne({ where: { ordenVentaId: ordenId } });
    if (!row) row = this.exportacionRepo.create({ ordenVentaId: ordenId });
    const field = tipo === 'documentos' ? 'documentosAsociados' : 'reportesCalidad';
    const current: { name: string; file: string }[] = Array.isArray((row as any)[field])
      ? (row as any)[field]
      : [];
    const entry = { name: file.originalname as string, file: file.filename as string };
    const updated = [...current, entry];
    (row as any)[field] = updated;
    await this.exportacionRepo.save(row);
    return updated;
  }

  async deleteExportacionFile(
    ordenId: number,
    tipo: 'documentos' | 'reportes',
    filename: string,
  ): Promise<{ name: string; file: string }[]> {
    await this.findOne(ordenId);
    const row = await this.exportacionRepo.findOne({ where: { ordenVentaId: ordenId } });
    if (!row) return [];
    const field = tipo === 'documentos' ? 'documentosAsociados' : 'reportesCalidad';
    const current: { name: string; file: string }[] = Array.isArray((row as any)[field])
      ? (row as any)[field]
      : [];
    const updated = current.filter(f => f.file !== filename);
    (row as any)[field] = updated.length ? updated : null;
    await this.exportacionRepo.save(row);
    const filePath = join(process.cwd(), 'uploads', 'exportacion', String(ordenId), tipo, filename);
    if (existsSync(filePath)) {
      try { unlinkSync(filePath); } catch { /* already gone */ }
    }
    return updated;
  }

  async getPostVenta(ordenId: number): Promise<OrdenPostVenta | null> {
    await this.findOne(ordenId);
    return this.postVentaRepo.findOne({ where: { ordenVentaId: ordenId } }) ?? null;
  }

  async upsertPostVenta(ordenId: number, dto: UpsertPostVentaDto): Promise<OrdenPostVenta> {
    await this.findOne(ordenId);
    let row = await this.postVentaRepo.findOne({ where: { ordenVentaId: ordenId } });
    if (!row) row = this.postVentaRepo.create({ ordenVentaId: ordenId });
    Object.assign(row, dto);
    return this.postVentaRepo.save(row);
  }
}
