import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Cliente } from './cliente.entity';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { FilterClientesDto } from './dto/filter-clientes.dto';
import { PaginatedResult } from '../common/interfaces/api-response.interface';
import { paginate } from '../common/helpers/pagination.helper';

@Injectable()
export class ClientesService {
  constructor(
    @InjectRepository(Cliente)
    private readonly repo: Repository<Cliente>,
  ) {}

  findAll(filter: FilterClientesDto): Promise<PaginatedResult<Cliente>> {
    const where: Record<string, unknown> = { activo: true };
    if (filter.search?.trim()) where['nombre'] = ILike(`%${filter.search.trim()}%`);
    if (filter.pais?.trim())   where['pais']   = ILike(`%${filter.pais.trim()}%`);

    return paginate(this.repo, filter, {
      where,
      order: { createdAt: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Cliente> {
    const c = await this.repo.findOne({ where: { id } });
    if (!c) throw new NotFoundException(`Cliente #${id} no encontrado`);
    return c;
  }

   
  private async generateCodigo(): Promise<string> {
    const last = await this.repo
      .createQueryBuilder('c')
      .select('c.codigo', 'codigo')
      .orderBy('c.id', 'DESC')
      .limit(1)
      .getRawOne<{ codigo: string }>();

    if (last?.codigo) {
      const match = last.codigo.match(/^CLI-(\d+)$/);
      if (match) {
        const next = parseInt(match[1], 10) + 1;
        return `CLI-${String(next).padStart(4, '0')}`;
      }
    }
    return 'CLI-0001';
  }

  async create(dto: CreateClienteDto): Promise<Cliente> {
    const codigo = await this.generateCodigo();
    const cliente = this.repo.create({ ...dto, codigo, activo: dto.activo ?? true });
    return this.repo.save(cliente);
  }

  async update(id: number, dto: UpdateClienteDto): Promise<Cliente> {
    await this.findOne(id);
    await this.repo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.repo.update(id, { activo: false });
  }

   
  async existsByNombre(nombre: string): Promise<boolean> {
    const found = await this.repo.findOne({ where: { nombre } });
    return !!found;
  }
}
