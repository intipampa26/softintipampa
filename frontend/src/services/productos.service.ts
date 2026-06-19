import api from '@/api/axios';
import { syncService } from './sync.service';

export type ProductoUnidad = 'kg' | 'tm' | 'litro' | 'unidad' | 'saco';
export type ProductoCategoria = 'insumo' | 'fertilizante' | 'plaguicida' | 'semilla' | 'cosecha' | 'otro';

export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  unidad: ProductoUnidad;
  precioBase: number;
  categoria: ProductoCategoria;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
}

export type CreateProductoDto = Omit<Producto, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateProductoDto = Partial<CreateProductoDto>;

export interface PaginationMeta {
  total: number;
  page: number;
  lastPage: number;
  limit: number;
}

export interface PagedResult {
  data: Producto[];
  meta: PaginationMeta;
}

const CACHE_KEY = 'collective_bean_productos_cache';
const BASE = '/productos';

function readCache(): Producto[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(CACHE_KEY) ?? '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeCache(data: Producto[]) {
  localStorage.setItem(CACHE_KEY, JSON.stringify(data));
}

function buildMeta(all: Producto[], page: number, limit: number): PaginationMeta {
  const total = all.length;
  const lastPage = Math.ceil(total / limit) || 1;
  return { total, page, lastPage, limit };
}

export const productosService = {
  async getPage(
    page = 1,
    limit = 10,
    categoria?: ProductoCategoria,
    search?: string,
  ): Promise<PagedResult> {
    if (!navigator.onLine) {
      let all = readCache();
      if (categoria) all = all.filter((p) => p.categoria === categoria);
      if (search?.trim()) {
        const term = search.trim().toLowerCase();
        all = all.filter((p) => p.nombre.toLowerCase().includes(term));
      }
      const start = (page - 1) * limit;
      return { data: all.slice(start, start + limit), meta: buildMeta(all, page, limit) };
    }
    try {
      const params: Record<string, unknown> = { page, limit };
      if (categoria) params['categoria'] = categoria;
      if (search?.trim()) params['search'] = search.trim();
      const res = await api.get(BASE, { params });
      const data: Producto[] = Array.isArray(res.data) ? res.data : [];
      const meta: PaginationMeta =
        (res as unknown as { meta: PaginationMeta }).meta ?? buildMeta(data, page, limit);
      writeCache(data);
      return { data, meta };
    } catch {
      let all = readCache();
      if (categoria) all = all.filter((p) => p.categoria === categoria);
      const start = (page - 1) * limit;
      return { data: all.slice(start, start + limit), meta: buildMeta(all, page, limit) };
    }
  },

  async create(dto: CreateProductoDto): Promise<Producto | null> {
    if (!navigator.onLine) {
      syncService.enqueue({ url: BASE, method: 'POST', body: dto, module: 'productos' });
      const fake: Producto = {
        ...dto,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      writeCache([...readCache(), fake]);
      return fake;
    }
    const { data } = await api.post<Producto>(BASE, dto);
    writeCache([...readCache(), data]);
    return data;
  },

  async update(id: number, dto: UpdateProductoDto): Promise<Producto | null> {
    if (!navigator.onLine) {
      syncService.enqueue({ url: `${BASE}/${id}`, method: 'PUT', body: dto, module: 'productos' });
      const cache = readCache().map((p) =>
        p.id === id ? { ...p, ...dto, updatedAt: new Date().toISOString() } : p,
      );
      writeCache(cache);
      return cache.find((p) => p.id === id) ?? null;
    }
    const { data } = await api.put<Producto>(`${BASE}/${id}`, dto);
    const cache = readCache().map((p) => (p.id === id ? data : p));
    writeCache(cache);
    return data;
  },

  async remove(id: number): Promise<void> {
    if (!navigator.onLine) {
      syncService.enqueue({ url: `${BASE}/${id}`, method: 'DELETE', module: 'productos' });
      writeCache(readCache().filter((p) => p.id !== id));
      return;
    }
    await api.delete(`${BASE}/${id}`);
    writeCache(readCache().filter((p) => p.id !== id));
  },
};
