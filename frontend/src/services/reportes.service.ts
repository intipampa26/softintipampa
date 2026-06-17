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

const BASE = '/api/reportes';

export const reportesService = {
  async getResumen(campanaId?: number): Promise<ResumenReporte> {
    const params = campanaId ? { campanaId } : {};
    const { data } = await api.get(`${BASE}/resumen`, { params });
    return data;
  },

  downloadExcel(tipo: 'productores' | 'lotes' | 'lotes-finales', campanaId?: number) {
    const token = storageService.getAccessToken();
    const qs    = campanaId ? `?campanaId=${campanaId}` : '';
    const url   = `/api/reportes/export/${tipo}${qs}`;

    const a = document.createElement('a');
    a.href = url;
    
    fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.blob())
      .then(blob => {
        const blobUrl = URL.createObjectURL(blob);
        a.href = blobUrl;
        a.download = `${tipo}.xlsx`;
        a.click();
        URL.revokeObjectURL(blobUrl);
      });
  },
};
