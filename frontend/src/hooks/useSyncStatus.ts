 
import { useState, useEffect } from 'react';
import { syncService } from '@/services/sync.service';

export interface SyncStatus {
  pending:  number;
  failed:   number;
  isSyncing: boolean;
}

export function useSyncStatus(): SyncStatus {
  const [pending,   setPending]   = useState(0);
  const [failed,    setFailed]    = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);

  async function refresh() {
    const [p, f] = await Promise.all([
      syncService.pendingCount(),
      syncService.failedItems().then(arr => arr.length),
    ]);
    setPending(p);
    setFailed(f);
  }

  useEffect(() => {
    refresh();

    const unsub = syncService.subscribe(type => {
      if (type === 'flush-start') setIsSyncing(true);
      else if (type === 'flush-done') { setIsSyncing(false); refresh(); }
      else refresh();
    });

    
    const interval = setInterval(refresh, 5000);

    return () => { unsub(); clearInterval(interval); };
  }, []);

  return { pending, failed, isSyncing };
}
