import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { useSyncStatus }    from '@/hooks/useSyncStatus';
import { useAuth }          from '@/contexts/AuthContext';

export function OfflineIndicator() {
  const { isOnline, isOffline, justReconnected } = useNetworkStatus();
  const { isOfflineSession }                     = useAuth();
  const { pending, failed, isSyncing }           = useSyncStatus();

  
  if (isOffline && isOfflineSession) {
    return (
      <div role="alert" aria-live="assertive"
        className="fixed top-0 inset-x-0 z-50 flex items-center justify-center gap-2 py-2 px-4 text-xs font-semibold animate-fade-in"
        style={{ backgroundColor: '#854d0e', color: '#fef9c3' }}
      >
        <span className="w-2 h-2 rounded-full bg-yellow-300 animate-pulse shrink-0" />
        MODO OFFLINE
        {pending > 0 && (
          <span className="ml-1 bg-yellow-800 text-yellow-100 px-1.5 py-0.5 rounded-full text-[0.65rem]">
            {pending} cambio{pending !== 1 ? 's' : ''} pendiente{pending !== 1 ? 's' : ''}
          </span>
        )}
        <span className="opacity-70">· se sincronizarán al reconectarte</span>
      </div>
    );
  }

  
  if (isOffline && !isOfflineSession) {
    return (
      <div role="alert" aria-live="assertive"
        className="fixed top-0 inset-x-0 z-50 flex items-center justify-center gap-2 py-2 px-4 text-xs font-semibold animate-fade-in"
        style={{ backgroundColor: '#7f1d1d', color: '#fecaca' }}
      >
        <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M18.364 5.636a9 9 0 010 12.728M15.536 8.464a5 5 0 010 7.072M12 12h.01M8.464 15.536a5 5 0 010-7.072M5.636 18.364a9 9 0 010-12.728" />
        </svg>
        Sin conexión a internet
      </div>
    );
  }

  
  if (isOnline && (justReconnected || isSyncing)) {
    return (
      <div role="status" aria-live="polite"
        className="fixed top-0 inset-x-0 z-50 flex items-center justify-center gap-2 py-2 px-4 text-xs font-semibold animate-fade-in"
        style={{ backgroundColor: '#14532d', color: '#bbf7d0' }}
      >
        <svg className="w-3.5 h-3.5 animate-spin shrink-0" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        {isSyncing
          ? `Sincronizando${pending > 0 ? ` ${pending} operación${pending !== 1 ? 'es' : ''}` : ''}…`
          : 'Conexión restaurada — sincronizando…'}
      </div>
    );
  }

  
  if (isOnline && failed > 0) {
    return (
      <div role="alert" aria-live="polite"
        className="fixed top-0 inset-x-0 z-50 flex items-center justify-center gap-2 py-2 px-4 text-xs font-semibold animate-fade-in"
        style={{ backgroundColor: '#7c2d12', color: '#fed7aa' }}
      >
        <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
        {failed} operación{failed !== 1 ? 'es' : ''} fallida{failed !== 1 ? 's' : ''} — revisa tu conexión
      </div>
    );
  }

  
  if (isOnline && pending > 0 && !isSyncing && !justReconnected) {
    return (
      <div role="status" aria-live="polite"
        className="fixed top-0 inset-x-0 z-50 flex items-center justify-center gap-2 py-2 px-4 text-xs font-semibold animate-fade-in"
        style={{ backgroundColor: '#1e3a5f', color: '#bfdbfe' }}
      >
        <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse shrink-0" />
        {pending} cambio{pending !== 1 ? 's' : ''} pendiente{pending !== 1 ? 's' : ''} de sincronizar
      </div>
    );
  }

  return null;
}
