import {
  AreaChart, Area,
  BarChart, Bar,
  XAxis, YAxis,
  CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useAuth } from '@/contexts/AuthContext';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';

const areaData = Array.from({ length: 30 }, (_, i) => {
  const t = i / 29;
  return {
    day: i + 1,
    top:    Math.round(2600 + Math.sin(t * Math.PI * 4.2) * 500 + Math.sin(t * Math.PI * 2.3) * 280),
    mid:    Math.round(1480 + Math.sin(t * Math.PI * 3.8 + 1.1) * 330 + Math.sin(t * Math.PI * 2.1) * 140),
    bottom: Math.round(870  + Math.sin(t * Math.PI * 5.1 + 2.4) * 180 + Math.sin(t * Math.PI * 2.7) * 90),
  };
});

const barNetMargin = [
  { n: '1', v: 6 }, { n: '2', v: 8.2 }, { n: '3', v: 9.1 },
  { n: '4', v: 12 }, { n: '5', v: 7.8 }, { n: '6', v: 4.3 }, { n: '7', v: 6.5 },
];

const barDebtEquity = [
  { n: '1', b: 6.2, r: 2.8 }, { n: '2', b: 8.8, r: 1.4 },
  { n: '3', b: 6.5, r: 5.1 }, { n: '4', b: 4.8, r: 0.6 },
  { n: '5', b: 7.4, r: 4.2 }, { n: '6', b: 5.8, r: 4.8 }, { n: '7', b: 7.1, r: 3.3 },
];

const KPIS = [
  { label: 'Ingresos',           value: 'S/ 124.5K', delta: '↑ 13%',   sub: 'vs semana anterior', positive: true  },
  { label: 'Margen Promedio',    value: '18.3%',     delta: '↑ 1.2',   sub: 'vs semana anterior', positive: true  },
  { label: 'Retorno s/ Inv. (ROI)', value: '24.7%',  delta: '8%',      sub: 'vs semana anterior', positive: true  },
  { label: 'Valor del Cliente',  value: 'S/ 2,847',  delta: '↑ 2.3%',  sub: 'vs semana anterior', positive: true  },
];

function KpiCard({ label, value, delta, sub, positive }: typeof KPIS[0]) {
  return (
    <div className="flex flex-col justify-between p-4 border-b border-r border-gray-100 last:border-r-0">
      <p className="text-[0.65rem] text-gray-400 font-medium uppercase tracking-wider">{label}</p>
      <div className="mt-1">
        <p className="font-headline text-2xl font-bold text-gray-900 leading-tight">{value}</p>
        <p className={`text-xs font-semibold mt-0.5 ${positive ? 'text-green-600' : 'text-red-500'}`}>{delta}</p>
        <p className="text-[0.6rem] text-gray-400 mt-0.5">{sub}</p>
      </div>
    </div>
  );
}

