import api from '@/api/axios';

export type LoteEstado = 'PRE_ADQUISICION' | 'POST_ADQUISICION' | 'PRE_TRILLADO' | 'POST_TRILLADO' | 'PREPARADO' | 'EMBARCADO' | 'EXPORTADO';

export interface Lote {
  id: number;
  codigo: string;
  tipoProductoId: number;
  tipoProducto?: { id: number; tipo: string; subtipoEntrada: string; subtipoSalida: string };
  campanaId: number | null;
  campana?: { id: number; nombre: string };
  productorId: number;
  productor?: { id: number; nombre: string; apellido: string | null };
  parcelaId: number | null;
  parcela?: { id: number; nombre: string };
  cantidadKg: number;
  cantidadSacos: number | null;
  estado: LoteEstado;
  fechaAdquisicion: string | null;
  lotePadreId: number | null;
  variedad: string | null;
  planta: string | null;
  observaciones: string | null;
  activo: boolean;
  createdAt: string;
}

export interface LoteFinalOrigen {
  id: number;
  loteFinalId: number;
  loteOrigenId: number;
  loteOrigen?: Lote;
  cantidadAportadaKg: number;
}

export interface CreateLoteDto {
  codigo?: string;
  tipoProductoId: number;
  campanaId?: number;
  productorId: number;
  parcelaId?: number;
  cantidadKg: number;
  cantidadSacos?: number;
  fechaAdquisicion?: string;
  variedad?: string;
  planta?: string;
  observaciones?: string;
}

export interface FilterLotesDto {
  page?: number; limit?: number;
  tipoProductoId?: number; campanaId?: number;
  productorId?: number; estado?: LoteEstado; search?: string; variedad?: string; planta?: string;
}

export interface PaginationMeta { total: number; page: number; lastPage: number; limit: number; }
export interface PagedLotes { data: Lote[]; meta: PaginationMeta; }

export interface DividirLoteDto {
  loteId: number;
  divisiones: Array<{ codigoLf: string; cantidadKg: number }>;
}

export interface MezclarLotesDto {
  origenes: Array<{ loteId: number; cantidadKg: number }>;
  codigoLf: string;
  campanaId?: number;
}

export interface PromoverLfDto { codigoLf?: string; }

const CACHE_KEY = 'intipampa_lotes_v2_cache';

function readCache(): PagedLotes {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : { data: [], meta: { total: 0, page: 1, lastPage: 1, limit: 10 } };
  } catch { return { data: [], meta: { total: 0, page: 1, lastPage: 1, limit: 10 } }; }
}

class LotesService {
  async getPage(filter: FilterLotesDto = {}): Promise<PagedLotes> {
    if (!navigator.onLine) return readCache();
    try {
      const res  = await api.get('/api/lotes', { params: filter });
      const data: Lote[] = Array.isArray(res.data) ? res.data : [];
      const meta: PaginationMeta = (res as unknown as { meta: PaginationMeta }).meta ?? { total: 0, page: 1, lastPage: 1, limit: 10 };
      const result = { data, meta };
      localStorage.setItem(CACHE_KEY, JSON.stringify(result));
      return result;
    } catch { return readCache(); }
  }

  async getOne(id: number): Promise<Lote> {
    const { data } = await api.get(`/api/lotes/${id}`);
    return data;
  }

  async getLotesFinalOrigen(loteId: number): Promise<LoteFinalOrigen[]> {
    const { data } = await api.get(`/api/lotes/${loteId}/lotes-finales`);
    return Array.isArray(data) ? data : [];
  }

  async create(dto: CreateLoteDto): Promise<Lote> {
    const { data } = await api.post('/api/lotes', dto);
    return data;
  }

  async update(id: number, dto: Partial<CreateLoteDto & { estado?: LoteEstado }>): Promise<Lote> {
    const { data } = await api.put(`/api/lotes/${id}`, dto);
    return data;
  }

  async remove(id: number): Promise<void> {
    await api.delete(`/api/lotes/${id}`);
  }

  async dividir(dto: DividirLoteDto): Promise<import('./lotes-finales.service').LoteFinal[]> {
    const { data } = await api.post('/api/lotes/dividir', dto);
    return Array.isArray(data) ? data : [];
  }

  async mezclar(dto: MezclarLotesDto): Promise<import('./lotes-finales.service').LoteFinal> {
    const { data } = await api.post('/api/lotes/mezclar', dto);
    return data;
  }

  async promoverALf(id: number, dto: PromoverLfDto = {}): Promise<import('./lotes-finales.service').LoteFinal> {
    const { data } = await api.post(`/api/lotes/${id}/promover-a-lf`, dto);
    return data;
  }
}

export const lotesService = new LotesService();
