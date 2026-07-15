import api from '@/api/axios';
import { syncService } from './sync.service';
import { storageService } from './storage.service';

export type TipoMuestra        = 'pergamino' | 'oro' | 'grano_cacao';
export type TipoProductoMuestra = 'cafe' | 'cacao' | 'cafe_cacao';
export type EstadoMuestra      = 'pendiente' | 'en_proceso' | 'completada';
export type ResultadoMuestra   = 'aprobado' | 'descartado';

export interface Muestra {
  id: number;
  codigo: string;
  fecha: string | null;
  tipoMuestra: TipoMuestra | null;
  estado: EstadoMuestra;
  resultado: ResultadoMuestra | null;
   
  puntaje: number | null;
  puntajeFisico:    number | string | null;
  puntajeSensorial: number | string | null;
  observaciones: string | null;
  productorId: number;
  campanaId: number;
  loteId: number | null;
  tipoProducto: TipoProductoMuestra | null;
  categoriaMuestra: string | null;
  rendimiento: string | null;
  humedad: string | null;
  base: string | null;
  variedad: string | null;
  proceso: string | null;
  planta: string | null;
  cantidadKg: number | null;
  fechaCata: string | null;
  añoCosecha: number | null;
  pais: string | null;
  region: string | null;
  estadoLote: string | null;
  loteCreado: boolean | null;
  activo: boolean;
  createdAt: string;
  campana?: { id: number; nombre: string };
  productor?: { id: number; nombre: string; apellido: string };
  lote?: { id: number; codigo: string; estado: string };
  loteFinal?: { id: number; codigo: string } | null;
  parcela?: { id: number; nombre: string; codigo: string } | null;
   
  _pendiente?: boolean;
}

export interface EvaluacionFisica {
  id: number; muestraId: number;
  cafeHumedadPct?: number; cafeDefectosPrimarios?: number; cafeDefectosSecundarios?: number;
  cafeGranulometria?: string; cafeColorGrano?: string; cafePesoHectolitrico?: number;
  cacaoFermentacionPct?: number; cacaoHumedadPct?: number; cacaoDefectosPct?: number;
  cacaoPurezaPct?: number; cacaoPesoCienGranos?: number; cacaoGranosMasa?: number;
  observaciones?: string; evaluadorId?: number; fechaEvaluacion: string;
}

export interface EvaluacionSensorial {
  id: number; muestraId: number;
  cafeFraganciaAroma?: number; cafeSabor?: number; cafePosgusto?: number;
  cafeAcidez?: number; cafeCuerpo?: number; cafeBalance?: number;
  cafeUniformidad?: number; cafeTazaLimpia?: number; cafeDulzura?: number;
  cafePuntajeTotal?: number;
  cacaoFlavor?: number; cacaoAroma?: number; cacaoAcidez?: number;
  cacaoAmargor?: number; cacaoAstringencia?: number; cacaoPersistencia?: number;
  cacaoPuntajeTotal?: number;
  defectos?: number; observaciones?: string; evaluadorId?: number; fechaEvaluacion: string;
}

export interface DetalleMuestra {
  muestra: Muestra;
  evaluacionFisica: EvaluacionFisica | null;
  evaluacionSensorial: EvaluacionSensorial | null;
}

export interface CreateMuestraDto {
  productorId: number;
  campanaId: number;
  loteId?: number;
  loteFinalId?: number;
  fecha?: string;
  tipoMuestra?: TipoMuestra;
  tipoProducto?: TipoProductoMuestra;
  estado?: EstadoMuestra;
  resultado?: ResultadoMuestra;
  puntaje?: number;
  observaciones?: string;
  
  categoriaMuestra?: string;
  rendimiento?: string;
  humedad?: string;
  base?: string;
  variedad?: string;
  proceso?: string;
  planta?: string;
  cantidadKg?: number;
  fechaCata?: string;
  añoCosecha?: number;
  pais?: string;
  region?: string;
  estadoLote?: string;
  loteCreado?: boolean;
}

export interface FilterMuestrasDto {
  page?: number; limit?: number;
  campanaId?: number; productorId?: number; loteId?: number;
  tipoMuestra?: TipoMuestra; estado?: EstadoMuestra; resultado?: ResultadoMuestra;
  search?: string; fechaDesde?: string; fechaHasta?: string;
  estadoLote?: string; variedad?: string; sinLote?: boolean;
}

export interface PaginationMeta { total: number; page: number; lastPage: number; limit: number; }
export interface PagedMuestras  { data: Muestra[]; meta: PaginationMeta; }

const CACHE_KEY           = 'intipampa_muestras_cache';
const DETALLE_PREFIX      = 'intipampa_muestra_detalle_';

function readCache(): Muestra[] {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    const parsed = JSON.parse(raw ?? '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch { return []; }
}

function writeCache(data: Muestra[]) {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify(data)); } catch {   }
}

