import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, ResponsiveContainer,
} from 'recharts';
import type { AcopioResumen, FiltroAño } from '@/types/dashboard.types';

const CP = '#445D46';
const CS = '#5F7A61';
const CL = '#8BA989';
const BD = '#E8EDE8';
const TX = '#2C2C2C';

const CARD_SHADOW = '0 1px 3px rgba(68,93,70,0.06), 0 4px 12px rgba(68,93,70,0.04)';

const COLORES_PIE = ['#445D46','#5F7A61','#8BA989','#A8BDA9','#6B8C6D','#334A35','#7A9C7C','#B5C9B6','#2E4230','#9FB89F'];
const COLORES_ALMACEN: Record<string, string> = {
  'Kuska': CP,
  'Mego': '#7A9C7C',
  'Selva Norte': CS,
  'CB Lima': CL,
  'Sin almacén': '#ccc',
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
  año: FiltroAño;
  almacen: string;
}

export function AcopioSection({ data, año, almacen }: Props) {
  const almacenData = almacen === 'todos'
    ? data.kgPorAlmacen
    : data.kgPorAlmacen.filter(r => r.almacen === almacen);

  const lotesData = (almacen === 'todos'
    ? data.kgPorLote
    : data.kgPorLote.filter(r => r.almacen === almacen)
  ).slice(0, 10);

  const variedadData = data.kgPorVariedad.slice(0, 10).map(r => ({
    ...r,
    valor: año === '2024' ? r.kg2024 : año === '2025' ? r.kg2025 : r.total,
  })).filter(r => r.valor > 0);

  const showBoth = año === 'ambos';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <ChartCard title="Acopio por Almacén (kg)">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={almacenData} margin={{ top: 4, right: 8, left: 0, bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={BD} />
            <XAxis dataKey="almacen" tick={{ fontSize: 10, fill: '#96A897' }} angle={-25} textAnchor="end" interval={0} />
            <YAxis tick={{ fontSize: 10, fill: '#96A897' }} width={60} tickFormatter={v => v.toLocaleString('es-PE')} />
            <Tooltip content={<CustomTooltip />} />
            <Legend iconSize={8} wrapperStyle={{ fontSize: 11, color: '#7A9A7C' }} />
            {showBoth ? (
              <>
                <Bar dataKey="kg2024" name="2024" fill={CL} radius={[4,4,0,0]} />
                <Bar dataKey="kg2025" name="2025" fill={CP} radius={[4,4,0,0]} />
              </>
            ) : (
              <Bar dataKey={año === '2024' ? 'kg2024' : 'kg2025'} name={año} radius={[4,4,0,0]}>
                {almacenData.map((entry, i) => (
                  <Cell key={i} fill={COLORES_ALMACEN[entry.almacen] ?? COLORES_PIE[i % COLORES_PIE.length]} />
                ))}
              </Bar>
            )}
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Top 10 Lotes por Kg">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={lotesData} layout="vertical" margin={{ top: 4, right: 16, left: 0, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={BD} horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 10, fill: '#96A897' }} tickFormatter={v => v.toLocaleString('es-PE')} />
            <YAxis dataKey="id_lote" type="category" tick={{ fontSize: 9, fill: '#96A897' }} width={72} />
            <Tooltip content={<CustomTooltip />} />
            {showBoth ? (
              <>
                <Legend iconSize={8} wrapperStyle={{ fontSize: 11, color: '#7A9A7C' }} />
                <Bar dataKey="kg2024" name="2024" fill={CL} stackId="a" radius={[0,3,3,0]} />
                <Bar dataKey="kg2025" name="2025" fill={CP} stackId="a" radius={[0,3,3,0]} />
              </>
            ) : (
              <Bar dataKey={año === '2024' ? 'kg2024' : 'kg2025'} name={año} radius={[0,4,4,0]}>
                {lotesData.map((entry, i) => (
                  <Cell key={i} fill={COLORES_ALMACEN[entry.almacen] ?? COLORES_PIE[i % COLORES_PIE.length]} />
                ))}
              </Bar>
            )}
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <div
        className="rounded-2xl p-5 lg:col-span-2"
        style={{ background: '#fff', boxShadow: CARD_SHADOW }}
      >
        <p className="text-[0.6rem] font-bold uppercase tracking-[0.14em] mb-5" style={{ color: '#7A9A7C' }}>
          Distribución por Variedad
        </p>
        <div className="flex flex-col md:flex-row items-center gap-8">
          <ResponsiveContainer width={220} height={220}>
            <PieChart>
              <Pie
                data={variedadData}
                dataKey="valor"
                nameKey="variedad"
                cx="50%"
                cy="50%"
                outerRadius={95}
                innerRadius={58}
                paddingAngle={2}
              >
                {variedadData.map((_, i) => <Cell key={i} fill={COLORES_PIE[i % COLORES_PIE.length]} />)}
              </Pie>
              <Tooltip
                formatter={(v: number) => [fmt(v) + ' kg', '']}
                contentStyle={{ borderRadius: 12, border: `1px solid ${BD}`, fontSize: 12 }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-8">
            {variedadData.map((r, i) => (
              <div key={r.variedad} className="flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: COLORES_PIE[i % COLORES_PIE.length] }} />
                <span className="truncate flex-1 text-xs" style={{ color: '#7A9A7C' }}>{r.variedad}</span>
                <span className="text-xs font-bold shrink-0" style={{ color: TX }}>{fmt(r.valor)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
