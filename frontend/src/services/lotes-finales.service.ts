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
  cantidadKg: number;
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
  observaciones?: string;
}

export interface FilterLotesFinalesDto {
  page?: number; limit?: number;
  estado?: LoteFinalEstado;
  tipoProductoId?: number;
  campanaId?: number;
  loteOrigenId?: number;
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
      const res  = await api.get('/api/lotes-finales', { params: filter });
      const data: LoteFinal[] = Array.isArray(res.data) ? res.data : [];
      const meta: PaginationMeta = (res as unknown as { meta: PaginationMeta }).meta ?? { total: 0, page: 1, lastPage: 1, limit: 10 };
      const result = { data, meta };
      localStorage.setItem(CACHE_KEY, JSON.stringify(result));
      return result;
    } catch { return readCache(); }
  }

  async getDetalle(id: number): Promise<DetalleLoteFinal> {
    const { data } = await api.get(`/api/lotes-finales/${id}`);
    return data;
  }

  async trillar(id: number, dto: TrillarDto): Promise<Trillado> {
    const { data } = await api.post(`/api/lotes-finales/${id}/trillar`, dto);
    return data;
  }

  async getKardex(id: number): Promise<MovimientoKardex[]> {
    const { data } = await api.get(`/api/lotes-finales/${id}/kardex`);
    return Array.isArray(data) ? data : [];
  }
}

export const lotesFinalesService = new LotesFinalesService();
