import api from '@/api/axios';

export interface Sku {
  id: number;
  codigo: string | null;
  nombre: string;
  unidad: string | null;
  descripcion: string | null;
  activo: boolean;
}

class SkusService {
  async findAll(): Promise<Sku[]> {
    try {
      const { data } = await api.get('/skus');
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  }
}

export const skusService = new SkusService();
