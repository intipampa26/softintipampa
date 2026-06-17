import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Parcela } from './parcela.entity';
import { CreateParcelaDto } from './dto/create-parcela.dto';
import { UpdateParcelaDto } from './dto/update-parcela.dto';
import { FilterParcelasDto } from './dto/filter-parcelas.dto';
import { PaginatedResult } from '../common/interfaces/api-response.interface';
import { paginate } from '../common/helpers/pagination.helper';

@Injectable()
export class ParcelasService {
  constructor(
    @InjectRepository(Parcela)
    private readonly repo: Repository<Parcela>,
  ) {}

  findAll(filter: FilterParcelasDto): Promise<PaginatedResult<Parcela>> {
    const where: Record<string, unknown> = { activo: true };
    if (filter.productorId) where['productorId'] = filter.productorId;
    if (filter.search?.trim()) where['nombre'] = ILike(`%${filter.search.trim()}%`);
    return paginate(this.repo, filter, {
      where,
      order: { createdAt: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Parcela> {
    const p = await this.repo.findOne({ where: { id } });
    if (!p) throw new NotFoundException(`Parcela #${id} no encontrada`);
    return p;
  }

   
  private async generateCodigo(): Promise<string> {
    const last = await this.repo
      .createQueryBuilder('p')
      .select('p.codigo', 'codigo')
      .orderBy('p.id', 'DESC')
      .limit(1)
      .getRawOne<{ codigo: string }>();

    if (last?.codigo) {
      const match = last.codigo.match(/^PAR-(\d+)$/);
      if (match) {
        const next = parseInt(match[1], 10) + 1;
        return `PAR-${String(next).padStart(4, '0')}`;
      }
    }

    return 'PAR-0001';
  }

  async create(dto: CreateParcelaDto): Promise<Parcela> {
    const codigo = await this.generateCodigo();
    const parcela = this.repo.create({
      ...dto,
      codigo,
      activo: dto.activo ?? true,
    });
    return this.repo.save(parcela);
  }

  async update(id: number, dto: UpdateParcelaDto): Promise<Parcela> {
    await this.findOne(id);
    await this.repo.update(id, dto);
    return this.findOne(id);
  }

   
  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.repo.update(id, { activo: false });
  }
}
