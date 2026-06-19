import api from '@/api/axios';
import { syncService } from './sync.service';
import type { Campana } from './campanas.service';

export type ProductorTipoProducto = 'cafe' | 'cacao' | 'cafe_cacao';

export const TIPO_PRODUCTO_LABEL: Record<ProductorTipoProducto, string> = {
  cafe:       'Café',
  cacao:      'Cacao',
  cafe_cacao: 'Café y Cacao',
};

export type ProductorTipoProductor = 'individual' | 'acopiador';

export const TIPO_PRODUCTOR_LABEL: Record<ProductorTipoProductor, string> = {
  individual: 'Productor Individual',
  acopiador:  'Acopiador',
};

export interface Productor {
  id: number;
  nombre: string;
  apellido: string | null;
  nroDocumento: string | null;
  fecha: string | null;           
  telefono: string | null;
  fotoUrl: string | null;
  email: string | null;
  descripcion: string | null;
  direccion: string | null;
  departamento: string | null;
  provincia: string | null;
  distrito: string | null;
  codigoUbigeo: string | null;
  tipoProducto: ProductorTipoProducto | null;
  tipoProductor: ProductorTipoProductor | null;
  esApto: boolean;
  activo: boolean;
  campanaId: number | null;
  campana?: Campana | null;
  clonedFromId: number | null;
   
  campanasActivas?: Campana[];
  
  familiarNombreProductor: string | null;
  familiarEdadProductor: number | null;
  familiarEstadoCivil: string | null;
  familiarGradoInstruccion: string | null;
  conyugeNombre: string | null;
  conyugeEdad: number | null;
  conyugeOcupacion: string | null;
  conyugeGradoInstruccion: string | null;
  hijosData: string | null;
  tieneEnfermedadEspecial: boolean | null;
  enfermedadesPreexistentes: string | null;
  seguroMedico: string | null;
  
  tieneAgua: boolean | null;
  tieneDesague: boolean | null;
  tieneLuz: boolean | null;
  tieneInternet: boolean | null;
  tieneBanio: boolean | null;
  empresaTipo: string | null;
  empresaGerenteGeneral: string | null;
  empresaAnioInicio: number | null;
  empresaInfoLegal: string | null;
  empresaNombreComercial: string | null;
  empresaAcopiador: string | null;
  empresaInfoSunat: string | null;
  empresaCantTrabajadores: number | null;
  createdAt: string;
  updatedAt: string;
}

export type CreateProductorDto = {
  nombre: string;
  apellido?: string | null;
  nroDocumento?: string | null;
  fecha?: string | null;
  telefono?: string | null;
  fotoUrl?: string | null;
  email?: string | null;
  descripcion?: string | null;
  direccion?: string | null;
  departamento?: string | null;
  provincia?: string | null;
  distrito?: string | null;
  codigoUbigeo?: string | null;
  tipoProducto?: ProductorTipoProducto | null;
  tipoProductor?: ProductorTipoProductor | null;
  esApto?: boolean;
  activo?: boolean;
  campanaId?: number | null;
  
  familiarNombreProductor?: string | null;
  familiarEdadProductor?: number | null;
  familiarEstadoCivil?: string | null;
  familiarGradoInstruccion?: string | null;
  conyugeNombre?: string | null;
  conyugeEdad?: number | null;
  conyugeOcupacion?: string | null;
  conyugeGradoInstruccion?: string | null;
  hijosData?: string | null;
  tieneEnfermedadEspecial?: boolean | null;
  enfermedadesPreexistentes?: string | null;
  seguroMedico?: string | null;
  
  tieneAgua?: boolean | null;
  tieneDesague?: boolean | null;
  tieneLuz?: boolean | null;
  tieneInternet?: boolean | null;
  tieneBanio?: boolean | null;
  empresaTipo?: string | null;
  empresaGerenteGeneral?: string | null;
  empresaAnioInicio?: number | null;
  empresaInfoLegal?: string | null;
  empresaNombreComercial?: string | null;
  empresaAcopiador?: string | null;
  empresaInfoSunat?: string | null;
  empresaCantTrabajadores?: number | null;
};

export type UpdateProductorDto = Partial<Omit<CreateProductorDto, 'campanaId'>>;

export interface CloneProductorDto {
  campanaDestinoId: number;
}

export interface PaginationMeta {
  total: number;
  page: number;
  lastPage: number;
  limit: number;
}

export interface PagedResult {
  data: Productor[];
  meta: PaginationMeta;
}

export interface ImportReport {
  productoresCreados: number;
  productoresActualizados: number;
  parcelasCreadas: number;
  parcelasActualizadas: number;
  filasFusionadasFamiliar: number;
  filasVaciasOmitidas: number;
  filasObservadas: number;
  logs: string[];
}

