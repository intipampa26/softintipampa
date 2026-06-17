import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Merma, TipoMerma, TIPO_MERMA_PREFIX } from './merma.entity';
import { CreateMermaDto } from './dto/create-merma.dto';
import { FilterMermasDto } from './dto/filter-mermas.dto';

@Injectable()
export class MermasService {
  constructor(
    @InjectRepository(Merma)
    private readonly repo: Repository<Merma>,
  ) {}

  private async generateCodigo(tipo: TipoMerma): Promise<string> {
    const prefix = TIPO_MERMA_PREFIX[tipo];
    const year   = new Date().getFullYear();
    const last   = await this.repo
      .createQueryBuilder('m')
      .select('m.codigo', 'codigo')
      .where('m.codigo LIKE :p', { p: `${prefix}-${year}-%` })
      .orderBy('m.id', 'DESC')
      .limit(1)
      .getRawOne<{ codigo: string }>();

    if (last?.codigo) {
      const match = last.codigo.match(/^[A-Z]+-\d{4}-(\d+)$/);
      if (match) {
        const next = parseInt(match[1], 10) + 1;
        return `${prefix}-${year}-${String(next).padStart(4, '0')}`;
      }
    }
    return `${prefix}-${year}-0001`;
  }

  async create(dto: CreateMermaDto): Promise<Merma> {
    const codigo = await this.generateCodigo(dto.tipoMerma);
    const merma  = this.repo.create({ ...dto, codigo });
    return this.repo.save(merma);
  }

  async findAll(filter: FilterMermasDto): Promise<{
    data: any[];
    meta: { total: number; page: number; lastPage: number; limit: number };
  }> {
    const page  = filter.page  ?? 1;
    const limit = filter.limit ?? 20;

    const qb = this.repo.createQueryBuilder('m')
      .leftJoinAndSelect('m.loteFinal',  'lf')
      .leftJoinAndSelect('lf.tipoProducto', 'tp')
      .leftJoinAndSelect('lf.campana',   'cam')
      
      .leftJoin('lote_final_origenes', 'lfo', 'lfo."loteFinalId" = lf.id')
      .leftJoin('lotes',               'lot', 'lot.id = lfo."loteOrigenId"')
      .leftJoin('productores',         'prod','prod.id = lot."productorId"')
      .addSelect('lot.codigo',         'loteOrigenCodigo')
      .addSelect('prod.nombre',        'productorNombre')
      .addSelect('prod.apellido',      'productorApellido')
      .orderBy('m.fecha', 'DESC')
      .addOrderBy('m.id', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    if (filter.tipoMerma)  qb.andWhere('m."tipoMerma" = :tipo', { tipo: filter.tipoMerma });
    if (filter.loteFinalId) qb.andWhere('m."loteFinalId" = :lfid', { lfid: filter.loteFinalId });
    if (filter.fechaDesde) qb.andWhere('m.fecha >= :desde', { desde: filter.fechaDesde });
    if (filter.fechaHasta) qb.andWhere('m.fecha <= :hasta', { hasta: filter.fechaHasta });

    const [raw, total] = await Promise.all([
      qb.getRawAndEntities(),
      qb.getCount(),
    ]);

    
    const data = raw.entities.map((merma, i) => ({
      ...merma,
      loteOrigenCodigo:  raw.raw[i]?.loteOrigenCodigo  ?? null,
      productorNombre:   raw.raw[i]?.productorNombre   ?? null,
      productorApellido: raw.raw[i]?.productorApellido ?? null,
    }));

    return { data, meta: { total, page, lastPage: Math.ceil(total / limit), limit } };
  }
}
