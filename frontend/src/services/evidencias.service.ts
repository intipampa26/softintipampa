import api from '@/api/axios';
import { syncService } from './sync.service';
import { storageService } from './storage.service';

export const ALLOWED_MIME_TYPES = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
]);

export const MAX_FILE_SIZE = 1 * 1024 * 1024; 

export function validateFile(file: File): string | null {
  if (file.type.startsWith('video/')) return 'No se permiten archivos de video.';
  if (!ALLOWED_MIME_TYPES.has(file.type))
    return 'Tipo no permitido. Use: PDF, Word, Excel o imágenes (jpg, png, webp).';
  if (file.size > MAX_FILE_SIZE)
    return `El archivo supera el límite de 1 MB (tamaño: ${(file.size / 1024 / 1024).toFixed(2)} MB).`;
  return null;
}

export interface Evidencia {
  id: number;
  productorId: number;
  nombreArchivo: string;
  originalFilename: string | null;
  mimeType: string | null;
  fileSize: number | null;
  version: number;
  createdAt: string;
  updatedAt: string;
   
  _pendiente?: boolean;
}

export interface UploadEvidenciaDto {
  productorId: number;
  nombreArchivo: string;
  file: File;
}

const cacheKey  = (pid: number) => `intipampa_evidencias_${pid}`;
const BASE      = '/evidencias';

function readCache(productorId: number): Evidencia[] {
  try {
    const p = JSON.parse(localStorage.getItem(cacheKey(productorId)) ?? '[]');
    return Array.isArray(p) ? p : [];
  } catch { return []; }
}

function writeCache(productorId: number, data: Evidencia[]) {
  localStorage.setItem(cacheKey(productorId), JSON.stringify(data));
}

export const evidenciasService = {
   
  async getByProductor(productorId: number): Promise<Evidencia[]> {
    if (!navigator.onLine) {
      return readCache(productorId);
    }
    try {
      const { data } = await api.get<Evidencia[]>(BASE, { params: { productorId } });
      const list = Array.isArray(data) ? data : [];
      
      const pending = readCache(productorId).filter((e) => e._pendiente);
      const merged  = [
        ...pending,
        ...list.filter((e) => !pending.find((p) => p.id === e.id)),
      ];
      writeCache(productorId, merged);
      return merged;
    } catch {
      return readCache(productorId);
    }
  },

   
  async upload(dto: UploadEvidenciaDto): Promise<Evidencia | null> {
    const validationError = validateFile(dto.file);
    if (validationError) throw new Error(validationError);

    if (!navigator.onLine) {
      
      const fake: Evidencia = {
        id:               Date.now(),
        productorId:      dto.productorId,
        nombreArchivo:    dto.nombreArchivo,
        originalFilename: dto.file.name,
        mimeType:         dto.file.type || null,
        fileSize:         dto.file.size,
        version:          1,
        createdAt:        new Date().toISOString(),
        updatedAt:        new Date().toISOString(),
        _pendiente:       true,
      };
      writeCache(dto.productorId, [fake, ...readCache(dto.productorId)]);
      return fake;
    }

    const form = new FormData();
    form.append('productorId',   String(dto.productorId));
    form.append('nombreArchivo', dto.nombreArchivo);
    form.append('file',          dto.file, dto.file.name);

    const { data } = await api.post<Evidencia>(`${BASE}/upload`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    writeCache(dto.productorId, [data, ...readCache(dto.productorId).filter((e) => !e._pendiente || e.id !== data.id)]);
    return data;
  },

   
  async remove(id: number, productorId: number): Promise<void> {
    if (!navigator.onLine) {
      syncService.enqueue({ url: `${BASE}/${id}`, method: 'DELETE', module: 'evidencias' });
      writeCache(productorId, readCache(productorId).filter((e) => e.id !== id));
      return;
    }
    await api.delete(`${BASE}/${id}`);
    writeCache(productorId, readCache(productorId).filter((e) => e.id !== id));
  },

   
  async download(ev: Evidencia): Promise<void> {
    if (!navigator.onLine) {
      alert('Descarga no disponible en modo offline.');
      return;
    }
    const token = storageService.getAccessToken();
    const url   = `${BASE}/${ev.id}/download`;

    const resp = await fetch(url, {
      headers: { Authorization: `Bearer ${token ?? ''}` },
    });

    if (!resp.ok) throw new Error('Error al descargar el archivo');

    const blob   = await resp.blob();
    const objUrl = URL.createObjectURL(blob);
    const a      = document.createElement('a');
    a.href       = objUrl;
    a.download   = ev.nombreArchivo;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(objUrl);
  },

  invalidateCache(productorId: number) {
    localStorage.removeItem(cacheKey(productorId));
  },
};
