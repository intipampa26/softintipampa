import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as XLSX from 'xlsx';

import { Campana }    from '../campanas/campana.entity';
import { Productor }  from '../productores/productor.entity';
import { Lote }       from '../lotes/lote.entity';
import { LoteFinal }  from '../lotes-finales/lote-final.entity';
import { Muestra }    from '../muestras/muestra.entity';
import { OrdenVenta } from '../ordenes-venta/orden-venta.entity';

@Injectable()
export class ReportesService {
  constructor(
    @InjectRepository(Campana)    private campanaRepo:     Repository<Campana>,
    @InjectRepository(Productor)  private productorRepo:   Repository<Productor>,
    @InjectRepository(Lote)       private loteRepo:        Repository<Lote>,
    @InjectRepository(LoteFinal)  private loteFinalRepo:   Repository<LoteFinal>,
    @InjectRepository(Muestra)    private muestraRepo:     Repository<Muestra>,
    @InjectRepository(OrdenVenta) private ordenVentaRepo:  Repository<OrdenVenta>,
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

  async getAcopioResumen() {
    const n = (v: string | null | undefined) => Number(v ?? 0);
    const yr24 = `EXTRACT(YEAR FROM l."fechaAdquisicion"::date) = 2024`;
    const yr25 = `EXTRACT(YEAR FROM l."fechaAdquisicion"::date) = 2025`;

    const [totalRaw, byYearRaw, byLoteRaw, byVariedadRaw, byAlmacenRaw, prodRaw] = await Promise.all([
      this.loteRepo.createQueryBuilder('l').select('SUM(l.cantidadKg)', 'total').where('l.activo = true').getRawOne<{ total: string }>(),

      this.loteRepo.createQueryBuilder('l')
        .select(`EXTRACT(YEAR FROM l."fechaAdquisicion"::date)`, 'ano')
        .addSelect('SUM(l.cantidadKg)', 'kg')
        .where(`l.activo = true AND l."fechaAdquisicion" IS NOT NULL`)
        .groupBy('ano').orderBy('ano', 'ASC')
        .getRawMany<{ ano: string; kg: string }>(),

      this.loteRepo.createQueryBuilder('l')
        .select('l.codigo', 'id_lote').addSelect('l.codigo', 'nombre')
        .addSelect(`COALESCE(NULLIF(TRIM(l.planta), ''), 'Sin almacén')`, 'almacen')
        .addSelect(`SUM(CASE WHEN ${yr24} THEN l."cantidadKg" ELSE 0 END)`, 'kg2024')
        .addSelect(`SUM(CASE WHEN ${yr25} THEN l."cantidadKg" ELSE 0 END)`, 'kg2025')
        .addSelect('SUM(l.cantidadKg)', 'total')
        .where('l.activo = true')
        .groupBy('l.codigo, l.planta').orderBy('total', 'DESC').limit(20)
        .getRawMany<{ id_lote: string; nombre: string; almacen: string; kg2024: string; kg2025: string; total: string }>(),

      this.loteRepo.createQueryBuilder('l')
        .select(`COALESCE(NULLIF(TRIM(l.variedad), ''), 'Sin variedad')`, 'variedad')
        .addSelect(`SUM(CASE WHEN ${yr24} THEN l."cantidadKg" ELSE 0 END)`, 'kg2024')
        .addSelect(`SUM(CASE WHEN ${yr25} THEN l."cantidadKg" ELSE 0 END)`, 'kg2025')
        .addSelect('SUM(l.cantidadKg)', 'total')
        .where('l.activo = true')
        .groupBy('variedad').orderBy('total', 'DESC')
        .getRawMany<{ variedad: string; kg2024: string; kg2025: string; total: string }>(),

      this.loteRepo.createQueryBuilder('l')
        .select(`COALESCE(NULLIF(TRIM(l.planta), ''), 'Sin almacén')`, 'almacen')
        .addSelect(`SUM(CASE WHEN ${yr24} THEN l."cantidadKg" ELSE 0 END)`, 'kg2024')
        .addSelect(`SUM(CASE WHEN ${yr25} THEN l."cantidadKg" ELSE 0 END)`, 'kg2025')
        .addSelect('SUM(l.cantidadKg)', 'total')
        .where('l.activo = true')
        .groupBy('almacen').orderBy('total', 'DESC')
        .getRawMany<{ almacen: string; kg2024: string; kg2025: string; total: string }>(),

      this.loteRepo.createQueryBuilder('l')
        .select(`EXTRACT(YEAR FROM l."fechaAdquisicion"::date)`, 'ano')
        .addSelect('COUNT(DISTINCT l.productorId)', 'conteo')
        .where(`l.activo = true AND l."fechaAdquisicion" IS NOT NULL`)
        .groupBy('ano').orderBy('ano', 'ASC')
        .getRawMany<{ ano: string; conteo: string }>(),
    ]);

    return {
      totalKgPergamino: n(totalRaw?.total),
      totalKgPorAño:   byYearRaw.map(r => ({ año: Number(r.ano), kg: n(r.kg) })),
      kgPorLote:       byLoteRaw.map(r => ({ id_lote: r.id_lote, nombre: r.nombre, almacen: r.almacen, kg2024: n(r.kg2024), kg2025: n(r.kg2025), total: n(r.total) })),
      kgPorVariedad:   byVariedadRaw.map(r => ({ variedad: r.variedad, kg2024: n(r.kg2024), kg2025: n(r.kg2025), total: n(r.total) })),
      kgPorAlmacen:    byAlmacenRaw.map(r => ({ almacen: r.almacen, kg2024: n(r.kg2024), kg2025: n(r.kg2025), total: n(r.total) })),
      conteoProductores: prodRaw.map(r => ({ tipo: 'CAFE', año: Number(r.ano), conteo: Number(r.conteo) })),
    };
  }

  async getTrillaResumen() {
    const n = (v: string | null | undefined) => Number(v ?? 0);

    const raw = await this.muestraRepo.createQueryBuilder('m')
      .innerJoin('m.lote', 'l')
      .select('l.codigo', 'id_lote')
      .addSelect('l.codigo', 'nombre')
      .addSelect("COALESCE(NULLIF(TRIM(m.planta), ''), NULLIF(TRIM(l.planta), ''), 'Sin almacén')", 'almacen')
      .addSelect('SUM(l.cantidadKg)', 'kgOroVerde')
      .addSelect(`AVG(CASE WHEN EXTRACT(YEAR FROM m."fechaRegistro"::date) = 2024 THEN m.rendimiento ELSE NULL END)`, 'rend2024')
      .addSelect(`AVG(CASE WHEN EXTRACT(YEAR FROM m."fechaRegistro"::date) = 2025 THEN m.rendimiento ELSE NULL END)`, 'rend2025')
      .addSelect('AVG(m.rendimiento)', 'rendTotal')
      .where('m.rendimiento IS NOT NULL AND m.loteId IS NOT NULL AND m.activo = true')
      .groupBy('l.codigo, m.planta, l.planta')
      .orderBy('AVG(m.rendimiento)', 'DESC')
      .getRawMany<{ id_lote: string; nombre: string; almacen: string; kgOroVerde: string; rend2024: string; rend2025: string; rendTotal: string }>();

    const detallePorLote = raw.map(r => {
      const rTotal = n(r.rendTotal);
      const kgOro = n(r.kgOroVerde);
      return {
        almacen:          r.almacen,
        id_lote:          r.id_lote,
        nombre:           r.nombre,
        kgPergamino:      kgOro > 0 && rTotal > 0 ? Math.round(kgOro / (rTotal / 100) * 100) / 100 : 0,
        kgOroVerde:       kgOro,
        rendimiento2024:  n(r.rend2024),
        rendimiento2025:  n(r.rend2025),
        rendimientoTotal: rTotal,
      };
    });

    const rendimientoPromedio = detallePorLote.length > 0
      ? detallePorLote.reduce((s, r) => s + r.rendimientoTotal, 0) / detallePorLote.length
      : 0;

    return { rendimientoPromedio, detallePorLote };
  }

  async getVentasResumen() {
    const n = (v: string | null | undefined) => Number(v ?? 0);

    const [totalRaw, byYearRaw, byClienteRaw, byProductoRaw, kgProdRaw, pareto2025Raw, detalle2025Raw, mensualRaw] = await Promise.all([
      this.ordenVentaRepo.createQueryBuilder('ov').select('SUM(ov."montoUSD")', 'total').where('ov.activo = true').getRawOne<{ total: string }>(),

      this.ordenVentaRepo.createQueryBuilder('ov')
        .select('EXTRACT(YEAR FROM ov."fecha"::date)', 'ano')
        .addSelect('SUM(ov."montoUSD")', 'usd')
        .where('ov.activo = true AND ov."fecha" IS NOT NULL')
        .groupBy('ano').orderBy('ano', 'ASC')
        .getRawMany<{ ano: string; usd: string }>(),

      this.ordenVentaRepo.createQueryBuilder('ov')
        .select('ov.cliente', 'cliente')
        .addSelect(`SUM(CASE WHEN EXTRACT(YEAR FROM ov."fecha"::date) = 2024 THEN ov."montoUSD" ELSE 0 END)`, 'usd2024')
        .addSelect(`SUM(CASE WHEN EXTRACT(YEAR FROM ov."fecha"::date) = 2025 THEN ov."montoUSD" ELSE 0 END)`, 'usd2025')
        .addSelect('SUM(ov."montoUSD")', 'total')
        .where('ov.activo = true')
        .groupBy('ov.cliente').orderBy('total', 'DESC')
        .getRawMany<{ cliente: string; usd2024: string; usd2025: string; total: string }>(),

      this.ordenVentaRepo.createQueryBuilder('ov')
        .select(`COALESCE(NULLIF(TRIM(ov."tipoProducto"), ''), 'Sin tipo')`, 'tipo')
        .addSelect(`SUM(CASE WHEN EXTRACT(YEAR FROM ov."fecha"::date) = 2024 THEN ov."montoUSD" ELSE 0 END)`, 'usd2024')
        .addSelect(`SUM(CASE WHEN EXTRACT(YEAR FROM ov."fecha"::date) = 2025 THEN ov."montoUSD" ELSE 0 END)`, 'usd2025')
        .addSelect('SUM(ov."montoUSD")', 'total')
        .where('ov.activo = true')
        .groupBy('tipo').orderBy('total', 'DESC')
        .getRawMany<{ tipo: string; usd2024: string; usd2025: string; total: string }>(),

      this.ordenVentaRepo.createQueryBuilder('ov')
        .select(`COALESCE(NULLIF(TRIM(ov."tipoProducto"), ''), 'Sin tipo')`, 'tipo')
        .addSelect(`SUM(CASE WHEN EXTRACT(YEAR FROM ov."fecha"::date) = 2024 THEN ov."cantidadKg" ELSE 0 END)`, 'kg2024')
        .addSelect(`SUM(CASE WHEN EXTRACT(YEAR FROM ov."fecha"::date) = 2025 THEN ov."cantidadKg" ELSE 0 END)`, 'kg2025')
        .addSelect('SUM(ov."cantidadKg")', 'total')
        .where('ov.activo = true')
        .groupBy('tipo').orderBy('total', 'DESC')
        .getRawMany<{ tipo: string; kg2024: string; kg2025: string; total: string }>(),

      this.ordenVentaRepo.createQueryBuilder('ov')
        .select(`COALESCE(NULLIF(TRIM(ov.lote), ''), '—')`, 'id_lote')
        .addSelect(`COALESCE(NULLIF(TRIM(ov.lote), ''), '—')`, 'nombre')
        .addSelect('SUM(ov."cantidadKg")', 'kgVendidos')
        .where(`ov.activo = true AND EXTRACT(YEAR FROM ov."fecha"::date) = 2025`)
        .groupBy('ov.lote').orderBy('SUM(ov."cantidadKg")', 'DESC')
        .getRawMany<{ id_lote: string; nombre: string; kgVendidos: string }>(),

      this.ordenVentaRepo.createQueryBuilder('ov')
        .select(`COALESCE(NULLIF(TRIM(ov."tipoProducto"), ''), 'Sin tipo')`, 'tipo')
        .addSelect(`COALESCE(NULLIF(TRIM(ov.lote), ''), '—')`, 'id_lote')
        .addSelect('SUM(ov."cantidadKg")', 'kgVendidos')
        .addSelect('SUM(ov."montoUSD")', 'valorFOB')
        .where(`ov.activo = true AND EXTRACT(YEAR FROM ov."fecha"::date) = 2025`)
        .groupBy('ov."tipoProducto", ov.lote').orderBy('SUM(ov."montoUSD")', 'DESC')
        .getRawMany<{ tipo: string; id_lote: string; kgVendidos: string; valorFOB: string }>(),

      this.ordenVentaRepo.createQueryBuilder('ov')
        .select(`LPAD(EXTRACT(MONTH FROM ov."fecha"::date)::text, 2, '0')`, 'mes')
        .addSelect(`SUM(CASE WHEN EXTRACT(YEAR FROM ov."fecha"::date) = 2024 THEN ov."montoUSD" ELSE 0 END)`, 'usd2024')
        .addSelect(`SUM(CASE WHEN EXTRACT(YEAR FROM ov."fecha"::date) = 2025 THEN ov."montoUSD" ELSE 0 END)`, 'usd2025')
        .where(`ov.activo = true AND ov."fecha" IS NOT NULL`)
        .groupBy('mes').orderBy('mes', 'ASC')
        .getRawMany<{ mes: string; usd2024: string; usd2025: string }>(),
    ]);

    const totalKg2025 = pareto2025Raw.reduce((s, r) => s + n(r.kgVendidos), 0);
    let acumulado = 0;
    const paretoProductos2025 = pareto2025Raw.map(r => {
      const pct = totalKg2025 > 0 ? (n(r.kgVendidos) / totalKg2025) * 100 : 0;
      acumulado += pct;
      return { id_lote: r.id_lote, nombre: r.nombre, kgVendidos: n(r.kgVendidos), porcentaje: pct, acumulado };
    });

    return {
      totalFOB:              n(totalRaw?.total),
      totalFOBPorAño:        byYearRaw.map(r => ({ año: Number(r.ano), usd: n(r.usd) })),
      ventasPorCliente:      byClienteRaw.map(r => ({ cliente: r.cliente, usd2024: n(r.usd2024), usd2025: n(r.usd2025), total: n(r.total) })),
      ventasPorProducto:     byProductoRaw.map(r => ({ tipo: r.tipo, usd2024: n(r.usd2024), usd2025: n(r.usd2025), total: n(r.total) })),
      kgVendidosPorProducto: kgProdRaw.map(r => ({ tipo: r.tipo, kg2024: n(r.kg2024), kg2025: n(r.kg2025), total: n(r.total) })),
      paretoProductos2025,
      detalle2025: detalle2025Raw.map(r => ({ tipo: r.tipo, id_lote: r.id_lote, kgVendidos: n(r.kgVendidos), valorFOB: n(r.valorFOB) })),
      ventasMensuales: mensualRaw.map(r => ({ mes: r.mes, usd2024: n(r.usd2024), usd2025: n(r.usd2025) })),
    };
  }

  private buildExcel(sheetName: string, rows: Record<string, unknown>[]): Buffer {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(rows);
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' }) as Buffer;
  }
}
