import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import {
  MovimientoKardex,
  TipoMovimientoKardex,
  ReferenciaTipoKardex,
} from './movimiento-kardex.entity';
import { LoteFinalOrigen } from '../lotes-finales/lote-final-origen.entity';
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
  ) {}

  private async saldoActual(loteFinalId: number): Promise<number> {
    const ultimo = await this.repo.findOne({
      where: { loteFinalId },
      order: { createdAt: 'DESC', id: 'DESC' },
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

  findByLoteFinal(loteFinalId: number): Promise<MovimientoKardex[]> {
    return this.repo.find({
      where: { loteFinalId },
      order: { fecha: 'ASC', createdAt: 'ASC' },
    });
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
      .orderBy('m.fecha', 'DESC')
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

    return { data, meta: { total, page, lastPage: Math.ceil(total / limit), limit } };
  }
}
