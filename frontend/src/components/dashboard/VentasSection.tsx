import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  AreaChart, Area, ResponsiveContainer,
} from 'recharts';
import { ParetoChart } from './ParetoChart';
import type { VentasResumen, FiltroAño } from '@/types/dashboard.types';

const CP = '#445D46';
const CS = '#5F7A61';
const CL = '#8BA989';
const BD = '#E8EDE8';
const TX = '#2C2C2C';

const CARD_SHADOW = '0 1px 3px rgba(68,93,70,0.06), 0 4px 12px rgba(68,93,70,0.04)';
const MESES = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];

const fmt = (n: number) => n.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtUSD = (n: number) => '$' + n.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtKg = (n: number) => n.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' kg';

const ChartCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="rounded-2xl p-5" style={{ background: '#fff', boxShadow: CARD_SHADOW }}>
    <p className="text-[0.6rem] font-bold uppercase tracking-[0.14em] mb-4" style={{ color: '#7A9A7C' }}>
      {title}
    </p>
    {children}
  </div>
);

const CustomTooltipUSD = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-xl px-3 py-2.5 shadow-xl text-xs"
      style={{ background: '#fff', border: `1px solid ${BD}`, color: TX }}
    >
      <p className="font-bold mb-1.5" style={{ color: TX }}>{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-sm inline-block shrink-0" style={{ background: p.color ?? p.fill }} />
          <span style={{ color: '#7A9A7C' }}>{p.name}:</span>
          <strong>{fmtUSD(p.value)}</strong>
        </p>
      ))}
    </div>
  );
};

interface Props {
  data: VentasResumen;
  año: FiltroAño;
}

