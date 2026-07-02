import { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ReferenceLine, Cell, ResponsiveContainer,
} from 'recharts';
import type { TrillaResumen } from '@/types/dashboard.types';

const CP = '#6B8472';
const CL = '#A8B8A8';
const BD = '#E8EDE8';
const TX = '#2C2C2C';
const C_BAJO = '#B08878';

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
  almacen: string;
}

type FiltroTipo = 'todos' | 'CAFE' | 'CACAO';

export function TrillaSection({ data, almacen }: Props) {
  const [filtroTipo, setFiltroTipo] = useState<FiltroTipo>('todos');
  const [page, setPage] = useState(0);

  const lotesAll = (almacen === 'todos'
    ? data.detallePorLote
    : data.detallePorLote.filter(r => r.almacen === almacen)
  )
    .filter(r => r.rendimientoTotal > 0)
    .filter(r => filtroTipo === 'todos' || (r.tipo ?? '').toUpperCase().includes(filtroTipo));

  const totalPages = Math.ceil(lotesAll.length / 5);
  const safePage = Math.min(page, Math.max(0, totalPages - 1));
  const lotesPaged = lotesAll.slice(safePage * 5, (safePage + 1) * 5);

  const chartData = lotesAll.slice(0, 25).map(r => ({
    nombre: r.productorNombre?.trim()
      ? `${r.productorNombre.trim()}${r.variedad && r.variedad !== 'Sin variedad' ? ' · ' + r.variedad : ''}`
      : r.nombre || r.id_lote,
    rendTotal: r.rendimientoTotal,
  }));

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-2">
        {(['todos', 'CAFE', 'CACAO'] as const).map(t => (
          <button
            key={t}
            onClick={() => setFiltroTipo(t)}
            className="px-3 py-1.5 rounded-full text-[0.65rem] font-bold transition-all"
            style={{
              background: filtroTipo === t ? CP : '#EFF2EF',
              color: filtroTipo === t ? '#fff' : '#7A9A7C',
            }}
          >
            {t === 'todos' ? 'Todos' : t === 'CAFE' ? 'Café' : 'Cacao'}
          </button>
        ))}
      </div>
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
              stroke="#9C8468"
              strokeDasharray="5 3"
              strokeWidth={1.5}
              label={{ value: `${fmt(data.rendimientoPromedio)}%`, position: 'insideTopRight', fontSize: 10, fill: '#9C8468', dy: -8 }}
            />
            <Bar dataKey="rendTotal" name="Rendimiento" radius={[4,4,0,0]}>
              {chartData.map((entry, i) => (
                <Cell key={i} fill={entry.rendTotal >= 80 ? CP : C_BAJO} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="flex items-center gap-5 mt-3 text-[0.65rem]" style={{ color: '#7A9A7C' }}>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm inline-block" style={{ background: CP }} />
            ≥ 80%
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm inline-block" style={{ background: C_BAJO }} />
            &lt; 80%
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-5 border-t-2 border-dashed inline-block" style={{ borderColor: '#9C8468' }} />
            Promedio
          </span>
        </div>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ background: '#fff', boxShadow: CARD_SHADOW }}>
        <div className="overflow-auto">
          <table className="w-full text-xs">
            <thead>
              <tr style={{ background: '#EFF2EF' }}>
                {['Productor / Variedad', 'Tipo', 'Zona', 'Rend. Total'].map(h => (
                  <th
                    key={h}
                    className="px-4 py-3 text-center font-bold whitespace-nowrap"
                    style={{ color: '#7A9A7C', letterSpacing: '0.05em', fontSize: '0.6rem', textTransform: 'uppercase' }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {lotesPaged.map((r, i) => (
                <tr
                  key={r.id_lote + i}
                  className="transition-colors hover:bg-green-50/50"
                  style={{ borderTop: `1px solid ${BD}` }}
                >
                  <td className="px-4 py-2.5 text-left">
                    <span className="font-semibold block" style={{ color: TX }}>
                      {r.productorNombre?.trim() || r.nombre || r.id_lote}
                    </span>
                    {r.variedad && r.variedad !== 'Sin variedad' && (
                      <span className="text-[0.6rem]" style={{ color: '#7A9A7C' }}>{r.variedad}</span>
                    )}
                  </td>
                  <td className="px-4 py-2.5 text-center whitespace-nowrap" style={{ color: '#7A9A7C' }}>
                    {r.tipo === 'CAFE' ? 'Café' : r.tipo === 'CACAO' ? 'Cacao' : r.tipo}
                  </td>
                  <td className="px-4 py-2.5 text-center whitespace-nowrap" style={{ color: '#7A9A7C' }}>{r.almacen}</td>
                  <td className="px-4 py-2.5 text-center font-black tabular-nums"
                    style={{ color: r.rendimientoTotal >= 80 ? CP : C_BAJO }}>
                    {fmt(r.rendimientoTotal)}%
                  </td>
                </tr>
              ))}
              <tr style={{ background: '#EFF2EF', borderTop: `2px solid ${BD}` }}>
                <td className="px-4 py-2.5 text-center font-bold" colSpan={3} style={{ color: TX }}>Promedio general</td>
                <td className="px-4 py-2.5 text-center font-black tabular-nums"
                  style={{ color: data.rendimientoPromedio >= 80 ? CP : C_BAJO }}>
                  {fmt(data.rendimientoPromedio)}%
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3" style={{ borderTop: `1px solid ${BD}` }}>
            <button
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={safePage === 0}
              className="px-3 py-1.5 rounded-lg text-[0.65rem] font-semibold disabled:opacity-40 transition-colors"
              style={{ backgroundColor: '#F0F4F0', color: '#7A9A7C' }}
            >
              ← Anterior
            </button>
            <span className="text-[0.65rem]" style={{ color: '#96A897' }}>
              {safePage + 1} / {totalPages} · {lotesAll.length} lotes
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={safePage >= totalPages - 1}
              className="px-3 py-1.5 rounded-lg text-[0.65rem] font-semibold disabled:opacity-40 transition-colors"
              style={{ backgroundColor: '#F0F4F0', color: '#7A9A7C' }}
            >
              Siguiente →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