const tooltipStyle = {
  contentStyle: { fontSize: 11, borderRadius: 6, border: '1px solid #e5e7eb', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  itemStyle: { padding: '1px 0' },
};

export function DashboardPage() {
  const { isOfflineSession } = useAuth();
  const { isOffline } = useNetworkStatus();

  return (
    <div className={`p-4 md:p-8 min-h-full bg-white ${isOfflineSession ? 'pt-14' : ''}`}>

      <h1
        className="font-headline text-2xl sm:text-3xl font-black uppercase tracking-wide text-gray-800 mb-6"
        style={{ letterSpacing: '0.05em' }}
      >
        Dashboard
      </h1>

      {isOffline && isOfflineSession && (
        <div className="mb-4 text-xs text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-2 inline-flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
          Modo offline — datos de última sesión
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

        <div className="px-6 pt-5 pb-4 border-b border-gray-100">
          <p className="font-semibold text-gray-700 text-sm">Data Dashboard</p>

          <div className="flex items-center gap-6 mt-3 flex-wrap">
            <div>
              <p className="text-[0.6rem] text-gray-400 uppercase tracking-wider">Auto date range</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/>
                  <line x1="8" y1="2" x2="8" y2="6"/><line x1="16" y1="2" x2="16" y2="6"/>
                </svg>
                <span className="text-xs font-semibold text-gray-700">Esta Semana</span>
              </div>
            </div>
            {['Servicios', 'Reportes'].map((f) => (
              <div key={f}>
                <p className="text-[0.6rem] text-gray-400 uppercase tracking-wider">{f}</p>
                <select className="mt-0.5 text-xs font-semibold text-gray-700 bg-transparent border-0 outline-none cursor-pointer pr-4">
                  <option>Todos</option>
                </select>
              </div>
            ))}
          </div>
        </div>

        <div className="px-6 pt-5 pb-2">
          <p className="text-[0.68rem] text-gray-400 mb-3">
            Ingresos Antes de Intereses, Impuestos, Depreciación y Amortización (EBITDA)
          </p>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={areaData} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="gTop" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="#8dc58d" stopOpacity={0.65}/>
                  <stop offset="100%" stopColor="#8dc58d" stopOpacity={0.15}/>
                </linearGradient>
                <linearGradient id="gMid" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="#cd5c5c" stopOpacity={0.45}/>
                  <stop offset="100%" stopColor="#cd5c5c" stopOpacity={0.05}/>
                </linearGradient>
                <linearGradient id="gBot" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="#c4a882" stopOpacity={0.85}/>
                  <stop offset="100%" stopColor="#c4a882" stopOpacity={0.55}/>
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false}/>
              <XAxis
                dataKey="day" tick={{ fontSize: 10, fill: '#9ca3af' }}
                tickLine={false} axisLine={false} interval={1}
              />
              <YAxis
                domain={[0, 4000]} ticks={[0, 1000, 2000, 3000, 4000]}
                tick={{ fontSize: 10, fill: '#9ca3af' }} tickLine={false} axisLine={false}
                tickFormatter={(v) => v === 0 ? '0' : `${v / 1000}k`}
                width={32}
              />
              <Tooltip
                formatter={(v: number, name: string) => [
                  `S/ ${v.toLocaleString()}`,
                  name === 'top' ? 'EBITDA' : name === 'mid' ? 'Ingresos' : 'Costos',
                ]}
                {...tooltipStyle}
              />

              <Area type="monotone" dataKey="top"
                stroke="#6aad6a" strokeWidth={1.8}
                fill="url(#gTop)" dot={false} activeDot={{ r: 4 }}
              />
              <Area type="monotone" dataKey="mid"
                stroke="#cd5c5c" strokeWidth={2}
                fill="url(#gMid)" dot={false} activeDot={{ r: 4 }}
              />
              <Area type="monotone" dataKey="bottom"
                stroke="#b49060" strokeWidth={1.5}
                fill="url(#gBot)" dot={false} activeDot={{ r: 4 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 border-t border-gray-100">

          <div className="p-5 border-b sm:border-b md:border-b-0 border-r-0 sm:border-r md:border-r border-gray-100">
            <p className="text-[0.68rem] text-gray-500 font-medium mb-3">Margen de Ganancia Neto</p>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={barNetMargin} margin={{ top: 5, right: 5, left: -20, bottom: 0 }} barSize={22}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false}/>
                <XAxis dataKey="n" tick={{ fontSize: 10, fill: '#9ca3af' }} tickLine={false} axisLine={false}/>
                <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} tickLine={false} axisLine={false} domain={[0, 13]}/>
                <Tooltip formatter={(v: number) => [`${v}%`, 'Margen']} {...tooltipStyle}/>
                <Bar dataKey="v" fill="#7090c8" radius={[3, 3, 0, 0]}/>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="p-5 border-b md:border-b-0 border-r-0 md:border-r border-gray-100">
            <p className="text-[0.68rem] text-gray-500 font-medium mb-3">Ratio Deuda-Capital</p>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={barDebtEquity} margin={{ top: 5, right: 5, left: -20, bottom: 0 }} barSize={22}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false}/>
                <XAxis dataKey="n" tick={{ fontSize: 10, fill: '#9ca3af' }} tickLine={false} axisLine={false}/>
                <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} tickLine={false} axisLine={false} domain={[0, 13]}/>
                <Tooltip
                  formatter={(v: number, name: string) => [`${v}`, name === 'b' ? 'Capital' : 'Deuda']}
                  {...tooltipStyle}
                />
                <Bar dataKey="b" stackId="s" fill="#7090c8" radius={[0, 0, 0, 0]}/>
                <Bar dataKey="r" stackId="s" fill="#c85c5c" radius={[3, 3, 0, 0]}/>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 divide-y divide-x divide-gray-100 sm:col-span-2 md:col-span-1">
            {KPIS.map((kpi) => (
              <KpiCard key={kpi.label} {...kpi} />
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
