import { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  AreaChart, Area, ResponsiveContainer,
} from 'recharts';
import { ParetoChart } from './ParetoChart';
import type { VentasResumen } from '@/types/dashboard.types';

const CP = '#7A8C9C';
const BD = '#E8EDE8';
const TX = '#2C2C2C';
const PEN_COLOR = '#9C8468';

const CARD_SHADOW = '0 1px 3px rgba(68,93,70,0.06), 0 4px 12px rgba(68,93,70,0.04)';
const MESES = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];

const fmt    = (n: number) => n.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtUSD = (n: number) => '$' + fmt(n);
const fmtPEN = (n: number) => 'S/.' + fmt(n);
const fmtKg  = (n: number) => fmt(n) + ' kg';

const ChartCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="rounded-2xl p-5" style={{ background: '#fff', boxShadow: CARD_SHADOW }}>
    <p className="text-[0.6rem] font-bold uppercase tracking-[0.14em] mb-4" style={{ color: '#7A9A7C' }}>
      {title}
    </p>
    {children}
  </div>
);

const CustomTooltipVentas = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl px-3 py-2.5 shadow-xl text-xs" style={{ background: '#fff', border: `1px solid ${BD}`, color: TX }}>
      <p className="font-bold mb-1.5" style={{ color: TX }}>{label}</p>
      {payload.map((p: any) => {
        const isPEN = (p.dataKey as string).toLowerCase().includes('pen');
        return (
          <p key={p.name} className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-sm inline-block shrink-0" style={{ background: p.color ?? p.fill }} />
            <span style={{ color: '#7A9A7C' }}>{p.name}:</span>
            <strong>{isPEN ? fmtPEN(p.value) : fmtUSD(p.value)}</strong>
          </p>
        );
      })}
    </div>
  );
};

interface Props {
  data: VentasResumen;
  campanaNombre?: string | null;
}

