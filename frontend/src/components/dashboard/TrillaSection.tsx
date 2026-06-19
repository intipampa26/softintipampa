import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ReferenceLine, Cell, ResponsiveContainer,
} from 'recharts';
import type { TrillaResumen, FiltroAño } from '@/types/dashboard.types';

const CP = '#445D46';
const CL = '#8BA989';
const BD = '#E8EDE8';
const TX = '#2C2C2C';

const CARD_SHADOW = '0 1px 3px rgba(68,93,70,0.06), 0 4px 12px rgba(68,93,70,0.04)';

const fmt = (n: number) => n.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtKg = (n: number) => n.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' kg';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-xl px-3 py-2.5 shadow-xl text-xs"
      style={{ background: '#fff', border: `1px solid ${BD}`, color: TX }}
    >
      <p className="font-bold mb-1.5" style={{ color: TX }}>{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-sm inline-block shrink-0" style={{ background: p.fill ?? p.color }} />
          <span style={{ color: '#7A9A7C' }}>{p.name}:</span>
          <strong>{typeof p.value === 'number' ? fmt(p.value) + '%' : p.value}</strong>
        </p>
      ))}
    </div>
  );
};

interface Props {
  data: TrillaResumen;
  año: FiltroAño;
  almacen: string;
}

export function TrillaSection({ data, año, almacen }: Props) {
  const lotes = (almacen === 'todos'
    ? data.detallePorLote
    : data.detallePorLote.filter(r => r.almacen === almacen)
  ).filter(r => r.rendimientoTotal > 0).slice(0, 25);

  const chartData = lotes.map(r => ({
    nombre: r.id_lote,
    rend2024: r.rendimiento2024 > 0 ? r.rendimiento2024 : undefined,
    rend2025: r.rendimiento2025 > 0 ? r.rendimiento2025 : undefined,
    rendTotal: r.rendimientoTotal,
  }));

  const showBoth = año === 'ambos';

  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-2xl p-5" style={{ background: '#fff', boxShadow: CARD_SHADOW }}>
        <div className="flex items-start justify-between gap-3 mb-4">
          <p className="text-[0.6rem] font-bold uppercase tracking-[0.14em]" style={{ color: '#7A9A7C' }}>
            Rendimiento por Lote (%)
          </p>
          <span
            className="text-[0.65rem] font-bold px-2.5 py-1 rounded-full"
            style={{ background: '#D1FAE5', color: '#065F46' }}
          >
            Prom. {fmt(data.rendimientoPromedio)}%
          </span>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 55 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={BD} />
            <XAxis dataKey="nombre" tick={{ fontSize: 9, fill: '#96A897' }} angle={-40} textAnchor="end" interval={0} />
            <YAxis domain={[60, 100]} tick={{ fontSize: 10, fill: '#96A897' }} unit="%" width={42} />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine
              y={data.rendimientoPromedio}
              stroke="#d97706"
              strokeDasharray="5 3"
              strokeWidth={1.5}
              label={{ value: `${fmt(data.rendimientoPromedio)}%`, position: 'insideTopRight', fontSize: 10, fill: '#d97706', dy: -8 }}
            />
            {showBoth ? (
              <>
                <Legend iconSize={8} wrapperStyle={{ fontSize: 11, color: '#7A9A7C' }} />
                <Bar dataKey="rend2024" name="2024" fill={CL} radius={[4,4,0,0]} />
                <Bar dataKey="rend2025" name="2025" radius={[4,4,0,0]}>
                  {chartData.map((entry, i) => (
                    <Cell key={i} fill={(entry.rend2025 ?? 0) >= 80 ? CP : '#ef4444'} />
                  ))}
                </Bar>
              </>
            ) : (
              <Bar dataKey={año === '2024' ? 'rend2024' : 'rend2025'} name={año} radius={[4,4,0,0]}>
                {chartData.map((entry, i) => {
                  const v = año === '2024' ? entry.rend2024 : entry.rend2025;
                  return <Cell key={i} fill={(v ?? 0) >= 80 ? CP : '#ef4444'} />;
                })}
              </Bar>
            )}
          </BarChart>
        </ResponsiveContainer>
        <div className="flex items-center gap-5 mt-3 text-[0.65rem]" style={{ color: '#7A9A7C' }}>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm inline-block" style={{ background: CP }} />
            ≥ 80%
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm inline-block" style={{ background: '#ef4444' }} />
            &lt; 80%
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-5 border-t-2 border-dashed inline-block" style={{ borderColor: '#d97706' }} />
            Promedio
          </span>
        </div>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ background: '#fff', boxShadow: CARD_SHADOW }}>
        <div className="overflow-auto">
          <table className="w-full text-xs">
            <thead>
              <tr style={{ background: '#EFF2EF' }}>
                {['Lote', 'Almacén', 'Kg Oro Verde', 'Kg Pergamino', 'Rend. 2024', 'Rend. 2025', 'Rend. Total'].map(h => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left font-bold whitespace-nowrap"
                    style={{ color: '#7A9A7C', letterSpacing: '0.05em', fontSize: '0.6rem', textTransform: 'uppercase' }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {lotes.map((r, i) => (
                <tr
                  key={r.id_lote + i}
                  className="transition-colors hover:bg-green-50/50"
                  style={{ borderTop: `1px solid ${BD}` }}
                >
                  <td className="px-4 py-2.5 font-semibold" style={{ color: TX }}>{r.nombre}</td>
                  <td className="px-4 py-2.5" style={{ color: '#7A9A7C' }}>{r.almacen}</td>
                  <td className="px-4 py-2.5 text-right tabular-nums" style={{ color: TX }}>{fmtKg(r.kgOroVerde)}</td>
                  <td className="px-4 py-2.5 text-right tabular-nums" style={{ color: TX }}>{fmtKg(r.kgPergamino)}</td>
                  <td className="px-4 py-2.5 text-right tabular-nums font-semibold"
                    style={{ color: r.rendimiento2024 > 0 ? (r.rendimiento2024 >= 80 ? CP : '#ef4444') : '#ccc' }}>
                    {r.rendimiento2024 > 0 ? fmt(r.rendimiento2024) + '%' : '—'}
                  </td>
                  <td className="px-4 py-2.5 text-right tabular-nums font-semibold"
                    style={{ color: r.rendimiento2025 > 0 ? (r.rendimiento2025 >= 80 ? CP : '#ef4444') : '#ccc' }}>
                    {r.rendimiento2025 > 0 ? fmt(r.rendimiento2025) + '%' : '—'}
                  </td>
                  <td className="px-4 py-2.5 text-right font-black tabular-nums"
                    style={{ color: r.rendimientoTotal >= 80 ? CP : '#ef4444' }}>
                    {fmt(r.rendimientoTotal)}%
                  </td>
                </tr>
              ))}
              <tr style={{ background: '#EFF2EF', borderTop: `2px solid ${BD}` }}>
                <td className="px-4 py-2.5 font-bold" colSpan={6} style={{ color: TX }}>Promedio general</td>
                <td className="px-4 py-2.5 text-right font-black tabular-nums"
                  style={{ color: data.rendimientoPromedio >= 80 ? CP : '#ef4444' }}>
                  {fmt(data.rendimientoPromedio)}%
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
