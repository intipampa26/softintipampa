import { useState, useMemo } from 'react';
import { useDashboardData } from '@/hooks/useDashboardData';
import { KpiCard } from '@/components/dashboard/KpiCard';
import { FiltroDashboard } from '@/components/dashboard/FiltroDashboard';
import { AcopioSection } from '@/components/dashboard/AcopioSection';
import { TrillaSection } from '@/components/dashboard/TrillaSection';
import { VentasSection } from '@/components/dashboard/VentasSection';
import type { FiltroAño } from '@/types/dashboard.types';

const CP = '#445D46';
const TX = '#2C2C2C';

const fmt = (n: number) => n.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtUSD = (n: number) => '$' + n.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtKg = (n: number) => n.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' kg';

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-1 h-6 rounded-full" style={{ background: CP }} />
      <h2 className="text-sm font-bold uppercase tracking-widest" style={{ color: CP }}>{children}</h2>
    </div>
  );
}

export function DashboardIndicadores() {
  const { acopio, trilla, ventas, loading, error, refetch } = useDashboardData();
  const [año, setAño] = useState<FiltroAño>('ambos');
  const [almacen, setAlmacen] = useState('todos');

  const almacenes = useMemo(() => {
    const set = new Set<string>();
    (acopio?.kgPorAlmacen ?? []).forEach(r => { if (r.almacen !== 'Sin almacén') set.add(r.almacen); });
    return [...set];
  }, [acopio]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <div className="animate-spin rounded-full h-10 w-10 border-2" style={{ borderColor: CP, borderTopColor: 'transparent' }} />
        <p className="text-xs" style={{ color: '#888' }}>Cargando indicadores...</p>
      </div>
    );
  }

  if (error || !acopio || !trilla || !ventas) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <p className="text-sm" style={{ color: '#dc2626' }}>{error ?? 'Error al cargar datos'}</p>
        <button
          onClick={refetch}
          className="px-4 py-2 rounded-lg text-xs font-semibold text-white"
          style={{ background: CP }}
        >
          Reintentar
        </button>
      </div>
    );
  }

  const kg2024 = acopio.totalKgPorAño.find(y => y.año === 2024)?.kg ?? 0;
  const kg2025 = acopio.totalKgPorAño.find(y => y.año === 2025)?.kg ?? 0;
  const fob2024 = ventas.totalFOBPorAño.find(y => y.año === 2024)?.usd ?? 0;
  const fob2025 = ventas.totalFOBPorAño.find(y => y.año === 2025)?.usd ?? 0;

  const totalAcopio = año === '2024' ? kg2024 : año === '2025' ? kg2025 : acopio.totalKgPergamino;
  const totalFOB = año === '2024' ? fob2024 : año === '2025' ? fob2025 : ventas.totalFOB;
  const deltaAcopio = kg2024 > 0 ? ((kg2025 - kg2024) / kg2024) * 100 : undefined;
  const deltaFOB = fob2024 > 0 ? ((fob2025 - fob2024) / fob2024) * 100 : undefined;

  const totalProductores = año === 'ambos'
    ? acopio.conteoProductores.reduce((s, r) => s + r.conteo, 0)
    : acopio.conteoProductores.find(r => r.año === Number(año))?.conteo ?? 0;

  const subAcopio = año === 'ambos'
    ? `2024: ${fmtKg(kg2024)} · 2025: ${fmtKg(kg2025)}`
    : año === '2024' ? `Total global: ${fmtKg(acopio.totalKgPergamino)}` : `Total global: ${fmtKg(acopio.totalKgPergamino)}`;

  const subFOB = año === 'ambos'
    ? `2024: ${fmtUSD(fob2024)} · 2025: ${fmtUSD(fob2025)}`
    : '';

  return (
    <div className="p-5 md:p-8 space-y-8" style={{ background: '#F7F8F7', minHeight: '100vh' }}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold" style={{ color: TX }}>Dashboard de Indicadores</h1>
          <p className="text-xs mt-0.5" style={{ color: '#888' }}>Collective Bean — Resumen consolidado de acopio, trilla y ventas</p>
        </div>
        <button
          onClick={refetch}
          className="px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors hover:bg-gray-50"
          style={{ color: CP, borderColor: CP }}
        >
          ↺ Actualizar
        </button>
      </div>

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
          value={fmtKg(totalAcopio)}
          sub={subAcopio}
          delta={año === 'ambos' ? deltaAcopio : undefined}
        />
        <KpiCard
          label="Ventas FOB"
          value={fmtUSD(totalFOB)}
          sub={subFOB}
          delta={año === 'ambos' ? deltaFOB : undefined}
        />
        <KpiCard
          label="Rend. Trilla Prom."
          value={trilla.rendimientoPromedio > 0 ? fmt(trilla.rendimientoPromedio) + '%' : '—'}
          sub="Promedio global de todos los lotes"
        />
        <KpiCard
          label="Productores Activos"
          value={String(totalProductores)}
          sub={año === 'ambos' ? `2024: ${acopio.conteoProductores.find(r => r.año === 2024)?.conteo ?? 0} · 2025: ${acopio.conteoProductores.find(r => r.año === 2025)?.conteo ?? 0}` : `Campaña ${año}`}
        />
      </div>

      <div className="space-y-5">
        <SectionTitle>Acopio</SectionTitle>
        <AcopioSection data={acopio} año={año} almacen={almacen} />
      </div>

      <div className="space-y-5">
        <SectionTitle>Trilla</SectionTitle>
        <TrillaSection data={trilla} año={año} almacen={almacen} />
      </div>

      <div className="space-y-5">
        <SectionTitle>Ventas</SectionTitle>
        <VentasSection data={ventas} año={año} />
      </div>
    </div>
  );
}
