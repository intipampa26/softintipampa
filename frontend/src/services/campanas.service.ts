import api from '@/api/axios';
import { syncService } from './sync.service';

export type CampanaTemporada = 'cafe' | 'cacao' | 'cafe_cacao';

export interface Campana {
  id: number;
  nombre: string;
  descripcion: string;
  temporada: CampanaTemporada;
  fechaInicio: string | null;
  fechaFin: string | null;
  createdAt: string;
  updatedAt: string;
}

export type CreateCampanaDto = Omit<Campana, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateCampanaDto = Partial<CreateCampanaDto>;

const CACHE_KEY = 'collective_bean_campanas_cache';
const BASE = '/campanas';

function readCache(): Campana[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(CACHE_KEY) ?? '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeCache(data: Campana[]) {
  localStorage.setItem(CACHE_KEY, JSON.stringify(data));
}

export interface PaginationMeta {
  total: number;
  page: number;
  lastPage: number;
  limit: number;
}

export interface PagedResult {
  data: Campana[];
  meta: PaginationMeta;
}

function buildMeta(all: Campana[], page: number, limit: number): PaginationMeta {
  const total = all.length;
  const lastPage = Math.ceil(total / limit) || 1;
  return { total, page, lastPage, limit };
}

export const campanasService = {
  
  async getPage(page = 1, limit = 5): Promise<PagedResult> {
    if (!navigator.onLine) {
      const all = readCache();
      const start = (page - 1) * limit;
      return { data: all.slice(start, start + limit), meta: buildMeta(all, page, limit) };
    }
    try {
      const res = await api.get(BASE, { params: { page, limit } });
      const data: Campana[] = Array.isArray(res.data) ? res.data : [];
      
      const meta: PaginationMeta = (res as unknown as { meta: PaginationMeta }).meta
        ?? buildMeta(data, page, limit);
      writeCache(data);
      return { data, meta };
    } catch {
      const all = readCache();
      const start = (page - 1) * limit;
      return { data: all.slice(start, start + limit), meta: buildMeta(all, page, limit) };
    }
  },

  
  async create(dto: CreateCampanaDto): Promise<Campana | null> {
    if (!navigator.onLine) {
      syncService.enqueue({ url: BASE, method: 'POST', body: dto, module: 'campanas' });
      
      const fake: Campana = {
        ...dto,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      writeCache([fake, ...readCache()]);
      return fake;
    }
    const { data } = await api.post<Campana>(BASE, dto);
    writeCache([data, ...readCache()]);
    return data;
  },

  
  async update(id: number, dto: UpdateCampanaDto): Promise<Campana | null> {
    if (!navigator.onLine) {
      syncService.enqueue({ url: `${BASE}/${id}`, method: 'PUT', body: dto, module: 'campanas' });
      const cache = readCache().map((c) => c.id === id ? { ...c, ...dto, updatedAt: new Date().toISOString() } : c);
      writeCache(cache);
      return cache.find((c) => c.id === id) ?? null;
    }
    const { data } = await api.put<Campana>(`${BASE}/${id}`, dto);
    const cache = readCache().map((c) => c.id === id ? data : c);
    writeCache(cache);
    return data;
  },

  
  async remove(id: number): Promise<void> {
    if (!navigator.onLine) {
      syncService.enqueue({ url: `${BASE}/${id}`, method: 'DELETE', module: 'campanas' });
      writeCache(readCache().filter((c) => c.id !== id));
      return;
    }
    await api.delete(`${BASE}/${id}`);
    writeCache(readCache().filter((c) => c.id !== id));
  },

  invalidateCache() {
    localStorage.removeItem(CACHE_KEY);
  },
};
