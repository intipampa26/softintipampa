import api from '@/api/axios';
import { syncService } from './sync.service';

export type Parentesco =
  | 'conyugue' | 'hijo' | 'hija' | 'padre' | 'madre'
  | 'hermano' | 'hermana' | 'abuelo' | 'abuela'
  | 'nieto' | 'nieta' | 'tio' | 'tia' | 'sobrino' | 'sobrina'
  | 'primo' | 'prima' | 'suegro' | 'suegra' | 'yerno' | 'nuera' | 'otro';

export type TipoDocumento = 'dni' | 'ce' | 'pasaporte' | 'partida_nacimiento' | 'otro';
export type Sexo = 'masculino' | 'femenino' | 'otro';

export const PARENTESCO_LABEL: Record<Parentesco, string> = {
  conyugue: 'Cónyuge / Pareja', hijo: 'Hijo', hija: 'Hija',
  padre: 'Padre', madre: 'Madre', hermano: 'Hermano', hermana: 'Hermana',
  abuelo: 'Abuelo', abuela: 'Abuela', nieto: 'Nieto', nieta: 'Nieta',
  tio: 'Tío', tia: 'Tía', sobrino: 'Sobrino', sobrina: 'Sobrina',
  primo: 'Primo', prima: 'Prima', suegro: 'Suegro', suegra: 'Suegra',
  yerno: 'Yerno', nuera: 'Nuera', otro: 'Otro',
};

export const TIPO_DOCUMENTO_LABEL: Record<TipoDocumento, string> = {
  dni: 'DNI', ce: 'Carnet de Extranjería', pasaporte: 'Pasaporte',
  partida_nacimiento: 'Partida de Nacimiento', otro: 'Otro',
};

export const SEXO_LABEL: Record<Sexo, string> = {
  masculino: 'Masculino', femenino: 'Femenino', otro: 'Otro',
};

export interface FamiliarProductor {
  id: number;
  productorId: number;
  nombres: string;
  apellidos: string;
  parentesco: Parentesco;
  sexo: Sexo | null;
  fechaNacimiento: string | null;
  tipoDocumento: TipoDocumento | null;
  nroDocumento: string | null;
  telefono: string | null;
  correo: string | null;
  direccion: string | null;
  observaciones: string | null;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
}

export type CreateFamiliarDto = {
  nombres: string;
  apellidos: string;
  parentesco: Parentesco;
  sexo?: Sexo;
  fechaNacimiento?: string;
  tipoDocumento?: TipoDocumento;
  nroDocumento?: string;
  telefono?: string;
  correo?: string;
  direccion?: string;
  observaciones?: string;
  activo?: boolean;
};

export type UpdateFamiliarDto = Partial<CreateFamiliarDto>;

const cacheKey = (pid: number) => `collective_bean_familiares_${pid}`;

function readCache(productorId: number): FamiliarProductor[] {
  try {
    const p = JSON.parse(localStorage.getItem(cacheKey(productorId)) ?? '[]');
    return Array.isArray(p) ? p : [];
  } catch { return []; }
}

function writeCache(productorId: number, data: FamiliarProductor[]) {
  localStorage.setItem(cacheKey(productorId), JSON.stringify(data));
}

function base(productorId: number) {
  return `/api/productores/${productorId}/familiares`;
}

export const familiaresService = {
  async getAll(productorId: number): Promise<FamiliarProductor[]> {
    if (!navigator.onLine) return readCache(productorId);
    try {
      const { data } = await api.get<FamiliarProductor[]>(base(productorId));
      const list = Array.isArray(data) ? data : [];
      writeCache(productorId, list);
      return list;
    } catch {
      return readCache(productorId);
    }
  },

  async create(productorId: number, dto: CreateFamiliarDto): Promise<FamiliarProductor> {
    if (!navigator.onLine) {
      syncService.enqueue({ url: base(productorId), method: 'POST', body: dto, module: 'familiares' });
      const fake: FamiliarProductor = {
        id: Date.now(),
        productorId,
        nombres: dto.nombres,
        apellidos: dto.apellidos,
        parentesco: dto.parentesco,
        sexo: dto.sexo ?? null,
        fechaNacimiento: dto.fechaNacimiento ?? null,
        tipoDocumento: dto.tipoDocumento ?? null,
        nroDocumento: dto.nroDocumento ?? null,
        telefono: dto.telefono ?? null,
        correo: dto.correo ?? null,
        direccion: dto.direccion ?? null,
        observaciones: dto.observaciones ?? null,
        activo: dto.activo ?? true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      writeCache(productorId, [fake, ...readCache(productorId)]);
      return fake;
    }
    const { data } = await api.post<FamiliarProductor>(base(productorId), dto);
    writeCache(productorId, [data, ...readCache(productorId)]);
    return data;
  },

  async update(productorId: number, id: number, dto: UpdateFamiliarDto): Promise<FamiliarProductor> {
    if (!navigator.onLine) {
      syncService.enqueue({ url: `${base(productorId)}/${id}`, method: 'PUT', body: dto, module: 'familiares' });
      const cache = readCache(productorId).map((f) =>
        f.id === id ? { ...f, ...dto, updatedAt: new Date().toISOString() } : f,
      );
      writeCache(productorId, cache);
      const updated = cache.find((f) => f.id === id);
      if (!updated) throw new Error('Familiar no encontrado en caché');
      return updated;
    }
    const { data } = await api.put<FamiliarProductor>(`${base(productorId)}/${id}`, dto);
    writeCache(productorId, readCache(productorId).map((f) => (f.id === id ? data : f)));
    return data;
  },

  async remove(productorId: number, id: number): Promise<void> {
    if (!navigator.onLine) {
      syncService.enqueue({ url: `${base(productorId)}/${id}`, method: 'DELETE', module: 'familiares' });
      writeCache(productorId, readCache(productorId).filter((f) => f.id !== id));
      return;
    }
    await api.delete(`${base(productorId)}/${id}`);
    writeCache(productorId, readCache(productorId).filter((f) => f.id !== id));
  },

  invalidateCache(productorId: number) {
    localStorage.removeItem(cacheKey(productorId));
  },
};
