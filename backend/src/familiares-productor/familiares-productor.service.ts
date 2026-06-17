
import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FamiliarProductor } from './familiar-productor.entity';
import { CreateFamiliarProductorDto } from './dto/create-familiar-productor.dto';
import { UpdateFamiliarProductorDto } from './dto/update-familiar-productor.dto';

@Injectable()
export class FamiliaresProductorService {
  constructor(
    @InjectRepository(FamiliarProductor)
    private readonly repo: Repository<FamiliarProductor>,
  ) {}

  async findByProductor(productorId: number): Promise<FamiliarProductor[]> {
    return this.repo.find({
      where: { productorId },
      order: { apellidos: 'ASC', nombres: 'ASC' },
    });
  }

  async findOne(id: number, productorId: number): Promise<FamiliarProductor> {
    const familiar = await this.repo.findOne({ where: { id, productorId } });
    if (!familiar) {
      throw new NotFoundException(`Familiar #${id} no encontrado para el productor #${productorId}`);
    }
    return familiar;
  }

  async create(
    productorId: number,
    dto: CreateFamiliarProductorDto,
  ): Promise<FamiliarProductor> {
    
    if (dto.nroDocumento?.trim()) {
      const existe = await this.repo.findOne({
        where: { productorId, nroDocumento: dto.nroDocumento.trim() },
      });
      if (existe) {
        throw new ConflictException(
          `Ya existe un familiar con documento "${dto.nroDocumento}" para este productor`,
        );
      }
    }

    const familiar = this.repo.create({ ...dto, productorId });
    return this.repo.save(familiar);
  }

  async update(
    id: number,
    productorId: number,
    dto: UpdateFamiliarProductorDto,
  ): Promise<FamiliarProductor> {
    await this.findOne(id, productorId);

    
    if (dto.nroDocumento?.trim()) {
      const existe = await this.repo.findOne({
        where: { productorId, nroDocumento: dto.nroDocumento.trim() },
      });
      if (existe && existe.id !== id) {
        throw new ConflictException(
          `Ya existe un familiar con documento "${dto.nroDocumento}" para este productor`,
        );
      }
    }

    await this.repo.update(id, dto);
    return this.findOne(id, productorId);
  }

  async remove(id: number, productorId: number): Promise<void> {
    await this.findOne(id, productorId);
    await this.repo.delete(id);
  }
}
