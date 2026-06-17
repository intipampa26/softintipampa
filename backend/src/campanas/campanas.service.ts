import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Campana } from './campana.entity';
import { CreateCampanaDto } from './dto/create-campana.dto';
import { UpdateCampanaDto } from './dto/update-campana.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { PaginatedResult } from '../common/interfaces/api-response.interface';
import { paginate } from '../common/helpers/pagination.helper';

@Injectable()
export class CampanasService {
  constructor(
    @InjectRepository(Campana)
    private readonly repo: Repository<Campana>,
  ) {}

  findAll(pagination: PaginationDto): Promise<PaginatedResult<Campana>> {
    return paginate(this.repo, pagination, {
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Campana> {
    const campana = await this.repo.findOne({ where: { id } });
    if (!campana) throw new NotFoundException(`Campaña #${id} no encontrada`);
    return campana;
  }

  create(dto: CreateCampanaDto): Promise<Campana> {
    return this.repo.save(this.repo.create(dto));
  }

  async update(id: number, dto: UpdateCampanaDto): Promise<Campana> {
    await this.findOne(id);
    await this.repo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.repo.delete(id);
  }
}
