import { useState, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useDashboardData } from '@/hooks/useDashboardData';
import { KpiCard } from '@/components/dashboard/KpiCard';
import { FiltroDashboard } from '@/components/dashboard/FiltroDashboard';
import { AcopioSection } from '@/components/dashboard/AcopioSection';
import { TrillaSection } from '@/components/dashboard/TrillaSection';
import { VentasSection } from '@/components/dashboard/VentasSection';
import type { FiltroAño } from '@/types/dashboard.types';

const CP = '#445D46';
const TX = '#2C2C2C';

const fmt  = (n: number) => n.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtU = (n: number) => '$' + n.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtK = (n: number) => n.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' kg';

type Seccion = 'acopio' | 'trilla' | 'ventas';

function IconAcopio() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10"/><path d="M12 2c0 5.5-4.5 10-10 10"/><path d="M12 2c0 5.5 4.5 10 10 10"/>
    </svg>
  );
}
function IconTrilla() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/>
    </svg>
  );
}
function IconVentas() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>
    </svg>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-0.5 h-5 rounded-full" style={{ background: CP }} />
      <h2
        className="text-[0.65rem] font-black uppercase"
        style={{ color: CP, letterSpacing: '0.2em' }}
      >
        {children}
      </h2>
      <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, #D9DDD8, transparent)' }} />
    </div>
  );
}

