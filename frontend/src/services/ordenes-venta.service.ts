import { api } from '@/api/axios';

export type EstadoOrdenFE = 'pre_venta' | 'alistado' | 'exportacion' | 'post_venta';

export interface OrdenVentaFE {
  dbId:         number;
  id:           string;
  cliente:      string;
  productor:    string;
  campana:      string;
  fecha:        string;
  estado:       EstadoOrdenFE;
  lote:         string;
  cantidadKg:   number;
  destino:      string;
  tipoProducto: string;
  montoUSD:     number;
}

export interface CreateOrdenDto {
  cliente:       string;
  productor:     string;
  campana?:      string;
  lote?:         string;
  cantidadKg?:   number;
  destino?:      string;
  tipoProducto?: string;
  montoUSD?:     number;
  fecha?:        string;
  etapaActual?:  string;
}

function mapEtapa(e: string): EstadoOrdenFE {
  if (e === 'preventa') return 'pre_venta';
  return e as EstadoOrdenFE;
}

export function mapEstadoToEtapa(e: EstadoOrdenFE): string {
  if (e === 'pre_venta') return 'preventa';
  return e;
}

function mapResponse(raw: any): OrdenVentaFE {
  return {
    dbId:         raw.id,
    id:           raw.codigo,
    cliente:      raw.cliente      ?? '',
    productor:    raw.productor    ?? '',
    campana:      raw.campana      ?? '',
    fecha:        raw.fecha        ?? '',
    estado:       mapEtapa(raw.etapaActual ?? 'preventa'),
    lote:         raw.lote         ?? '',
    cantidadKg:   Number(raw.cantidadKg   ?? 0),
    destino:      raw.destino      ?? '',
    tipoProducto: raw.tipoProducto ?? '',
    montoUSD:     Number(raw.montoUSD     ?? 0),
  };
}

function unwrap(r: any): any {
  return r.data?.data ?? r.data;
}

export type EstadoPaso = 'pendiente' | 'en_proceso' | 'completado';

export interface OrdenPasoFE {
  id:       number;
  indice:   number;
  label:    string;
  fecha:    string | null;
  usuario:  string | null;
  estado:   EstadoPaso;
}

export const ordenesVentaService = {
  async getAll(params?: Record<string, unknown>): Promise<OrdenVentaFE[]> {
    const r    = await api.get('/ordenes-venta', { params: { limit: 200, ...params } });
    const body = unwrap(r);
    const list: any[] = Array.isArray(body) ? body : (body?.data ?? []);
    return list.map(mapResponse);
  },

  async create(dto: CreateOrdenDto): Promise<OrdenVentaFE> {
    const r = await api.post('/ordenes-venta', dto);
    return mapResponse(unwrap(r));
  },

  async update(id: number, dto: Partial<CreateOrdenDto>): Promise<OrdenVentaFE> {
    const r = await api.put(`/ordenes-venta/${id}`, dto);
    return mapResponse(unwrap(r));
  },

  async remove(id: number): Promise<void> {
    await api.delete(`/ordenes-venta/${id}`);
  },

  async getPasos(id: number): Promise<OrdenPasoFE[]> {
    const r = await api.get(`/ordenes-venta/${id}/pasos`);
    const list: any[] = unwrap(r);
    return (Array.isArray(list) ? list : []).sort((a, b) => a.indice - b.indice);
  },

  async updatePaso(id: number, indice: number, dto: { estado: EstadoPaso; fecha?: string; usuario?: string }): Promise<OrdenPasoFE> {
    const r = await api.put(`/ordenes-venta/${id}/pasos/${indice}`, dto);
    return unwrap(r);
  },

  async getPreventa(id: number): Promise<{ preventa: any; muestras: any[] }> {
    const r = await api.get(`/ordenes-venta/${id}/preventa`);
    const body = unwrap(r);
    return { preventa: body?.preventa ?? null, muestras: body?.muestras ?? [] };
  },

  async upsertPreventa(id: number, dto: Record<string, unknown>): Promise<any> {
    const r = await api.put(`/ordenes-venta/${id}/preventa`, dto);
    return unwrap(r);
  },

  async getCotizacion(id: number): Promise<any> {
    const r = await api.get(`/ordenes-venta/${id}/cotizacion`);
    return unwrap(r);
  },

  async upsertCotizacion(id: number, dto: Record<string, unknown>): Promise<any> {
    const r = await api.put(`/ordenes-venta/${id}/cotizacion`, dto);
    return unwrap(r);
  },

  async getAlistado(id: number): Promise<any> {
    const r = await api.get(`/ordenes-venta/${id}/alistado`);
    return unwrap(r);
  },

  async upsertAlistado(id: number, dto: Record<string, unknown>): Promise<any> {
    const r = await api.put(`/ordenes-venta/${id}/alistado`, dto);
    return unwrap(r);
  },

  async getExportacion(id: number): Promise<any> {
    const r = await api.get(`/ordenes-venta/${id}/exportacion`);
    return unwrap(r);
  },

  async upsertExportacion(id: number, dto: Record<string, unknown>): Promise<any> {
    const r = await api.put(`/ordenes-venta/${id}/exportacion`, dto);
    return unwrap(r);
  },

  async uploadExportacionFile(
    id: number,
    tipo: 'documentos' | 'reportes',
    file: File,
  ): Promise<{ name: string; file: string }[]> {
    const form = new FormData();
    form.append('file', file);
    const r = await api.post(`/ordenes-venta/${id}/exportacion/upload/${tipo}`, form);
    return unwrap(r);
  },

  async deleteExportacionFile(
    id: number,
    tipo: 'documentos' | 'reportes',
    filename: string,
  ): Promise<{ name: string; file: string }[]> {
    const r = await api.delete(`/ordenes-venta/${id}/exportacion/upload/${tipo}/${filename}`);
    return unwrap(r);
  },

  async getPostVenta(id: number): Promise<any> {
    const r = await api.get(`/ordenes-venta/${id}/post-venta`);
    return unwrap(r);
  },

  async upsertPostVenta(id: number, dto: Record<string, unknown>): Promise<any> {
    const r = await api.put(`/ordenes-venta/${id}/post-venta`, dto);
    return unwrap(r);
  },
};
