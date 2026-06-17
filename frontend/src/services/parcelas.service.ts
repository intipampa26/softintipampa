import api from '@/api/axios';
import { syncService } from './sync.service';

export type ParcelaTipoProducto = 'cafe' | 'cacao' | 'cafe_cacao';

export const PARCELA_TIPO_LABEL: Record<ParcelaTipoProducto, string> = {
  cafe:       'Café',
  cacao:      'Cacao',
  cafe_cacao: 'Café y Cacao',
};

export interface LatLng { lat: number; lng: number; }

export interface Parcela {
  id: number;
  codigo: string;
  nombre: string;
  descripcion: string | null;
  fechaRegistro: string | null;
  tipoProducto: ParcelaTipoProducto | null;
  activo: boolean;
  tienePpa: string | null;
  productorId: number;
  coordenadas: LatLng[] | null;
  
  nombreFinca: string | null;
  breveHistoriaInicioProduccion: string | null;
  areaTotalFinca: number | null;
  altitud: number | null;
  estadoPropiedad: string | null;
  inicioProduccionAnio: number | null;
  
  controlesBiologicos: boolean | null;
  usoHerbicidasChala: boolean | null;
  practicaCultivo: string | null;
  rgazar: string | null;
  metodoFertilizacion: string | null;
  practicasConservacionAmbiental: string | null;
  
  tanqueTina: boolean | null;
  pozoAguasMieles: boolean | null;
  secadorSolar: boolean | null;
  compostera: boolean | null;
  infraOtros: string | null;
  timbosFermentacion: boolean | null;
  despulpadora: boolean | null;
  
  produccion2023: number | null;
  tipoBeneficio: string | null;
  tipoSecado: string | null;
  
  hectareasTotales: number | null;
  hectareasCafe: number | null;
  variedadesCafe: string | null;
  hectareasRenovacion: number | null;
  areaPurma: number | null;
  areaBosque: number | null;
  tipoArbolesBosque: string | null;
  
  conoceTipoSuelo: boolean | null;
  estudioSuelos: string | null;
  temperaturaPromedio: number | null;
  tiempoSecadoDias: number | null;
  periodoCosecha: string | null;
  densidadSombra: string | null;
  floraFauna: string | null;
  
  cosechaManejo: string | null;
  despulpado: string | null;
  fermentacion: string | null;
  secadoManejo: string | null;
  almacenaje: string | null;
  bienestarLaboral: string | null;
  jornalerosPorCampana: number | null;
  createdAt: string;
  updatedAt: string;
}

export type CreateParcelaDto = {
  nombre: string;
  descripcion?: string | null;
  fechaRegistro?: string | null;
  tipoProducto?: ParcelaTipoProducto | null;
  activo?: boolean;
  tienePpa?: string;
  productorId: number;
  coordenadas?: LatLng[] | null;
  
  nombreFinca?: string;
  breveHistoriaInicioProduccion?: string;
  areaTotalFinca?: number;
  altitud?: number;
  estadoPropiedad?: string;
  inicioProduccionAnio?: number;
  
  controlesBiologicos?: boolean;
  usoHerbicidasChala?: boolean;
  practicaCultivo?: string;
  rgazar?: string;
  metodoFertilizacion?: string;
  practicasConservacionAmbiental?: string;
  
  tanqueTina?: boolean;
  pozoAguasMieles?: boolean;
  secadorSolar?: boolean;
  compostera?: boolean;
  infraOtros?: string;
  timbosFermentacion?: boolean;
  despulpadora?: boolean;
  
  produccion2023?: number;
  tipoBeneficio?: string;
  tipoSecado?: string;
  
  hectareasTotales?: number;
  hectareasCafe?: number;
  variedadesCafe?: string;
  hectareasRenovacion?: number;
  areaPurma?: number;
  areaBosque?: number;
  tipoArbolesBosque?: string;
  
  conoceTipoSuelo?: boolean;
  estudioSuelos?: string;
  temperaturaPromedio?: number;
  tiempoSecadoDias?: number;
  periodoCosecha?: string;
  densidadSombra?: string;
  floraFauna?: string;
  
  cosechaManejo?: string;
  despulpado?: string;
  fermentacion?: string;
  secadoManejo?: string;
  almacenaje?: string;
  bienestarLaboral?: string;
  jornalerosPorCampana?: number;
};

