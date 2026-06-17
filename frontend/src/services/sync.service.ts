 

import api from '@/api/axios';
import { db, type SyncOperation } from './db.service';

export type SyncMethod = 'POST' | 'PUT' | 'DELETE';

 
export interface SyncItem {
  id:         string;
  url:        string;
  method:     SyncMethod;
  body?:      unknown;
  timestamp:  number;
  module:     string;
}

const MAX_RETRIES   = 5;
const BASE_DELAY_MS = 1000;

function backoffDelay(retries: number): number {
  return Math.min(BASE_DELAY_MS * Math.pow(2, retries), 30_000);
}

function uid(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

type SyncEventType = 'enqueue' | 'flush-start' | 'flush-done' | 'item-done' | 'item-failed';

const listeners = new Set<(type: SyncEventType) => void>();

function emit(type: SyncEventType) {
  listeners.forEach(fn => { try { fn(type); } catch {   } });
}

 
function hasFakeIdInUrl(url: string): boolean {
  return url.split('/').some(seg => {
    const n = Number(seg);
    return Number.isFinite(n) && Number.isInteger(n) && n >= 1_000_000_000_000;
  });
}

export const syncService = {
   
  subscribe(fn: (type: SyncEventType) => void): () => void {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },

   
  enqueue(item: Omit<SyncItem, 'id' | 'timestamp'>): SyncItem {
    const localId  = uid();
    const timestamp = Date.now();

    const op: SyncOperation = {
      localId,
      url:       item.url,
      method:    item.method,
      body:      item.body,
      timestamp,
      module:    item.module,
      status:    'pending',
      retries:   0,
    };

    
    db.operations.add(op).then(() => emit('enqueue')).catch(() => {
      
      const q: SyncItem[] = JSON.parse(localStorage.getItem('collective_bean_sync_queue') ?? '[]');
      q.push({ id: localId, url: item.url, method: item.method, body: item.body, timestamp, module: item.module });
      localStorage.setItem('collective_bean_sync_queue', JSON.stringify(q));
      emit('enqueue');
    });

    return { id: localId, url: item.url, method: item.method, body: item.body, timestamp, module: item.module };
  },

   
  async pendingCount(): Promise<number> {
    try {
      return await db.operations.where('status').anyOf(['pending', 'failed']).count();
    } catch {
      const q = JSON.parse(localStorage.getItem('collective_bean_sync_queue') ?? '[]');
      return Array.isArray(q) ? q.length : 0;
    }
  },

   
  async failedItems(): Promise<SyncOperation[]> {
    try {
      return await db.operations.where('status').equals('failed').toArray();
    } catch { return []; }
  },

   
  async getQueue(): Promise<SyncOperation[]> {
    try {
      return await db.operations.where('status').anyOf(['pending', 'failed']).toArray();
    } catch { return []; }
  },

  remove(localId: string): void {
    db.operations.where('localId').equals(localId).delete().catch(() => {
      const q: SyncItem[] = JSON.parse(localStorage.getItem('collective_bean_sync_queue') ?? '[]');
      localStorage.setItem('collective_bean_sync_queue', JSON.stringify(q.filter(i => i.id !== localId)));
    });
  },

  clear(): void {
    db.operations.clear().catch(() => localStorage.removeItem('collective_bean_sync_queue'));
  },

   
  async flush(): Promise<{ ok: number; failed: number }> {
    
    const raw = localStorage.getItem('collective_bean_sync_queue');
    if (raw) {
      try {
        const legacy: SyncItem[] = JSON.parse(raw);
        if (Array.isArray(legacy) && legacy.length > 0) {
          await Promise.all(legacy.map(i =>
            db.operations.add({ localId: i.id, url: i.url, method: i.method, body: i.body, timestamp: i.timestamp, module: i.module, status: 'pending', retries: 0 })
          )).catch(() => {});
          localStorage.removeItem('collective_bean_sync_queue');
        }
      } catch {   }
    }

    
    let pending: SyncOperation[] = [];
    try {
      pending = await db.operations
        .where('status').anyOf(['pending', 'failed'])
        .toArray();
    } catch { return { ok: 0, failed: 0 }; }

    if (pending.length === 0) return { ok: 0, failed: 0 };

    emit('flush-start');
    let ok = 0;
    let failed = 0;

    
    pending.sort((a, b) => a.timestamp - b.timestamp);

    for (const op of pending) {
      
      
      if (hasFakeIdInUrl(op.url)) {
        await db.operations.delete(op.id!).catch(() => {});
        emit('item-failed');
        failed++;
        continue;
      }

      await db.operations.update(op.id!, { status: 'syncing' }).catch(() => {});

      try {
        if      (op.method === 'POST')   await api.post(op.url, op.body);
        else if (op.method === 'PUT')    await api.put(op.url, op.body);
        else if (op.method === 'DELETE') await api.delete(op.url);

        
        await db.operations.delete(op.id!).catch(() => {});
        ok++;
        emit('item-done');

      } catch (err: unknown) {
        const status  = (err as { response?: { status?: number } })?.response?.status;
        const errMsg  = (err as { message?: string })?.message ?? 'Error desconocido';
        const retries = (op.retries ?? 0) + 1;

        
        const esDefinitivo = (status !== undefined && status >= 400 && status < 500)
          || (status === 500 && retries >= MAX_RETRIES)
          || retries >= MAX_RETRIES;

        if (esDefinitivo) {
          await db.operations.delete(op.id!).catch(() => {});
        } else {
          
          await db.operations.update(op.id!, {
            status:      'pending',
            retries,
            lastError:   errMsg,
            nextRetryAt: Date.now() + backoffDelay(retries),
          }).catch(() => {});
        }

        failed++;
        emit('item-failed');
        
      }
    }

    emit('flush-done');
    return { ok, failed };
  },

   
  async clearAll(): Promise<void> {
    await db.operations.clear().catch(() => {});
    
    const keysToRemove = Object.keys(localStorage).filter(k =>
      k.startsWith('collective_bean_') || k.startsWith('intipampa_')
    );
    keysToRemove.forEach(k => localStorage.removeItem(k));
  },
};
