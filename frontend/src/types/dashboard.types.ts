export interface AcopioResumen {
  totalKgPergamino: number;
  totalKgPorAño: { año: number; kg: number }[];
  kgPorLote: { id_lote: string; nombre: string; almacen: string; kg2024: number; kg2025: number; total: number }[];
  kgPorVariedad: { variedad: string; tipo: string; kg2024: number; kg2025: number; total: number }[];
  kgPorAlmacen: { almacen: string; kg2024: number; kg2025: number; total: number }[];
  conteoProductores: { tipo: string; año: number; conteo: number }[];
  kgPorMes: { mes: string; almacen: string; total: number }[];
  muestrasPorMes: {
    mes: string;
    conteo: number;
    avgFisico: number | null;
    avgSensorial: number | null;
    avgRendimiento: number | null;
    avgHumedad: number | null;
  }[];
  top10PorProductor: { nombre: string; mes: string; total: number }[];
  top10PorVariedad:  { nombre: string; mes: string; total: number }[];
  top10PorZona:      { nombre: string; mes: string; total: number }[];
  muestrasPorProductorMes: { nombre: string; mes: string; conteo: number; avgFisico: number | null; avgSensorial: number | null; avgRendimiento: number | null; avgHumedad: number | null }[];
  muestrasPorVariedadMes:  { nombre: string; mes: string; conteo: number; avgFisico: number | null; avgSensorial: number | null; avgRendimiento: number | null; avgHumedad: number | null }[];
  muestrasPorZonaMes:      { nombre: string; mes: string; conteo: number; avgFisico: number | null; avgSensorial: number | null; avgRendimiento: number | null; avgHumedad: number | null }[];
}

export interface TrillaResumen {
  rendimientoPromedio: number;
  detallePorLote: {
    almacen: string;
    id_lote: string;
    nombre: string;
    productorNombre: string;
    variedad: string;
    tipo: string;
    kgPergamino: number;
    kgOroVerde: number;
    rendimiento2024: number;
    rendimiento2025: number;
    rendimientoTotal: number;
  }[];
}

export interface VentasResumen {
  totalUSD: number;
  totalPEN: number;
  totalFOB: number;
  totalFOBPorAño: { año: number; usd: number }[];
  totalPENPorAño: { año: number; pen: number }[];
  ventasPorCliente: { cliente: string; usd2024: number; usd2025: number; pen2024: number; pen2025: number }[];
  ventasPorProducto: { tipo: string; usd2024: number; usd2025: number; pen2024: number; pen2025: number }[];
  kgVendidosPorProducto: { tipo: string; kg2024: number; kg2025: number; total: number }[];
  paretoProductos2025: { id_lote: string; nombre: string; kgVendidos: number; porcentaje: number; acumulado: number }[];
  detalle2025: { tipo: string; id_lote: string; kgVendidos: number; valorUSD: number; valorPEN: number; mercado?: string; sku?: string }[];
  ventasMensuales: { mes: string; usd2024: number; usd2025: number; pen2024: number; pen2025: number }[];
  ventasPorMercado: { mercado: string; kg: number; montoUSD: number; montoPEN: number }[];
  ventasPorSku: { sku: string; kg: number; montoUSD: number; montoPEN: number }[];
}

export type FiltroAño = '2024' | '2025' | 'ambos';
