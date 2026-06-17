import api from '@/api/axios';

export type TipoMerma = 'REUTILIZABLE' | 'DESECHABLE' | 'EXPORTABLE';

export const TIPO_MERMA_LABEL: Record<TipoMerma, string> = {
  REUTILIZABLE: 'Reutilizable (LR)',
  DESECHABLE:   'Desechable (LD)',
  EXPORTABLE:   'Exportable (LE)',
};

export const TIPO_MERMA_BADGE: Record<TipoMerma, string> = {
  REUTILIZABLE: 'bg-amber-100 text-amber-700',
  DESECHABLE:   'bg-red-100 text-red-700',
  EXPORTABLE:   'bg-blue-100 text-blue-700',
};

export interface Merma {
  id: number;
  codigo: string;
  loteFinalId: number;
  trilladoId: number | null;
  tipoMerma: TipoMerma;
  cantidadKg: number | string;
  cantidadSacos: number | null;
  fecha: string;
  observaciones: string | null;
  activo: boolean;
  createdAt: string;
  
  loteFinal?: {
    id: number;
    codigo: string;
    tipoProducto?: { id: number; tipo: string; subtipoEntrada: string; subtipoSalida: string };
    campana?: { id: number; nombre: string };
  };
  loteOrigenCodigo?: string | null;
  productorNombre?: string | null;
  productorApellido?: string | null;
}

export interface PagedMermas {
  data: Merma[];
  meta: { total: number; page: number; lastPage: number; limit: number };
}

const BASE = '/api/mermas';

export const mermasService = {
  async getPage(filter: {
    page?: number; limit?: number;
    tipoMerma?: TipoMerma | '';
    fechaDesde?: string; fechaHasta?: string;
    loteFinalId?: number;
  } = {}): Promise<PagedMermas> {
    const params: Record<string, unknown> = { page: filter.page ?? 1, limit: filter.limit ?? 20 };
    if (filter.tipoMerma)  params.tipoMerma  = filter.tipoMerma;
    if (filter.fechaDesde) params.fechaDesde  = filter.fechaDesde;
    if (filter.fechaHasta) params.fechaHasta  = filter.fechaHasta;
    if (filter.loteFinalId) params.loteFinalId = filter.loteFinalId;

    const res  = await api.get(BASE, { params });
    const data: Merma[] = Array.isArray(res.data) ? res.data : [];
    const meta = (res as unknown as { meta: PagedMermas['meta'] }).meta
      ?? { total: 0, page: 1, lastPage: 1, limit: 20 };
    return { data, meta };
  },
};
