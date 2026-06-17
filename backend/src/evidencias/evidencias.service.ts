import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Evidencia } from './evidencia.entity';
import { existsSync, unlinkSync, mkdirSync } from 'fs';
import { join } from 'path';

@Injectable()
export class EvidenciasService {
  constructor(
    @InjectRepository(Evidencia)
    private readonly repo: Repository<Evidencia>,
  ) {
    
    const dir = join(process.cwd(), 'uploads', 'evidencias');
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  }

  async findByProductor(productorId: number): Promise<Evidencia[]> {
    return this.repo.find({
      where: { productorId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Evidencia> {
    const ev = await this.repo.findOne({ where: { id } });
    if (!ev) throw new NotFoundException(`Evidencia #${id} no encontrada`);
    return ev;
  }

  async create(params: {
    productorId:      number;
    nombreArchivo:    string;
    filePath:         string;
    originalFilename: string;
    mimeType:         string | null;
    fileSize:         number | null;
  }): Promise<Evidencia> {
    
    const raw = await this.repo
      .createQueryBuilder('e')
      .select('MAX(e.version)', 'maxVersion')
      .where('e.productorId = :pid AND e.nombreArchivo = :name', {
        pid:  params.productorId,
        name: params.nombreArchivo,
      })
      .getRawOne<{ maxVersion: string | null }>();

    const version = Number(raw?.maxVersion ?? 0) + 1;

    const ev = this.repo.create({ ...params, version });
    return this.repo.save(ev);
  }

  async remove(id: number): Promise<void> {
    const ev = await this.findOne(id);
    
    const fullPath = join(process.cwd(), ev.filePath);
    if (existsSync(fullPath)) {
      unlinkSync(fullPath);
    }
    await this.repo.remove(ev);
  }
}
