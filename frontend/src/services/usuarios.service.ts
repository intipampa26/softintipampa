import api from '@/api/axios';

export type UserRole = 'admin' | 'manager' | 'operator';

export interface Usuario {
  id: number;
  username: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUsuarioDto {
  username: string;
  password: string;
  role?: UserRole;
}

export interface UpdateUsuarioDto {
  username?: string;
  password?: string;
  role?: UserRole;
  isActive?: boolean;
}

const CACHE_KEY = 'collective_bean_usuarios_cache';
const BASE = '/users';

function readCache(): Usuario[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(CACHE_KEY) ?? '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeCache(data: Usuario[]) {
  localStorage.setItem(CACHE_KEY, JSON.stringify(data));
}

export const usuariosService = {
  async getAll(): Promise<Usuario[]> {
    if (!navigator.onLine) return readCache();
    try {
      const { data } = await api.get<Usuario[]>(BASE, { params: { limit: 100 } });
      const arr = Array.isArray(data) ? data : [];
      writeCache(arr);
      return arr;
    } catch {
      return readCache();
    }
  },

  async create(dto: CreateUsuarioDto): Promise<Usuario> {
    const { data } = await api.post<Usuario>(BASE, dto);
    writeCache([data, ...readCache()]);
    return data;
  },

  async update(id: number, dto: UpdateUsuarioDto): Promise<Usuario> {
    const { data } = await api.put<Usuario>(`${BASE}/${id}`, dto);
    const cache = readCache().map((u) => u.id === id ? data : u);
    writeCache(cache);
    return data;
  },

  async deactivate(id: number): Promise<void> {
    await api.delete(`${BASE}/${id}`);
    writeCache(readCache().filter((u) => u.id !== id));
  },
};
