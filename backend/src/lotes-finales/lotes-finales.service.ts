import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { LoteFinal, LoteFinalEstado } from './lote-final.entity';
import { LoteFinalOrigen } from './lote-final-origen.entity';
import { Trillado } from '../trillado/trillado.entity';
import { FilterLotesFinalesDto } from './dto/filter-lotes-finales.dto';
import { TrillarDto } from './dto/trillar.dto';
import { BatchTrillarDto } from './dto/batch-trillar.dto';
import { PaginatedResult } from '../common/interfaces/api-response.interface';
import { paginate } from '../common/helpers/pagination.helper';
import { KardexService } from '../kardex/kardex.service';
import { TipoMovimientoKardex, ReferenciaTipoKardex } from '../kardex/movimiento-kardex.entity';
import { MovimientoKardex } from '../kardex/movimiento-kardex.entity';
import { MermasService } from '../mermas/mermas.service';
import { TipoMerma } from '../mermas/merma.entity';
import { Sku } from '../skus/sku.entity';
import { AsignarSkuDto } from './dto/asignar-sku.dto';


const TOLERANCIA_KG = 0.5;
const RENDIMIENTO_MIN_TIPICO = 60;
const RENDIMIENTO_MAX_TIPICO = 85;

@Injectable()
export class LotesFinalesService {
  constructor(
    @InjectRepository(LoteFinal)
    private readonly lfRepo: Repository<LoteFinal>,
    @InjectRepository(LoteFinalOrigen)
    private readonly origenRepo: Repository<LoteFinalOrigen>,
    @InjectRepository(Trillado)
    private readonly trilladoRepo: Repository<Trillado>,
    @InjectRepository(Sku)
    private readonly skuRepo: Repository<Sku>,
    private readonly kardexService: KardexService,
    private readonly mermasService: MermasService,
  ) {}

  /**
   * Asigna o corrige el SKU de un LoteFinal. Separado de trillar() porque el
   * SKU muchas veces se define después (control de calidad, clasificación
   * comercial) y un LoteFinal ya TRILLADO no puede volver a pasar por
   * trillar() (R3 bloquea el re-trillado).
   */
  async asignarSku(id: number, dto: AsignarSkuDto): Promise<LoteFinal> {
    await this.findOne(id);
    const sku = await this.skuRepo.findOne({ where: { id: dto.skuId } });
    if (!sku) throw new NotFoundException(`SKU #${dto.skuId} no encontrado`);
    await this.lfRepo.update(id, { skuId: dto.skuId });
    return this.findOne(id);
  }

  

  async findAll(filter: FilterLotesFinalesDto): Promise<PaginatedResult<LoteFinal>> {
    const where: Record<string, unknown> = { activo: true };
    if (filter.estado)         where['estado']         = filter.estado;
    if (filter.tipoProductoId) where['tipoProductoId'] = filter.tipoProductoId;
    if (filter.campanaId)      where['campanaId']      = filter.campanaId;

    if (filter.loteOrigenId) {
      const origenes = await this.origenRepo.find({ where: { loteOrigenId: filter.loteOrigenId } });
      const ids = origenes.map(o => o.loteFinalId);
      if (ids.length === 0) return { data: [], meta: { total: 0, page: filter.page, lastPage: 1, limit: filter.limit } };
      where['id'] = In(ids);
    }

    if (filter.productorId) {
      const rows = await this.origenRepo
        .createQueryBuilder('fo')
        .select('DISTINCT fo."loteFinalId"', 'id')
        .innerJoin('lotes', 'l', 'l.id = fo."loteOrigenId" AND l."productorId" = :pid', { pid: filter.productorId })
        .getRawMany<{ id: number }>();
      const ids = rows.map(r => Number(r.id));
      if (ids.length === 0) return { data: [], meta: { total: 0, page: filter.page, lastPage: 1, limit: filter.limit } };
      where['id'] = In(ids);
    }

    const result = await paginate(this.lfRepo, filter, {
      where,
      relations: ['tipoProducto', 'campana', 'sku'],
      order: { createdAt: 'DESC' },
    });

    if (result.data.length > 0) {
      const ids = result.data.map(lf => lf.id);
      const origenes = await this.origenRepo.find({
        where: { loteFinalId: In(ids) },
        relations: ['loteOrigen', 'loteOrigen.productor'],
        order: { createdAt: 'ASC' },
      });
      const origenMap = new Map<number, typeof origenes[0]>();
      for (const o of origenes) {
        if (!origenMap.has(o.loteFinalId)) origenMap.set(o.loteFinalId, o);
      }
      for (const lf of result.data as (LoteFinal & { variedad?: string | null; productor?: unknown })[]) {
        const first = origenMap.get(lf.id);
        lf.variedad  = (first?.loteOrigen as any)?.variedad  ?? null;
        lf.productor = (first?.loteOrigen as any)?.productor ?? null;
      }
    }

    return result;
  }

