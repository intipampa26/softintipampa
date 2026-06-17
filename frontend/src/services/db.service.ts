import Dexie, { type Table } from 'dexie';

export type SyncStatus = 'pending' | 'syncing' | 'synced' | 'failed' | 'conflict';
export type SyncMethod  = 'POST' | 'PUT' | 'DELETE';

export interface SyncOperation {
  id?:          number;     
  localId:      string;     
  url:          string;
  method:       SyncMethod;
  body?:        unknown;
  timestamp:    number;
  module:       string;
  status:       SyncStatus;
  retries:      number;
  lastError?:   string;
  nextRetryAt?: number;     
}

class IntipampaDB extends Dexie {
  operations!: Table<SyncOperation>;

  constructor() {
    super('intipampa_db_v1');
    this.version(1).stores({
      operations: '++id, localId, status, module, timestamp, nextRetryAt',
    });
  }
}

export const db = new IntipampaDB();

 
export async function migrateLegacyQueue(): Promise<void> {
  const raw = localStorage.getItem('collective_bean_sync_queue');
  if (!raw) return;
  try {
    const items: Array<{ id: string; url: string; method: SyncMethod; body?: unknown; timestamp: number; module: string }> =
      JSON.parse(raw);
    if (!Array.isArray(items) || items.length === 0) return;

    const existing = await db.operations.where('status').equals('pending').toArray();
    const existingLocalIds = new Set(existing.map(o => o.localId));

    const toInsert: SyncOperation[] = items
      .filter(i => !existingLocalIds.has(i.id))
      .map(i => ({
        localId:   i.id,
        url:       i.url,
        method:    i.method,
        body:      i.body,
        timestamp: i.timestamp,
        module:    i.module,
        status:    'pending',
        retries:   0,
      }));

    if (toInsert.length > 0) await db.operations.bulkAdd(toInsert);
    localStorage.removeItem('collective_bean_sync_queue');
  } catch {   }
}
