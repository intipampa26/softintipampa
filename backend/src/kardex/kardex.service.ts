import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import {
  MovimientoKardex,
  TipoMovimientoKardex,
  ReferenciaTipoKardex,
} from './movimiento-kardex.entity';
import { LoteFinalOrigen } from '../lotes-finales/lote-final-origen.entity';
import { Trillado } from '../trillado/trillado.entity';
import { FilterKardexDto } from './dto/filter-kardex.dto';

export interface RegistrarMovimientoParams {
  loteFinalId:    number;
  tipoMovimiento: TipoMovimientoKardex;
  cantidadKg:     number;
  referenciaTipo: ReferenciaTipoKardex;
  referenciaId?:  number;
  fecha:          string;
  horaEntrada?:   Date;
  usuarioId?:     number;
  observaciones?: string;
}

@Injectable()
export class KardexService {
  constructor(
    @InjectRepository(MovimientoKardex)
    private readonly repo: Repository<MovimientoKardex>,
    @InjectRepository(LoteFinalOrigen)
    private readonly origenRepo: Repository<LoteFinalOrigen>,
    @InjectRepository(Trillado)
    private readonly trilladoRepo: Repository<Trillado>,
  ) {}

  /**
   * El movimiento de kardex solo guarda referenciaTipo/referenciaId de forma
   * genérica — para los de tipo TRILLADO, referenciaId apunta al id de
   * Trillado. Se resuelve el nroLiquidacion en batch y se agrega como campo
   * extra a cada movimiento devuelto (no es una columna real de kardex).
   */
  private async attachNroLiquidacion<T extends MovimientoKardex>(movs: T[]): Promise<T[]> {
    const trilladoIds = [...new Set(
      movs.filter(m => m.referenciaTipo === ReferenciaTipoKardex.TRILLADO && m.referenciaId != null)
          .map(m => m.referenciaId as number),
    )];
    if (trilladoIds.length === 0) return movs;

    const trillados = await this.trilladoRepo.find({ where: { id: In(trilladoIds) } });
    const trilladoPorId = new Map(trillados.map(t => [t.id, t]));

    // El tipo de merma (Segunda/Descarte) no es atribuible a un lote
    // individual — solo se clasifica al nivel de toda la liquidación. Se
    // suma sobre TODOS los trillados del batch (no solo los de esta página)
    // para que el total mostrado sea el real de la liquidación completa.
    const batchIds = [...new Set(trillados.filter(t => t.origenBatchId).map(t => t.origenBatchId as string))];
    const totalesPorBatch = new Map<string, { lr: number; ld: number }>();
    if (batchIds.length > 0) {
      const rows = await this.trilladoRepo
        .createQueryBuilder('t')
        .select('t.origenBatchId', 'batchId')
        .addSelect('SUM(t.mermaReutilizableKg)', 'lr')
        .addSelect('SUM(t.mermaDesechableKg)', 'ld')
        .where('t.origenBatchId IN (:...batchIds)', { batchIds })
        .groupBy('t.origenBatchId')
        .getRawMany();
      for (const r of rows) totalesPorBatch.set(r.batchId, { lr: Number(r.lr), ld: Number(r.ld) });
    }

    return movs.map(m => {
      if (m.referenciaTipo === ReferenciaTipoKardex.TRILLADO && m.referenciaId != null) {
        const t = trilladoPorId.get(m.referenciaId as number);
        (m as any).nroLiquidacion = t?.nroLiquidacion ?? null;
        if (t) {
          const totales = t.origenBatchId ? totalesPorBatch.get(t.origenBatchId) : undefined;
          (m as any).liqMermaReutilizableKg = totales ? totales.lr : Number(t.mermaReutilizableKg);
          (m as any).liqMermaDesechableKg   = totales ? totales.ld : Number(t.mermaDesechableKg);
        }
      }
      return m;
    });
  }

  async saldoActual(loteFinalId: number): Promise<number> {
    const ultimo = await this.repo.findOne({
      where: { loteFinalId },
      order: { horaEntrada: 'DESC', createdAt: 'DESC', id: 'DESC' },
    });
    return ultimo ? Number(ultimo.saldoKg) : 0;
  }

  async registrar(params: RegistrarMovimientoParams): Promise<MovimientoKardex> {
    const saldoAnterior = await this.saldoActual(params.loteFinalId);

    let saldoNuevo: number;
    if (params.tipoMovimiento === TipoMovimientoKardex.INGRESO) {
      saldoNuevo = saldoAnterior + params.cantidadKg;
    } else {
      saldoNuevo = saldoAnterior - params.cantidadKg;
    }

    const mov = this.repo.create({
      ...params,
      saldoKg: Math.max(0, saldoNuevo),
    });
    return this.repo.save(mov);
  }