  async findOne(id: number): Promise<LoteFinal> {
    const lf = await this.lfRepo.findOne({
      where: { id },
      relations: ['tipoProducto', 'campana', 'sku'],
    });
    if (!lf) throw new NotFoundException(`LoteFinal #${id} no encontrado`);
    return lf;
  }

   
  async findDetalle(id: number): Promise<{
    loteFinal: LoteFinal;
    origenes: LoteFinalOrigen[];
    trillado: Trillado | null;
  }> {
    const loteFinal = await this.findOne(id);
    const origenes  = await this.origenRepo.find({
      where: { loteFinalId: id },
      relations: [
        'loteOrigen',
        'loteOrigen.productor',
        'loteOrigen.parcela',
        'loteOrigen.tipoProducto',
      ],
      order: { createdAt: 'ASC' },
    });
    const trillado = await this.trilladoRepo.findOne({ where: { loteFinalId: id } }) ?? null;
    return { loteFinal, origenes, trillado };
  }


  /** Correlativo único por planta/fecha, formato PPP-YYYYMMDD-N (p.ej. SEL-20260310-1) */
  private async generateNroLiquidacion(planta: string | undefined, fecha: string): Promise<string> {
    const prefix = (planta ?? '')
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[^a-zA-Z0-9]/g, '')
      .toUpperCase()
      .slice(0, 3) || 'LIQ';
    const fechaCompacta = fecha.replace(/-/g, '');
    const base = `${prefix}-${fechaCompacta}`;

    const last = await this.trilladoRepo
      .createQueryBuilder('t')
      .select('t.nroLiquidacion', 'nroLiquidacion')
      .where('t.nroLiquidacion LIKE :p', { p: `${base}-%` })
      .orderBy('t.nroLiquidacion', 'DESC')
      .limit(1)
      .getRawOne<{ nroLiquidacion: string }>();

