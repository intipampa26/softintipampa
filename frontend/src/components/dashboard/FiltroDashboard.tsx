import type { FiltroAño } from '@/types/dashboard.types';

const CP = '#445D46';
const TX = '#2C2C2C';

interface FiltroDashboardProps {
  año: FiltroAño;
  almacen: string;
  almacenes: string[];
  onAñoChange: (v: FiltroAño) => void;
  onAlmacenChange: (v: string) => void;
}

export function FiltroDashboard({ año, almacen, almacenes, onAñoChange, onAlmacenChange }: FiltroDashboardProps) {
  const años: FiltroAño[] = ['ambos', '2024', '2025'];

  return (
    <div
      className="rounded-2xl px-5 py-4 flex flex-wrap items-center gap-5"
      style={{
        background: '#fff',
        boxShadow: '0 1px 3px rgba(68,93,70,0.06), 0 4px 12px rgba(68,93,70,0.04)',
      }}
    >
      <div className="flex items-center gap-3">
        <span className="text-[0.6rem] font-bold uppercase tracking-[0.14em]" style={{ color: '#7A9A7C' }}>
          Campaña
        </span>
        <div
          className="flex items-center p-0.5 rounded-xl gap-0.5"
          style={{ background: '#F0F4F0' }}
        >
          {años.map(a => (
            <button
              key={a}
              onClick={() => onAñoChange(a)}
              className="px-3.5 py-1.5 rounded-[0.6rem] text-[0.72rem] font-bold transition-all duration-150"
              style={
                año === a
                  ? { background: CP, color: '#fff', boxShadow: '0 1px 4px rgba(68,93,70,0.25)' }
                  : { background: 'transparent', color: '#7A9A7C' }
              }
            >
              {a === 'ambos' ? 'Todos' : a}
            </button>
          ))}
        </div>
      </div>

      {almacenes.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[0.6rem] font-bold uppercase tracking-[0.14em]" style={{ color: '#7A9A7C' }}>
            Almacén
          </span>
          {['todos', ...almacenes].map(a => (
            <button
              key={a}
              onClick={() => onAlmacenChange(a)}
              className="px-3 py-1 rounded-full text-[0.68rem] font-semibold transition-all duration-150"
              style={
                almacen === a
                  ? { background: CP, color: '#fff' }
                  : { background: '#F0F4F0', color: '#7A9A7C' }
              }
            >
              {a === 'todos' ? 'Todos' : a}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
