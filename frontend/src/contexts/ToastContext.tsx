import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { CheckCircle2, XCircle, Info, AlertTriangle, WifiOff, X } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning' | 'offline';

interface ToastItem { id: number; type: ToastType; message: string; }

interface ToastCtx { add: (type: ToastType, msg: string) => void; remove: (id: number) => void; toasts: ToastItem[]; }

const Ctx = createContext<ToastCtx | null>(null);
let _id = 0;

const CONFIG: Record<ToastType, { bg: string; border: string; text: string; Icon: LucideIcon }> = {
  success: { bg: '#f0fdf4', border: '#86efac', text: '#166534', Icon: CheckCircle2 },
  error:   { bg: '#fef2f2', border: '#fca5a5', text: '#991b1b', Icon: XCircle      },
  info:    { bg: '#eff6ff', border: '#93c5fd', text: '#1e40af', Icon: Info          },
  warning: { bg: '#fffbeb', border: '#fcd34d', text: '#92400e', Icon: AlertTriangle },
  offline: { bg: '#fefce8', border: '#fde047', text: '#713f12', Icon: WifiOff       },
};

function ToastItem({ t, onRemove }: { t: ToastItem; onRemove: () => void }) {
  const { bg, border, text, Icon } = CONFIG[t.type];
  return (
    <div
      role="alert"
      aria-live="polite"
      className="flex items-start gap-3 px-4 py-3 rounded-2xl shadow-lg pointer-events-auto w-full"
      style={{ backgroundColor: bg, border: `1.5px solid ${border}`, animation: 'cb-toast-in 0.22s ease-out' }}
    >
      <Icon size={17} strokeWidth={2.5} style={{ color: text, flexShrink: 0, marginTop: 1 }} />
      <p className="flex-1 text-sm font-semibold leading-snug" style={{ color: text }}>{t.message}</p>
      <button
        onClick={onRemove}
        aria-label="Cerrar"
        className="opacity-50 hover:opacity-100 transition-opacity flex-shrink-0"
        style={{ color: text }}
      >
        <X size={14} strokeWidth={2.5} />
      </button>
    </div>
  );
}

function ToastContainer({ toasts, remove }: { toasts: ToastItem[]; remove: (id: number) => void }) {
  if (!toasts.length) return null;
  return (
    <div className="fixed z-[9999] bottom-4 inset-x-4 sm:inset-x-auto sm:right-4 sm:w-80 flex flex-col gap-2 pointer-events-none">
      <style>{`
        @keyframes cb-toast-in {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      {toasts.map(t => <ToastItem key={t.id} t={t} onRemove={() => remove(t.id)} />)}
    </div>
  );
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const remove = useCallback((id: number) => setToasts(p => p.filter(t => t.id !== id)), []);

  const add = useCallback((type: ToastType, msg: string) => {
    const id = ++_id;
    setToasts(p => [...p.slice(-2), { id, type, message: msg }]);
    setTimeout(() => remove(id), 3500);
  }, [remove]);

  useEffect(() => {
    const h = (e: Event) => {
      const { type, message } = (e as CustomEvent<{ type: ToastType; message: string }>).detail;
      add(type, message);
    };
    window.addEventListener('app:toast', h);
    return () => window.removeEventListener('app:toast', h);
  }, [add]);

  return (
    <Ctx.Provider value={{ add, remove, toasts }}>
      {children}
      <ToastContainer toasts={toasts} remove={remove} />
    </Ctx.Provider>
  );
}

export function useToast() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useToast requires ToastProvider');
  return {
    success: (msg: string) => ctx.add('success', msg),
    error:   (msg: string) => ctx.add('error',   msg),
    info:    (msg: string) => ctx.add('info',     msg),
    warning: (msg: string) => ctx.add('warning',  msg),
    offline: (msg: string) => ctx.add('offline',  msg),
  };
}
