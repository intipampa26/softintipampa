import api from '@/api/axios';

export type TipoProductoEnum = 'CAFE' | 'CACAO';

export interface TipoProducto {
  id: number;
  tipo: TipoProductoEnum;
  subtipoEntrada: string;
  subtipoSalida: string;
  activo: boolean;
}

const CACHE_KEY = 'intipampa_tipos_producto_cache';

function readCache(): TipoProducto[] {
  try { return JSON.parse(localStorage.getItem(CACHE_KEY) ?? '[]'); } catch { return []; }
}

class TiposProductoService {
  async getAll(): Promise<TipoProducto[]> {
    if (!navigator.onLine) return readCache();
    try {
      const { data } = await api.get('/api/tipos-producto');
      const list = Array.isArray(data) ? data : [];
      localStorage.setItem(CACHE_KEY, JSON.stringify(list));
      return list;
    } catch { return readCache(); }
  }
}

export const tiposProductoService = new TiposProductoService();
