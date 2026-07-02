import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts';

const CP = '#6B8472';
const CS = '#8A9CB0';
const BD = '#D9DDD8';
const TX = '#2C2C2C';
const ACUM_COLOR = '#A09078';

const fmt = (n: number) => n.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl px-3 py-2 shadow-lg text-xs" style={{ background: '#fff', border: `1px solid ${BD}`, color: TX }}>
      <p className="font-semibold mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name}: <strong>
            {p.name === '% Acumulado' ? fmt(p.value) + '%' : fmt(p.value) + ' kg'}
          </strong>
        </p>
      ))}
    </div>
  );
};

interface ParetoRow {
  id_lote: string;
  nombre: string;
  kgVendidos: number;
  porcentaje: number;
  acumulado: number;
}

interface Props {
  data: ParetoRow[];
}

export function ParetoChart({ data }: Props) {
  const top = data.slice(0, 15);

  return (
    <>
      <ResponsiveContainer width="100%" height={280}>
        <ComposedChart data={top} margin={{ top: 8, right: 40, left: 0, bottom: 72 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={BD} />
          <XAxis dataKey="nombre" tick={{ fontSize: 9, fill: TX }} angle={-40} textAnchor="end" interval={0} />
          <YAxis yAxisId="left" tick={{ fontSize: 10, fill: TX }} width={60}
                 tickFormatter={v => v.toLocaleString('es-PE')} label={{ value: 'Kg', angle: -90, position: 'insideLeft', fontSize: 10, fill: TX, dx: -4 }} />
          <YAxis yAxisId="right" orientation="right" domain={[0, 100]} unit="%" tick={{ fontSize: 10, fill: TX }} width={40} />
          <Tooltip content={<CustomTooltip />} />
          <Bar yAxisId="left" dataKey="kgVendidos" name="Kg Vendidos" fill={CS} radius={[3,3,0,0]} />
          <Line yAxisId="right" type="monotone" dataKey="acumulado" name="% Acumulado"
                stroke={ACUM_COLOR} strokeWidth={2} dot={{ r: 3, fill: ACUM_COLOR, stroke: '#fff', strokeWidth: 1 }} />
        </ComposedChart>
      </ResponsiveContainer>
      <div className="flex items-center justify-center gap-5 mt-3 text-[0.65rem]" style={{ color: TX }}>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: CS }} />
          Kg Vendidos
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-5 border-t-2 inline-block" style={{ borderColor: ACUM_COLOR }} />
          % Acumulado
        </span>
      </div>
    </>
  );
}
