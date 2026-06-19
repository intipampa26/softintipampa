import api from '@/api/axios';

export type TipoMovimientoKardex = 'INGRESO' | 'SALIDA' | 'MERMA' | 'AJUSTE';

export interface MovimientoKardex {
  id: number;
  loteFinalId: number;
  loteFinal?: {
    id: number;
    codigo: string;
    tipoProducto?: { id: number; tipo: string; subtipoEntrada?: string; subtipoSalida?: string };
    campana?: { id: number; nombre: string };
    cantidadKg: number;
    estado: string;
    tipoOrigen?: 'DIRECTO' | 'DIVISION' | 'MEZCLA';
    origenes?: Array<{
      id: number;
      loteFinalId: number;
      loteOrigenId: number;
      cantidadAportadaKg: number;
      loteOrigen?: { id: number; codigo: string };
    }>;
  };
  tipoMovimiento: TipoMovimientoKardex;
  cantidadKg: number;
  saldoKg: number;
  referenciaTipo: string;
  referenciaId: number | null;
  fecha: string;
  horaEntrada: string | null;
  horaSalida: string | null;
  observaciones: string | null;
  createdAt: string;
}

export interface KardexFilter {
  loteFinalId?: number;
  tipoMovimiento?: TipoMovimientoKardex | '';
  fechaDesde?: string;
  fechaHasta?: string;
  page?: number;
  limit?: number;
}

export interface PagedKardex {
  data: MovimientoKardex[];
  meta: { total: number; page: number; lastPage: number; limit: number };
}

const CACHE_KEY = 'intipampa_kardex_cache';
const BASE = '/kardex';

function writeCache(data: PagedKardex) {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify(data)); } catch {}
}

function readCache(): PagedKardex {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { data: [], meta: { total: 0, page: 1, lastPage: 1, limit: 20 } };
}

export const kardexService = {
  async getPage(filter: KardexFilter = {}): Promise<PagedKardex> {
    const params: Record<string, unknown> = {
      page:  filter.page  ?? 1,
      limit: filter.limit ?? 20,
    };
    if (filter.loteFinalId)    params.loteFinalId    = filter.loteFinalId;
    if (filter.tipoMovimiento) params.tipoMovimiento = filter.tipoMovimiento;
    if (filter.fechaDesde)     params.fechaDesde     = filter.fechaDesde;
    if (filter.fechaHasta)     params.fechaHasta     = filter.fechaHasta;

    if (!navigator.onLine) return readCache();
    try {
      const res = await api.get(BASE, { params });
      const raw = res.data;
      let data: MovimientoKardex[];
      let meta: PagedKardex['meta'];
      if (Array.isArray(raw)) {
        data = raw as MovimientoKardex[];
        meta = { total: data.length, page: 1, lastPage: 1, limit: data.length || 20 };
      } else {
        const payload = raw as { data?: MovimientoKardex[]; meta?: PagedKardex['meta'] };
        data = Array.isArray(payload?.data) ? payload.data : [];
        meta = payload?.meta ?? { total: 0, page: 1, lastPage: 1, limit: 20 };
      }
      const result: PagedKardex = { data, meta };
      writeCache(result);
      return result;
    } catch {
      return readCache();
    }
  },
};
