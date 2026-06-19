export interface AcopioResumen {
  totalKgPergamino: number;
  totalKgPorAño: { año: number; kg: number }[];
  kgPorLote: { id_lote: string; nombre: string; almacen: string; kg2024: number; kg2025: number; total: number }[];
  kgPorVariedad: { variedad: string; kg2024: number; kg2025: number; total: number }[];
  kgPorAlmacen: { almacen: string; kg2024: number; kg2025: number; total: number }[];
  conteoProductores: { tipo: string; año: number; conteo: number }[];
}

export interface TrillaResumen {
  rendimientoPromedio: number;
  detallePorLote: {
    almacen: string;
    id_lote: string;
    nombre: string;
    kgPergamino: number;
    kgOroVerde: number;
    rendimiento2024: number;
    rendimiento2025: number;
    rendimientoTotal: number;
  }[];
}

export interface VentasResumen {
  totalFOB: number;
  totalFOBPorAño: { año: number; usd: number }[];
  ventasPorCliente: { cliente: string; usd2024: number; usd2025: number; total: number }[];
  ventasPorProducto: { tipo: string; usd2024: number; usd2025: number; total: number }[];
  kgVendidosPorProducto: { tipo: string; kg2024: number; kg2025: number; total: number }[];
  paretoProductos2025: { id_lote: string; nombre: string; kgVendidos: number; porcentaje: number; acumulado: number }[];
  detalle2025: { tipo: string; id_lote: string; kgVendidos: number; valorFOB: number }[];
  ventasMensuales: { mes: string; usd2024: number; usd2025: number }[];
}

export type FiltroAño = '2024' | '2025' | 'ambos';