    let next = 1;
    if (last?.nroLiquidacion) {
      const match = last.nroLiquidacion.match(/-(\d+)$/);
      if (match) next = parseInt(match[1], 10) + 1;
    }
    return `${base}-${next}`;
  }


  async trillar(id: number, dto: TrillarDto): Promise<Trillado> {
    const loteFinal = await this.findOne(id);

    
    if (loteFinal.estado !== LoteFinalEstado.PENDIENTE_TRILLADO) {
      if (loteFinal.estado === LoteFinalEstado.TRILLADO) {
        throw new ConflictException(
          `R3 — El LoteFinal #${id} ya fue trillado. El re-trillado no está en el alcance de esta etapa.`,
          
          
        );
      }
      throw new BadRequestException(
        `Solo se pueden trillar LotesFinal en estado PENDIENTE_TRILLADO. Estado actual: ${loteFinal.estado}`,
      );
    }

    
    const sumaSalidas =
      Number(dto.pesoPfKg) +
      Number(dto.mermaReutilizableKg) +
      Number(dto.mermaDesechableKg) +
      Number(dto.sobranteExportableKg);

    const diferencia = Math.abs(sumaSalidas - Number(loteFinal.cantidadKg));
    if (diferencia > TOLERANCIA_KG) {
      throw new BadRequestException(
        `R4 — La suma de salidas (${sumaSalidas.toFixed(3)} kg) no coincide con la cantidad del LoteFinal ` +
        `(${loteFinal.cantidadKg} kg). Diferencia: ${diferencia.toFixed(3)} kg > tolerancia permitida de ${TOLERANCIA_KG} kg. ` +
        `Verifica: PF (${dto.pesoPfKg}) + LR (${dto.mermaReutilizableKg}) + LD (${dto.mermaDesechableKg}) + LE (${dto.sobranteExportableKg})`,
      );
    }


    const cantidadQuintales = Math.floor(Number(dto.pesoPfKg) / Number(dto.pesoPorQuintalKg));
    const kgSueltos = Number(dto.pesoPfKg) % Number(dto.pesoPorQuintalKg);


    const rendimientoPct = parseFloat(
      ((Number(dto.pesoPfKg) / Number(loteFinal.cantidadKg)) * 100).toFixed(2),
    );

    // Si se adjunta a un grupo existente, heredar batchId y nroLiquidacion
    let origenBatchId: string | null = null;
    let nroLiquidacionFinal = dto.nroLiquidacion;
    if (dto.existingBatchId) {
      const grupoRef = await this.trilladoRepo.findOne({ where: { origenBatchId: dto.existingBatchId } });
      if (!grupoRef) throw new NotFoundException(`Grupo de trilla "${dto.existingBatchId}" no encontrado.`);
      origenBatchId      = dto.existingBatchId;
      nroLiquidacionFinal = grupoRef.nroLiquidacion ?? dto.nroLiquidacion;
    }
    if (!nroLiquidacionFinal) {
      nroLiquidacionFinal = await this.generateNroLiquidacion(dto.planta, dto.fecha);
    }

    const { existingBatchId: _drop, ...dtoSinBatch } = dto;
    const trillado = this.trilladoRepo.create({
      ...dtoSinBatch,
      loteFinalId:       id,
      cantidadQuintales,
      kgSueltos:         parseFloat(kgSueltos.toFixed(3)),
      rendimientoPct,
      origenBatchId,
      nroLiquidacion:    nroLiquidacionFinal,
    });
    const savedTrillado = await this.trilladoRepo.save(trillado);


    await this.lfRepo.update(id, {
      estado: LoteFinalEstado.TRILLADO,
      ...(dto.skuId != null ? { skuId: dto.skuId } : {}),
    });


    // El LoteFinal ya tiene registrado su ingreso íntegro (peso pergamino) al ser
    // creado. La trilla NO agrega material nuevo — solo separa lo que queda como
    // stock exportable (PF + LE, que permanecen en el saldo) de lo que sale del
    // lote como merma (LR + LD). Por eso solo se registra una SALIDA por la merma;
    // nunca un INGRESO adicional por el oro producido (eso duplicaría el peso).
    //
    // Por LOTE solo se conoce el peso pergamino que entró y el peso oro que
    // salió — la merma TOTAL de ese lote es una resta real. Pero el TIPO de
    // merma (Segunda/Descarte) se clasifica recién después de mezclar toda la
    // liquidación, no es atribuible a un lote específico. Por eso el kardex
    // por lote registra un solo movimiento combinado (sin tipo); el detalle
    // por tipo vive a nivel de la liquidación completa (getGruposTrilla()).
    const mermaTotal = Number(dto.mermaReutilizableKg) + Number(dto.mermaDesechableKg);
    if (mermaTotal > 0) {
      await this.kardexService.registrar({
        loteFinalId:    id,
        tipoMovimiento: TipoMovimientoKardex.MERMA,
        cantidadKg:     parseFloat(mermaTotal.toFixed(3)),
        referenciaTipo: ReferenciaTipoKardex.TRILLADO,
        referenciaId:   savedTrillado.id,
        fecha:          dto.fecha,
        observaciones:  `Merma de trillado — LR: ${dto.mermaReutilizableKg} kg, LD: ${dto.mermaDesechableKg} kg ` +
                         `(Oro verde: ${dto.pesoPfKg} kg, Sobrante exportable: ${dto.sobranteExportableKg} kg, ` +
                         `Rendimiento: ${rendimientoPct}%)`,
      });
    }

    
    const mermasAuto: Array<{ tipo: TipoMerma; kg: number }> = [
      { tipo: TipoMerma.REUTILIZABLE, kg: Number(dto.mermaReutilizableKg)   },
      { tipo: TipoMerma.DESECHABLE,   kg: Number(dto.mermaDesechableKg)     },
      { tipo: TipoMerma.EXPORTABLE,   kg: Number(dto.sobranteExportableKg)  },
    ];
    for (const { tipo, kg } of mermasAuto) {
      if (kg > 0) {
        await this.mermasService.create({
          loteFinalId: id,
          trilladoId:  savedTrillado.id,
          tipoMerma:   tipo,
          cantidadKg:  kg,
          fecha:        dto.fecha,
        });
      }
    }

    if (rendimientoPct < RENDIMIENTO_MIN_TIPICO || rendimientoPct > RENDIMIENTO_MAX_TIPICO) {
      (savedTrillado as any).alertaRendimiento =
        `Rendimiento ${rendimientoPct}% fuera del rango típico (${RENDIMIENTO_MIN_TIPICO}-${RENDIMIENTO_MAX_TIPICO}%). Verifica los pesos ingresados.`;
    }

    return savedTrillado;
  }



  async findKardex(id: number): Promise<MovimientoKardex[]> {
    await this.findOne(id);
    return this.kardexService.findByLoteFinal(id);
  }

  async trillarBatch(dto: BatchTrillarDto): Promise<{
    batchId: string;
    trillados: Trillado[];
    resumen: {
      lotesCount: number;
      pesoTotalKg: number;
      mermaReutilizableTotalKg: number;
      mermaDesechableTotalKg: number;
      sobranteExportableTotalKg: number;
      pesoPfTotalKg: number;
      rendimientoPct: number;
    };
  }> {
    if (!dto.ids || dto.ids.length === 0) {
      throw new BadRequestException('Debes seleccionar al menos un LoteFinal.');
    }

    const lotes = await this.lfRepo.find({ where: { id: In(dto.ids) } });
    if (lotes.length !== dto.ids.length) {
      const encontrados = new Set(lotes.map(l => l.id));
      const faltantes = dto.ids.filter(id => !encontrados.has(id));
      throw new NotFoundException(`LoteFinal(es) no encontrados: ${faltantes.join(', ')}`);
    }

    const noPendientes = lotes.filter(l => l.estado !== LoteFinalEstado.PENDIENTE_TRILLADO);
    if (noPendientes.length > 0) {
      throw new BadRequestException(
        `Los siguientes lotes no están en estado PENDIENTE_TRILLADO: ${noPendientes.map(l => `${l.codigo} (${l.estado})`).join(', ')}`,
      );
    }

    const pesoTotal = lotes.reduce((s, l) => s + Number(l.cantidadKg), 0);
    const mermaTotalIngresada =
      Number(dto.mermaReutilizableKg) +
      Number(dto.mermaDesechableKg) +
      Number(dto.sobranteExportableKg);

    if (mermaTotalIngresada >= pesoTotal) {
      throw new BadRequestException(
        `La merma total (${mermaTotalIngresada.toFixed(3)} kg) no puede ser mayor o igual al peso total de la operación (${pesoTotal.toFixed(3)} kg).`,
      );
    }

    // Si se envía existingBatchId, verificar que el grupo exista y heredar su nroLiquidacion
    let batchId: string;
    let nroLiquidacionFinal = dto.nroLiquidacion;

    if (dto.existingBatchId) {
      const grupoExistente = await this.trilladoRepo.findOne({
        where: { origenBatchId: dto.existingBatchId },
      });
      if (!grupoExistente) {
        throw new NotFoundException(
          `Grupo de trilla con ID "${dto.existingBatchId}" no encontrado.`,
        );
      }
      batchId = dto.existingBatchId;
      nroLiquidacionFinal = grupoExistente.nroLiquidacion ?? dto.nroLiquidacion;
    } else {
      batchId = uuidv4();
    }

    // Una liquidación cubre TODO el grupo — se genera una sola vez y se
    // comparte entre todos los lotes del batch (no una por lote).
    if (!nroLiquidacionFinal) {
      nroLiquidacionFinal = await this.generateNroLiquidacion(dto.planta, dto.fecha);
    }

    const trillados: Trillado[] = [];
    const overridesMap = new Map(
      (dto.loteOverrides ?? []).map(o => [o.id, o]),
    );

    for (let i = 0; i < lotes.length; i++) {
      const lote      = lotes[i];
      const esUltimo  = i === lotes.length - 1;
      const peso      = Number(lote.cantidadKg);
      const proporcion = peso / pesoTotal;
      const override  = overridesMap.get(lote.id);

      let lr: number;
      let ld: number;
      let le: number;
      let skuIdFinal: number | undefined;

      if (override?.pesoPfKg != null) {
        // Override por lote: solo se pide el Peso Oro (PF) real de ESE lote —
        // es lo único que se puede medir por lote. La merma total de ese lote
        // sale de la resta (peso - pf); no se le asigna sobrante exportable
        // propio. El tipo (Segunda/Descarte) no es atribuible a un lote
        // individual dentro del batch, así que esa merma se reparte entre LR
        // y LD usando la MISMA proporción que la merma total de la operación
        // (es la única referencia de tipo disponible).
        const pfOverride    = Number(override.pesoPfKg);
        const mermaLoteTotal = Math.max(0, peso - pfOverride);
        const mermaAggTotal  = Number(dto.mermaReutilizableKg) + Number(dto.mermaDesechableKg);
        const propLr = mermaAggTotal > 0 ? Number(dto.mermaReutilizableKg) / mermaAggTotal : 1;
        lr = parseFloat((mermaLoteTotal * propLr).toFixed(3));
        ld = parseFloat((mermaLoteTotal - lr).toFixed(3));
        le = 0;
        skuIdFinal = override.skuId ?? dto.skuId;
      } else if (esUltimo && !overridesMap.size) {
        // El último lote absorbe el residuo decimal para que la suma cuadre exacto
        const lrAcum = trillados.reduce((s, t) => s + Number(t.mermaReutilizableKg), 0);
        const ldAcum = trillados.reduce((s, t) => s + Number(t.mermaDesechableKg), 0);
        const leAcum = trillados.reduce((s, t) => s + Number(t.sobranteExportableKg), 0);
        lr = parseFloat((Number(dto.mermaReutilizableKg) - lrAcum).toFixed(3));
        ld = parseFloat((Number(dto.mermaDesechableKg)   - ldAcum).toFixed(3));
        le = parseFloat((Number(dto.sobranteExportableKg) - leAcum).toFixed(3));
        skuIdFinal = dto.skuId;
      } else {
        lr = parseFloat((Number(dto.mermaReutilizableKg)  * proporcion).toFixed(3));
        ld = parseFloat((Number(dto.mermaDesechableKg)    * proporcion).toFixed(3));
        le = parseFloat((Number(dto.sobranteExportableKg) * proporcion).toFixed(3));
        skuIdFinal = override?.skuId ?? dto.skuId;
      }

      const pf = parseFloat((peso - lr - ld - le).toFixed(3));

      const trilladoIndividual = await this.trillar(lote.id, {
        fecha:               dto.fecha,
        planta:              dto.planta,
        malla:               dto.malla,
        tipoSeleccion:       dto.tipoSeleccion,
        encargado:           dto.encargado,
        pesoPorQuintalKg:    Number(dto.pesoPorQuintalKg),
        pesoPfKg:            pf,
        mermaReutilizableKg: lr,
        mermaDesechableKg:   ld,
        sobranteExportableKg: le,
        skuId:               skuIdFinal,
        nroLiquidacion:      nroLiquidacionFinal,
        observaciones:       dto.observaciones,
      });

      // Estampar el batchId en el Trillado recién creado
      await this.trilladoRepo.update(trilladoIndividual.id, { origenBatchId: batchId });
      trilladoIndividual.origenBatchId = batchId;
      trillados.push(trilladoIndividual);
    }

    const pesoPfTotal = trillados.reduce((s, t) => s + Number(t.pesoPfKg), 0);
    const rendimientoPct = parseFloat(((pesoPfTotal / pesoTotal) * 100).toFixed(2));

    return {
      batchId,
      trillados,
      resumen: {
        lotesCount:                 lotes.length,
        pesoTotalKg:                parseFloat(pesoTotal.toFixed(3)),
        mermaReutilizableTotalKg:   Number(dto.mermaReutilizableKg),
        mermaDesechableTotalKg:     Number(dto.mermaDesechableKg),
        sobranteExportableTotalKg:  Number(dto.sobranteExportableKg),
        pesoPfTotalKg:              parseFloat(pesoPfTotal.toFixed(3)),
        rendimientoPct,
      },
    };
  }

  /**
   * Devuelve todos los grupos de trilla existentes (agrupados por
   * origenBatchId), con el detalle de merma por TIPO a nivel de la
   * liquidación completa (Segunda/Descarte) — nunca por lote individual,
   * porque esa clasificación solo existe una vez mezclado todo el batch.
   */
  async getGruposTrilla(): Promise<{
    batchId: string;
    nroLiquidacion: string | null;
    fecha: string;
    planta: string | null;
    lotesCount: number;
    pesoTotalKg: number;
    mermaReutilizableTotalKg: number;
    mermaDesechableTotalKg: number;
  }[]> {
    const rows = await this.trilladoRepo
      .createQueryBuilder('t')
      .select('t."origenBatchId"',           'batchId')
      .addSelect('t."nroLiquidacion"',        'nroLiquidacion')
      .addSelect('t.fecha',                   'fecha')
      .addSelect('t.planta',                  'planta')
      .addSelect('COUNT(t.id)',               'lotesCount')
      .addSelect('SUM(t."pesoPfKg" + t."mermaReutilizableKg" + t."mermaDesechableKg" + t."sobranteExportableKg")', 'pesoTotalKg')
      .addSelect('SUM(t."mermaReutilizableKg")', 'mermaReutilizableTotalKg')
      .addSelect('SUM(t."mermaDesechableKg")',   'mermaDesechableTotalKg')
      .where('t."origenBatchId" IS NOT NULL')
      .groupBy('t."origenBatchId"')
      .addGroupBy('t."nroLiquidacion"')
      .addGroupBy('t.fecha')
      .addGroupBy('t.planta')
      .orderBy('t.fecha', 'DESC')
      .getRawMany<{
        batchId: string;
        nroLiquidacion: string | null;
        mermaReutilizableTotalKg: string;
        mermaDesechableTotalKg: string;
        fecha: string;
        planta: string | null;
        lotesCount: string;
        pesoTotalKg: string;
      }>();

    return rows.map(r => ({
      batchId:       r.batchId,
      nroLiquidacion: r.nroLiquidacion,
      fecha:         r.fecha,
      planta:        r.planta,
      lotesCount:    Number(r.lotesCount),
      pesoTotalKg:   parseFloat(Number(r.pesoTotalKg).toFixed(3)),
      mermaReutilizableTotalKg: parseFloat(Number(r.mermaReutilizableTotalKg).toFixed(3)),
      mermaDesechableTotalKg:   parseFloat(Number(r.mermaDesechableTotalKg).toFixed(3)),
    }));
  }
}
