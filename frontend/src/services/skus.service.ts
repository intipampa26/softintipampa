import api from '@/api/axios';

export interface Sku {
  id: number;
  codigo: string | null;
  nombre: string;
  unidad: string | null;
  descripcion: string | null;
  soloOtros: boolean;
  activo: boolean;
}

class SkusService {
  async findAll(params?: { soloOtros?: boolean }): Promise<Sku[]> {
    try {
      const query: Record<string, string> = {};
      if (params?.soloOtros !== undefined) query.soloOtros = String(params.soloOtros);
      const { data } = await api.get('/skus', { params: query });
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  }

  async create(nombre: string, descripcion?: string): Promise<Sku> {
    const { data } = await api.post('/skus', { nombre, descripcion });
    return data;
  }
}

export const skusService = new SkusService();
