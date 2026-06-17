import { useState, useEffect } from 'react';
import { reportesService, ResumenReporte } from '@/services/reportes.service';
import { campanasService, Campana } from '@/services/campanas.service';
import LoadingLogo from '@/components/LoadingLogo';

function KpiCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">{label}</p>
      <p className="text-3xl font-black mt-1" style={{ color: '#172216' }}>{value}</p>
      {sub && <p className="text-xs text-gray-500 mt-0.5">{sub}</p>}
    </div>
  );
}

function fmtKg(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(2)} t`;
  return `${Number(n).toFixed(1)} kg`;
}

export function ReportesPage() {
  const [campanas,    setCampanas]   = useState<Campana[]>([]);
  const [campanaId,   setCampanaId]  = useState<number | undefined>(undefined);
  const [resumen,     setResumen]    = useState<ResumenReporte | null>(null);
  const [loading,     setLoading]    = useState(false);
  const [loadingCamp, setLoadingCamp] = useState(true);
  const [exporting,   setExporting]  = useState<string | null>(null);

  useEffect(() => {
    setLoadingCamp(true);
    campanasService.getPage(1, 100)
      .then(res => setCampanas(res.data))
      .catch(() => {})
      .finally(() => setLoadingCamp(false));
  }, []);

  
  useEffect(() => {
    setLoading(true);
    reportesService.getResumen(campanaId)
      .then(setResumen)
      .catch(() => setResumen(null))
      .finally(() => setLoading(false));
  }, [campanaId]);

  function handleExport(tipo: 'productores' | 'lotes' | 'lotes-finales') {
    setExporting(tipo);
    reportesService.downloadExcel(tipo, campanaId);
    setTimeout(() => setExporting(null), 2000);
  }

  const kpis = resumen?.kpis;

  return (
    <div className="p-4 md:p-6 space-y-6 relative">

      {loading && (
        <div
          className="absolute inset-0 z-40 flex items-center justify-center"
          style={{ backgroundColor: 'rgba(249,250,251,0.9)', backdropFilter: 'blur(2px)' }}
        >
          <LoadingLogo />
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-end gap-4">
        <div className="flex-1">
          <h1 className="text-2xl font-black uppercase tracking-wide" style={{ color: '#172216' }}>
            Reportes
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">Resumen y exportación de datos por campaña</p>
        </div>

        <div className="w-full sm:w-72">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
            Campaña
          </label>
          <select
            value={campanaId ?? ''}
            onChange={e => setCampanaId(e.target.value ? Number(e.target.value) : undefined)}
            className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none"
            disabled={loadingCamp}
          >
            <option value="">Todas las campañas</option>
            {campanas.map(c => (
              <option key={c.id} value={c.id}>{c.nombre}</option>
            ))}
          </select>
        </div>
      </div>

      {kpis && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <KpiCard label="Productores"    value={kpis.totalProductores} />
          <KpiCard label="Lotes"          value={kpis.totalLotes} />
          <KpiCard label="Lotes Finales"  value={kpis.totalLotesFinales} />
          <KpiCard label="Muestras"       value={kpis.totalMuestras} />
          <KpiCard label="Kg Lotes"       value={fmtKg(kpis.kgTotalLotes)}        sub="Total ingresado" />
          <KpiCard label="Kg Lotes Final" value={fmtKg(kpis.kgTotalLotesFinales)} sub="Disponible / trillado" />
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
        <h2 className="text-sm font-black uppercase tracking-wide text-gray-700">
          Exportar a Excel
        </h2>
        <p className="text-xs text-gray-400">
          {campanaId ? `Campaña: ${resumen?.campana?.nombre ?? campanaId}` : 'Todas las campañas'}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <ExportBtn
            label="Productores"
            description="Listado completo de productores activos"
            loading={exporting === 'productores'}
            onClick={() => handleExport('productores')}
          />
          <ExportBtn
            label="Lotes"
            description="Todos los lotes registrados con estado"
            loading={exporting === 'lotes'}
            onClick={() => handleExport('lotes')}
          />
          <ExportBtn
            label="Lotes Finales"
            description="Lotes finales activos con tipo y cantidad"
            loading={exporting === 'lotes-finales'}
            onClick={() => handleExport('lotes-finales')}
          />
        </div>
      </div>
    </div>
  );
}

function ExportBtn({
  label, description, loading, onClick,
}: {
  label: string;
  description: string;
  loading: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="flex items-start gap-3 p-4 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-left transition-colors disabled:opacity-60"
    >
      <div className="mt-0.5 shrink-0">
        {loading ? (
          <svg className="w-5 h-5 animate-spin text-gray-400" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" style={{ color: '#172216' }}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
        )}
      </div>
      <div>
        <p className="text-sm font-semibold text-gray-800">{label}</p>
        <p className="text-xs text-gray-400 mt-0.5">{description}</p>
      </div>
    </button>
  );
}