export type UpdateParcelaDto = Partial<Omit<CreateParcelaDto, 'productorId'>>;

export interface PaginationMeta {
  total: number;
  page: number;
  lastPage: number;
  limit: number;
}

export interface PagedResult {
  data: Parcela[];
  meta: PaginationMeta;
}

const CACHE_KEY = 'collective_bean_parcelas_cache';
const BASE = '/api/parcelas';

function readCache(): Parcela[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(CACHE_KEY) ?? '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeCache(data: Parcela[]) {
  localStorage.setItem(CACHE_KEY, JSON.stringify(data));
}

function buildMeta(all: Parcela[], page: number, limit: number): PaginationMeta {
  const total = all.length;
  const lastPage = Math.ceil(total / limit) || 1;
  return { total, page, lastPage, limit };
}

export const parcelasService = {
  async getPage(
    page = 1,
    limit = 10,
    productorId?: number,
    search?: string,
  ): Promise<PagedResult> {
    if (!navigator.onLine) {
      let all = readCache().filter((p) => p.activo);
      if (productorId) all = all.filter((p) => p.productorId === productorId);
      if (search?.trim()) {
        const term = search.trim().toLowerCase();
        all = all.filter(
          (p) =>
            p.nombre.toLowerCase().includes(term) ||
            p.codigo.toLowerCase().includes(term),
        );
      }
      const start = (page - 1) * limit;
      return { data: all.slice(start, start + limit), meta: buildMeta(all, page, limit) };
    }

    try {
      const params: Record<string, unknown> = { page, limit };
      if (productorId) params['productorId'] = productorId;
      if (search?.trim()) params['search'] = search.trim();

      const res = await api.get(BASE, { params });
      const data: Parcela[] = Array.isArray(res.data) ? res.data : [];
      const meta: PaginationMeta =
        (res as unknown as { meta: PaginationMeta }).meta ?? buildMeta(data, page, limit);

      const cached = readCache().filter((p) => p.productorId !== productorId);
      writeCache([...data, ...cached]);

      return { data, meta };
    } catch {
      let all = readCache().filter((p) => p.activo);
      if (productorId) all = all.filter((p) => p.productorId === productorId);
      const start = (page - 1) * limit;
      return { data: all.slice(start, start + limit), meta: buildMeta(all, page, limit) };
    }
  },

  async getOne(id: number): Promise<Parcela | null> {
    if (!navigator.onLine) {
      return readCache().find((p) => p.id === id) ?? null;
    }
    try {
      const { data } = await api.get<Parcela>(`${BASE}/${id}`);
      return data;
    } catch {
      return readCache().find((p) => p.id === id) ?? null;
    }
  },

  async create(dto: CreateParcelaDto): Promise<Parcela | null> {
    if (!navigator.onLine) {
      syncService.enqueue({ url: BASE, method: 'POST', body: dto, module: 'parcelas' });
      const fake: Parcela = {
        id: Date.now(),
        codigo:        `PAR-OFFLINE-${Date.now()}`,
        nombre:        dto.nombre,
        descripcion:   dto.descripcion   ?? null,
        fechaRegistro: dto.fechaRegistro ?? null,
        tipoProducto:  dto.tipoProducto  ?? null,
        activo:        dto.activo        ?? true,
        productorId:   dto.productorId,
        coordenadas:   dto.coordenadas   ?? null,
        nombreFinca:                   dto.nombreFinca                   ?? null,
        breveHistoriaInicioProduccion: dto.breveHistoriaInicioProduccion ?? null,
        areaTotalFinca:                dto.areaTotalFinca                ?? null,
        altitud:                       dto.altitud                       ?? null,
        estadoPropiedad:               dto.estadoPropiedad               ?? null,
        inicioProduccionAnio:          dto.inicioProduccionAnio          ?? null,
        controlesBiologicos:           dto.controlesBiologicos           ?? null,
        usoHerbicidasChala:            dto.usoHerbicidasChala            ?? null,
        practicaCultivo:               dto.practicaCultivo               ?? null,
        rgazar:                        dto.rgazar                        ?? null,
        metodoFertilizacion:           dto.metodoFertilizacion           ?? null,
        practicasConservacionAmbiental: dto.practicasConservacionAmbiental ?? null,
        tanqueTina:                    dto.tanqueTina                    ?? null,
        pozoAguasMieles:               dto.pozoAguasMieles               ?? null,
        secadorSolar:                  dto.secadorSolar                  ?? null,
        compostera:                    dto.compostera                    ?? null,
        infraOtros:                    dto.infraOtros                    ?? null,
        timbosFermentacion:            dto.timbosFermentacion            ?? null,
        despulpadora:                  dto.despulpadora                  ?? null,
        produccion2023:                dto.produccion2023                ?? null,
        tipoBeneficio:                 dto.tipoBeneficio                 ?? null,
        tipoSecado:                    dto.tipoSecado                    ?? null,
        hectareasTotales:              dto.hectareasTotales              ?? null,
        hectareasCafe:                 dto.hectareasCafe                 ?? null,
        variedadesCafe:                dto.variedadesCafe                ?? null,
        hectareasRenovacion:           dto.hectareasRenovacion           ?? null,
        areaPurma:                     dto.areaPurma                     ?? null,
        areaBosque:                    dto.areaBosque                    ?? null,
        tipoArbolesBosque:             dto.tipoArbolesBosque             ?? null,
        conoceTipoSuelo:               dto.conoceTipoSuelo               ?? null,
        estudioSuelos:                 dto.estudioSuelos                 ?? null,
        temperaturaPromedio:           dto.temperaturaPromedio           ?? null,
        tiempoSecadoDias:              dto.tiempoSecadoDias              ?? null,
        periodoCosecha:                dto.periodoCosecha                ?? null,
        densidadSombra:                dto.densidadSombra                ?? null,
        floraFauna:                    dto.floraFauna                    ?? null,
        cosechaManejo:                 dto.cosechaManejo                 ?? null,
        despulpado:                    dto.despulpado                    ?? null,
        fermentacion:                  dto.fermentacion                  ?? null,
        secadoManejo:                  dto.secadoManejo                  ?? null,
        almacenaje:                    dto.almacenaje                    ?? null,
        bienestarLaboral:              dto.bienestarLaboral              ?? null,
        tienePpa:                      dto.tienePpa                      ?? null,
        jornalerosPorCampana:          dto.jornalerosPorCampana          ?? null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      writeCache([fake, ...readCache()]);
      return fake;
    }
    const { data } = await api.post<Parcela>(BASE, dto);
    writeCache([data, ...readCache()]);
    return data;
  },

  async update(id: number, dto: UpdateParcelaDto): Promise<Parcela | null> {
    if (!navigator.onLine) {
      syncService.enqueue({ url: `${BASE}/${id}`, method: 'PUT', body: dto, module: 'parcelas' });
      const cache = readCache().map((p) =>
        p.id === id ? { ...p, ...dto, updatedAt: new Date().toISOString() } : p,
      );
      writeCache(cache);
      return cache.find((p) => p.id === id) ?? null;
    }
    const { data } = await api.put<Parcela>(`${BASE}/${id}`, dto);
    const cache = readCache().map((p) => (p.id === id ? data : p));
    writeCache(cache);
    return data;
  },

  async remove(id: number): Promise<void> {
    if (!navigator.onLine) {
      syncService.enqueue({ url: `${BASE}/${id}`, method: 'DELETE', module: 'parcelas' });
      writeCache(readCache().filter((p) => p.id !== id));
      return;
    }
    await api.delete(`${BASE}/${id}`);
    writeCache(readCache().filter((p) => p.id !== id));
  },

  invalidateCache() {
    localStorage.removeItem(CACHE_KEY);
  },
};
