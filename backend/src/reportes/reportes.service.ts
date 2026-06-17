import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as XLSX from 'xlsx';

import { Campana } from '../campanas/campana.entity';
import { Productor } from '../productores/productor.entity';
import { Lote } from '../lotes/lote.entity';
import { LoteFinal } from '../lotes-finales/lote-final.entity';
import { Muestra } from '../muestras/muestra.entity';

@Injectable()
export class ReportesService {
  constructor(
    @InjectRepository(Campana)    private campanaRepo:    Repository<Campana>,
    @InjectRepository(Productor)  private productorRepo:  Repository<Productor>,
    @InjectRepository(Lote)       private loteRepo:       Repository<Lote>,
    @InjectRepository(LoteFinal)  private loteFinalRepo:  Repository<LoteFinal>,
    @InjectRepository(Muestra)    private muestraRepo:    Repository<Muestra>,
  ) {}

  async getResumen(campanaId?: number) {
    let campana: Campana | null = null;

    if (campanaId) {
      campana = await this.campanaRepo.findOne({ where: { id: campanaId } });
      if (!campana) throw new NotFoundException(`Campaña ${campanaId} no encontrada`);
    }

    const [
      totalProductores,
      totalLotes,
      totalLotesFinales,
      totalMuestras,
    ] = await Promise.all([
      this.productorRepo.count({
        where: { ...(campanaId ? { campanaId } : {}), activo: true },
      }),
      this.loteRepo.count({
        where: { ...(campanaId ? { campanaId } : {}) },
      }),
      this.loteFinalRepo.count({
        where: { ...(campanaId ? { campanaId } : {}), activo: true },
      }),
      this.muestraRepo.count({
        where: { ...(campanaId ? { campanaId } : {}) },
      }),
    ]);

    
    const kgLotesRaw = await this.loteRepo
      .createQueryBuilder('l')
      .select('SUM(l.cantidadKg)', 'total')
      .where(campanaId ? 'l.campanaId = :campanaId' : '1=1', { campanaId })
      .getRawOne<{ total: string | null }>();

    const kgLotesFinalesRaw = await this.loteFinalRepo
      .createQueryBuilder('lf')
      .select('SUM(lf.cantidadKg)', 'total')
      .where(campanaId ? 'lf.campanaId = :campanaId AND lf.activo = true' : 'lf.activo = true', { campanaId })
      .getRawOne<{ total: string | null }>();

    return {
      campana: campana ? { id: campana.id, nombre: campana.nombre } : null,
      kpis: {
        totalProductores,
        totalLotes,
        totalLotesFinales,
        totalMuestras,
        kgTotalLotes:        Number(kgLotesRaw?.total ?? 0),
        kgTotalLotesFinales: Number(kgLotesFinalesRaw?.total ?? 0),
      },
    };
  }

  async exportProductores(campanaId?: number): Promise<Buffer> {
    const where: Record<string, unknown> = { activo: true };
    if (campanaId) where.campanaId = campanaId;

    const productores = await this.productorRepo.find({
      where,
      relations: ['campana'],
      order: { apellido: 'ASC', nombre: 'ASC' },
    });

    const rows = productores.map((p, i) => ({
      'N°':            i + 1,
      'Código':        `PR${String(p.id).padStart(3, '0')}`,
      'Nombres':       p.nombre,
      'Apellidos':     p.apellido ?? '',
      'Documento':     p.nroDocumento ?? '',
      'Teléfono':      p.telefono ?? '',
      'Email':         p.email ?? '',
      'Dirección':     p.direccion ?? '',
      'Tipo Producto': p.tipoProducto ?? '',
      'Es Apto':       p.esApto ? 'Sí' : 'No',
      'Campaña':       (p as any).campana?.nombre ?? '',
      'Fecha Reg.':    p.fecha ?? '',
    }));

    return this.buildExcel('Productores', rows);
  }

  async exportLotes(campanaId?: number): Promise<Buffer> {
    const qb = this.loteRepo.createQueryBuilder('l')
      .leftJoinAndSelect('l.campana', 'c')
      .leftJoinAndSelect('l.productor', 'p')
      .leftJoinAndSelect('l.tipoProducto', 'tp')
      .orderBy('l.id', 'ASC');

    if (campanaId) qb.where('l.campanaId = :campanaId', { campanaId });

    const lotes = await qb.getMany();

    const rows = lotes.map((l, i) => ({
      'N°':            i + 1,
      'Código':        l.codigo,
      'Tipo Producto': (l as any).tipoProducto?.tipo ?? '',
      'Campaña':       (l as any).campana?.nombre ?? '',
      'Productor':     (l as any).productor ? `${(l as any).productor.nombre} ${(l as any).productor.apellido ?? ''}`.trim() : '',
      'Cantidad Kg':   Number(l.cantidadKg),
      'Estado':        l.estado,
    }));

    return this.buildExcel('Lotes', rows);
  }

  async exportLotesFinales(campanaId?: number): Promise<Buffer> {
    const qb = this.loteFinalRepo.createQueryBuilder('lf')
      .leftJoinAndSelect('lf.campana', 'c')
      .leftJoinAndSelect('lf.tipoProducto', 'tp')
      .where('lf.activo = true')
      .orderBy('lf.codigo', 'ASC');

    if (campanaId) qb.andWhere('lf.campanaId = :campanaId', { campanaId });

    const lotes = await qb.getMany();

    const rows = lotes.map((lf, i) => ({
      'N°':            i + 1,
      'Código':        lf.codigo,
      'Tipo Producto': (lf as any).tipoProducto?.tipo ?? '',
      'Campaña':       (lf as any).campana?.nombre ?? '',
      'Cantidad Kg':   Number(lf.cantidadKg),
      'Tipo Origen':   lf.tipoOrigen,
      'Estado':        lf.estado,
      'Fecha':         lf.fechaCreacion ?? '',
    }));

    return this.buildExcel('Lotes Finales', rows);
  }

  private buildExcel(sheetName: string, rows: Record<string, unknown>[]): Buffer {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(rows);
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' }) as Buffer;
  }
}
