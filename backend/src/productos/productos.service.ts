import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Producto } from './producto.entity';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { FilterProductosDto } from './dto/filter-productos.dto';
import { PaginatedResult } from '../common/interfaces/api-response.interface';
import { paginate } from '../common/helpers/pagination.helper';

@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(Producto)
    private readonly repo: Repository<Producto>,
  ) {}

  findAll(filter: FilterProductosDto): Promise<PaginatedResult<Producto>> {
    const where: Record<string, unknown> = {};
    if (filter.categoria) where['categoria'] = filter.categoria;
    if (filter.search?.trim()) where['nombre'] = ILike(`%${filter.search.trim()}%`);
    return paginate(this.repo, filter, {
      where,
      order: { nombre: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Producto> {
    const p = await this.repo.findOne({ where: { id } });
    if (!p) throw new NotFoundException(`Producto #${id} no encontrado`);
    return p;
  }

  create(dto: CreateProductoDto): Promise<Producto> {
    const producto = this.repo.create(dto);
    return this.repo.save(producto);
  }

  async update(id: number, dto: UpdateProductoDto): Promise<Producto> {
    await this.findOne(id);
    await this.repo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.repo.delete(id);
  }
}
