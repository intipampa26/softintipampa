import { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, ResponsiveContainer,
} from 'recharts';
import type { AcopioResumen } from '@/types/dashboard.types';

const CP = '#6B8472';
const CS = '#8A9E8A';
const CL = '#A8B8A8';
const BD = '#E8EDE8';
const TX = '#2C2C2C';

const CARD_SHADOW = '0 1px 3px rgba(68,93,70,0.06), 0 4px 12px rgba(68,93,70,0.04)';

const COLORES_PIE = [
  '#7A8C9C', '#9C8468', '#8A9E8A', '#A09078', '#9088A0',
  '#8A9CB0', '#B0926E', '#8090A0', '#9E8A7A', '#7A9080',
  '#A08890', '#8AA090', '#9C9070', '#7890A0', '#A08070',
  '#90A08A', '#9A8878', '#8098A0',
];
const COLORES_ALMACEN: Record<string, string> = {
  'CB JAEN':     '#8A9E8A',
  'CB LIMA':     '#A09078',
  'EXPOCAFÉ':    '#9088A0',
  'KUSKA':       '#6B8472',
  'MEGO':        '#9C8468',
  'SELVA NORTE': '#7A8C9C',
  'AICASA':      '#A08878',
  'NORANDINO':   '#8A9CB0',
  'NEGRISA':     '#8A8A9C',
  'OTRO':        '#B0A898',
  'Sin almacén': '#C0C0BC',
};

const fmt = (n: number) => n.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const ChartCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div
    className="rounded-2xl p-5"
    style={{ background: '#fff', boxShadow: CARD_SHADOW }}
  >
    <p
      className="text-[0.6rem] font-bold uppercase tracking-[0.14em] mb-4"
      style={{ color: '#7A9A7C' }}
    >
      {title}
    </p>
    {children}
  </div>
);

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
          <span className="w-2 h-2 rounded-sm inline-block shrink-0" style={{ background: p.color ?? p.fill }} />
          <span style={{ color: '#7A9A7C' }}>{p.name}:</span>
          <strong>{fmt(p.value)} kg</strong>
        </p>
      ))}
    </div>
  );
};

interface Props {
  data: AcopioResumen;
  almacen: string;
}

