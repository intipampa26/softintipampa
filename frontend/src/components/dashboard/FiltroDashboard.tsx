const CP = '#445D46';

interface Campana { id: number; nombre: string; }

interface FiltroDashboardProps {
  campanaId: number | null;
  campanas: Campana[];
  almacen: string;
  almacenes: string[];
  onCampanaChange: (id: number | null) => void;
  onAlmacenChange: (v: string) => void;
}

const selectStyle: React.CSSProperties = {
  border: '1px solid #D8E5D8',
  borderRadius: 10,
  padding: '6px 32px 6px 12px',
  fontSize: '0.78rem',
  fontWeight: 600,
  color: CP,
  background: `#F0F4F0 url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%237A9A7C' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E") no-repeat right 10px center`,
  appearance: 'none' as const,
  WebkitAppearance: 'none' as const,
  cursor: 'pointer',
  outline: 'none',
};

export function FiltroDashboard({ campanaId, campanas, almacen, almacenes, onCampanaChange, onAlmacenChange }: FiltroDashboardProps) {
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
        <select
          value={campanaId ?? ''}
          onChange={e => onCampanaChange(e.target.value ? Number(e.target.value) : null)}
          style={selectStyle}
        >
          <option value="">Todas</option>
          {campanas.map(c => (
            <option key={c.id} value={c.id}>{c.nombre}</option>
          ))}
        </select>
      </div>

      {almacenes.length > 0 && (
        <div className="flex items-center gap-3">
          <span className="text-[0.6rem] font-bold uppercase tracking-[0.14em]" style={{ color: '#7A9A7C' }}>
            Almacén
          </span>
          <select
            value={almacen}
            onChange={e => onAlmacenChange(e.target.value)}
            style={selectStyle}
          >
            <option value="todos">Todos</option>
            {almacenes.map(a => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
