import api from '@/api/axios';

export type LoteFinalTipoOrigen = 'DIRECTO' | 'DIVISION' | 'MEZCLA';
export type LoteFinalEstado     = 'PENDIENTE_TRILLADO' | 'TRILLADO';

export interface LoteFinal {
  id: number;
  codigo: string;
  tipoProductoId: number;
  tipoProducto?: { id: number; tipo: string; subtipoEntrada: string; subtipoSalida: string };
  campanaId: number | null;
  campana?: { id: number; nombre: string };
  skuId?: number | null;
  sku?: { id: number; nombre: string; codigoHS?: string | null; requiereFito?: boolean; codigoFDA?: string | null; nombreFDA?: string | null } | null;
  cantidadKg: number;
  variedad: string | null;
  productor?: { id: number; nombre: string; apellido: string | null } | null;
  tipoOrigen: LoteFinalTipoOrigen;
  estado: LoteFinalEstado;
  fechaCreacion: string | null;
  observaciones: string | null;
  activo: boolean;
  createdAt: string;
}

export interface LoteFinalOrigen {
  id: number;
  loteFinalId: number;
  loteOrigenId: number;
  loteOrigen?: {
    id: number; codigo: string; cantidadKg: number;
    productor?: { id: number; nombre: string; apellido: string | null };
    parcela?: { id: number; nombre: string };
    tipoProducto?: { tipo: string };
  };
  cantidadAportadaKg: number;
}

export interface Trillado {
  id: number;
  loteFinalId: number;
  fecha: string;
  planta: string | null;
  malla: string | null;
  tipoSeleccion: string | null;
  encargado: string | null;
  pesoPorQuintalKg: number;
  pesoPfKg: number;
  cantidadQuintales: number;
  kgSueltos: number;
  mermaReutilizableKg: number;
  mermaDesechableKg: number;
  sobranteExportableKg: number;
  nroLiquidacion: string | null;
  observaciones: string | null;
  createdAt: string;
}

export interface MovimientoKardex {
  id: number;
  loteFinalId: number;
  tipoMovimiento: 'INGRESO' | 'SALIDA' | 'MERMA' | 'AJUSTE';
  cantidadKg: number;
  saldoKg: number;
  referenciaTipo: string;
  referenciaId: number | null;
  fecha: string;
  observaciones: string | null;
  createdAt: string;
}

export interface DetalleLoteFinal {
  loteFinal: LoteFinal;
  origenes: LoteFinalOrigen[];
  trillado: Trillado | null;
}

export interface TrillarDto {
  fecha: string;
  planta?: string;
  malla?: string;
  tipoSeleccion?: string;
  encargado?: string;
  pesoPorQuintalKg: number;
  pesoPfKg: number;
  mermaReutilizableKg: number;
  mermaDesechableKg: number;
  sobranteExportableKg: number;
  skuId?: number;
  nroLiquidacion?: string;
  /** UUID de un grupo de trilla existente — el lote hereda su nroLiquidacion y batchId */
  existingBatchId?: string;
  observaciones?: string;
}

export interface GrupoTrilla {
  batchId: string;
  nroLiquidacion: string | null;
  fecha: string;
  planta: string | null;
  lotesCount: number;
  pesoTotalKg: number;
}

export interface LoteOverride {
  id: number;
  skuId?: number;
  mermaReutilizableKg?: number;
  mermaDesechableKg?: number;
  sobranteExportableKg?: number;
}

export interface BatchTrillarDto {
  ids: number[];
  fecha: string;
  planta?: string;
  malla?: string;
  tipoSeleccion?: string;
  encargado?: string;
  pesoPorQuintalKg: number;
  /** Merma reutilizable TOTAL de la operación (se distribuye por prorrateo si no hay overrides) */
  mermaReutilizableKg: number;
  /** Merma desechable TOTAL de la operación */
  mermaDesechableKg: number;
  /** Sobrante exportable TOTAL de la operación */
  sobranteExportableKg: number;
  skuId?: number;
  nroLiquidacion?: string;
  /** UUID de un grupo existente — si se provee, los lotes se agregan a ese grupo */
  existingBatchId?: string;
  observaciones?: string;
  /** Overrides por lote: SKU y mermas individuales */
  loteOverrides?: LoteOverride[];
}

export interface BatchTrillarResumen {
  batchId: string;
  trillados: Trillado[];
  resumen: {
    lotesCount: number;
    pesoTotalKg: number;
    mermaReutilizableTotalKg: number;
    mermaDesechableTotalKg: number;
    sobranteExportableTotalKg: number;
    pesoPfTotalKg: number;
    rendimientoPct: number;
  };
}

export interface FilterLotesFinalesDto {
  page?: number; limit?: number;
  estado?: LoteFinalEstado;
  tipoProductoId?: number;
  campanaId?: number;
  loteOrigenId?: number;
  productorId?: number;
}

export interface PaginationMeta { total: number; page: number; lastPage: number; limit: number; }
export interface PagedLotesFinales { data: LoteFinal[]; meta: PaginationMeta; }

const CACHE_KEY = 'intipampa_lotes_finales_cache';

function readCache(): PagedLotesFinales {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : { data: [], meta: { total: 0, page: 1, lastPage: 1, limit: 10 } };
  } catch { return { data: [], meta: { total: 0, page: 1, lastPage: 1, limit: 10 } }; }
}

class LotesFinalesService {
  async getPage(filter: FilterLotesFinalesDto = {}): Promise<PagedLotesFinales> {
    if (!navigator.onLine) return readCache();
    try {
      const res  = await api.get('/lotes-finales', { params: filter });
      const data: LoteFinal[] = Array.isArray(res.data) ? res.data : [];
      const meta: PaginationMeta = (res as unknown as { meta: PaginationMeta }).meta ?? { total: 0, page: 1, lastPage: 1, limit: 10 };
      const result = { data, meta };
      localStorage.setItem(CACHE_KEY, JSON.stringify(result));
      return result;
    } catch { return readCache(); }
  }

  async getDetalle(id: number): Promise<DetalleLoteFinal> {
    const { data } = await api.get(`/lotes-finales/${id}`);
    return data;
  }

  async trillar(id: number, dto: TrillarDto): Promise<Trillado> {
    const { data } = await api.post(`/lotes-finales/${id}/trillar`, dto);
    return data;
  }

  async trillarBatch(dto: BatchTrillarDto): Promise<BatchTrillarResumen> {
    const { data } = await api.post('/lotes-finales/trillar-batch', dto);
    return data;
  }

  async getGruposTrilla(): Promise<GrupoTrilla[]> {
    try {
      const { data } = await api.get('/lotes-finales/grupos-trilla');
      return Array.isArray(data) ? data : [];
    } catch { return []; }
  }

  async getKardex(id: number): Promise<MovimientoKardex[]> {
    try {
      const { data } = await api.get(`/lotes-finales/${id}/kardex`);
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  }
}

export const lotesFinalesService = new LotesFinalesService();