function readDetalleCache(id: number): DetalleMuestra | null {
  try {
    const raw = localStorage.getItem(`${DETALLE_PREFIX}${id}`);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function writeDetalleCache(id: number, d: DetalleMuestra) {
  try { localStorage.setItem(`${DETALLE_PREFIX}${id}`, JSON.stringify(d)); } catch {   }
}

function buildMeta(all: Muestra[], page: number, limit: number): PaginationMeta {
  const total    = all.length;
  const lastPage = Math.ceil(total / limit) || 1;
  return { total, page, lastPage, limit };
}

function applyFilters(all: Muestra[], filter: FilterMuestrasDto): Muestra[] {
  let result = all.filter((m) => m.activo !== false);
  if (filter.campanaId)   result = result.filter((m) => m.campanaId   === filter.campanaId);
  if (filter.productorId) result = result.filter((m) => m.productorId === filter.productorId);
  if (filter.loteId)      result = result.filter((m) => m.loteId      === filter.loteId);
  if (filter.tipoMuestra) result = result.filter((m) => m.tipoMuestra === filter.tipoMuestra);
  if (filter.estado)      result = result.filter((m) => m.estado      === filter.estado);
  if (filter.search?.trim()) {
    const term = filter.search.trim().toLowerCase();
    result = result.filter((m) => m.codigo.toLowerCase().includes(term));
  }
  if (filter.fechaDesde) result = result.filter((m) => !!m.fecha && m.fecha >= filter.fechaDesde!);
  if (filter.fechaHasta) result = result.filter((m) => !!m.fecha && m.fecha <= filter.fechaHasta!);
  if (filter.estadoLote) result = result.filter((m) => m.lote?.estado === filter.estadoLote);
  if (filter.variedad?.trim()) {
    const term = filter.variedad.trim().toLowerCase();
    result = result.filter((m) => (m.variedad ?? '').toLowerCase().includes(term));
  }
  return result;
}

function toApiPayload(dto: Partial<CreateMuestraDto>): Record<string, unknown> {
  
  const { fecha, tipoProducto, resultado, puntaje, ...rest } = dto as any;
  const payload: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(rest)) {
    
    if (v === '' || v === null || v === undefined) continue;
    payload[k] = v;
  }
  if (fecha) payload.fechaRegistro = fecha;
  return payload;
}

function toEvalSensorialPayload(dto: Partial<EvaluacionSensorial>): Record<string, unknown> {
  const { cafePuntajeTotal, cacaoPuntajeTotal, fechaEvaluacion, observaciones, evaluadorId, ...camposRaw } = dto as any;
  const isCafe      = cafePuntajeTotal !== undefined;
  const puntajeTotal = cafePuntajeTotal ?? cacaoPuntajeTotal;
  const camposJson: Record<string, unknown> = {};
  
  for (const [k, v] of Object.entries(camposRaw)) {
    if (v !== undefined && v !== null && v !== '') camposJson[k] = v;
  }
  if (puntajeTotal !== undefined) camposJson.puntajeTotal = puntajeTotal;
  const payload: Record<string, unknown> = {
    productoTipo: isCafe ? 'CAFE' : 'CACAO',
    camposJson,
  };
  if (puntajeTotal !== undefined) payload.puntajeTotal = puntajeTotal;
  if (fechaEvaluacion) payload.fecha = fechaEvaluacion;
  if (observaciones)   payload.observaciones = observaciones;
  if (evaluadorId)     payload.evaluadorId   = evaluadorId;
  return payload;
}

function toEvalFisicaPayload(dto: Partial<EvaluacionFisica>): Record<string, unknown> {
  const { fechaEvaluacion, observaciones, evaluadorId, puntajeTotal, ...camposRaw } = dto as any;
  const isCafe = Object.keys(camposRaw).some((k) => k.startsWith('cafe'));
  const camposJson: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(camposRaw)) {
    if (v !== undefined && v !== null && v !== '') camposJson[k] = v;
  }
  const payload: Record<string, unknown> = {
    productoTipo: isCafe ? 'CAFE' : 'CACAO',
    camposJson,
  };
  if (puntajeTotal != null) payload.puntajeTotal = puntajeTotal;
  if (fechaEvaluacion) payload.fecha = fechaEvaluacion;
  if (observaciones)   payload.observaciones = observaciones;
  if (evaluadorId)     payload.evaluadorId   = evaluadorId;
  return payload;
}

class MuestrasService {

  

