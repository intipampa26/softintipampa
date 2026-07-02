import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { LoteFinal, LoteFinalEstado } from './lote-final.entity';
import { LoteFinalOrigen } from './lote-final-origen.entity';
import { Trillado } from '../trillado/trillado.entity';
import { FilterLotesFinalesDto } from './dto/filter-lotes-finales.dto';
import { TrillarDto } from './dto/trillar.dto';
import { PaginatedResult } from '../common/interfaces/api-response.interface';
import { paginate } from '../common/helpers/pagination.helper';
import { KardexService } from '../kardex/kardex.service';
import { TipoMovimientoKardex, ReferenciaTipoKardex } from '../kardex/movimiento-kardex.entity';
import { MovimientoKardex } from '../kardex/movimiento-kardex.entity';
import { MermasService } from '../mermas/mermas.service';
import { TipoMerma } from '../mermas/merma.entity';

 
const TOLERANCIA_KG = 0.5;

@Injectable()
export class LotesFinalesService {
  constructor(
    @InjectRepository(LoteFinal)
    private readonly lfRepo: Repository<LoteFinal>,
    @InjectRepository(LoteFinalOrigen)
    private readonly origenRepo: Repository<LoteFinalOrigen>,
    @InjectRepository(Trillado)
    private readonly trilladoRepo: Repository<Trillado>,
    private readonly kardexService: KardexService,
    private readonly mermasService: MermasService,
  ) {}

  

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

    return paginate(this.lfRepo, filter, {
      where,
      relations: ['tipoProducto', 'campana', 'sku'],
      order: { createdAt: 'DESC' },
    });
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

    
    const trillado = this.trilladoRepo.create({
      ...dto,
      loteFinalId:       id,
      cantidadQuintales,
      kgSueltos:         parseFloat(kgSueltos.toFixed(3)),
    });
    const savedTrillado = await this.trilladoRepo.save(trillado);

    
    await this.lfRepo.update(id, {
      estado: LoteFinalEstado.TRILLADO,
      ...(dto.skuId != null ? { skuId: dto.skuId } : {}),
    });

    
    await this.kardexService.registrar({
      loteFinalId:    id,
      tipoMovimiento: TipoMovimientoKardex.INGRESO,
      cantidadKg:     parseFloat(Number(dto.pesoPfKg).toFixed(3)),
      referenciaTipo: ReferenciaTipoKardex.TRILLADO,
      referenciaId:   savedTrillado.id,
      fecha:          dto.fecha,
      observaciones:  `Ingreso trillado — Oro verde: ${dto.pesoPfKg} kg`,
    });

    const mermaTotal = Number(dto.mermaReutilizableKg) + Number(dto.mermaDesechableKg);
    if (mermaTotal > 0) {
      await this.kardexService.registrar({
        loteFinalId:    id,
        tipoMovimiento: TipoMovimientoKardex.MERMA,
        cantidadKg:     parseFloat(mermaTotal.toFixed(3)),
        referenciaTipo: ReferenciaTipoKardex.TRILLADO,
        referenciaId:   savedTrillado.id,
        fecha:          dto.fecha,
        observaciones:  `Merma de trillado — LR: ${dto.mermaReutilizableKg} kg, LD: ${dto.mermaDesechableKg} kg`,
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

    return savedTrillado;
  }

  

  async findKardex(id: number): Promise<MovimientoKardex[]> {
    await this.findOne(id);
    return this.kardexService.findByLoteFinal(id);
  }
}
