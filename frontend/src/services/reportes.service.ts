import api from '@/api/axios';
import { storageService } from '@/services/storage.service';

export interface ResumenKpis {
  totalProductores:    number;
  totalLotes:          number;
  totalLotesFinales:   number;
  totalMuestras:       number;
  kgTotalLotes:        number;
  kgTotalLotesFinales: number;
}

export interface ResumenReporte {
  campana: { id: number; nombre: string } | null;
  kpis:    ResumenKpis;
}

export interface ExportFilters {
  campanaId?:  number;
  sku?:        string;
  fecha?:      string;
  fechaDesde?: string;
  fechaHasta?: string;
  almacen?:    string;
}

const BASE = '/reportes';

export const reportesService = {
  async getFilterOptions(): Promise<{ almacenes: string[] }> {
    const { data } = await api.get(`${BASE}/filter-options`);
    return data;
  },

  async getResumen(campanaId?: number): Promise<ResumenReporte> {
    const params = campanaId ? { campanaId } : {};
    const { data } = await api.get(`${BASE}/resumen`, { params });
    return data;
  },

  downloadExcel(
    tipo: 'productores' | 'lotes' | 'lotes-finales' | 'muestras' | 'ventas' | 'parcelas',
    filters: ExportFilters = {},
    filename?: string,
  ) {
    const token = storageService.getAccessToken();
    const params = new URLSearchParams();
    if (filters.campanaId)  params.set('campanaId',  String(filters.campanaId));
    if (filters.sku)        params.set('sku',        filters.sku);
    if (filters.fecha)      params.set('fecha',      filters.fecha);
    if (filters.fechaDesde) params.set('fechaDesde', filters.fechaDesde);
    if (filters.fechaHasta) params.set('fechaHasta', filters.fechaHasta);
    if (filters.almacen)    params.set('almacen',    filters.almacen);
    const qs  = params.toString() ? `?${params.toString()}` : '';
    const url = `/api/reportes/export/${tipo}${qs}`;

    fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => {
        if (!r.ok) { console.error('Error descargando Excel:', r.status, r.statusText); return null; }
        return r.blob();
      })
      .then(blob => {
        if (!blob) return;
        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href     = blobUrl;
        a.download = `${filename ?? tipo}.xlsx`;
        a.click();
        URL.revokeObjectURL(blobUrl);
      });
  },
};