export function AcopioSection({ data, almacen }: Props) {
  const [top10Tipo,         setTop10Tipo]         = useState<'productor' | 'variedad' | 'zona'>('productor');
  const [top10Mes,          setTop10Mes]          = useState('');
  const [acopioMesFiltro,   setAcopioMesFiltro]   = useState('');
  const [muestrasTipo,      setMuestrasTipo]      = useState<'mes' | 'productor' | 'variedad' | 'zona'>('mes');
  const [muestrasMesFiltro, setMuestrasMesFiltro] = useState('');

  const almacenData = almacen === 'todos'
    ? data.kgPorAlmacen
    : data.kgPorAlmacen.filter(r => r.almacen === almacen);

  const top10Data = (() => {
    const raw = top10Tipo === 'productor'
      ? (data.top10PorProductor ?? [])
      : top10Tipo === 'variedad'
        ? (data.top10PorVariedad ?? [])
        : (data.top10PorZona ?? []);
    const filtered = top10Mes ? raw.filter(r => r.mes === top10Mes) : raw;
    const agg = new Map<string, number>();
    filtered.forEach(r => agg.set(r.nombre, (agg.get(r.nombre) ?? 0) + r.total));
    return Array.from(agg.entries())
      .map(([nombre, total]) => ({ nombre, total }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 10);
  })();

  const variedadCafe = data.kgPorVariedad
    .filter(r => r.tipo === 'CAFE')
    .map(r => ({ ...r, valor: r.total }))
    .filter(r => r.valor > 0)
    .slice(0, 12);

  const variedadCacao = data.kgPorVariedad
    .filter(r => r.tipo === 'CACAO')
    .map(r => ({ ...r, valor: r.total }))
    .filter(r => r.valor > 0)
    .slice(0, 12);

  const MESES = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
  const fmtN = (v: number | null) => v != null ? v.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '—';

  const kgMesData = (() => {
    const porMes = new Map<string, { mes: string; total: number; porAlmacen: Record<string, number> }>();
    (data.kgPorMes ?? []).forEach(r => {
      if (!porMes.has(r.mes)) porMes.set(r.mes, { mes: r.mes, total: 0, porAlmacen: {} });
      const e = porMes.get(r.mes)!;
      e.total += r.total;
      e.porAlmacen[r.almacen] = (e.porAlmacen[r.almacen] ?? 0) + r.total;
    });
    return Array.from({ length: 12 }, (_, i) => {
      const mes = String(i + 1).padStart(2, '0');
      return porMes.get(mes) ?? { mes, total: 0, porAlmacen: {} };
    }).filter(r => r.total > 0);
  })();

  const almacenesUnicos = [...new Set((data.kgPorMes ?? []).map(r => r.almacen))];

  const muestrasTipoRows = (() => {
    if (muestrasTipo === 'mes') return null;
    const raw = muestrasTipo === 'productor'
      ? (data.muestrasPorProductorMes ?? [])
      : muestrasTipo === 'variedad'
        ? (data.muestrasPorVariedadMes ?? [])
        : (data.muestrasPorZonaMes ?? []);
    const filtered = muestrasMesFiltro ? raw.filter(r => r.mes === muestrasMesFiltro) : raw;
    const agg = new Map<string, { conteo: number; fisico: number[]; sensorial: number[]; rend: number[]; hum: number[] }>();
    filtered.forEach(r => {
      if (!agg.has(r.nombre)) agg.set(r.nombre, { conteo: 0, fisico: [], sensorial: [], rend: [], hum: [] });
      const e = agg.get(r.nombre)!;
      e.conteo += r.conteo;
      if (r.avgFisico != null) e.fisico.push(r.avgFisico);
      if (r.avgSensorial != null) e.sensorial.push(r.avgSensorial);
      if (r.avgRendimiento != null) e.rend.push(r.avgRendimiento);
      if (r.avgHumedad != null) e.hum.push(r.avgHumedad);
    });
    const avg = (arr: number[]) => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : null;
    return Array.from(agg.entries()).map(([nombre, d]) => ({
      nombre,
      conteo: d.conteo,
      avgFisico: avg(d.fisico),
      avgSensorial: avg(d.sensorial),
      avgRendimiento: avg(d.rend),
      avgHumedad: avg(d.hum),
    }));
  })();

  return (
    <div className="flex flex-col gap-5">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <ChartCard title="Acopio por Almacén (kg)">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={almacenData} margin={{ top: 4, right: 8, left: 0, bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={BD} />
            <XAxis dataKey="almacen" tick={{ fontSize: 10, fill: '#96A897' }} angle={-25} textAnchor="end" interval={0} />
            <YAxis tick={{ fontSize: 10, fill: '#96A897' }} width={60} tickFormatter={v => v.toLocaleString('es-PE')} />
            <Tooltip content={<CustomTooltip />} />
            <Legend iconSize={8} wrapperStyle={{ fontSize: 11, color: '#7A9A7C' }} />
            <Bar dataKey="total" name="Total" radius={[4,4,0,0]}>
              {almacenData.map((entry, i) => (
                <Cell key={i} fill={COLORES_ALMACEN[entry.almacen] ?? COLORES_PIE[i % COLORES_PIE.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Top 10 · Acopio por">
        <div className="flex flex-wrap gap-1.5 mb-3">
          {(['productor', 'variedad', 'zona'] as const).map(t => (
            <button key={t} onClick={() => setTop10Tipo(t)}
              className="px-2.5 py-1 rounded-lg text-[0.65rem] font-bold uppercase tracking-wide transition-colors"
              style={top10Tipo === t
                ? { backgroundColor: '#2d5a3d', color: '#fff' }
                : { backgroundColor: '#F0F4F0', color: '#7A9A7C' }}>
              {t === 'productor' ? 'Productor' : t === 'variedad' ? 'Variedad' : 'Zona'}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-1 mb-4">
          <button onClick={() => setTop10Mes('')}
            className="px-2 py-0.5 rounded-lg text-[0.6rem] font-semibold transition-colors"
            style={top10Mes === '' ? { backgroundColor: CP, color: '#fff' } : { backgroundColor: '#F0F4F0', color: '#96A897' }}>
            Todos
          </button>
          {MESES.map((m, i) => {
            const v = String(i + 1).padStart(2, '0');
            return (
              <button key={v} onClick={() => setTop10Mes(top10Mes === v ? '' : v)}
                className="px-2 py-0.5 rounded-lg text-[0.6rem] font-semibold transition-colors"
                style={top10Mes === v ? { backgroundColor: CP, color: '#fff' } : { backgroundColor: '#F0F4F0', color: '#96A897' }}>
                {m}
              </button>
            );
          })}
        </div>
        {top10Data.length === 0 ? (
          <div className="flex items-center justify-center py-12 text-xs" style={{ color: '#96A897' }}>
            Sin datos para el filtro seleccionado
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={Math.max(180, top10Data.length * 32)}>
            <BarChart data={top10Data} layout="vertical" margin={{ top: 4, right: 16, left: 4, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={BD} horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10, fill: '#96A897' }} tickFormatter={v => v.toLocaleString('es-PE')} />
              <YAxis dataKey="nombre" type="category" tick={{ fontSize: 8, fill: '#96A897' }} width={140} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="total" name="kg" radius={[0,4,4,0]}>
                {top10Data.map((_, i) => (
                  <Cell key={i} fill={COLORES_PIE[i % COLORES_PIE.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </ChartCard>

      <ChartCard title="Café · Variedades">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <ResponsiveContainer width={200} height={200}>
            <PieChart>
              <Pie data={variedadCafe} dataKey="valor" nameKey="variedad" cx="50%" cy="50%" outerRadius={88} innerRadius={52} paddingAngle={2}>
                {variedadCafe.map((_, i) => <Cell key={i} fill={COLORES_PIE[i % COLORES_PIE.length]} />)}
              </Pie>
              <Tooltip formatter={(v: number) => [fmt(v) + ' kg', '']} contentStyle={{ borderRadius: 12, border: `1px solid ${BD}`, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex-1 grid grid-cols-1 gap-y-1.5">
            {variedadCafe.map((r, i) => (
              <div key={r.variedad} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: COLORES_PIE[i % COLORES_PIE.length] }} />
                <span className="truncate flex-1 text-xs" style={{ color: '#7A9A7C' }}>{r.variedad}</span>
                <span className="text-xs font-bold shrink-0" style={{ color: TX }}>{fmt(r.valor)}</span>
              </div>
            ))}
          </div>
        </div>
      </ChartCard>

      <ChartCard title="Cacao · Variedades">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <ResponsiveContainer width={200} height={200}>
            <PieChart>
              <Pie data={variedadCacao} dataKey="valor" nameKey="variedad" cx="50%" cy="50%" outerRadius={88} innerRadius={52} paddingAngle={2}>
                {variedadCacao.map((_, i) => <Cell key={i} fill={COLORES_PIE[i % COLORES_PIE.length]} />)}
              </Pie>
              <Tooltip formatter={(v: number) => [fmt(v) + ' kg', '']} contentStyle={{ borderRadius: 12, border: `1px solid ${BD}`, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex-1 grid grid-cols-1 gap-y-1.5">
            {variedadCacao.map((r, i) => (
              <div key={r.variedad} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: COLORES_PIE[i % COLORES_PIE.length] }} />
                <span className="truncate flex-1 text-xs" style={{ color: '#7A9A7C' }}>{r.variedad}</span>
                <span className="text-xs font-bold shrink-0" style={{ color: TX }}>{fmt(r.valor)}</span>
              </div>
            ))}
          </div>
        </div>
      </ChartCard>
    </div>

    <ChartCard title="Acopio por Mes · Zona (kg)">
      {kgMesData.length === 0 ? (
        <p className="text-xs text-center py-6" style={{ color: '#96A897' }}>Sin datos mensuales</p>
      ) : (
        <>
          <div className="flex flex-wrap gap-1 mb-4">
            <button onClick={() => setAcopioMesFiltro('')}
              className="px-2 py-0.5 rounded-lg text-[0.6rem] font-semibold transition-colors"
              style={acopioMesFiltro === '' ? { backgroundColor: CP, color: '#fff' } : { backgroundColor: '#F0F4F0', color: '#96A897' }}>
              Todos
            </button>
            {kgMesData.map(r => (
              <button key={r.mes} onClick={() => setAcopioMesFiltro(acopioMesFiltro === r.mes ? '' : r.mes)}
                className="px-2 py-0.5 rounded-lg text-[0.6rem] font-semibold transition-colors"
                style={acopioMesFiltro === r.mes ? { backgroundColor: CP, color: '#fff' } : { backgroundColor: '#F0F4F0', color: '#96A897' }}>
                {MESES[parseInt(r.mes, 10) - 1]}
              </button>
            ))}
          </div>
          <div className="overflow-auto">
            <table className="w-full text-xs">
              <thead>
                <tr style={{ background: '#EFF2EF' }}>
                  <th className="px-3 py-2.5 text-left font-bold" style={{ color: '#7A9A7C', fontSize: '0.6rem', textTransform: 'uppercase' }}>Mes</th>
                  {almacenesUnicos.map(a => (
                    <th key={a} className="px-3 py-2.5 text-center font-bold whitespace-nowrap" style={{ color: '#7A9A7C', fontSize: '0.6rem', textTransform: 'uppercase' }}>{a}</th>
                  ))}
                  <th className="px-3 py-2.5 text-center font-bold" style={{ color: '#7A9A7C', fontSize: '0.6rem', textTransform: 'uppercase' }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {kgMesData.filter(r => !acopioMesFiltro || r.mes === acopioMesFiltro).map((r, i) => (
                  <tr key={r.mes} style={{ borderTop: '1px solid #E8EDE8', background: i % 2 === 0 ? '#fff' : '#F7F8F7' }}>
                    <td className="px-3 py-2 font-semibold" style={{ color: '#2C2C2C' }}>{MESES[parseInt(r.mes, 10) - 1]}</td>
                    {almacenesUnicos.map(a => (
                      <td key={a} className="px-3 py-2 text-center tabular-nums" style={{ color: '#7A9A7C' }}>
                        {r.porAlmacen[a] ? fmt(r.porAlmacen[a]) : '—'}
                      </td>
                    ))}
                    <td className="px-3 py-2 text-center font-bold tabular-nums" style={{ color: '#2C2C2C' }}>{fmt(r.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </ChartCard>

    <ChartCard title="Muestras · Evaluaciones por">
      {(data.muestrasPorMes ?? []).length === 0 ? (
        <p className="text-xs text-center py-6" style={{ color: '#96A897' }}>Sin datos de muestras</p>
      ) : (
        <>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {(['mes', 'productor', 'variedad', 'zona'] as const).map(t => (
              <button key={t} onClick={() => setMuestrasTipo(t)}
                className="px-2.5 py-1 rounded-lg text-[0.65rem] font-bold uppercase tracking-wide transition-colors"
                style={muestrasTipo === t
                  ? { backgroundColor: '#2d5a3d', color: '#fff' }
                  : { backgroundColor: '#F0F4F0', color: '#7A9A7C' }}>
                {t === 'mes' ? 'Mes' : t === 'productor' ? 'Productor' : t === 'variedad' ? 'Variedad' : 'Zona'}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-1 mb-4">
            <button onClick={() => setMuestrasMesFiltro('')}
              className="px-2 py-0.5 rounded-lg text-[0.6rem] font-semibold transition-colors"
              style={muestrasMesFiltro === '' ? { backgroundColor: CP, color: '#fff' } : { backgroundColor: '#F0F4F0', color: '#96A897' }}>
              Todos
            </button>
            {(data.muestrasPorMes ?? []).map(r => (
              <button key={r.mes} onClick={() => setMuestrasMesFiltro(muestrasMesFiltro === r.mes ? '' : r.mes)}
                className="px-2 py-0.5 rounded-lg text-[0.6rem] font-semibold transition-colors"
                style={muestrasMesFiltro === r.mes ? { backgroundColor: CP, color: '#fff' } : { backgroundColor: '#F0F4F0', color: '#96A897' }}>
                {MESES[parseInt(r.mes, 10) - 1]}
              </button>
            ))}
          </div>
          <div className="overflow-auto">
            <table className="w-full text-xs">
              <thead>
                <tr style={{ background: '#EFF2EF' }}>
                  {[
                    muestrasTipo === 'mes' ? 'Mes' : muestrasTipo === 'productor' ? 'Productor' : muestrasTipo === 'variedad' ? 'Variedad' : 'Zona',
                    'Muestras','Prom. Físico','Prom. Sensorial','Prom. Rend.','Prom. Humedad',
                  ].map(h => (
                    <th key={h} className="px-3 py-2.5 text-center font-bold whitespace-nowrap" style={{ color: '#7A9A7C', fontSize: '0.6rem', textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {muestrasTipo === 'mes'
                  ? (data.muestrasPorMes ?? []).filter(r => !muestrasMesFiltro || r.mes === muestrasMesFiltro).map((r, i) => (
                    <tr key={r.mes} style={{ borderTop: '1px solid #E8EDE8', background: i % 2 === 0 ? '#fff' : '#F7F8F7' }}>
                      <td className="px-3 py-2 text-center font-semibold" style={{ color: '#2C2C2C' }}>{MESES[parseInt(r.mes, 10) - 1]}</td>
                      <td className="px-3 py-2 text-center font-bold tabular-nums" style={{ color: CP }}>{r.conteo}</td>
                      <td className="px-3 py-2 text-center tabular-nums" style={{ color: '#2C2C2C' }}>{fmtN(r.avgFisico)}</td>
                      <td className="px-3 py-2 text-center tabular-nums" style={{ color: '#2C2C2C' }}>{fmtN(r.avgSensorial)}</td>
                      <td className="px-3 py-2 text-center tabular-nums" style={{ color: '#2C2C2C' }}>{fmtN(r.avgRendimiento)}</td>
                      <td className="px-3 py-2 text-center tabular-nums" style={{ color: '#2C2C2C' }}>{fmtN(r.avgHumedad)}</td>
                    </tr>
                  ))
                  : (muestrasTipoRows ?? []).length === 0
                    ? (
                      <tr>
                        <td colSpan={6} className="px-3 py-8 text-center text-xs" style={{ color: '#96A897' }}>Sin datos para el filtro seleccionado</td>
                      </tr>
                    )
                    : (muestrasTipoRows ?? []).map((r, i) => (
                      <tr key={r.nombre} style={{ borderTop: '1px solid #E8EDE8', background: i % 2 === 0 ? '#fff' : '#F7F8F7' }}>
                        <td className="px-3 py-2 font-semibold max-w-[180px] truncate" style={{ color: '#2C2C2C' }}>{r.nombre}</td>
                        <td className="px-3 py-2 text-center font-bold tabular-nums" style={{ color: CP }}>{r.conteo}</td>
                        <td className="px-3 py-2 text-center tabular-nums" style={{ color: '#2C2C2C' }}>{fmtN(r.avgFisico)}</td>
                        <td className="px-3 py-2 text-center tabular-nums" style={{ color: '#2C2C2C' }}>{fmtN(r.avgSensorial)}</td>
                        <td className="px-3 py-2 text-center tabular-nums" style={{ color: '#2C2C2C' }}>{fmtN(r.avgRendimiento)}</td>
                        <td className="px-3 py-2 text-center tabular-nums" style={{ color: '#2C2C2C' }}>{fmtN(r.avgHumedad)}</td>
                      </tr>
                    ))
                }
              </tbody>
            </table>
          </div>
        </>
      )}
    </ChartCard>

    </div>
  );
}
