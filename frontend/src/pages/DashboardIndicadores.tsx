import { useState, useMemo, useEffect } from 'react';
import { useDashboardData } from '@/hooks/useDashboardData';
import { KpiCard } from '@/components/dashboard/KpiCard';
import { FiltroDashboard } from '@/components/dashboard/FiltroDashboard';
import { AcopioSection } from '@/components/dashboard/AcopioSection';
import { TrillaSection } from '@/components/dashboard/TrillaSection';
import { VentasSection } from '@/components/dashboard/VentasSection';
import { campanasService } from '@/services/campanas.service';

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
  const [campanaId, setCampanaId] = useState<number | null>(null);
  const [campanas, setCampanas] = useState<{ id: number; nombre: string }[]>([]);
  const { acopio, trilla, ventas, loading, error, refetch } = useDashboardData(campanaId ?? undefined);
  const [almacen, setAlmacen] = useState('todos');

  useEffect(() => {
    campanasService.getPage(1, 100).then(res => {
      setCampanas((res.data ?? []).map((c: any) => ({ id: c.id, nombre: c.nombre })));
    }).catch(() => {});
  }, []);

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

  const totalAcopio = acopio.totalKgPergamino;
  const totalFOB = ventas.totalFOB;
  const totalProductores = acopio.conteoProductores.reduce((s, r) => s + r.conteo, 0);
  const campanaNombre = campanaId ? campanas.find(c => c.id === campanaId)?.nombre ?? String(campanaId) : null;
  const subAcopio = campanaNombre ? `Campaña ${campanaNombre}` : 'Todas las campañas';
  const subFOB = campanaNombre ? `Campaña ${campanaNombre}` : 'Todas las campañas';

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
        campanaId={campanaId}
        campanas={campanas}
        almacen={almacen}
        almacenes={almacenes}
        onCampanaChange={id => { setCampanaId(id); setAlmacen('todos'); }}
        onAlmacenChange={setAlmacen}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Total Acopio" value={fmtKg(totalAcopio)} sub={subAcopio} />
        <KpiCard label="Ventas FOB" value={fmtUSD(totalFOB)} sub={subFOB} />
        <KpiCard label="Rend. Trilla Prom." value={trilla.rendimientoPromedio > 0 ? fmt(trilla.rendimientoPromedio) + '%' : '—'} sub="Promedio global" />
        <KpiCard label="Productores Activos" value={String(totalProductores)} sub={subAcopio} />
      </div>

      <div className="space-y-5">
        <SectionTitle>Acopio</SectionTitle>
        <AcopioSection data={acopio} almacen={almacen} />
      </div>

      <div className="space-y-5">
        <SectionTitle>Trilla</SectionTitle>
        <TrillaSection data={trilla} almacen={almacen} />
      </div>

      <div className="space-y-5">
        <SectionTitle>Ventas</SectionTitle>
        <VentasSection data={ventas} campanaNombre={campanaNombre} />
      </div>
    </div>
  );
}