export function DashboardPage() {
  const { isOfflineSession } = useAuth();
  const { acopio, trilla, ventas, loading, error, refetch } = useDashboardData();
  const [año, setAño] = useState<FiltroAño>('ambos');
  const [almacen, setAlmacen] = useState('todos');
  const [seccion, setSeccion] = useState<Seccion>('acopio');

  const almacenes = useMemo(() => {
    const set = new Set<string>();
    (acopio?.kgPorAlmacen ?? []).forEach(r => { if (r.almacen !== 'Sin almacén') set.add(r.almacen); });
    return [...set];
  }, [acopio]);

  return (
    <div className={`p-4 md:p-8 min-h-full space-y-8 ${isOfflineSession ? 'pt-14' : ''}`} style={{ background: '#F7F8F7' }}>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1
            className="font-headline text-2xl sm:text-3xl font-black uppercase"
            style={{ color: TX, letterSpacing: '0.08em' }}
          >
            Dashboard
          </h1>
          <p className="text-[0.68rem] mt-0.5" style={{ color: '#96A897' }}>
            Indicadores de campaña · Collective Bean
          </p>
        </div>
        <button
          onClick={refetch}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[0.72rem] font-bold transition-all hover:shadow-sm active:scale-95"
          style={{
            background: '#EFF2EF',
            color: CP,
          }}
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M23 4v6h-6"/><path d="M1 20v-6h6"/>
            <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/>
          </svg>
          Actualizar
        </button>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center h-56 gap-3">
          <div className="animate-spin rounded-full h-9 w-9 border-2" style={{ borderColor: CP, borderTopColor: 'transparent' }} />
          <p className="text-xs" style={{ color: '#888' }}>Cargando indicadores...</p>
        </div>
      )}

      {!loading && error && (
        <div className="flex flex-col items-center justify-center h-40 gap-3">
          <p className="text-sm" style={{ color: '#dc2626' }}>{error}</p>
          <button onClick={refetch} className="px-4 py-2 rounded-lg text-xs font-semibold text-white" style={{ background: CP }}>
            Reintentar
          </button>
        </div>
      )}

      {!loading && !error && acopio && trilla && ventas && (() => {
        const kg2024  = acopio.totalKgPorAño.find(y => y.año === 2024)?.kg ?? 0;
        const kg2025  = acopio.totalKgPorAño.find(y => y.año === 2025)?.kg ?? 0;
        const fob2024 = ventas.totalFOBPorAño.find(y => y.año === 2024)?.usd ?? 0;
        const fob2025 = ventas.totalFOBPorAño.find(y => y.año === 2025)?.usd ?? 0;

        const totalAcopio = año === '2024' ? kg2024 : año === '2025' ? kg2025 : acopio.totalKgPergamino;
        const totalFOB    = año === '2024' ? fob2024 : año === '2025' ? fob2025 : ventas.totalFOB;
        const deltaAcopio = kg2024 > 0 ? ((kg2025 - kg2024) / kg2024) * 100 : undefined;
        const deltaFOB    = fob2024 > 0 ? ((fob2025 - fob2024) / fob2024) * 100 : undefined;

        const prod2024 = acopio.conteoProductores.find(r => r.año === 2024)?.conteo ?? 0;
        const prod2025 = acopio.conteoProductores.find(r => r.año === 2025)?.conteo ?? 0;
        const totalProd = año === '2024' ? prod2024 : año === '2025' ? prod2025 : prod2024 + prod2025;

        return (
          <>
            <FiltroDashboard
              año={año}
              almacen={almacen}
              almacenes={almacenes}
              onAñoChange={a => { setAño(a); setAlmacen('todos'); }}
              onAlmacenChange={setAlmacen}
            />

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <KpiCard
                label="Total Acopio"
                value={fmtK(totalAcopio)}
                sub={año === 'ambos' ? `2024: ${fmtK(kg2024)} · 2025: ${fmtK(kg2025)}` : `Global: ${fmtK(acopio.totalKgPergamino)}`}
                delta={año === 'ambos' ? deltaAcopio : undefined}
              />
              <KpiCard
                label="Ventas FOB"
                value={fmtU(totalFOB)}
                sub={año === 'ambos' ? `2024: ${fmtU(fob2024)} · 2025: ${fmtU(fob2025)}` : ''}
                delta={año === 'ambos' ? deltaFOB : undefined}
              />
              <KpiCard
                label="Rend. Trilla Prom."
                value={trilla.rendimientoPromedio > 0 ? fmt(trilla.rendimientoPromedio) + '%' : '—'}
                sub="Promedio global todos los lotes"
              />
              <KpiCard
                label="Productores Activos"
                value={String(totalProd)}
                sub={año === 'ambos' ? `2024: ${prod2024} · 2025: ${prod2025}` : `Campaña ${año}`}
              />
            </div>

            <div
              className="grid grid-cols-3 gap-3 rounded-2xl p-1.5"
              style={{ background: '#EDF0ED' }}
            >
              {([
                {
                  key: 'acopio' as Seccion,
                  label: 'Acopio',
                  metric: fmtK(totalAcopio),
                  sub: 'Café pergamino',
                  icon: <IconAcopio />,
                },
                {
                  key: 'trilla' as Seccion,
                  label: 'Trilla',
                  metric: trilla.rendimientoPromedio > 0 ? fmt(trilla.rendimientoPromedio) + '%' : '—',
                  sub: 'Rendimiento prom.',
                  icon: <IconTrilla />,
                },
                {
                  key: 'ventas' as Seccion,
                  label: 'Ventas',
                  metric: fmtU(totalFOB),
                  sub: 'Total FOB',
                  icon: <IconVentas />,
                },
              ] as const).map(tab => {
                const active = seccion === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setSeccion(tab.key)}
                    className="relative flex flex-col items-start gap-2 rounded-xl px-4 py-3.5 text-left transition-all duration-200"
                    style={{
                      background: active ? '#fff' : 'transparent',
                      boxShadow: active ? '0 1px 4px rgba(68,93,70,0.10), 0 4px 12px rgba(68,93,70,0.06)' : 'none',
                      color: active ? CP : '#8FA88E',
                    }}
                  >
                    <div className="flex items-center gap-2 w-full">
                      <span style={{ color: active ? CP : '#AFC2B0' }}>{tab.icon}</span>
                      <span
                        className="text-[0.68rem] font-black uppercase tracking-widest"
                        style={{ color: active ? CP : '#8FA88E' }}
                      >
                        {tab.label}
                      </span>
                      {active && (
                        <span
                          className="ml-auto w-1.5 h-1.5 rounded-full"
                          style={{ background: CP }}
                        />
                      )}
                    </div>
                    <div>
                      <p
                        className="text-[0.95rem] font-black tabular-nums leading-tight"
                        style={{ color: active ? TX : '#A0B5A0' }}
                      >
                        {tab.metric}
                      </p>
                      <p
                        className="text-[0.6rem] font-medium mt-0.5"
                        style={{ color: active ? '#96A897' : '#B8C8B9' }}
                      >
                        {tab.sub}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div
              key={seccion}
              className="space-y-5"
              style={{ animation: 'fadeSlideIn 0.22s ease both' }}
            >
              <style>{`
                @keyframes fadeSlideIn {
                  from { opacity: 0; transform: translateY(6px); }
                  to   { opacity: 1; transform: translateY(0); }
                }
              `}</style>
              <SectionTitle>
                {seccion === 'acopio' ? 'Acopio' : seccion === 'trilla' ? 'Trilla' : 'Ventas'}
              </SectionTitle>
              {seccion === 'acopio' && <AcopioSection data={acopio} año={año} almacen={almacen} />}
              {seccion === 'trilla' && <TrillaSection data={trilla} año={año} almacen={almacen} />}
              {seccion === 'ventas' && <VentasSection data={ventas} año={año} />}
            </div>
          </>
        );
      })()}
    </div>
  );
}
