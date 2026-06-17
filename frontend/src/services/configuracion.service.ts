import api from '@/api/axios';
import { syncService } from './sync.service';

export interface Configuracion {
  id: number;
  nombreEmpresa: string | null;
  ruc:           string | null;
  direccion:     string | null;
  telefono:      string | null;
  email:         string | null;
  logoUrl:       string | null;
  pais:          string | null;
  moneda:        string | null;
  variedades:    string | null;
  updatedAt:     string;
}

export type UpdateConfiguracionDto = Partial<Omit<Configuracion, 'id' | 'updatedAt'>>;

const CACHE_KEY = 'collective_bean_configuracion_cache';
const BASE      = '/api/configuracion';

function readCache(): Configuracion | null {
  try {
    const p = JSON.parse(localStorage.getItem(CACHE_KEY) ?? 'null');
    return p && typeof p === 'object' ? (p as Configuracion) : null;
  } catch { return null; }
}

function writeCache(c: Configuracion) {
  localStorage.setItem(CACHE_KEY, JSON.stringify(c));
}

export const configuracionService = {
  async get(): Promise<Configuracion | null> {
    if (!navigator.onLine) return readCache();
    try {
      const { data } = await api.get<Configuracion>(BASE);
      if (data) writeCache(data);
      return data ?? null;
    } catch {
      return readCache();
    }
  },

  async update(dto: UpdateConfiguracionDto): Promise<Configuracion | null> {
    if (!navigator.onLine) {
      syncService.enqueue({ url: BASE, method: 'PUT', body: dto, module: 'configuracion' });
      const cached = readCache();
      if (cached) {
        const optimistic = { ...cached, ...dto, updatedAt: new Date().toISOString() };
        writeCache(optimistic);
        return optimistic;
      }
      return null;
    }
    try {
      const { data } = await api.put<Configuracion>(BASE, dto);
      if (data) writeCache(data);
      return data ?? null;
    } catch {
      return readCache();
    }
  },

  invalidateCache() { localStorage.removeItem(CACHE_KEY); },
};
