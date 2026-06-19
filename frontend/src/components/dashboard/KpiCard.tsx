const TX = '#1A2B1E';

interface KpiCardProps {
  label: string;
  value: string;
  sub?: string;
  delta?: number;
  accent?: string;
  icon?: React.ReactNode;
}

export function KpiCard({ label, value, sub, delta, accent = '#445D46', icon }: KpiCardProps) {
  return (
    <div
      className="relative rounded-2xl p-5 flex flex-col gap-3 overflow-hidden"
      style={{
        background: '#fff',
        boxShadow: '0 1px 3px rgba(68,93,70,0.06), 0 4px 12px rgba(68,93,70,0.04)',
      }}
    >
      <div className="absolute left-0 top-4 bottom-4 w-[3px] rounded-full" style={{ background: accent }} />

      <div className="flex items-start justify-between gap-2 pl-2">
        <span
          className="text-[0.6rem] font-bold uppercase tracking-[0.14em] leading-tight"
          style={{ color: '#7A9A7C' }}
        >
          {label}
        </span>
        {icon && (
          <span className="shrink-0 opacity-30" style={{ color: accent }}>
            {icon}
          </span>
        )}
      </div>

      <div className="pl-2">
        <p className="text-[1.6rem] font-black leading-none tracking-tight" style={{ color: TX }}>
          {value}
        </p>
      </div>

      <div className="flex items-center gap-2 flex-wrap pl-2">
        {sub && (
          <span className="text-[0.68rem] leading-snug" style={{ color: '#96A897' }}>{sub}</span>
        )}
        {delta !== undefined && (
          <span
            className="inline-flex items-center gap-0.5 text-[0.65rem] font-bold px-2 py-0.5 rounded-full ml-auto shrink-0"
            style={{
              background: delta >= 0 ? '#D1FAE5' : '#FEE2E2',
              color:      delta >= 0 ? '#065F46' : '#991B1B',
            }}
          >
            {delta >= 0 ? '↑' : '↓'} {Math.abs(delta).toFixed(1)}%
          </span>
        )}
      </div>
    </div>
  );
}