export function VentasSection({ data, campanaNombre }: Props) {
  const [filtroSku,    setFiltroSku]    = useState<string | null>(null);
  const [detallePage,  setDetallePage]  = useState(0);

  const labelCampana = campanaNombre ?? 'Todas las campañas';
  const clienteData = data.ventasPorCliente.slice(0, 10).map(r => ({
    ...r,
    totalUSD: (r.usd2024 || 0) + (r.usd2025 || 0),
    totalPEN: (r.pen2024 || 0) + (r.pen2025 || 0),
  }));

  const mensualData = (() => {
    const map = new Map(data.ventasMensuales.map(r => [r.mes, r]));
    return Array.from({ length: 12 }, (_, i) => {
      const mes = String(i + 1).padStart(2, '0');
      const row = map.get(mes) ?? { mes, usd2024: 0, usd2025: 0, pen2024: 0, pen2025: 0 };
      return {
        mes: MESES[i],
        totalUSD: (row.usd2024 || 0) + (row.usd2025 || 0),
        totalPEN: (row.pen2024 || 0) + (row.pen2025 || 0),
      };
    });
  })();

  const totalUSDFiltrado = data.totalUSD;
  const totalPENFiltrado = data.totalPEN;

  const skusDisponibles = Array.from(new Set(data.detalle2025.map(r => r.sku ?? '—').filter(s => s !== '—')));

  const detalleBase = filtroSku
    ? data.detalle2025.filter(r => (r.sku ?? '—') === filtroSku)
    : data.detalle2025;
  const detalleTotalPages = Math.ceil(detalleBase.length / 5);
  const detalleSafePage   = Math.min(detallePage, Math.max(0, detalleTotalPages - 1));
  const detalle           = detalleBase.slice(detalleSafePage * 5, (detalleSafePage + 1) * 5);
  const totalKgDetalle    = detalleBase.reduce((s, r) => s + r.kgVendidos, 0);
  const totalUSDDetalle   = detalleBase.reduce((s, r) => s + r.valorUSD, 0);
  const totalPENDetalle   = detalleBase.reduce((s, r) => s + r.valorPEN, 0);

  return (
    <div className="flex flex-col gap-5">
      {skusDisponibles.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[0.6rem] font-bold uppercase tracking-[0.14em]" style={{ color: '#7A9A7C' }}>SKU:</span>
          <button
            onClick={() => setFiltroSku(null)}
            className="px-3 py-1 rounded-full text-[0.65rem] font-bold transition-all"
            style={{ background: filtroSku === null ? '#445D46' : '#EFF2EF', color: filtroSku === null ? '#fff' : '#7A9A7C' }}
          >
            Todos
          </button>
          {skusDisponibles.map(s => (
            <button
              key={s}
              onClick={() => setFiltroSku(filtroSku === s ? null : s)}
              className="px-3 py-1 rounded-full text-[0.65rem] font-bold transition-all"
              style={{ background: filtroSku === s ? '#445D46' : '#EFF2EF', color: filtroSku === s ? '#fff' : '#7A9A7C' }}
            >
              {s}
            </button>
          ))}
        </div>
      )}

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <ChartCard title="Ventas por Cliente">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={clienteData} margin={{ top: 4, right: 8, left: 0, bottom: 80 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={BD} />
            <XAxis dataKey="cliente" tick={{ fontSize: 9, fill: '#96A897' }} angle={-35} textAnchor="end" interval={0} />
            <YAxis tick={{ fontSize: 10, fill: '#96A897' }} width={72} tickFormatter={v => (v / 1000).toFixed(0) + 'k'} />
            <Tooltip content={<CustomTooltipVentas />} />
            <Bar dataKey="totalUSD" name="USD" fill={CP}        radius={[4,4,0,0]} />
            <Bar dataKey="totalPEN" name="S/." fill={PEN_COLOR} radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
        <div className="flex items-center justify-center gap-5 mt-3 text-[0.65rem]" style={{ color: '#7A9A7C' }}>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: CP }} />
            USD
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: PEN_COLOR }} />
            S/.
          </span>
        </div>
      </ChartCard>

      <ChartCard title="Evolución Mensual">
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={mensualData} margin={{ top: 4, right: 8, left: 0, bottom: 4 }}>
            <defs>
              <linearGradient id="gradUSD25" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={CP} stopOpacity={0.3} /><stop offset="95%" stopColor={CP} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradPEN25" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={PEN_COLOR} stopOpacity={0.3} /><stop offset="95%" stopColor={PEN_COLOR} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={BD} />
            <XAxis dataKey="mes" tick={{ fontSize: 10, fill: '#96A897' }} />
            <YAxis tick={{ fontSize: 10, fill: '#96A897' }} width={64} tickFormatter={v => (v / 1000).toFixed(0) + 'k'} />
            <Tooltip content={<CustomTooltipVentas />} />
            <Area type="monotone" dataKey="totalUSD" name="USD" stroke={CP} strokeWidth={2} fill="url(#gradUSD25)" dot={false} />
            <Area type="monotone" dataKey="totalPEN" name="S/." stroke={PEN_COLOR} strokeWidth={2} fill="url(#gradPEN25)" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
        <div className="flex items-center justify-center gap-5 mt-3 text-[0.65rem]" style={{ color: '#7A9A7C' }}>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: CP }} />
            USD
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: PEN_COLOR }} />
            S/.
          </span>
        </div>
      </ChartCard>

      <ChartCard title={`Pareto Lotes Vendidos — ${labelCampana} (% Volumen)`}>
        <ParetoChart data={data.paretoProductos2025} />
      </ChartCard>

      <div className="rounded-2xl overflow-hidden flex flex-col" style={{ background: '#fff', boxShadow: CARD_SHADOW }}>
        <div className="px-5 pt-5 pb-3 flex items-start justify-between gap-3 flex-wrap">
          <p className="text-[0.6rem] font-bold uppercase tracking-[0.14em]" style={{ color: '#7A9A7C' }}>
            Detalle Ventas — {labelCampana}
          </p>
          <div className="flex flex-col items-end gap-0.5">
            {totalUSDFiltrado > 0 && (
              <span className="text-[0.65rem] font-bold" style={{ color: CP }}>{fmtUSD(totalUSDFiltrado)}</span>
            )}
            {totalPENFiltrado > 0 && (
              <span className="text-[0.65rem] font-bold" style={{ color: PEN_COLOR }}>{fmtPEN(totalPENFiltrado)}</span>
            )}
          </div>
        </div>
        <div className="overflow-auto flex-1">
          <table className="w-full text-xs">
            <thead>
              <tr style={{ background: '#EFF2EF' }}>
                {['Tipo', 'Mercado', 'SKU', 'Kg', 'USD', 'S/.'].map(h => (
                  <th key={h} className="px-4 py-3 text-center whitespace-nowrap font-bold"
                    style={{ color: '#7A9A7C', letterSpacing: '0.05em', fontSize: '0.6rem', textTransform: 'uppercase' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {detalle.map((r, i) => (
                <tr key={r.id_lote + r.tipo + i} className="transition-colors hover:bg-green-50/50" style={{ borderTop: `1px solid ${BD}` }}>
                  <td className="px-4 py-2 text-center whitespace-nowrap" style={{ color: '#7A9A7C' }}>{r.tipo}</td>
                  <td className="px-4 py-2 text-center whitespace-nowrap">
                    {r.mercado ? (
                      <span className={`px-2 py-0.5 rounded-full text-[0.58rem] font-bold ${r.mercado === 'INTERNACIONAL' ? 'bg-sky-50 text-sky-700' : 'bg-green-50 text-green-700'}`}>
                        {r.mercado === 'INTERNACIONAL' ? 'Intl.' : 'Nac.'}
                      </span>
                    ) : '—'}
                  </td>
                  <td className="px-4 py-2 text-center font-semibold whitespace-nowrap" style={{ color: TX }}>{r.sku ?? '—'}</td>
                  <td className="px-4 py-2 text-center tabular-nums" style={{ color: TX }}>{fmtKg(r.kgVendidos)}</td>
                  <td className="px-4 py-2 text-center font-bold tabular-nums" style={{ color: r.valorUSD > 0 ? CP : '#ccc' }}>
                    {r.valorUSD > 0 ? fmtUSD(r.valorUSD) : '—'}
                  </td>
                  <td className="px-4 py-2 text-center font-bold tabular-nums" style={{ color: r.valorPEN > 0 ? PEN_COLOR : '#ccc' }}>
                    {r.valorPEN > 0 ? fmtPEN(r.valorPEN) : '—'}
                  </td>
                </tr>
              ))}
              <tr style={{ background: '#EFF2EF', borderTop: `2px solid ${BD}` }}>
                <td className="px-4 py-2.5 text-center font-bold" colSpan={3} style={{ color: TX }}>Total — {labelCampana}</td>
                <td className="px-4 py-2.5 text-center font-bold tabular-nums" style={{ color: TX }}>{fmtKg(totalKgDetalle)}</td>
                <td className="px-4 py-2.5 text-center font-black tabular-nums" style={{ color: CP }}>{fmtUSD(totalUSDDetalle)}</td>
                <td className="px-4 py-2.5 text-center font-black tabular-nums" style={{ color: PEN_COLOR }}>{fmtPEN(totalPENDetalle)}</td>
              </tr>
            </tbody>
          </table>
        </div>
        {detalleTotalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3" style={{ borderTop: `1px solid ${BD}` }}>
            <button
              onClick={() => setDetallePage(p => Math.max(0, p - 1))}
              disabled={detalleSafePage === 0}
              className="px-3 py-1.5 rounded-lg text-[0.65rem] font-semibold disabled:opacity-40 transition-colors"
              style={{ backgroundColor: '#F0F4F0', color: '#7A9A7C' }}
            >
              ← Anterior
            </button>
            <span className="text-[0.65rem]" style={{ color: '#96A897' }}>
              {detalleSafePage + 1} / {detalleTotalPages} · {detalleBase.length} ventas
            </span>
            <button
              onClick={() => setDetallePage(p => Math.min(detalleTotalPages - 1, p + 1))}
              disabled={detalleSafePage >= detalleTotalPages - 1}
              className="px-3 py-1.5 rounded-lg text-[0.65rem] font-semibold disabled:opacity-40 transition-colors"
              style={{ backgroundColor: '#F0F4F0', color: '#7A9A7C' }}
            >
              Siguiente →
            </button>
          </div>
        )}
      </div>

      <div className="lg:col-span-2">
        <ChartCard title="Distribución por Mercado">
          {(!data.ventasPorMercado || data.ventasPorMercado.length === 0) ? (
            <p className="text-xs text-center py-6" style={{ color: '#96A897' }}>Sin datos de mercado — asigna mercado en cada orden de venta</p>
          ) : (
            <div className="flex flex-wrap gap-4">
              {data.ventasPorMercado.map(r => {
                const color = r.mercado === 'INTERNACIONAL' ? '#7A8C9C' : '#6B8472';
                const label = r.mercado === 'INTERNACIONAL' ? 'Internacional' : 'Nacional';
                const usePEN = r.montoUSD === 0 && r.montoPEN > 0;
                const primaryAmt = usePEN ? fmtPEN(r.montoPEN) : fmtUSD(r.montoUSD);
                const totalPrimary = usePEN
                  ? data.ventasPorMercado.reduce((s, x) => s + x.montoPEN, 0)
                  : data.ventasPorMercado.reduce((s, x) => s + x.montoUSD, 0);
                const primaryVal = usePEN ? r.montoPEN : r.montoUSD;
                const pct = totalPrimary > 0 ? ((primaryVal / totalPrimary) * 100).toFixed(1) : '0.0';
                const pctLabel = usePEN ? '% del total PEN' : '% del total USD';
                return (
                  <div key={r.mercado} className="flex-1 min-w-[180px] rounded-xl p-4" style={{ background: color + '12', border: `1px solid ${color}25` }}>
                    <p className="text-[0.6rem] font-bold uppercase tracking-widest mb-2" style={{ color }}>{label}</p>
                    <p className="text-lg font-black tabular-nums" style={{ color: TX }}>{primaryAmt}</p>
                    <p className="text-xs mt-1" style={{ color: '#96A897' }}>{fmtKg(r.kg)} · {pct}{pctLabel}</p>
                    {usePEN && r.montoUSD > 0 && (
                      <p className="text-xs mt-0.5" style={{ color: '#7A8C9C' }}>{fmtUSD(r.montoUSD)}</p>
                    )}
                    {!usePEN && r.montoPEN > 0 && (
                      <p className="text-xs mt-0.5" style={{ color: PEN_COLOR }}>{fmtPEN(r.montoPEN)}</p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </ChartCard>
      </div>

      {data.ventasPorSku && data.ventasPorSku.length > 0 && (
        <div className="lg:col-span-2">
          <ChartCard title="Distribución por SKU">
            <div className="flex flex-wrap gap-4">
              {data.ventasPorSku.filter(r => r.sku !== '—').map((r, i) => {
                const COLORS = ['#445D46', '#6B8F71', '#7A9A7C', '#96A897'];
                const color = COLORS[i % COLORS.length];
                const totalUSD = data.ventasPorSku.reduce((s, x) => s + x.montoUSD, 0);
                const pct = totalUSD > 0 ? ((r.montoUSD / totalUSD) * 100).toFixed(1) : '0.0';
                return (
                  <div
                    key={r.sku}
                    className="flex-1 min-w-[200px] rounded-xl p-4 cursor-pointer transition-all"
                    style={{
                      background: color + '10',
                      border: `1px solid ${color}${filtroSku === r.sku ? '80' : '25'}`,
                      boxShadow: filtroSku === r.sku ? `0 0 0 2px ${color}40` : 'none',
                    }}
                    onClick={() => setFiltroSku(filtroSku === r.sku ? null : r.sku)}
                  >
                    <p className="text-[0.6rem] font-bold uppercase tracking-widest mb-2" style={{ color }}>{r.sku}</p>
                    <p className="text-lg font-black tabular-nums" style={{ color: TX }}>{fmtUSD(r.montoUSD)}</p>
                    <p className="text-xs mt-1" style={{ color: '#96A897' }}>{fmtKg(r.kg)} · {pct}% del total</p>
                    {r.montoPEN > 0 && (
                      <p className="text-xs mt-0.5" style={{ color: PEN_COLOR }}>{fmtPEN(r.montoPEN)}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </ChartCard>
        </div>
      )}
    </div>
    </div>
  );
}
