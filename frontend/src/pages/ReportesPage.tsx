import { useState, useEffect } from 'react';
import { reportesService, ResumenReporte, ExportFilters } from '@/services/reportes.service';
import { campanasService, Campana } from '@/services/campanas.service';
import { skusService, Sku } from '@/services/skus.service';
import LoadingLogo from '@/components/LoadingLogo';
import { Filter, X, ChevronDown } from 'lucide-react';

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

const SEL = 'w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 bg-white appearance-none pr-8';

export function ReportesPage() {
  const [campanas,    setCampanas]   = useState<Campana[]>([]);
  const [campanaId,   setCampanaId]  = useState<number | undefined>(undefined);
  const [resumen,     setResumen]    = useState<ResumenReporte | null>(null);
  const [loading,     setLoading]    = useState(false);
  const [loadingCamp, setLoadingCamp] = useState(true);
  const [exporting,   setExporting]  = useState<string | null>(null);

  // Filter options
  const [skus,      setSkus]      = useState<Sku[]>([]);
  const [almacenes, setAlmacenes] = useState<string[]>([]);

  // Filters
  const [filterSku,        setFilterSku]        = useState('');
  const [filterFecha,      setFilterFecha]      = useState('');
  const [filterFechaDesde, setFilterFechaDesde] = useState('');
  const [filterFechaHasta, setFilterFechaHasta] = useState('');
  const [filterAlmacen,    setFilterAlmacen]    = useState('');
  const [showFilters,      setShowFilters]      = useState(false);

  useEffect(() => {
    setLoadingCamp(true);
    campanasService.getPage(1, 100)
      .then(res => setCampanas(res.data))
      .catch(() => {})
      .finally(() => setLoadingCamp(false));
    skusService.findAll().then(setSkus).catch(() => {});
    reportesService.getFilterOptions().then(o => setAlmacenes(o.almacenes)).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    reportesService.getResumen(campanaId)
      .then(setResumen)
      .catch(() => setResumen(null))
      .finally(() => setLoading(false));
  }, [campanaId]);

  const activeFilterCount = [
    campanaId, filterSku, filterFecha, filterFechaDesde, filterFechaHasta, filterAlmacen,
  ].filter(v => v !== undefined && v !== '').length;

  function clearFilters() {
    setCampanaId(undefined);
    setFilterSku('');
    setFilterFecha('');
    setFilterFechaDesde('');
    setFilterFechaHasta('');
    setFilterAlmacen('');
  }

  function buildFilename(tipo: string) {
    const parts = [tipo];
    if (campanaId && resumen?.campana?.nombre)
      parts.push(`camp-${resumen.campana.nombre.replace(/\s+/g, '_')}`);
    if (filterSku)        parts.push(`sku-${filterSku.replace(/\s+/g, '_')}`);
    if (filterFecha)      parts.push(`fecha-${filterFecha}`);
    if (filterFechaDesde) parts.push(`desde-${filterFechaDesde}`);
    if (filterFechaHasta) parts.push(`hasta-${filterFechaHasta}`);
    if (filterAlmacen)    parts.push(`almacen-${filterAlmacen.replace(/\s+/g, '_')}`);
    return parts.join('_');
  }

  function handleExport(tipo: 'productores' | 'lotes' | 'lotes-finales' | 'muestras' | 'ventas') {
    setExporting(tipo);
    const filters: ExportFilters = {
      campanaId,
      sku:        filterSku        || undefined,
      fecha:      filterFecha      || undefined,
      fechaDesde: filterFechaDesde || undefined,
      fechaHasta: filterFechaHasta || undefined,
      almacen:    filterAlmacen    || undefined,
    };
    reportesService.downloadExcel(tipo, filters, buildFilename(tipo));
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

      {/* Header */}
      <div>
        <h1 className="text-2xl font-black uppercase tracking-wide" style={{ color: '#172216' }}>
          Reportes
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">Resumen y exportación de datos por campaña</p>
      </div>

      {/* KPIs */}
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

      {/* Export section */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-black uppercase tracking-wide text-gray-700">
              Exportar a Excel
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {activeFilterCount > 0 ? `${activeFilterCount} filtro${activeFilterCount > 1 ? 's' : ''} activo${activeFilterCount > 1 ? 's' : ''}` : 'Sin filtros aplicados'}
            </p>
          </div>
          <button
            onClick={() => setShowFilters(v => !v)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all"
            style={{
              borderColor: activeFilterCount > 0 ? '#445D46' : '#D1D5DB',
              color: activeFilterCount > 0 ? '#445D46' : '#6B7280',
              backgroundColor: activeFilterCount > 0 ? '#445D4610' : 'transparent',
            }}
          >
            <Filter size={12} />
            Filtros
            {activeFilterCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full text-[0.55rem] font-black text-white" style={{ backgroundColor: '#445D46' }}>
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Filter panel */}
        {showFilters && (
          <div className="rounded-xl border p-4 space-y-3" style={{ borderColor: '#D9DDD8', backgroundColor: '#F7F8F7' }}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[0.65rem] font-black uppercase tracking-widest text-gray-500">Filtros de exportación</span>
              {activeFilterCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 text-[0.6rem] font-bold text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X size={10} /> Limpiar filtros
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <div>
                <label className="block text-[0.6rem] font-bold uppercase tracking-wide text-gray-500 mb-1">Campaña</label>
                <div className="relative">
                  <select
                    value={campanaId ?? ''}
                    onChange={e => setCampanaId(e.target.value ? Number(e.target.value) : undefined)}
                    className={SEL}
                    disabled={loadingCamp}
                  >
                    <option value="">Todas las campañas</option>
                    {campanas.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                  </select>
                  <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-[0.6rem] font-bold uppercase tracking-wide text-gray-500 mb-1">SKU</label>
                <div className="relative">
                  <select value={filterSku} onChange={e => setFilterSku(e.target.value)} className={SEL}>
                    <option value="">Todos los SKU</option>
                    {skus.filter(s => s.activo).map(s => (
                      <option key={s.id} value={s.nombre}>{s.nombre}</option>
                    ))}
                  </select>
                  <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-[0.6rem] font-bold uppercase tracking-wide text-gray-500 mb-1">Almacén / Planta</label>
                <div className="relative">
                  <select value={filterAlmacen} onChange={e => setFilterAlmacen(e.target.value)} className={SEL}>
                    <option value="">Todos los almacenes</option>
                    {almacenes.map(a => (
                      <option key={a} value={a}>{a}</option>
                    ))}
                  </select>
                  <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-[0.6rem] font-bold uppercase tracking-wide text-gray-500 mb-1">Fecha exacta</label>
                <input
                  type="date"
                  value={filterFecha}
                  onChange={e => setFilterFecha(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 bg-white disabled:opacity-40"
                  disabled={!!(filterFechaDesde || filterFechaHasta)}
                />
              </div>
              <div>
                <label className="block text-[0.6rem] font-bold uppercase tracking-wide text-gray-500 mb-1">Rango — Desde</label>
                <input
                  type="date"
                  value={filterFechaDesde}
                  onChange={e => { setFilterFechaDesde(e.target.value); setFilterFecha(''); }}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 bg-white disabled:opacity-40"
                  disabled={!!filterFecha}
                />
              </div>
              <div>
                <label className="block text-[0.6rem] font-bold uppercase tracking-wide text-gray-500 mb-1">Rango — Hasta</label>
                <input
                  type="date"
                  value={filterFechaHasta}
                  onChange={e => { setFilterFechaHasta(e.target.value); setFilterFecha(''); }}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 bg-white disabled:opacity-40"
                  disabled={!!filterFecha}
                />
              </div>
            </div>

            {activeFilterCount > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {campanaId        && <FilterTag label={`Campaña: ${resumen?.campana?.nombre ?? campanaId}`} onRemove={() => setCampanaId(undefined)} />}
                {filterSku        && <FilterTag label={`SKU: ${filterSku}`}        onRemove={() => setFilterSku('')} />}
                {filterAlmacen    && <FilterTag label={`Almacén: ${filterAlmacen}`} onRemove={() => setFilterAlmacen('')} />}
                {filterFecha      && <FilterTag label={`Fecha: ${filterFecha}`}     onRemove={() => setFilterFecha('')} />}
                {filterFechaDesde && <FilterTag label={`Desde: ${filterFechaDesde}`} onRemove={() => setFilterFechaDesde('')} />}
                {filterFechaHasta && <FilterTag label={`Hasta: ${filterFechaHasta}`} onRemove={() => setFilterFechaHasta('')} />}
              </div>
            )}

            <p className="text-[0.58rem] text-gray-400 italic">
              SKU aplica a: Lotes Finales, Ventas · Almacén aplica a: Lotes, Muestras · Fechas aplican a todos los tipos
            </p>
          </div>
        )}

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
          <ExportBtn
            label="Muestras"
            description="Todas las muestras con puntajes, rendimiento y datos sensoriales"
            loading={exporting === 'muestras'}
            onClick={() => handleExport('muestras')}
          />
          <ExportBtn
            label="Ventas"
            description="Órdenes de venta con cliente, monto, mercado y etapa"
            loading={exporting === 'ventas'}
            onClick={() => handleExport('ventas')}
          />
        </div>
      </div>
    </div>
  );
}

function FilterTag({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span
      className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[0.6rem] font-bold"
      style={{ backgroundColor: '#445D4615', color: '#445D46' }}
    >
      {label}
      <button onClick={onRemove} className="hover:opacity-60 transition-opacity">
        <X size={9} />
      </button>
    </span>
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
