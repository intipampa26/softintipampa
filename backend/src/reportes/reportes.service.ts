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

export interface ExportFilters {
  campanaId?:  number;
  sku?:        string;
  fecha?:      string;
  fechaDesde?: string;
  fechaHasta?: string;
  almacen?:    string;
}

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

  async getFilterOptions() {
    const [lotesRaw, muestrasRaw] = await Promise.all([
      this.loteRepo.manager.query<{ planta: string }[]>(
        `SELECT DISTINCT TRIM(planta) AS planta FROM lotes WHERE planta IS NOT NULL AND TRIM(planta) != '' ORDER BY planta ASC`,
      ),
      this.loteRepo.manager.query<{ planta: string }[]>(
        `SELECT DISTINCT TRIM(planta) AS planta FROM muestras WHERE planta IS NOT NULL AND TRIM(planta) != '' ORDER BY planta ASC`,
      ),
    ]);
    const almacenesSet = new Set<string>([
      ...lotesRaw.map(r => r.planta),
      ...muestrasRaw.map(r => r.planta),
    ]);
    return { almacenes: [...almacenesSet].sort() };
  }

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

  async exportLotes(f: ExportFilters = {}): Promise<Buffer> {
    const qb = this.loteRepo.createQueryBuilder('l')
      .leftJoinAndSelect('l.campana', 'c')
      .leftJoinAndSelect('l.productor', 'p')
      .leftJoinAndSelect('l.tipoProducto', 'tp')
      .where('l.id > 0')
      .orderBy('l.id', 'ASC');

    if (f.campanaId)  qb.andWhere('l.campanaId = :campanaId', { campanaId: f.campanaId });
    if (f.almacen)    qb.andWhere("l.planta ILIKE :almacen", { almacen: `%${f.almacen}%` });
    if (f.fecha)      qb.andWhere("l.fechaAdquisicion = :fecha", { fecha: f.fecha });
    if (f.fechaDesde) qb.andWhere("l.fechaAdquisicion >= :fechaDesde", { fechaDesde: f.fechaDesde });
    if (f.fechaHasta) qb.andWhere("l.fechaAdquisicion <= :fechaHasta", { fechaHasta: f.fechaHasta });

    const lotes = await qb.getMany();

    const rows = lotes.map((l, i) => ({
      'N°':              i + 1,
      'Código':          l.codigo,
      'Tipo Producto':   (l as any).tipoProducto?.tipo ?? '',
      'Campaña':         (l as any).campana?.nombre ?? '',
      'Productor':       (l as any).productor ? `${(l as any).productor.nombre} ${(l as any).productor.apellido ?? ''}`.trim() : '',
      'Almacén / Planta': (l as any).planta ?? '',
      'Cantidad Kg':     Number(l.cantidadKg),
      'Estado':          l.estado,
    }));

    return this.buildExcel('Lotes', rows);
  }

  async exportLotesFinales(f: ExportFilters = {}): Promise<Buffer> {
    const qb = this.loteFinalRepo.createQueryBuilder('lf')
      .leftJoinAndSelect('lf.campana', 'c')
      .leftJoinAndSelect('lf.tipoProducto', 'tp')
      .leftJoin('skus', 'sk', 'sk.id = lf."skuId"')
      .addSelect('sk.nombre', 'sku_nombre')
      .where('lf.activo = true')
      .orderBy('lf.codigo', 'ASC');

    if (f.campanaId)  qb.andWhere('lf.campanaId = :campanaId', { campanaId: f.campanaId });
    if (f.sku)        qb.andWhere('sk.nombre ILIKE :sku', { sku: `%${f.sku}%` });
    if (f.fecha)      qb.andWhere('lf.fechaCreacion = :fecha', { fecha: f.fecha });
    if (f.fechaDesde) qb.andWhere('lf.fechaCreacion >= :fechaDesde', { fechaDesde: f.fechaDesde });
    if (f.fechaHasta) qb.andWhere('lf.fechaCreacion <= :fechaHasta', { fechaHasta: f.fechaHasta });

    const raw = await qb.getRawAndEntities();
    const skuMap = new Map<number, string>();
    raw.raw.forEach((r: any) => { if (r.lf_id != null) skuMap.set(Number(r.lf_id), r.sku_nombre ?? ''); });

    const rows = raw.entities.map((lf, i) => ({
      'N°':            i + 1,
      'Código':        lf.codigo,
      'SKU':           skuMap.get(lf.id) ?? '',
      'Tipo Producto': (lf as any).tipoProducto?.tipo ?? '',
      'Campaña':       (lf as any).campana?.nombre ?? '',
      'Cantidad Kg':   Number(lf.cantidadKg),
      'Tipo Origen':   lf.tipoOrigen,
      'Estado':        lf.estado,
      'Fecha':         lf.fechaCreacion ?? '',
    }));

    return this.buildExcel('Lotes Finales', rows);
  }

  async getAcopioResumen(campanaId?: number) {
    const n = (v: string | null | undefined) => Number(v ?? 0);
    const currentYear = new Date().getFullYear();
    const yr24 = `EXTRACT(YEAR FROM l."fechaAdquisicion"::date) = ${currentYear - 1}`;
    const yr25 = `EXTRACT(YEAR FROM l."fechaAdquisicion"::date) = ${currentYear}`;
    const cf = `($1::int IS NULL OR l."campanaId" = $1::int)`;
    const p = [campanaId ?? null];

    const [totalRaw, byYearRaw, byLoteRaw, byVariedadRaw, byAlmacenRaw, prodRaw, kgPorMesRaw, muestrasPorMesRaw, top10ProductorRaw, top10VariedadRaw, top10ZonaRaw, muestrasPorProductorRaw, muestrasPorVariedadRaw, muestrasPorZonaRaw] = await Promise.all([
      this.loteRepo.manager.query<{ total: string }[]>(`
        SELECT SUM(l."cantidadKg" + COALESCE(lo_sum.total_aportado, 0)) AS total
        FROM lotes l
        LEFT JOIN (SELECT "loteOrigenId", SUM("cantidadAportadaKg") AS total_aportado FROM lote_final_origenes GROUP BY "loteOrigenId") lo_sum ON l.id = lo_sum."loteOrigenId"
        WHERE l.activo = true AND ${cf}
      `, p).then(r => r[0]),

      this.loteRepo.manager.query<{ ano: string; kg: string }[]>(`
        SELECT EXTRACT(YEAR FROM l."fechaAdquisicion"::date) AS ano,
               SUM(l."cantidadKg" + COALESCE(lo_sum.total_aportado, 0)) AS kg
        FROM lotes l
        LEFT JOIN (SELECT "loteOrigenId", SUM("cantidadAportadaKg") AS total_aportado FROM lote_final_origenes GROUP BY "loteOrigenId") lo_sum ON l.id = lo_sum."loteOrigenId"
        WHERE l.activo = true AND l."fechaAdquisicion" IS NOT NULL AND ${cf}
        GROUP BY 1 ORDER BY 1 ASC
      `, p),

      this.loteRepo.manager.query<{ id_lote: string; nombre: string; almacen: string; kg2024: string; kg2025: string; total: string }[]>(`
        SELECT
          l.codigo AS id_lote,
          CONCAT(
            COALESCE(pr.nombre, ''), ' ', COALESCE(pr.apellido, ''),
            ' · ', COALESCE(NULLIF(TRIM(l.variedad), ''), 'Sin var.'),
            ' · ', COALESCE(NULLIF(TRIM(l.planta), ''), 'Sin zona')
          ) AS nombre,
          COALESCE(NULLIF(TRIM(l.planta), ''), 'Sin almacén') AS almacen,
          SUM(CASE WHEN ${yr24} THEN (l."cantidadKg" + COALESCE(lo_sum.total_aportado, 0)) ELSE 0 END) AS kg2024,
          SUM(CASE WHEN ${yr25} THEN (l."cantidadKg" + COALESCE(lo_sum.total_aportado, 0)) ELSE 0 END) AS kg2025,
          SUM(l."cantidadKg" + COALESCE(lo_sum.total_aportado, 0)) AS total
        FROM lotes l
        LEFT JOIN productores pr ON pr.id = l."productorId"
        LEFT JOIN (
          SELECT "loteOrigenId", SUM("cantidadAportadaKg") AS total_aportado
          FROM lote_final_origenes GROUP BY "loteOrigenId"
        ) lo_sum ON l.id = lo_sum."loteOrigenId"
        WHERE l.activo = true AND ${cf}
        GROUP BY l.codigo, l.planta, l.variedad, pr.nombre, pr.apellido
        ORDER BY total DESC
        LIMIT 20
      `, p),

      this.loteRepo.manager.query<{ variedad: string; tipo: string; kg2024: string; kg2025: string; total: string }[]>(`
        SELECT
          COALESCE(NULLIF(TRIM(l.variedad), ''), mv.variedad, 'Sin variedad') AS variedad,
          COALESCE(tp.tipo::text, 'SIN_TIPO') AS tipo,
          SUM(CASE WHEN ${yr24} THEN (l."cantidadKg" + COALESCE(lo_sum.total_aportado, 0)) ELSE 0 END) AS kg2024,
          SUM(CASE WHEN ${yr25} THEN (l."cantidadKg" + COALESCE(lo_sum.total_aportado, 0)) ELSE 0 END) AS kg2025,
          SUM(l."cantidadKg" + COALESCE(lo_sum.total_aportado, 0)) AS total
        FROM lotes l
        LEFT JOIN tipos_producto tp ON tp.id = l."tipoProductoId"
        LEFT JOIN (
          SELECT "loteOrigenId", SUM("cantidadAportadaKg") AS total_aportado
          FROM lote_final_origenes
          GROUP BY "loteOrigenId"
        ) lo_sum ON l.id = lo_sum."loteOrigenId"
        LEFT JOIN (
          SELECT DISTINCT ON (m."loteId") m."loteId" AS lote_id, m.variedad
          FROM muestras m
          WHERE m.variedad IS NOT NULL AND TRIM(m.variedad) != '' AND m.activo = true
          ORDER BY m."loteId", m."createdAt" DESC
        ) mv ON l.id = mv.lote_id
        WHERE l.activo = true AND ${cf}
        GROUP BY 1, 2
        ORDER BY total DESC
      `, p),

      this.loteRepo.manager.query<{ almacen: string; kg2024: string; kg2025: string; total: string }[]>(`
        SELECT
          COALESCE(NULLIF(TRIM(l.planta), ''), mp.planta, 'Sin almacén') AS almacen,
          SUM(CASE WHEN ${yr24} THEN (l."cantidadKg" + COALESCE(lo_sum.total_aportado, 0)) ELSE 0 END) AS kg2024,
          SUM(CASE WHEN ${yr25} THEN (l."cantidadKg" + COALESCE(lo_sum.total_aportado, 0)) ELSE 0 END) AS kg2025,
          SUM(l."cantidadKg" + COALESCE(lo_sum.total_aportado, 0)) AS total
        FROM lotes l
        LEFT JOIN (
          SELECT "loteOrigenId", SUM("cantidadAportadaKg") AS total_aportado
          FROM lote_final_origenes GROUP BY "loteOrigenId"
        ) lo_sum ON l.id = lo_sum."loteOrigenId"
        LEFT JOIN (
          SELECT DISTINCT ON (m."loteId") m."loteId" AS lote_id, m.planta
          FROM muestras m
          WHERE m.planta IS NOT NULL AND TRIM(m.planta) != '' AND m.activo = true
          ORDER BY m."loteId", m."createdAt" DESC
        ) mp ON l.id = mp.lote_id
        WHERE l.activo = true AND ${cf}
        GROUP BY 1
        ORDER BY total DESC
      `, p),

      (() => {
        const qb = this.loteRepo.createQueryBuilder('l')
          .select(`EXTRACT(YEAR FROM l."fechaAdquisicion"::date)`, 'ano')
          .addSelect('COUNT(DISTINCT l.productorId)', 'conteo')
          .where(`l.activo = true AND l."fechaAdquisicion" IS NOT NULL`);
        if (campanaId) qb.andWhere('l."campanaId" = :campanaId', { campanaId });
        return qb.groupBy('ano').orderBy('ano', 'ASC').getRawMany<{ ano: string; conteo: string }>();
      })(),

      this.loteRepo.manager.query<{ mes: string; almacen: string; total: string }[]>(`
        SELECT
          LPAD(EXTRACT(MONTH FROM l."fechaAdquisicion"::date)::text, 2, '0') AS mes,
          COALESCE(NULLIF(TRIM(l.planta), ''), 'Sin almacén') AS almacen,
          SUM(l."cantidadKg" + COALESCE(lo_sum.total_aportado, 0)) AS total
        FROM lotes l
        LEFT JOIN (
          SELECT "loteOrigenId", SUM("cantidadAportadaKg") AS total_aportado
          FROM lote_final_origenes GROUP BY "loteOrigenId"
        ) lo_sum ON l.id = lo_sum."loteOrigenId"
        WHERE l.activo = true AND l."fechaAdquisicion" IS NOT NULL AND ${cf}
        GROUP BY mes, almacen
        ORDER BY mes ASC
      `, p),

      this.loteRepo.manager.query<{ mes: string; conteo: string; avg_fisico: string; avg_sensorial: string; avg_rendimiento: string; avg_humedad: string }[]>(`
        SELECT
          LPAD(EXTRACT(MONTH FROM m."fechaRegistro"::date)::text, 2, '0') AS mes,
          COUNT(*) AS conteo,
          ROUND(AVG(m."puntajeFisico")::numeric, 2) AS avg_fisico,
          ROUND(AVG(m."puntajeSensorial")::numeric, 2) AS avg_sensorial,
          ROUND(AVG(m.rendimiento)::numeric, 2) AS avg_rendimiento,
          ROUND(AVG(m.humedad)::numeric, 2) AS avg_humedad
        FROM muestras m
        WHERE m.activo = true AND m."fechaRegistro" IS NOT NULL
          AND ($1::int IS NULL OR m."campanaId" = $1::int)
        GROUP BY mes
        ORDER BY mes ASC
      `, p),

      this.loteRepo.manager.query<{ nombre: string; mes: string; total: string }[]>(`
        SELECT
          TRIM(COALESCE(pr.nombre || ' ' || COALESCE(pr.apellido, ''), 'Sin productor')) AS nombre,
          LPAD(EXTRACT(MONTH FROM l."fechaAdquisicion"::date)::text, 2, '0') AS mes,
          SUM(l."cantidadKg" + COALESCE(lo_sum.total_aportado, 0)) AS total
        FROM lotes l
        LEFT JOIN productores pr ON pr.id = l."productorId"
        LEFT JOIN (SELECT "loteOrigenId", SUM("cantidadAportadaKg") AS total_aportado FROM lote_final_origenes GROUP BY "loteOrigenId") lo_sum ON l.id = lo_sum."loteOrigenId"
        WHERE l.activo = true AND l."fechaAdquisicion" IS NOT NULL AND ${cf}
        GROUP BY 1, 2
        ORDER BY total DESC
      `, p),

      this.loteRepo.manager.query<{ nombre: string; mes: string; total: string }[]>(`
        SELECT
          COALESCE(NULLIF(TRIM(l.variedad), ''), 'Sin variedad') AS nombre,
          LPAD(EXTRACT(MONTH FROM l."fechaAdquisicion"::date)::text, 2, '0') AS mes,
          SUM(l."cantidadKg" + COALESCE(lo_sum.total_aportado, 0)) AS total
        FROM lotes l
        LEFT JOIN (SELECT "loteOrigenId", SUM("cantidadAportadaKg") AS total_aportado FROM lote_final_origenes GROUP BY "loteOrigenId") lo_sum ON l.id = lo_sum."loteOrigenId"
        WHERE l.activo = true AND l."fechaAdquisicion" IS NOT NULL AND ${cf}
        GROUP BY 1, 2
        ORDER BY total DESC
      `, p),

      this.loteRepo.manager.query<{ nombre: string; mes: string; total: string }[]>(`
        SELECT
          COALESCE(NULLIF(TRIM(l.planta), ''), 'Sin zona') AS nombre,
          LPAD(EXTRACT(MONTH FROM l."fechaAdquisicion"::date)::text, 2, '0') AS mes,
          SUM(l."cantidadKg" + COALESCE(lo_sum.total_aportado, 0)) AS total
        FROM lotes l
        LEFT JOIN (SELECT "loteOrigenId", SUM("cantidadAportadaKg") AS total_aportado FROM lote_final_origenes GROUP BY "loteOrigenId") lo_sum ON l.id = lo_sum."loteOrigenId"
        WHERE l.activo = true AND l."fechaAdquisicion" IS NOT NULL AND ${cf}
        GROUP BY 1, 2
        ORDER BY total DESC
      `, p),

      this.loteRepo.manager.query<{ nombre: string; mes: string; conteo: string; avg_fisico: string; avg_sensorial: string; avg_rendimiento: string; avg_humedad: string }[]>(`
        SELECT
          TRIM(COALESCE(pr.nombre || ' ' || COALESCE(pr.apellido, ''), 'Sin productor')) AS nombre,
          LPAD(EXTRACT(MONTH FROM m."fechaRegistro"::date)::text, 2, '0') AS mes,
          COUNT(*) AS conteo,
          ROUND(AVG(m."puntajeFisico")::numeric, 2) AS avg_fisico,
          ROUND(AVG(m."puntajeSensorial")::numeric, 2) AS avg_sensorial,
          ROUND(AVG(m.rendimiento)::numeric, 2) AS avg_rendimiento,
          ROUND(AVG(m.humedad)::numeric, 2) AS avg_humedad
        FROM muestras m
        LEFT JOIN lotes l ON l.id = m."loteId"
        LEFT JOIN productores pr ON pr.id = l."productorId"
        WHERE m.activo = true AND m."fechaRegistro" IS NOT NULL
          AND ($1::int IS NULL OR m."campanaId" = $1::int)
        GROUP BY 1, 2
        ORDER BY nombre ASC, mes ASC
      `, p),

      this.loteRepo.manager.query<{ nombre: string; mes: string; conteo: string; avg_fisico: string; avg_sensorial: string; avg_rendimiento: string; avg_humedad: string }[]>(`
        SELECT
          COALESCE(NULLIF(TRIM(m.variedad), ''), NULLIF(TRIM(l.variedad), ''), 'Sin variedad') AS nombre,
          LPAD(EXTRACT(MONTH FROM m."fechaRegistro"::date)::text, 2, '0') AS mes,
          COUNT(*) AS conteo,
          ROUND(AVG(m."puntajeFisico")::numeric, 2) AS avg_fisico,
          ROUND(AVG(m."puntajeSensorial")::numeric, 2) AS avg_sensorial,
          ROUND(AVG(m.rendimiento)::numeric, 2) AS avg_rendimiento,
          ROUND(AVG(m.humedad)::numeric, 2) AS avg_humedad
        FROM muestras m
        LEFT JOIN lotes l ON l.id = m."loteId"
        WHERE m.activo = true AND m."fechaRegistro" IS NOT NULL
          AND ($1::int IS NULL OR m."campanaId" = $1::int)
        GROUP BY 1, 2
        ORDER BY nombre ASC, mes ASC
      `, p),

      this.loteRepo.manager.query<{ nombre: string; mes: string; conteo: string; avg_fisico: string; avg_sensorial: string; avg_rendimiento: string; avg_humedad: string }[]>(`
        SELECT
          COALESCE(NULLIF(TRIM(m.planta), ''), NULLIF(TRIM(l.planta), ''), 'Sin zona') AS nombre,
          LPAD(EXTRACT(MONTH FROM m."fechaRegistro"::date)::text, 2, '0') AS mes,
          COUNT(*) AS conteo,
          ROUND(AVG(m."puntajeFisico")::numeric, 2) AS avg_fisico,
          ROUND(AVG(m."puntajeSensorial")::numeric, 2) AS avg_sensorial,
          ROUND(AVG(m.rendimiento)::numeric, 2) AS avg_rendimiento,
          ROUND(AVG(m.humedad)::numeric, 2) AS avg_humedad
        FROM muestras m
        LEFT JOIN lotes l ON l.id = m."loteId"
        WHERE m.activo = true AND m."fechaRegistro" IS NOT NULL
          AND ($1::int IS NULL OR m."campanaId" = $1::int)
        GROUP BY 1, 2
        ORDER BY nombre ASC, mes ASC
      `, p),

    ]);

    return {
      totalKgPergamino: n(totalRaw?.total),
      totalKgPorAño:   byYearRaw.map(r => ({ año: Number(r.ano), kg: n(r.kg) })),
      kgPorLote:       byLoteRaw.map(r => ({ id_lote: r.id_lote, nombre: r.nombre, almacen: r.almacen, kg2024: n(r.kg2024), kg2025: n(r.kg2025), total: n(r.total) })),
      kgPorVariedad:   byVariedadRaw.map(r => ({ variedad: r.variedad, tipo: r.tipo, kg2024: n(r.kg2024), kg2025: n(r.kg2025), total: n(r.total) })),
      kgPorAlmacen:    byAlmacenRaw.map(r => ({ almacen: r.almacen, kg2024: n(r.kg2024), kg2025: n(r.kg2025), total: n(r.total) })),
      conteoProductores: prodRaw.map(r => ({ tipo: 'CAFE', año: Number(r.ano), conteo: Number(r.conteo) })),
      kgPorMes: kgPorMesRaw.map(r => ({ mes: r.mes, almacen: r.almacen, total: n(r.total) })),
      muestrasPorMes: muestrasPorMesRaw.map(r => ({
        mes: r.mes,
        conteo: Number(r.conteo),
        avgFisico:      r.avg_fisico      ? n(r.avg_fisico)      : null,
        avgSensorial:   r.avg_sensorial   ? n(r.avg_sensorial)   : null,
        avgRendimiento: r.avg_rendimiento ? n(r.avg_rendimiento) : null,
        avgHumedad:     r.avg_humedad     ? n(r.avg_humedad)     : null,
      })),
      top10PorProductor: top10ProductorRaw.map(r => ({ nombre: r.nombre, mes: r.mes, total: n(r.total) })),
      top10PorVariedad:  top10VariedadRaw.map(r  => ({ nombre: r.nombre, mes: r.mes, total: n(r.total) })),
      top10PorZona:      top10ZonaRaw.map(r      => ({ nombre: r.nombre, mes: r.mes, total: n(r.total) })),
      muestrasPorProductorMes: muestrasPorProductorRaw.map(r => ({ nombre: r.nombre, mes: r.mes, conteo: Number(r.conteo), avgFisico: r.avg_fisico ? n(r.avg_fisico) : null, avgSensorial: r.avg_sensorial ? n(r.avg_sensorial) : null, avgRendimiento: r.avg_rendimiento ? n(r.avg_rendimiento) : null, avgHumedad: r.avg_humedad ? n(r.avg_humedad) : null })),
      muestrasPorVariedadMes:  muestrasPorVariedadRaw.map(r => ({ nombre: r.nombre, mes: r.mes, conteo: Number(r.conteo), avgFisico: r.avg_fisico ? n(r.avg_fisico) : null, avgSensorial: r.avg_sensorial ? n(r.avg_sensorial) : null, avgRendimiento: r.avg_rendimiento ? n(r.avg_rendimiento) : null, avgHumedad: r.avg_humedad ? n(r.avg_humedad) : null })),
      muestrasPorZonaMes:      muestrasPorZonaRaw.map(r    => ({ nombre: r.nombre, mes: r.mes, conteo: Number(r.conteo), avgFisico: r.avg_fisico ? n(r.avg_fisico) : null, avgSensorial: r.avg_sensorial ? n(r.avg_sensorial) : null, avgRendimiento: r.avg_rendimiento ? n(r.avg_rendimiento) : null, avgHumedad: r.avg_humedad ? n(r.avg_humedad) : null })),
    };
  }

  async getTrillaResumen(campanaId?: number) {
    const n = (v: string | null | undefined) => Number(v ?? 0);

    const qb = this.muestraRepo.createQueryBuilder('m')
      .innerJoin('m.lote', 'l')
      .leftJoin('l.productor', 'pr')
      .leftJoin('l.tipoProducto', 'tp')
      .select('l.codigo', 'id_lote')
      .addSelect('l.codigo', 'nombre')
      .addSelect("COALESCE(NULLIF(TRIM(m.planta), ''), NULLIF(TRIM(l.planta), ''), 'Sin almacén')", 'almacen')
      .addSelect("CONCAT(pr.nombre, ' ', COALESCE(pr.apellido, ''))", 'productor_nombre')
      .addSelect("COALESCE(NULLIF(TRIM(l.variedad), ''), 'Sin variedad')", 'variedad')
      .addSelect("COALESCE(tp.tipo::text, 'SIN_TIPO')", 'tipo')
      .addSelect('SUM(l.cantidadKg)', 'kgOroVerde')
      .addSelect(`AVG(CASE WHEN EXTRACT(YEAR FROM m."fechaRegistro"::date) = 2024 THEN m.rendimiento ELSE NULL END)`, 'rend2024')
      .addSelect(`AVG(CASE WHEN EXTRACT(YEAR FROM m."fechaRegistro"::date) = 2025 THEN m.rendimiento ELSE NULL END)`, 'rend2025')
      .addSelect('AVG(m.rendimiento)', 'rendTotal')
      .where('m.rendimiento IS NOT NULL AND m.loteId IS NOT NULL AND m.activo = true');
    if (campanaId) qb.andWhere('l."campanaId" = :campanaId', { campanaId });
    const raw = await qb
      .groupBy('l.codigo, m.planta, l.planta, l.variedad, pr.nombre, pr.apellido, tp.tipo')
      .orderBy('AVG(m.rendimiento)', 'DESC')
      .getRawMany<{ id_lote: string; nombre: string; almacen: string; productor_nombre: string; variedad: string; tipo: string; kgOroVerde: string; rend2024: string; rend2025: string; rendTotal: string }>();

    const detallePorLote = raw.map(r => {
      const rTotal = n(r.rendTotal);
      const kgOro = n(r.kgOroVerde);
      return {
        almacen:          r.almacen,
        id_lote:          r.id_lote,
        nombre:           r.nombre,
        productorNombre:  r.productor_nombre?.trim() ?? '',
        variedad:         r.variedad,
        tipo:             r.tipo,
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

  async getVentasResumen(campanaId?: number) {
    const n = (v: string | null | undefined) => Number(v ?? 0);
    const currentYear = new Date().getFullYear();
    const yr24 = `EXTRACT(YEAR FROM ov."fecha"::date) = ${currentYear - 1}`;
    const yr25 = `EXTRACT(YEAR FROM ov."fecha"::date) = ${currentYear}`;
    const cf = `($1::int IS NULL OR ov.campana = (SELECT nombre FROM campanas WHERE id = $1::int))`;
    const p = [campanaId ?? null];

    const [totalRaw, byYearRaw, byClienteRaw, byProductoRaw, kgProdRaw, pareto2025Raw, detalle2025Raw, mensualRaw, mercadoRaw, ventasPorSkuRaw] = await Promise.all([
      this.ordenVentaRepo.manager.query<{ moneda: string; total: string }[]>(`
        SELECT ov.moneda, SUM(ov."montoUSD") AS total
        FROM ordenes_venta ov WHERE ov.activo = true AND ${cf}
        GROUP BY ov.moneda
      `, p),

      this.ordenVentaRepo.manager.query<{ ano: string; moneda: string; monto: string }[]>(`
        SELECT EXTRACT(YEAR FROM ov."fecha"::date) AS ano, ov.moneda, SUM(ov."montoUSD") AS monto
        FROM ordenes_venta ov WHERE ov.activo = true AND ov."fecha" IS NOT NULL AND ${cf}
        GROUP BY ano, ov.moneda ORDER BY ano
      `, p),

      this.ordenVentaRepo.manager.query<{ cliente: string; usd2024: string; usd2025: string; pen2024: string; pen2025: string }[]>(`
        SELECT ov.cliente,
          SUM(CASE WHEN ${yr24} AND ov.moneda = 'USD' THEN ov."montoUSD" ELSE 0 END) AS usd2024,
          SUM(CASE WHEN ${yr25} AND ov.moneda = 'USD' THEN ov."montoUSD" ELSE 0 END) AS usd2025,
          SUM(CASE WHEN ${yr24} AND ov.moneda = 'PEN' THEN ov."montoUSD" ELSE 0 END) AS pen2024,
          SUM(CASE WHEN ${yr25} AND ov.moneda = 'PEN' THEN ov."montoUSD" ELSE 0 END) AS pen2025
        FROM ordenes_venta ov WHERE ov.activo = true AND ${cf}
        GROUP BY ov.cliente ORDER BY (SUM(CASE WHEN ov.moneda='USD' THEN ov."montoUSD" ELSE 0 END)) DESC
        LIMIT 10
      `, p),

      (() => {
        const qb = this.ordenVentaRepo.createQueryBuilder('ov')
          .select(`COALESCE(NULLIF(TRIM(ov."tipoProducto"), ''), 'Sin tipo')`, 'tipo')
          .addSelect(`SUM(CASE WHEN ${yr24} AND ov.moneda = 'USD' THEN ov."montoUSD" ELSE 0 END)`, 'usd2024')
          .addSelect(`SUM(CASE WHEN ${yr25} AND ov.moneda = 'USD' THEN ov."montoUSD" ELSE 0 END)`, 'usd2025')
          .addSelect(`SUM(CASE WHEN ${yr24} AND ov.moneda = 'PEN' THEN ov."montoUSD" ELSE 0 END)`, 'pen2024')
          .addSelect(`SUM(CASE WHEN ${yr25} AND ov.moneda = 'PEN' THEN ov."montoUSD" ELSE 0 END)`, 'pen2025')
          .where('ov.activo = true');
        if (campanaId) qb.andWhere(`ov.campana = (SELECT nombre FROM campanas WHERE id = :campanaId)`, { campanaId });
        return qb.groupBy('tipo').orderBy('SUM(ov."montoUSD")', 'DESC')
          .getRawMany<{ tipo: string; usd2024: string; usd2025: string; pen2024: string; pen2025: string }>();
      })(),

      (() => {
        const qb = this.ordenVentaRepo.createQueryBuilder('ov')
          .select(`COALESCE(NULLIF(TRIM(ov."tipoProducto"), ''), 'Sin tipo')`, 'tipo')
          .addSelect(`SUM(CASE WHEN ${yr24} THEN ov."cantidadKg" ELSE 0 END)`, 'kg2024')
          .addSelect(`SUM(CASE WHEN ${yr25} THEN ov."cantidadKg" ELSE 0 END)`, 'kg2025')
          .addSelect('SUM(ov."cantidadKg")', 'total')
          .where('ov.activo = true');
        if (campanaId) qb.andWhere(`ov.campana = (SELECT nombre FROM campanas WHERE id = :campanaId)`, { campanaId });
        return qb.groupBy('tipo').orderBy('total', 'DESC')
          .getRawMany<{ tipo: string; kg2024: string; kg2025: string; total: string }>();
      })(),

      (() => {
        const qb = this.ordenVentaRepo.createQueryBuilder('ov')
          .select(`COALESCE(NULLIF(TRIM(ov.lote), ''), '—')`, 'id_lote')
          .addSelect(`COALESCE(NULLIF(TRIM(ov.lote), ''), '—')`, 'nombre')
          .addSelect('SUM(ov."cantidadKg")', 'kgVendidos')
          .where('ov.activo = true');
        if (campanaId) qb.andWhere(`ov.campana = (SELECT nombre FROM campanas WHERE id = :campanaId)`, { campanaId });
        return qb.groupBy('ov.lote').orderBy('SUM(ov."cantidadKg")', 'DESC')
          .getRawMany<{ id_lote: string; nombre: string; kgVendidos: string }>();
      })(),

      this.ordenVentaRepo.manager.query<{ tipo: string; id_lote: string; mercado: string; sku_nombre: string; kgVendidos: string; valorUSD: string; valorPEN: string }[]>(`
        SELECT
          COALESCE(NULLIF(TRIM(ov."tipoProducto"), ''), 'Sin tipo') AS tipo,
          COALESCE(NULLIF(TRIM(ov.lote), ''), '—') AS id_lote,
          COALESCE(NULLIF(TRIM(ov.mercado), ''), 'NACIONAL') AS mercado,
          COALESCE(sk.nombre, '—') AS sku_nombre,
          SUM(ov."cantidadKg") AS "kgVendidos",
          SUM(CASE WHEN ov.moneda = 'USD' THEN ov."montoUSD" ELSE 0 END) AS "valorUSD",
          SUM(CASE WHEN ov.moneda = 'PEN' THEN ov."montoUSD" ELSE 0 END) AS "valorPEN"
        FROM ordenes_venta ov
        LEFT JOIN lotes_finales lf ON lf.codigo = ov.lote AND lf.activo = true
        LEFT JOIN skus sk ON sk.id = lf."skuId" AND sk.activo = true
        WHERE ov.activo = true AND ${cf}
        GROUP BY ov."tipoProducto", ov.lote, ov.mercado, sk.nombre
        ORDER BY SUM(ov."montoUSD") DESC
      `, p),

      this.ordenVentaRepo.manager.query<{ mes: string; usd2024: string; usd2025: string; pen2024: string; pen2025: string }[]>(`
        SELECT LPAD(EXTRACT(MONTH FROM ov."fecha"::date)::text, 2, '0') AS mes,
          SUM(CASE WHEN ${yr24} AND ov.moneda = 'USD' THEN ov."montoUSD" ELSE 0 END) AS usd2024,
          SUM(CASE WHEN ${yr25} AND ov.moneda = 'USD' THEN ov."montoUSD" ELSE 0 END) AS usd2025,
          SUM(CASE WHEN ${yr24} AND ov.moneda = 'PEN' THEN ov."montoUSD" ELSE 0 END) AS pen2024,
          SUM(CASE WHEN ${yr25} AND ov.moneda = 'PEN' THEN ov."montoUSD" ELSE 0 END) AS pen2025
        FROM ordenes_venta ov WHERE ov.activo = true AND ov."fecha" IS NOT NULL AND ${cf}
        GROUP BY mes ORDER BY mes
      `, p),

      this.ordenVentaRepo.manager.query<{ mercado: string; kg: string; montoUSD: string; montoPEN: string }[]>(`
        SELECT
          COALESCE(NULLIF(TRIM(ov.mercado), ''), 'NACIONAL') AS mercado,
          SUM(ov."cantidadKg") AS kg,
          SUM(CASE WHEN ov.moneda = 'USD' THEN ov."montoUSD" ELSE 0 END) AS "montoUSD",
          SUM(CASE WHEN ov.moneda = 'PEN' THEN ov."montoUSD" ELSE 0 END) AS "montoPEN"
        FROM ordenes_venta ov WHERE ov.activo = true AND ${cf}
        GROUP BY mercado ORDER BY "montoUSD" DESC
      `, p),

      this.ordenVentaRepo.manager.query<{ sku: string; kg: string; montoUSD: string; montoPEN: string }[]>(`
        SELECT
          COALESCE(sk.nombre, '—') AS sku,
          SUM(ov."cantidadKg") AS kg,
          SUM(CASE WHEN ov.moneda = 'USD' THEN ov."montoUSD" ELSE 0 END) AS "montoUSD",
          SUM(CASE WHEN ov.moneda = 'PEN' THEN ov."montoUSD" ELSE 0 END) AS "montoPEN"
        FROM ordenes_venta ov
        LEFT JOIN lotes_finales lf ON lf.codigo = ov.lote AND lf.activo = true
        LEFT JOIN skus sk ON sk.id = lf."skuId" AND sk.activo = true
        WHERE ov.activo = true AND ${cf}
        GROUP BY sk.nombre ORDER BY "montoUSD" DESC
      `, p),
    ]);

    const totalUSD = n(totalRaw.find(r => r.moneda === 'USD')?.total);
    const totalPEN = n(totalRaw.find(r => r.moneda === 'PEN')?.total);

    const byYearUSD = byYearRaw.filter(r => r.moneda === 'USD');
    const byYearPEN = byYearRaw.filter(r => r.moneda === 'PEN');

    const totalKg2025 = pareto2025Raw.reduce((s, r) => s + n(r.kgVendidos), 0);
    let acumulado = 0;
    const paretoProductos2025 = pareto2025Raw.map(r => {
      const pct = totalKg2025 > 0 ? (n(r.kgVendidos) / totalKg2025) * 100 : 0;
      acumulado += pct;
      return { id_lote: r.id_lote, nombre: r.nombre, kgVendidos: n(r.kgVendidos), porcentaje: pct, acumulado };
    });

    return {
      totalUSD,
      totalPEN,
      totalFOB: totalUSD,
      totalFOBPorAño: byYearUSD.map(r => ({ año: Number(r.ano), usd: n(r.monto) })),
      totalPENPorAño: byYearPEN.map(r => ({ año: Number(r.ano), pen: n(r.monto) })),
      ventasPorCliente:      byClienteRaw.map(r => ({ cliente: r.cliente, usd2024: n(r.usd2024), usd2025: n(r.usd2025), pen2024: n(r.pen2024), pen2025: n(r.pen2025) })),
      ventasPorProducto:     byProductoRaw.map(r => ({ tipo: r.tipo, usd2024: n(r.usd2024), usd2025: n(r.usd2025), pen2024: n(r.pen2024), pen2025: n(r.pen2025) })),
      kgVendidosPorProducto: kgProdRaw.map(r => ({ tipo: r.tipo, kg2024: n(r.kg2024), kg2025: n(r.kg2025), total: n(r.total) })),
      paretoProductos2025,
      detalle2025: detalle2025Raw.map(r => ({ tipo: r.tipo, id_lote: r.id_lote, mercado: r.mercado, sku: r.sku_nombre, kgVendidos: n(r.kgVendidos), valorUSD: n(r.valorUSD), valorPEN: n(r.valorPEN) })),
      ventasMensuales: mensualRaw.map(r => ({ mes: r.mes, usd2024: n(r.usd2024), usd2025: n(r.usd2025), pen2024: n(r.pen2024), pen2025: n(r.pen2025) })),
      ventasPorMercado: mercadoRaw.map(r => ({ mercado: r.mercado, kg: n(r.kg), montoUSD: n(r.montoUSD), montoPEN: n(r.montoPEN) })),
      ventasPorSku: ventasPorSkuRaw.map(r => ({ sku: r.sku, kg: n(r.kg), montoUSD: n(r.montoUSD), montoPEN: n(r.montoPEN) })),
    };
  }

  async exportMuestras(f: ExportFilters = {}): Promise<Buffer> {
    const qb = this.muestraRepo.createQueryBuilder('m')
      .leftJoinAndSelect('m.productor', 'pr')
      .leftJoinAndSelect('m.campana', 'c')
      .leftJoinAndSelect('m.lote', 'l')
      .leftJoinAndSelect('m.parcela', 'pa')
      .where('m.activo = true')
      .orderBy('m.fechaRegistro', 'ASC')
      .addOrderBy('m.codigo', 'ASC');

    if (f.campanaId)  qb.andWhere('m.campanaId = :campanaId', { campanaId: f.campanaId });
    if (f.almacen)    qb.andWhere('m.planta ILIKE :almacen', { almacen: `%${f.almacen}%` });
    if (f.fecha)      qb.andWhere('m.fechaRegistro = :fecha', { fecha: f.fecha });
    if (f.fechaDesde) qb.andWhere('m.fechaRegistro >= :fechaDesde', { fechaDesde: f.fechaDesde });
    if (f.fechaHasta) qb.andWhere('m.fechaRegistro <= :fechaHasta', { fechaHasta: f.fechaHasta });

    const muestras = await qb.getMany();

    const rows = muestras.map((m, i) => ({
      'N°':                i + 1,
      'Código':            m.codigo,
      'Fecha Registro':    m.fechaRegistro ?? '',
      'Fecha Cata':        m.fechaCata ?? '',
      'Campaña':           (m as any).campana?.nombre ?? '',
      'Productor':         (m as any).productor ? `${(m as any).productor.nombre} ${(m as any).productor.apellido ?? ''}`.trim() : '',
      'Parcela':           (m as any).parcela?.nombre ?? '',
      'Lote':              (m as any).lote?.codigo ?? '',
      'Tipo Muestra':      m.tipoMuestra ?? '',
      'Variedad':          m.variedad ?? '',
      'Proceso':           m.proceso ?? '',
      'Planta / Zona':     m.planta ?? '',
      'País':              m.pais ?? '',
      'Región':            m.region ?? '',
      'Cantidad Kg':       m.cantidadKg != null ? Number(m.cantidadKg) : '',
      'Rendimiento (%)':   m.rendimiento != null ? Number(m.rendimiento) : '',
      'Humedad (%)':       m.humedad != null ? Number(m.humedad) : '',
      'Puntaje Físico':    m.puntajeFisico != null ? Number(m.puntajeFisico) : '',
      'Puntaje Sensorial': m.puntajeSensorial != null ? Number(m.puntajeSensorial) : '',
      'Categoría':         m.categoriaMuestra ?? '',
      'Estado Lote':       m.estadoLote ?? '',
      'Base':              m.base ?? '',
      'Año Cosecha':       m.añoCosecha ?? '',
      'Estado':            m.estado,
      'Observaciones':     m.observaciones ?? '',
    }));

    return this.buildExcel('Muestras', rows);
  }

  async exportVentas(f: ExportFilters = {}): Promise<Buffer> {
    const qb = this.ordenVentaRepo.createQueryBuilder('ov')
      .leftJoin('lotes_finales', 'lf', 'lf.codigo = ov.lote AND lf.activo = true')
      .leftJoin('skus', 'sk', 'sk.id = lf."skuId"')
      .where('ov.activo = true')
      .orderBy('ov.fecha', 'ASC')
      .addOrderBy('ov.codigo', 'ASC');

    if (f.campanaId)  qb.andWhere('ov.campana = (SELECT nombre FROM campanas WHERE id = :campanaId)', { campanaId: f.campanaId });
    if (f.sku)        qb.andWhere('sk.nombre ILIKE :sku', { sku: `%${f.sku}%` });
    if (f.fecha)      qb.andWhere('ov.fecha = :fecha', { fecha: f.fecha });
    if (f.fechaDesde) qb.andWhere('ov.fecha >= :fechaDesde', { fechaDesde: f.fechaDesde });
    if (f.fechaHasta) qb.andWhere('ov.fecha <= :fechaHasta', { fechaHasta: f.fechaHasta });

    const ventas = await qb.getMany();

    const rows = ventas.map((v, i) => ({
      'N°':            i + 1,
      'Código':        v.codigo,
      'Fecha':         v.fecha ?? '',
      'Cliente':       v.cliente,
      'Productor':     v.productor ?? '',
      'Campaña':       v.campana ?? '',
      'Lote':          v.lote ?? '',
      'Tipo Producto': v.tipoProducto ?? '',
      'Destino':       v.destino ?? '',
      'Mercado':       v.mercado ?? '',
      'Cantidad Kg':   Number(v.cantidadKg),
      'Monto':         Number(v.montoUSD),
      'Moneda':        v.moneda,
      'Etapa Actual':  v.etapaActual,
    }));

    return this.buildExcel('Ventas', rows);
  }

  private buildExcel(sheetName: string, rows: Record<string, unknown>[]): Buffer {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(rows);
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' }) as Buffer;
  }
}
