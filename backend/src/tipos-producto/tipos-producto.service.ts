import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TipoProducto } from './tipo-producto.entity';

@Injectable()
export class TiposProductoService {
  constructor(
    @InjectRepository(TipoProducto)
    private readonly repo: Repository<TipoProducto>,
  ) {}

  findAll(): Promise<TipoProducto[]> {
    return this.repo.find({ where: { activo: true }, order: { tipo: 'ASC' } });
  }
}