  async getPage(filter: FilterMuestrasDto = {}): Promise<PagedMuestras> {
    if (!navigator.onLine) {
      const all    = applyFilters(readCache(), filter);
      const page   = filter.page  ?? 1;
      const limit  = filter.limit ?? 12;
      const start  = (page - 1) * limit;
      return { data: all.slice(start, start + limit), meta: buildMeta(all, page, limit) };
    }
    try {
      const res  = await api.get('/muestras', { params: filter });
      const data: Muestra[] = Array.isArray(res.data) ? res.data : [];
      const meta: PaginationMeta =
        (res as unknown as { meta: PaginationMeta }).meta ??
        buildMeta(data, filter.page ?? 1, filter.limit ?? 12);

      
      const pending  = readCache().filter((m) => m._pendiente);
      const freshIds = new Set(data.map((m) => m.id));
      const merged   = [...data, ...pending.filter((m) => !freshIds.has(m.id))];
      writeCache(merged);

      return { data, meta };
    } catch {
      const all   = applyFilters(readCache(), filter);
      const page  = filter.page  ?? 1;
      const limit = filter.limit ?? 12;
      const start = (page - 1) * limit;
      return { data: all.slice(start, start + limit), meta: buildMeta(all, page, limit) };
    }
  }

  

  async getOne(id: number): Promise<Muestra> {
    if (!navigator.onLine) {
      const cached = readCache().find((m) => m.id === id);
      if (cached) return cached;
      throw new Error('Sin conexión y sin datos en caché');
    }
    const { data } = await api.get(`/muestras/${id}`);
    return data;
  }

  async getDetalle(id: number): Promise<DetalleMuestra> {
    if (!navigator.onLine) {
      const cached = readDetalleCache(id);
      if (cached) return cached;

      const muestra = readCache().find((m) => m.id === id);
      if (muestra) return { muestra, evaluacionFisica: null, evaluacionSensorial: null };
      throw new Error('Sin conexión y sin detalle en caché');
    }
    try {
      const { data } = await api.get(`/muestras/${id}/detalle`);
      writeDetalleCache(id, data);
      return data;
    } catch {
      const cached = readDetalleCache(id);
      if (cached) return cached;
      throw new Error('Error al obtener detalle');
    }
  }

  

  async create(dto: CreateMuestraDto): Promise<Muestra> {
    if (!navigator.onLine) {
      syncService.enqueue({ url: '/muestras', method: 'POST', body: dto, module: 'muestras' });
      const fake: Muestra = {
        id:              Date.now(),
        codigo:          `MUE-OFFLINE-${Date.now()}`,
        fecha:           dto.fecha           ?? null,
        tipoMuestra:     dto.tipoMuestra     ?? null,
        tipoProducto:    dto.tipoProducto    ?? null,
        estado:           dto.estado          ?? 'pendiente',
        resultado:        dto.resultado       ?? null,
        puntaje:          dto.puntaje         ?? null,
        puntajeFisico:    null,
        puntajeSensorial: null,
        parcela:          null,
        observaciones:    dto.observaciones   ?? null,
        categoriaMuestra: dto.categoriaMuestra ?? null,
        rendimiento:     dto.rendimiento     ?? null,
        humedad:         dto.humedad         ?? null,
        base:            dto.base            ?? null,
        variedad:        dto.variedad        ?? null,
        proceso:         dto.proceso         ?? null,
        planta:          dto.planta          ?? null,
        cantidadKg:      dto.cantidadKg      ?? null,
        fechaCata:       dto.fechaCata       ?? null,
        añoCosecha:      dto.añoCosecha      ?? null,
        pais:            dto.pais            ?? null,
        region:          dto.region          ?? null,
        estadoLote:      null,
        loteCreado:      dto.loteCreado ?? null,
        productorId:     dto.productorId,
        campanaId:       dto.campanaId,
        loteId:          dto.loteId          ?? null,
        activo:          true,
        createdAt:       new Date().toISOString(),
        _pendiente:      true,
      };
      writeCache([fake, ...readCache()]);
      return fake;
    }
    const { data } = await api.post('/muestras', toApiPayload(dto));
    writeCache([data, ...readCache().filter((m) => !m._pendiente || m.id !== data.id)]);
    return data;
  }

  async update(id: number, dto: Partial<CreateMuestraDto>): Promise<Muestra> {
    if (!navigator.onLine) {
      syncService.enqueue({ url: `/muestras/${id}`, method: 'PUT', body: toApiPayload(dto), module: 'muestras' });
      const cache = readCache().map((m) =>
        m.id === id ? { ...m, ...dto, updatedAt: new Date().toISOString() } : m,
      );
      writeCache(cache);
      return cache.find((m) => m.id === id) as Muestra;
    }
    const { data } = await api.put(`/muestras/${id}`, toApiPayload(dto));
    writeCache(readCache().map((m) => (m.id === id ? data : m)));
    return data;
  }

  async marcarEnLinea(id: number): Promise<Muestra> {
    return this.update(id, { estado: 'en_proceso' });
  }

