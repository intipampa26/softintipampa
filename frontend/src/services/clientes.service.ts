import api from '@/api/axios';
import { syncService } from './sync.service';

export interface Cliente {
  id: number;
  codigo: string;
  nroDocumento: string | null;
  nombre: string;
  telefono: string | null;
  direccion: string | null;
  pais: string | null;
  email: string | null;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
}

export type CreateClienteDto = {
  nombre: string;
  nroDocumento?: string | null;
  telefono?: string | null;
  direccion?: string | null;
  pais?: string | null;
  email?: string | null;
  activo?: boolean;
};

export type UpdateClienteDto = Partial<CreateClienteDto>;

export interface PaginationMeta {
  total: number;
  page: number;
  lastPage: number;
  limit: number;
}

export interface PagedResult {
  data: Cliente[];
  meta: PaginationMeta;
}

const CACHE_KEY = 'collective_bean_clientes_cache';
const BASE      = '/api/clientes';

function readCache(): Cliente[] {
  try {
    const p = JSON.parse(localStorage.getItem(CACHE_KEY) ?? '[]');
    return Array.isArray(p) ? p : [];
  } catch { return []; }
}

function writeCache(data: Cliente[]) {
  localStorage.setItem(CACHE_KEY, JSON.stringify(data));
}

function buildMeta(all: Cliente[], page: number, limit: number): PaginationMeta {
  const total    = all.length;
  const lastPage = Math.ceil(total / limit) || 1;
  return { total, page, lastPage, limit };
}

export const clientesService = {
  async getPage(
    page   = 1,
    limit  = 10,
    search?: string,
    pais?:   string,
  ): Promise<PagedResult> {
    if (!navigator.onLine) {
      let all = readCache().filter((c) => c.activo);
      if (search?.trim()) {
        const t = search.trim().toLowerCase();
        all = all.filter(
          (c) =>
            c.nombre.toLowerCase().includes(t) ||
            (c.nroDocumento ?? '').toLowerCase().includes(t) ||
            c.codigo.toLowerCase().includes(t),
        );
      }
      if (pais?.trim()) all = all.filter((c) => c.pais?.toLowerCase().includes(pais.toLowerCase()));
      const start = (page - 1) * limit;
      return { data: all.slice(start, start + limit), meta: buildMeta(all, page, limit) };
    }

    try {
      const params: Record<string, unknown> = { page, limit };
      if (search?.trim()) params['search'] = search.trim();
      if (pais?.trim())   params['pais']   = pais.trim();

      const res  = await api.get(BASE, { params });
      const data: Cliente[] = Array.isArray(res.data) ? res.data : [];
      const meta: PaginationMeta =
        (res as unknown as { meta: PaginationMeta }).meta ?? buildMeta(data, page, limit);

      writeCache([...data, ...readCache().filter((c) => !data.find((d) => d.id === c.id))]);
      return { data, meta };
    } catch {
      let all = readCache().filter((c) => c.activo);
      const start = (page - 1) * limit;
      return { data: all.slice(start, start + limit), meta: buildMeta(all, page, limit) };
    }
  },

  async getOne(id: number): Promise<Cliente | null> {
    if (!navigator.onLine) return readCache().find((c) => c.id === id) ?? null;
    try {
      const { data } = await api.get<Cliente>(`${BASE}/${id}`);
      return data;
    } catch {
      return readCache().find((c) => c.id === id) ?? null;
    }
  },

  async create(dto: CreateClienteDto): Promise<Cliente | null> {
    if (!navigator.onLine) {
      syncService.enqueue({ url: BASE, method: 'POST', body: dto, module: 'clientes' });
      const fake: Cliente = {
        ...dto,
        id:           Date.now(),
        codigo:       `CLI-OFFLINE-${Date.now()}`,
        nroDocumento: dto.nroDocumento ?? null,
        telefono:     dto.telefono     ?? null,
        direccion:    dto.direccion    ?? null,
        pais:         dto.pais         ?? null,
        email:        dto.email        ?? null,
        activo:       dto.activo       ?? true,
        createdAt:    new Date().toISOString(),
        updatedAt:    new Date().toISOString(),
      };
      writeCache([fake, ...readCache()]);
      return fake;
    }
    const { data } = await api.post<Cliente>(BASE, dto);
    writeCache([data, ...readCache()]);
    return data;
  },

  async update(id: number, dto: UpdateClienteDto): Promise<Cliente | null> {
    if (!navigator.onLine) {
      syncService.enqueue({ url: `${BASE}/${id}`, method: 'PUT', body: dto, module: 'clientes' });
      const cache = readCache().map((c) =>
        c.id === id ? { ...c, ...dto, updatedAt: new Date().toISOString() } : c,
      );
      writeCache(cache);
      return cache.find((c) => c.id === id) ?? null;
    }
    const { data } = await api.put<Cliente>(`${BASE}/${id}`, dto);
    writeCache(readCache().map((c) => (c.id === id ? data : c)));
    return data;
  },

  async remove(id: number): Promise<void> {
    if (!navigator.onLine) {
      syncService.enqueue({ url: `${BASE}/${id}`, method: 'DELETE', module: 'clientes' });
      writeCache(readCache().filter((c) => c.id !== id));
      return;
    }
    await api.delete(`${BASE}/${id}`);
    writeCache(readCache().filter((c) => c.id !== id));
  },

  invalidateCache() { localStorage.removeItem(CACHE_KEY); },
};