  async netSalidaPorReferencia(
    referenciaTipo: ReferenciaTipoKardex,
    referenciaId:   number,
    loteFinalId:    number,
  ): Promise<number> {
    const movs = await this.repo.find({ where: { referenciaTipo, referenciaId, loteFinalId } });
    return movs.reduce((acc, m) => {
      const qty = Number(m.cantidadKg);
      return m.tipoMovimiento === TipoMovimientoKardex.SALIDA ? acc + qty : acc - qty;
    }, 0);
  }

  /**
   * Igual que netSalidaPorReferencia pero agrupado por loteFinalId, para
   * cuando una referencia (p.ej. una orden de venta) puede tocar varios
   * lotes. Necesario para revertir correctamente: si un lote ya no aparece
   * en la lista actual del llamador, su entrada en este mapa es la única
   * forma de saber que todavía tiene un neto pendiente por revertir.
   */
  async netPorReferenciaAgrupado(
    referenciaTipo: ReferenciaTipoKardex,
    referenciaId:   number,
  ): Promise<Map<number, number>> {
    const movs = await this.repo.find({ where: { referenciaTipo, referenciaId } });
    const porLote = new Map<number, number>();
    for (const m of movs) {
      const qty = Number(m.cantidadKg);
      const delta = m.tipoMovimiento === TipoMovimientoKardex.SALIDA ? qty : -qty;
      porLote.set(m.loteFinalId, (porLote.get(m.loteFinalId) ?? 0) + delta);
    }
    return porLote;
  }

  async findByLoteFinal(loteFinalId: number): Promise<MovimientoKardex[]> {
    const movs = await this.repo.find({
      where: { loteFinalId },
      order: { fecha: 'ASC', horaEntrada: 'ASC', createdAt: 'ASC', id: 'ASC' },
    });
    // El saldoKg guardado en cada fila se calculó en orden de INSERCIÓN real
    // (registrar() siempre suma/resta sobre el último movimiento creado). Pero
    // esta lista se muestra en orden de FECHA del movimiento, que no coincide
    // con el orden de inserción cuando se cargan movimientos con fecha
    // retroactiva (lo normal: una trilla o venta se registra días después de
    // ocurrida, con su fecha real). Sin este recálculo, la columna de saldo
    // que ve el usuario deja de ser una suma acumulada coherente. Se
    // recalcula solo para esta vista, sin tocar el valor persistido.
    let saldoRecalculado = 0;
    const conSaldo = movs.map(m => {
      const qty = Number(m.cantidadKg);
      saldoRecalculado += m.tipoMovimiento === TipoMovimientoKardex.INGRESO ? qty : -qty;
      // decimal(10,3) se serializa como string en el resto de la API — se
      // mantiene el mismo formato para no romper el contrato con el frontend.
      return { ...m, saldoKg: Math.max(0, saldoRecalculado).toFixed(3) } as unknown as MovimientoKardex;
    });
    return this.attachNroLiquidacion(conSaldo);
  }

  async findAll(filter: FilterKardexDto): Promise<{
    data: MovimientoKardex[];
    meta: { total: number; page: number; lastPage: number; limit: number };
  }> {
    const page  = filter.page  ?? 1;
    const limit = filter.limit ?? 20;

    const qb = this.repo.createQueryBuilder('m')
      .leftJoinAndSelect('m.loteFinal', 'lf')
      .leftJoinAndSelect('lf.tipoProducto', 'tp')
      .leftJoinAndSelect('lf.campana', 'campana')
      .orderBy('m.horaEntrada', 'DESC')
      .addOrderBy('m.createdAt', 'DESC')
      .addOrderBy('m.id', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    if (filter.loteFinalId)   qb.andWhere('m.loteFinalId = :loteFinalId', { loteFinalId: filter.loteFinalId });
    if (filter.tipoMovimiento) qb.andWhere('m.tipoMovimiento = :tipo', { tipo: filter.tipoMovimiento });
    if (filter.fechaDesde)    qb.andWhere('m.fecha >= :desde', { desde: filter.fechaDesde });
    if (filter.fechaHasta)    qb.andWhere('m.fecha <= :hasta', { hasta: filter.fechaHasta });

    const [data, total] = await qb.getManyAndCount();

    const loteFinalIds = [...new Set(data.map(m => m.loteFinalId))];
    if (loteFinalIds.length > 0) {
      const origenes = await this.origenRepo.find({
        where: { loteFinalId: In(loteFinalIds) },
        relations: ['loteOrigen'],
      });
      for (const m of data) {
        if (m.loteFinal) {
          (m.loteFinal as any).origenes = origenes.filter(o => o.loteFinalId === m.loteFinalId);
        }
      }
    }

    const dataConLiquidacion = await this.attachNroLiquidacion(data);

    return { data: dataConLiquidacion, meta: { total, page, lastPage: Math.ceil(total / limit), limit } };
  }
}