  async actualizarEstadoPorEvaluaciones(id: number): Promise<void> {
    const { evaluacionFisica, evaluacionSensorial } = await this.getDetalle(id);
    const ambas = evaluacionFisica != null && evaluacionSensorial != null;
    await this.update(id, { estado: ambas ? 'completada' : 'en_proceso' });
  }

  async remove(id: number): Promise<void> {
    if (!navigator.onLine) {
      syncService.enqueue({ url: `/muestras/${id}`, method: 'DELETE', module: 'muestras' });
      writeCache(readCache().filter((m) => m.id !== id));
      return;
    }
    await api.delete(`/muestras/${id}`);
    writeCache(readCache().filter((m) => m.id !== id));
  }

  

  async upsertEvaluacionFisica(
    muestraId: number,
    dto: Partial<EvaluacionFisica>,
  ): Promise<EvaluacionFisica> {
    const payload = toEvalFisicaPayload(dto);
    if (!navigator.onLine) {
      syncService.enqueue({ url: `/muestras/${muestraId}/evaluacion-fisica`, method: 'POST', body: payload, module: 'muestras' });
      const fake = { id: Date.now(), muestraId, ...dto } as EvaluacionFisica;
      const det  = readDetalleCache(muestraId);
      if (det) writeDetalleCache(muestraId, { ...det, evaluacionFisica: fake });
      
      if ((payload as any).puntajeTotal != null) {
        writeCache(readCache().map(m =>
          m.id === muestraId ? { ...m, puntajeFisico: (payload as any).puntajeTotal } : m
        ));
      }
      return fake;
    }
    const { data } = await api.post(`/muestras/${muestraId}/evaluacion-fisica`, payload);
    const det2 = readDetalleCache(muestraId);
    if (det2) writeDetalleCache(muestraId, { ...det2, evaluacionFisica: data });
    
    writeCache(readCache().map(m =>
      m.id === muestraId ? { ...m, puntajeFisico: data.puntajeTotal ?? m.puntajeFisico } : m
    ));
    return data;
  }

  async upsertEvaluacionSensorial(
    muestraId: number,
    dto: Partial<EvaluacionSensorial>,
  ): Promise<EvaluacionSensorial> {
    const payload = toEvalSensorialPayload(dto);
    if (!navigator.onLine) {
      syncService.enqueue({ url: `/muestras/${muestraId}/evaluacion-sensorial`, method: 'POST', body: payload, module: 'muestras' });
      const fake = { id: Date.now(), muestraId, ...dto } as EvaluacionSensorial;
      const det  = readDetalleCache(muestraId);
      if (det) writeDetalleCache(muestraId, { ...det, evaluacionSensorial: fake });
      
      if ((payload as any).puntajeTotal != null) {
        writeCache(readCache().map(m =>
          m.id === muestraId ? { ...m, puntajeSensorial: (payload as any).puntajeTotal } : m
        ));
      }
      return fake;
    }
    const { data } = await api.post(`/muestras/${muestraId}/evaluacion-sensorial`, payload);
    const det2 = readDetalleCache(muestraId);
    if (det2) writeDetalleCache(muestraId, { ...det2, evaluacionSensorial: data });
    
    writeCache(readCache().map(m =>
      m.id === muestraId ? { ...m, puntajeSensorial: data.puntajeTotal ?? m.puntajeSensorial } : m
    ));
    return data;
  }

  

  async exportPreview(filter: FilterMuestrasDto = {}): Promise<{
    data: Array<{ muestra: Muestra; evaluacionFisica: Record<string, unknown> | null; evaluacionSensorial: Record<string, unknown> | null }>;
    meta: PaginationMeta;
  }> {
    const res  = await api.get('/muestras/export/preview', { params: filter });
    const data = Array.isArray(res.data) ? res.data : [];
    const meta = (res as unknown as { meta: PaginationMeta }).meta ?? { total: 0, page: 1, lastPage: 1, limit: 20 };
    return { data, meta };
  }

  async exportExcel(filter: FilterMuestrasDto = {}): Promise<Blob> {
    const token  = storageService.getAccessToken();
    const params = new URLSearchParams(
      Object.entries(filter)
        .filter(([, v]) => v !== undefined)
        .map(([k, v]) => [k, String(v)]),
    );
    const resp = await fetch(`/api/muestras/export/excel?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!resp.ok) throw new Error('Error al exportar muestras');
    return resp.blob();
  }

  async importHistorico(
    file: File,
  ): Promise<{ creadas: number; actualizadas: number; errores: string[] }> {
    const token = storageService.getAccessToken();
    const form  = new FormData();
    form.append('file', file);
    const resp = await fetch('/muestras/import', {
      method:  'POST',
      headers: { Authorization: `Bearer ${token}` },
      body:    form,
    });
    if (!resp.ok) throw new Error('Error al importar muestras');
    const json = await resp.json();
    return json.data ?? json;
  }
}

export const muestrasService = new MuestrasService();
