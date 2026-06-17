import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ParcelaCampana } from './parcela-campana.entity';
import { UpsertParcelaCampanaDto } from './dto/upsert-parcela-campana.dto';

@Injectable()
export class ParcelasCampanaService {
  constructor(
    @InjectRepository(ParcelaCampana)
    private readonly repo: Repository<ParcelaCampana>,
  ) {}

   
  async findOne(parcelaId: number, campanaId: number): Promise<ParcelaCampana | null> {
    return this.repo.findOne({
      where: { parcelaId, campanaId },
      relations: ['campana'],
    });
  }

   
  async findByParcela(parcelaId: number): Promise<ParcelaCampana[]> {
    return this.repo.find({
      where: { parcelaId },
      relations: ['campana'],
      order: { campanaId: 'DESC' },
    });
  }

   
  async upsert(dto: UpsertParcelaCampanaDto): Promise<ParcelaCampana> {
    const { parcelaId, campanaId, ...data } = dto;
    let record = await this.repo.findOne({ where: { parcelaId, campanaId } });
    if (record) {
      Object.assign(record, data);
      return this.repo.save(record);
    }
    return this.repo.save(this.repo.create({ parcelaId, campanaId, ...data }));
  }

  async remove(parcelaId: number, campanaId: number): Promise<void> {
    const record = await this.repo.findOne({ where: { parcelaId, campanaId } });
    if (!record) throw new NotFoundException('Snapshot no encontrado');
    await this.repo.remove(record);
  }
}