const CACHE_KEY = 'collective_bean_productores_cache';
const BASE = '/productores';

function readCache(): Productor[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(CACHE_KEY) ?? '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeCache(data: Productor[]) {
  localStorage.setItem(CACHE_KEY, JSON.stringify(data));
}

function buildMeta(all: Productor[], page: number, limit: number): PaginationMeta {
  const total = all.length;
  const lastPage = Math.ceil(total / limit) || 1;
  return { total, page, lastPage, limit };
}

export const productoresService = {
  
  async getPage(
    page = 1,
    limit = 10,
    campanaId?: number,
    search?: string,
    nroDocumento?: string,
    tipoProductor?: string,
    departamento?: string,
    tipoProducto?: string,
  ): Promise<PagedResult> {
    if (!navigator.onLine) {
      let all = readCache();
      if (campanaId) all = all.filter((p) => p.campanaId === campanaId && p.activo);
      if (search?.trim()) {
        const term = search.trim().toLowerCase();
        all = all.filter(
          (p) =>
            p.nombre.toLowerCase().includes(term) ||
            (p.apellido ?? '').toLowerCase().includes(term) ||
            (p.nroDocumento ?? '').toLowerCase().includes(term),
        );
      }
      if (nroDocumento?.trim()) {
        const term = nroDocumento.trim().toLowerCase();
        all = all.filter((p) => (p.nroDocumento ?? '').toLowerCase().includes(term));
      }
      if (tipoProductor?.trim()) {
        all = all.filter((p) => p.tipoProductor === tipoProductor);
      }
      if (departamento?.trim()) {
        all = all.filter((p) => p.departamento === departamento.trim());
      }
      if (tipoProducto?.trim()) {
        all = all.filter((p) => p.tipoProducto === tipoProducto);
      }
      const start = (page - 1) * limit;
      return { data: all.slice(start, start + limit), meta: buildMeta(all, page, limit) };
    }

    try {
      const params: Record<string, unknown> = { page, limit };
      if (campanaId) params['campanaId'] = campanaId;
      if (search?.trim()) params['search'] = search.trim();
      if (nroDocumento?.trim()) params['nroDocumento'] = nroDocumento.trim();
      if (tipoProductor?.trim()) params['tipoProductor'] = tipoProductor.trim();
      if (departamento?.trim()) params['departamento'] = departamento.trim();
      if (tipoProducto?.trim()) params['tipoProducto'] = tipoProducto.trim();

      const res = await api.get(BASE, { params });
      const data: Productor[] = Array.isArray(res.data) ? res.data : [];
      const meta: PaginationMeta =
        (res as unknown as { meta: PaginationMeta }).meta ?? buildMeta(data, page, limit);

      if (campanaId) {
        
        const freshIds = new Set(data.map((p) => p.id));
        const cached = readCache().filter((p) => p.campanaId !== campanaId && !freshIds.has(p.id));
        writeCache([...data, ...cached]);
      } else {
        
        writeCache(data);
      }

      return { data, meta };
    } catch {
      let all = readCache();
      if (campanaId) all = all.filter((p) => p.campanaId === campanaId && p.activo);
      if (nroDocumento?.trim()) {
        const term = nroDocumento.trim().toLowerCase();
        all = all.filter((p) => (p.nroDocumento ?? '').toLowerCase().includes(term));
      }
      const start = (page - 1) * limit;
      return { data: all.slice(start, start + limit), meta: buildMeta(all, page, limit) };
    }
  },

  
  async getAllFiltered(
    campanaId?: number,
    search?: string,
    nroDocumento?: string,
    departamento?: string,
    tipoProducto?: string,
  ): Promise<Productor[]> {
    const result = await productoresService.getPage(1, 9999, campanaId, search, nroDocumento, undefined, departamento, tipoProducto);
    return result.data;
  },

  
  async getOne(id: number): Promise<Productor | null> {
    if (!navigator.onLine) {
      return readCache().find((p) => p.id === id) ?? null;
    }
    try {
      const { data } = await api.get<Productor>(`${BASE}/${id}`);
      const cache = readCache();
      const exists = cache.some((p) => p.id === id);
      writeCache(exists ? cache.map((p) => (p.id === id ? data : p)) : [data, ...cache]);
      return data;
    } catch {
      return readCache().find((p) => p.id === id) ?? null;
    }
  },

  
  async create(dto: CreateProductorDto): Promise<Productor | null> {
    if (!navigator.onLine) {
      syncService.enqueue({ url: BASE, method: 'POST', body: dto, module: 'productores' });
      const fake: Productor = {
        ...dto,
        id: Date.now(),
        apellido:                  dto.apellido                  ?? null,
        nroDocumento:              dto.nroDocumento              ?? null,
        fecha:                     dto.fecha                     ?? null,
        telefono:                  dto.telefono                  ?? null,
        fotoUrl:                   dto.fotoUrl                   ?? null,
        email:                     dto.email                     ?? null,
        descripcion:               dto.descripcion               ?? null,
        direccion:                 dto.direccion                 ?? null,
        departamento:              dto.departamento              ?? null,
        provincia:                 dto.provincia                 ?? null,
        distrito:                  dto.distrito                  ?? null,
        codigoUbigeo:              dto.codigoUbigeo              ?? null,
        tipoProducto:              dto.tipoProducto              ?? null,
        tipoProductor:             dto.tipoProductor             ?? null,
        esApto:                    dto.esApto                    ?? true,
        activo:                    dto.activo                    ?? true,
        campanaId:                 dto.campanaId                 ?? null,
        clonedFromId:              null,
        familiarNombreProductor:  dto.familiarNombreProductor  ?? null,
        familiarEdadProductor:    dto.familiarEdadProductor    ?? null,
        familiarEstadoCivil:      dto.familiarEstadoCivil      ?? null,
        familiarGradoInstruccion: dto.familiarGradoInstruccion ?? null,
        conyugeNombre:            dto.conyugeNombre            ?? null,
        conyugeEdad:              dto.conyugeEdad              ?? null,
        conyugeOcupacion:         dto.conyugeOcupacion         ?? null,
        conyugeGradoInstruccion:  dto.conyugeGradoInstruccion  ?? null,
        hijosData:                dto.hijosData                ?? null,
        tieneEnfermedadEspecial:  dto.tieneEnfermedadEspecial  ?? null,
        enfermedadesPreexistentes:dto.enfermedadesPreexistentes ?? null,
        seguroMedico:             dto.seguroMedico             ?? null,
        tieneAgua:                dto.tieneAgua                ?? null,
        tieneDesague:             dto.tieneDesague             ?? null,
        tieneLuz:                 dto.tieneLuz                 ?? null,
        tieneInternet:            dto.tieneInternet            ?? null,
        tieneBanio:               dto.tieneBanio               ?? null,
        empresaTipo:              dto.empresaTipo              ?? null,
        empresaGerenteGeneral:    dto.empresaGerenteGeneral    ?? null,
        empresaAnioInicio:        dto.empresaAnioInicio        ?? null,
        empresaInfoLegal:         dto.empresaInfoLegal         ?? null,
        empresaNombreComercial:   dto.empresaNombreComercial   ?? null,
        empresaAcopiador:         dto.empresaAcopiador         ?? null,
        empresaInfoSunat:         dto.empresaInfoSunat         ?? null,
        empresaCantTrabajadores:  dto.empresaCantTrabajadores  ?? null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      writeCache([fake, ...readCache()]);
      return fake;
    }
    const { data } = await api.post<Productor>(BASE, dto);
    writeCache([data, ...readCache()]);
    return data;
  },

  
  async update(id: number, dto: UpdateProductorDto): Promise<Productor | null> {
    if (!navigator.onLine) {
      syncService.enqueue({ url: `${BASE}/${id}`, method: 'PUT', body: dto, module: 'productores' });
      const cache = readCache().map((p) =>
        p.id === id ? { ...p, ...dto, updatedAt: new Date().toISOString() } : p,
      );
      writeCache(cache);
      return cache.find((p) => p.id === id) ?? null;
    }
    const { data } = await api.put<Productor>(`${BASE}/${id}`, dto);
    const cache = readCache().map((p) => (p.id === id ? data : p));
    writeCache(cache);
    return data;
  },

  
  async remove(id: number): Promise<void> {
    if (!navigator.onLine) {
      syncService.enqueue({ url: `${BASE}/${id}`, method: 'DELETE', module: 'productores' });
      writeCache(readCache().filter((p) => p.id !== id));
      return;
    }
    await api.delete(`${BASE}/${id}`);
    writeCache(readCache().filter((p) => p.id !== id));
  },

  
  async clone(id: number, dto: CloneProductorDto): Promise<Productor | null> {
    if (!navigator.onLine) return null; 
    try {
      const { data } = await api.post<Productor>(`${BASE}/${id}/clonar`, dto);
      writeCache([data, ...readCache()]);
      return data;
    } catch {
      return null;
    }
  },

  
  async importarExcel(file: File): Promise<ImportReport> {
    const formData = new FormData();
    formData.append('file', file);
    const { data } = await api.post<ImportReport>(
      `${BASE}/importar-excel`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } },
    );
    return data as unknown as ImportReport;
  },

  
  async uploadFoto(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    const { data } = await api.post<{ url: string }>(`${BASE}/upload-foto`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return (data as unknown as { url: string }).url;
  },

  invalidateCache() {
    localStorage.removeItem(CACHE_KEY);
  },
};
