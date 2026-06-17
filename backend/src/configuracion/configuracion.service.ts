import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Configuracion } from './configuracion.entity';
import { UpdateConfiguracionDto } from './dto/update-configuracion.dto';

@Injectable()
export class ConfiguracionService {
  constructor(
    @InjectRepository(Configuracion)
    private readonly repo: Repository<Configuracion>,
  ) {}

   
  async get(): Promise<Configuracion> {
    const existing = await this.repo.findOne({ where: { id: 1 } });
    if (existing) return existing;

    const initial = this.repo.create({
      id:           1,
      nombreEmpresa: 'INTIPAMPA',
      moneda:        'PEN',
      pais:          'Peru',
    });
    return this.repo.save(initial);
  }

  async update(dto: UpdateConfiguracionDto): Promise<Configuracion> {
    await this.get(); 
    await this.repo.update(1, dto);
    return this.get();
  }
}