export function VentasSection({ data, año }: Props) {
  const showBoth = año === 'ambos';

  const clienteData = data.ventasPorCliente.slice(0, 10);

  const mensualData = (() => {
    const map = new Map(data.ventasMensuales.map(r => [r.mes, r]));
    return Array.from({ length: 12 }, (_, i) => {
      const mes = String(i + 1).padStart(2, '0');
      const row = map.get(mes) ?? { mes, usd2024: 0, usd2025: 0 };
      return { mes: MESES[i], usd2024: row.usd2024, usd2025: row.usd2025 };
    });
  })();

  const totalFOBFiltrado = año === '2024'
    ? data.totalFOBPorAño.find(y => y.año === 2024)?.usd ?? 0
    : año === '2025'
    ? data.totalFOBPorAño.find(y => y.año === 2025)?.usd ?? 0
    : data.totalFOB;

  const detalle = data.detalle2025.slice(0, 20);
  const totalKgDetalle = detalle.reduce((s, r) => s + r.kgVendidos, 0);
  const totalFOBDetalle = detalle.reduce((s, r) => s + r.valorFOB, 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <ChartCard title="Ventas FOB por Cliente (USD)">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={clienteData} margin={{ top: 4, right: 8, left: 0, bottom: 55 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={BD} />
            <XAxis dataKey="cliente" tick={{ fontSize: 9, fill: '#96A897' }} angle={-35} textAnchor="end" interval={0} />
            <YAxis tick={{ fontSize: 10, fill: '#96A897' }} width={64} tickFormatter={v => '$' + (v / 1000).toFixed(0) + 'k'} />
            <Tooltip content={<CustomTooltipUSD />} />
            <Legend iconSize={8} wrapperStyle={{ fontSize: 11, color: '#7A9A7C' }} />
            {showBoth ? (
              <>
                <Bar dataKey="usd2024" name="2024" fill={CL} radius={[4,4,0,0]} stackId="a" />
                <Bar dataKey="usd2025" name="2025" fill={CP} radius={[4,4,0,0]} stackId="a" />
              </>
            ) : (
              <Bar dataKey={año === '2024' ? 'usd2024' : 'usd2025'} name={año} fill={CP} radius={[4,4,0,0]} />
            )}
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Evolución Mensual FOB (USD)">
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={mensualData} margin={{ top: 4, right: 8, left: 0, bottom: 4 }}>
            <defs>
              <linearGradient id="grad2024" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={CL} stopOpacity={0.3} />
                <stop offset="95%" stopColor={CL} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="grad2025" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={CP} stopOpacity={0.3} />
                <stop offset="95%" stopColor={CP} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={BD} />
            <XAxis dataKey="mes" tick={{ fontSize: 10, fill: '#96A897' }} />
            <YAxis tick={{ fontSize: 10, fill: '#96A897' }} width={64} tickFormatter={v => '$' + (v / 1000).toFixed(0) + 'k'} />
            <Tooltip content={<CustomTooltipUSD />} />
            <Legend iconSize={8} wrapperStyle={{ fontSize: 11, color: '#7A9A7C' }} />
            {(showBoth || año === '2024') && (
              <Area type="monotone" dataKey="usd2024" name="2024" stroke={CL} strokeWidth={2}
                    fill="url(#grad2024)" dot={false} />
            )}
            {(showBoth || año === '2025') && (
              <Area type="monotone" dataKey="usd2025" name="2025" stroke={CP} strokeWidth={2}
                    fill="url(#grad2025)" dot={false} />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Pareto Lotes Vendidos 2025 (% Volumen)">
        <ParetoChart data={data.paretoProductos2025} />
      </ChartCard>

      <div className="rounded-2xl overflow-hidden flex flex-col" style={{ background: '#fff', boxShadow: CARD_SHADOW }}>
        <div className="px-5 pt-5 pb-3 flex items-start justify-between gap-3">
          <p className="text-[0.6rem] font-bold uppercase tracking-[0.14em]" style={{ color: '#7A9A7C' }}>
            Detalle Ventas 2025
          </p>
          <span className="text-[0.65rem] font-bold" style={{ color: CP }}>
            {fmtUSD(totalFOBFiltrado)}
          </span>
        </div>
        <div className="overflow-auto flex-1">
          <table className="w-full text-xs">
            <thead>
              <tr style={{ background: '#EFF2EF' }}>
                {['Tipo', 'Lote', 'Kg Vendidos', 'Valor FOB', 'USD/kg'].map(h => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left whitespace-nowrap font-bold"
                    style={{ color: '#7A9A7C', letterSpacing: '0.05em', fontSize: '0.6rem', textTransform: 'uppercase' }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {detalle.map((r, i) => {
                const pxkg = r.kgVendidos > 0 ? r.valorFOB / r.kgVendidos : 0;
                return (
                  <tr
                    key={r.id_lote + r.tipo + i}
                    className="transition-colors hover:bg-green-50/50"
                    style={{ borderTop: `1px solid ${BD}` }}
                  >
                    <td className="px-4 py-2 whitespace-nowrap" style={{ color: '#7A9A7C' }}>{r.tipo}</td>
                    <td className="px-4 py-2 font-semibold whitespace-nowrap" style={{ color: TX }}>{r.id_lote}</td>
                    <td className="px-4 py-2 text-right tabular-nums" style={{ color: TX }}>{fmtKg(r.kgVendidos)}</td>
                    <td className="px-4 py-2 text-right font-bold tabular-nums" style={{ color: CP }}>{fmtUSD(r.valorFOB)}</td>
                    <td className="px-4 py-2 text-right tabular-nums" style={{ color: CS }}>{fmtUSD(pxkg)}</td>
                  </tr>
                );
              })}
              <tr style={{ background: '#EFF2EF', borderTop: `2px solid ${BD}` }}>
                <td className="px-4 py-2.5 font-bold" colSpan={2} style={{ color: TX }}>Total 2025</td>
                <td className="px-4 py-2.5 text-right font-bold tabular-nums" style={{ color: TX }}>{fmtKg(totalKgDetalle)}</td>
                <td className="px-4 py-2.5 text-right font-black tabular-nums" style={{ color: CP }}>{fmtUSD(totalFOBDetalle)}</td>
                <td className="px-4 py-2.5 text-right font-bold tabular-nums" style={{ color: CS }}>
                  {totalKgDetalle > 0 ? fmtUSD(totalFOBDetalle / totalKgDetalle) : '—'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
