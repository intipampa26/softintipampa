import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { muestrasService, Muestra, TipoMuestra, EstadoMuestra, FilterMuestrasDto } from '@/services/muestras.service';
import { campanasService, Campana } from '@/services/campanas.service';
import { productoresService, Productor } from '@/services/productores.service';
import LoadingLogo from '@/components/LoadingLogo';

interface Col {
  key: string;
  label: string;
}

const MUESTRA_COLS: Col[] = [
  { key: 'Código',           label: 'Código' },
  { key: 'Fecha',            label: 'Fecha' },
  { key: 'Fecha Cata',       label: 'Fecha Cata' },
  { key: 'Tipo Muestra',     label: 'Tipo Muestra' },
  { key: 'Categoría',        label: 'Categoría' },
  { key: 'Estado',           label: 'Estado' },
  { key: 'Estado Lote',      label: 'Estado Lote' },
  { key: 'Productor',        label: 'Productor' },
  { key: 'Campaña',          label: 'Campaña' },
  { key: 'Lote',             label: 'Lote' },
  { key: 'Lote Final',       label: 'Lote Final' },
  { key: 'Cantidad (kg)',    label: 'Cantidad (kg)' },
  { key: 'Rendimiento',      label: 'Rendimiento' },
  { key: 'Humedad%',         label: 'Humedad%' },
  { key: 'Variedad',         label: 'Variedad' },
  { key: 'Proceso',          label: 'Proceso' },
  { key: 'Base',             label: 'Base' },
  { key: 'Año Cosecha',      label: 'Año Cosecha' },
  { key: 'País',             label: 'País' },
  { key: 'Región',           label: 'Región' },
  { key: 'Puntaje Físico',   label: 'Puntaje Físico' },
  { key: 'Puntaje Sensorial',label: 'Puntaje Sensorial' },
  { key: 'Observaciones',    label: 'Observaciones' },
];

const EF_COLS: Col[] = [
  { key: 'EF-Tipo',                label: 'Tipo' },
  { key: 'EF-Fecha',               label: 'Fecha Eval.' },
  { key: 'EF-Puntaje',             label: 'Puntaje' },
  { key: 'EF-HumedadGrano',        label: 'Humedad Grano' },
  { key: 'EF-ActividadGrano',      label: 'Actividad Grano' },
  { key: 'EF-Cafe-DefPrimarios',   label: 'Café-Def.Primarios' },
  { key: 'EF-Cafe-DefSecundarios', label: 'Café-Def.Secundarios' },
  { key: 'EF-Cafe-ColorGrano',     label: 'Café-Color Grano' },
  { key: 'EF-Cacao-FermentPct',    label: 'Cacao-Fermentación%' },
  { key: 'EF-Cacao-HumedadPct',    label: 'Cacao-Humedad%' },
  { key: 'EF-Cacao-Peso100g',      label: 'Cacao-Peso 100g' },
  { key: 'EF-Cacao-Distrito',      label: 'Cacao-Distrito' },
  { key: 'EF-Cacao-Variedad',      label: 'Cacao-Variedad' },
  { key: 'EF-Cacao-Calificacion',  label: 'Cacao-Calificación' },
  { key: 'EF-Observaciones',       label: 'Observaciones' },
];

const ES_COLS: Col[] = [
  { key: 'ES-Tipo',                label: 'Tipo' },
  { key: 'ES-Fecha',               label: 'Fecha Eval.' },
  { key: 'ES-Puntaje',             label: 'Puntaje' },
  { key: 'ES-NotaSabor',           label: 'Nota Sabor' },
  { key: 'ES-NotaSaborResidual',   label: 'Nota Sabor Residual' },
  { key: 'ES-NotaAcidez',          label: 'Nota Acidez' },
  { key: 'ES-Cafe-FraganciaAroma', label: 'Café-Fragancia/Aroma' },
  { key: 'ES-Cafe-Sabor',          label: 'Café-Sabor' },
  { key: 'ES-Cafe-SaborResidual',  label: 'Café-Sabor Residual' },
  { key: 'ES-Cafe-Acidez',         label: 'Café-Acidez' },
  { key: 'ES-Cafe-Cuerpo',         label: 'Café-Cuerpo' },
  { key: 'ES-Cafe-Balance',        label: 'Café-Balance' },
  { key: 'ES-Cafe-Uniformidad',    label: 'Café-Uniformidad' },
  { key: 'ES-Cafe-TazaLimpia',     label: 'Café-Taza Limpia' },
  { key: 'ES-Cafe-Dulzor',         label: 'Café-Dulzor' },
  { key: 'ES-Cacao-Defectos',      label: 'Cacao-Defectos' },
  { key: 'ES-Cacao-SaborCalidad',  label: 'Cacao-Sabor/Calidad' },
  { key: 'ES-Cacao-PuntosCatador', label: 'Cacao-Puntos Catador' },
  { key: 'ES-Observaciones',       label: 'Observaciones' },
];

type PreviewRow = Record<string, string>;

type PreviewItem = {
  muestra: Muestra;
  evaluacionFisica: Record<string, unknown> | null;
  evaluacionSensorial: Record<string, unknown> | null;
};

function str(v: unknown): string {
  if (v == null || v === '') return '';
  if (Array.isArray(v)) return v.map(Boolean).filter(Boolean).length + '/' + v.length;
  return String(v);
}

function muestraToRow(item: PreviewItem): PreviewRow {
  const { muestra: m, evaluacionFisica: ef, evaluacionSensorial: es } = item;
  const fc      = (ef  ? (ef['camposJson']  as Record<string, unknown> ?? {}) : {});
  const sc      = (es  ? (es['camposJson']  as Record<string, unknown> ?? {}) : {});
  const cafeSca = ((sc['cafeSca'] as Record<string, unknown>)?.['sample'] as Record<string, unknown>) ?? {};

  return {
    'Código':            m.codigo,
    'Fecha':             m.fecha ?? '',
    'Fecha Cata':        m.fechaCata ?? '',
    'Tipo Muestra':      m.tipoMuestra ? { pergamino: 'Pergamino', oro: 'Oro', grano_cacao: 'Grano Cacao' }[m.tipoMuestra] ?? '' : '',
    'Categoría':         m.categoriaMuestra ?? '',
    'Estado':            m.estado,
    'Estado Lote':       m.estadoLote ?? '',
    'Productor':         m.productor ? `${m.productor.nombre} ${m.productor.apellido ?? ''}`.trim() : `#${m.productorId}`,
    'Campaña':           m.campana?.nombre ?? `#${m.campanaId}`,
    'Lote':              m.lote?.codigo ?? (m.loteId ? `#${m.loteId}` : ''),
    'Lote Final':        m.loteFinal?.codigo ?? '',
    'Cantidad (kg)':     m.cantidadKg != null ? Number(m.cantidadKg).toFixed(3) : '',
    'Rendimiento':       m.rendimiento != null ? Number(m.rendimiento).toFixed(3) : '',
    'Humedad%':          m.humedad != null ? Number(m.humedad).toFixed(2) : '',
    'Variedad':          m.variedad ?? '',
    'Proceso':           m.proceso ?? '',
    'Base':              m.base ?? '',
    'Año Cosecha':       m.añoCosecha != null ? String(m.añoCosecha) : '',
    'País':              m.pais ?? '',
    'Región':            m.region ?? '',
    'Puntaje Físico':    m.puntajeFisico    != null ? Number(m.puntajeFisico).toFixed(2)    : '',
    'Puntaje Sensorial': m.puntajeSensorial != null ? Number(m.puntajeSensorial).toFixed(2) : '',
    'Observaciones':     m.observaciones ?? '',
    
    'EF-Tipo':                ef ? str(ef['productoTipo']) : '',
    'EF-Fecha':               ef ? str(ef['fecha'])        : '',
    'EF-Puntaje':             ef && ef['puntajeTotal'] != null ? Number(ef['puntajeTotal']).toFixed(2) : '',
    'EF-HumedadGrano':        str(fc['cafeHumedadGrano']    ?? fc['cacaoHumedadGrano']),
    'EF-ActividadGrano':      str(fc['cafeActividadGrano']  ?? fc['cacaoActividadGrano']),
    'EF-Cafe-DefPrimarios':   str(fc['cafeDefectosPrimarios']),
    'EF-Cafe-DefSecundarios': str(fc['cafeDefectosSecundarios']),
    'EF-Cafe-ColorGrano':     str(fc['cafeColorGrano']),
    'EF-Cacao-FermentPct':    str(fc['cacaoFermentacionPct']),
    'EF-Cacao-HumedadPct':    str(fc['cacaoHumedadPct']),
    'EF-Cacao-Peso100g':      str(fc['cacaoPesoCienGranos']),
    'EF-Cacao-Distrito':      str(fc['cacaoDistrito']),
    'EF-Cacao-Variedad':      str(fc['cacaoVariedad']),
    'EF-Cacao-Calificacion':  str(fc['cacaoCalificacion']),
    'EF-Observaciones':       ef ? str(ef['observaciones']) : '',
    
    'ES-Tipo':                es ? str(es['productoTipo']) : '',
    'ES-Fecha':               es ? str(es['fecha'])        : '',
    'ES-Puntaje':             es && es['puntajeTotal'] != null ? Number(es['puntajeTotal']).toFixed(2) : '',
    'ES-NotaSabor':           str(cafeSca['notaSabor']),
    'ES-NotaSaborResidual':   str(cafeSca['notaSaborResidual']),
    'ES-NotaAcidez':          str(cafeSca['notaAcidez']),
    'ES-Cafe-FraganciaAroma': str(cafeSca['fragTotal']),
    'ES-Cafe-Sabor':          str(cafeSca['sabor']),
    'ES-Cafe-SaborResidual':  str(cafeSca['saborResidual']),
    'ES-Cafe-Acidez':         str(cafeSca['acidez']),
    'ES-Cafe-Cuerpo':         str(cafeSca['cuerpo']),
    'ES-Cafe-Balance':        str(cafeSca['balance']),
    'ES-Cafe-Uniformidad':    str(cafeSca['uniformidad']),
    'ES-Cafe-TazaLimpia':     str(cafeSca['tazaLimpia']),
    'ES-Cafe-Dulzor':         str(cafeSca['dulzor']),
    'ES-Cacao-Defectos':      str(sc['defectos']),
    'ES-Cacao-SaborCalidad':  str(sc['saborCalidad']),
    'ES-Cacao-PuntosCatador': str(sc['puntosCatador']),
    'ES-Observaciones':       es ? str(es['observaciones']) : '',
  };
}

const TH_BASE = 'px-2 py-1.5 text-[0.55rem] font-bold text-white uppercase tracking-wider border-r whitespace-nowrap';
const TH_MUESTRA = `${TH_BASE} border-green-800`;
const TH_EF      = `${TH_BASE} border-blue-900`;
const TH_ES      = `${TH_BASE} border-amber-900`;

export function ExportarMuestrasPage() {
  const navigate = useNavigate();

  const [campanas,    setCampanas]    = useState<Campana[]>([]);
  const [productores, setProductores] = useState<Productor[]>([]);

  const [filterCampanaId,   setFilterCampanaId]   = useState('');
  const [filterProductorId, setFilterProductorId] = useState('');
  const [filterLote,        setFilterLote]        = useState('');
  const [filterTipo,        setFilterTipo]        = useState<TipoMuestra | ''>('');
  const [filterEstado,      setFilterEstado]      = useState<EstadoMuestra | ''>('');

  useEffect(() => {
    campanasService.getPage(1, 100).then((r) => setCampanas(r.data));
    productoresService.getPage(
      1, 100,
      filterCampanaId ? Number(filterCampanaId) : undefined,
    ).then((r) => setProductores(r.data));
  }, [filterCampanaId]);

  const [rows,        setRows]        = useState<PreviewRow[]>([]);
  const [loading,     setLoading]     = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [searched,    setSearched]    = useState(false);
  const [error,       setError]       = useState('');

  const buildParams = useCallback(() => ({
    page: 1, limit: 500,
    ...(filterCampanaId   && { campanaId:   Number(filterCampanaId)   }),
    ...(filterProductorId && { productorId: Number(filterProductorId) }),
    ...(filterTipo        && { tipoMuestra: filterTipo               }),
    ...(filterEstado      && { estado:      filterEstado             }),
    ...(filterLote        && { search:      filterLote               }),
  }), [filterCampanaId, filterProductorId, filterTipo, filterEstado, filterLote]);

  async function handleBuscar() {
    setLoading(true); setError(''); setSearched(false);
    try {
      const result = await muestrasService.exportPreview(buildParams() as FilterMuestrasDto);
      setRows(result.data.map(muestraToRow));
      setSearched(true);
    } catch {
      setError('Error al cargar datos. Verifica tu conexión.');
    } finally {
      setLoading(false);
    }
  }

  async function handleDescargar() {
    if (rows.length === 0) return;
    setDownloading(true);
    try {
      const blob = await muestrasService.exportExcel(buildParams());
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href = url; a.download = 'muestras.xlsx'; a.click();
      URL.revokeObjectURL(url);
    } catch {
      setError('Error al descargar el Excel.');
    } finally {
      setDownloading(false);
    }
  }

  const inputCls = 'w-full border border-gray-300 bg-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500';

  return (
    <div className="min-h-full bg-white flex flex-col">
      <div className="px-4 md:px-8 pt-6 pb-4 flex items-center gap-4">
        <button onClick={() => navigate('/dashboard/muestras')} className="p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-500">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
        </button>
        <div>
          <h1 className="font-headline text-2xl sm:text-3xl font-black uppercase tracking-wide text-gray-800">Exportar muestras</h1>
          <p className="text-xs text-gray-400 mt-0.5">Previsualiza y descarga las muestras filtradas en Excel</p>
        </div>
      </div>

      
      <div className="px-4 md:px-8 py-4 border-b border-gray-100" style={{ backgroundColor: '#eef3ec' }}>
        <div className="flex flex-wrap items-end gap-3">
          <div className="w-48">
            <label className="block text-[0.65rem] font-bold text-gray-600 uppercase tracking-wider mb-1">Campaña</label>
            <select value={filterCampanaId} onChange={(e) => setFilterCampanaId(e.target.value)} className={inputCls}>
              <option value="">Todas</option>
              {campanas.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
            </select>
          </div>
          <div className="w-40">
            <label className="block text-[0.65rem] font-bold text-gray-600 uppercase tracking-wider mb-1">Lote</label>
            <input value={filterLote} onChange={(e) => setFilterLote(e.target.value)} className={inputCls} placeholder="Código..." />
          </div>
          <div className="flex-1 min-w-48">
            <label className="block text-[0.65rem] font-bold text-gray-600 uppercase tracking-wider mb-1">Nombre del Productor / Razón Social</label>
            <select value={filterProductorId} onChange={(e) => setFilterProductorId(e.target.value)} className={inputCls}>
              <option value="">Todos</option>
              {productores.map((p) => <option key={p.id} value={p.id}>{p.nombre} {p.apellido ?? ''}</option>)}
            </select>
          </div>
          <div className="w-36">
            <label className="block text-[0.65rem] font-bold text-gray-600 uppercase tracking-wider mb-1">Tipo muestra</label>
            <select value={filterTipo} onChange={(e) => setFilterTipo(e.target.value as TipoMuestra | '')} className={inputCls}>
              <option value="">Todos</option>
              <option value="cafe">Café</option>
              <option value="cacao">Cacao</option>
            </select>
          </div>
          <div className="w-36">
            <label className="block text-[0.65rem] font-bold text-gray-600 uppercase tracking-wider mb-1">Estado</label>
            <select value={filterEstado} onChange={(e) => setFilterEstado(e.target.value as EstadoMuestra | '')} className={inputCls}>
              <option value="">Todos</option>
              <option value="pendiente">Pendiente</option>
              <option value="en_proceso">En proceso</option>
              <option value="completada">Completada</option>
              <option value="rechazada">Rechazada</option>
            </select>
          </div>
          <button onClick={handleBuscar} disabled={loading}
            className="h-10 w-10 rounded-xl bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors shrink-0">
            <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="11" cy="11" r="8"/><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35"/></svg>
          </button>
          {rows.length > 0 && (
            <button onClick={handleDescargar} disabled={downloading}
              className="flex items-center gap-2 px-4 h-10 rounded-xl text-sm font-bold text-white uppercase tracking-wide transition-opacity hover:opacity-90"
              style={{ backgroundColor: downloading ? '#9ca3af' : '#2d5a3d' }}>
              {downloading ? (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={4}/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
              )}
              {downloading ? 'Descargando…' : 'Descargar Excel'}
            </button>
          )}
        </div>
      </div>

      
      <div className="flex-1 overflow-auto px-4 md:px-8 py-6">
        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <LoadingLogo />
            <p className="text-sm text-gray-400">Cargando datos…</p>
          </div>
        )}

        {!loading && !searched && (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400">
            <svg className="w-16 h-16 mb-3 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>
            </svg>
            <p className="text-sm font-medium">Aplica filtros y presiona buscar</p>
            <p className="text-xs mt-1">Los datos aparecerán aquí antes de descargar</p>
          </div>
        )}

        {!loading && searched && rows.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400">
            <p className="text-sm font-medium">Sin resultados para los filtros seleccionados</p>
          </div>
        )}

        {!loading && rows.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-gray-500">
                <span className="font-semibold text-gray-800">{rows.length}</span> registro{rows.length !== 1 ? 's' : ''} encontrado{rows.length !== 1 ? 's' : ''}
              </p>
              <p className="text-xs text-gray-400">
                Los campos de evaluación se completan en la descarga Excel — la previsualización muestra la estructura completa
              </p>
            </div>

            <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm">
              <div className="overflow-x-auto">
                <table className="text-xs border-collapse" style={{ minWidth: 'max-content' }}>
                  <thead>
                    
                    <tr>
                      <th
                        rowSpan={2}
                        className="px-2 py-2 text-[0.55rem] font-bold text-white uppercase tracking-wider text-center border-r border-green-800 w-7 align-middle"
                        style={{ backgroundColor: '#2d5a3d' }}
                      >#</th>
                      <th
                        colSpan={MUESTRA_COLS.length}
                        className="px-3 py-2 text-[0.6rem] font-bold text-white uppercase tracking-wider text-center border-r border-green-800"
                        style={{ backgroundColor: '#2d5a3d' }}
                      >Muestra</th>
                      <th
                        colSpan={EF_COLS.length}
                        className="px-3 py-2 text-[0.6rem] font-bold text-white uppercase tracking-wider text-center border-r border-blue-900"
                        style={{ backgroundColor: '#1a5276' }}
                      >Evaluación Física</th>
                      <th
                        colSpan={ES_COLS.length}
                        className="px-3 py-2 text-[0.6rem] font-bold text-white uppercase tracking-wider text-center"
                        style={{ backgroundColor: '#7e5109' }}
                      >Evaluación Sensorial</th>
                    </tr>
                    
                    <tr>
                      {MUESTRA_COLS.map((c) => (
                        <th key={c.key} className={TH_MUESTRA} style={{ backgroundColor: '#3d7a53' }}>{c.label}</th>
                      ))}
                      {EF_COLS.map((c) => (
                        <th key={c.key} className={TH_EF} style={{ backgroundColor: '#1f6391' }}>{c.label}</th>
                      ))}
                      {ES_COLS.map((c, i) => (
                        <th key={c.key} className={i === ES_COLS.length - 1 ? TH_ES.replace('border-r', '') : TH_ES} style={{ backgroundColor: '#9a6a1a' }}>{c.label}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, i) => (
                      <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-[#f2f7f2]'}>
                        <td className="px-2 py-1.5 text-gray-400 text-center border-r border-gray-100 font-mono text-[0.6rem]">{i + 1}</td>
                        {MUESTRA_COLS.map((c) => (
                          <td key={c.key} className="px-2 py-1.5 text-gray-700 border-r border-gray-100 whitespace-nowrap max-w-[160px] truncate text-[0.65rem]" title={row[c.key]}>
                            {row[c.key] || <span className="text-gray-300">—</span>}
                          </td>
                        ))}
                        {EF_COLS.map((c) => (
                          <td key={c.key} className="px-2 py-1.5 text-gray-500 border-r border-gray-100 whitespace-nowrap text-center text-[0.65rem]" title={row[c.key]}>
                            {row[c.key] || <span className="text-gray-200">—</span>}
                          </td>
                        ))}
                        {ES_COLS.map((c, j) => (
                          <td key={c.key} className={`px-2 py-1.5 text-gray-500 whitespace-nowrap text-center text-[0.65rem] ${j < ES_COLS.length - 1 ? 'border-r border-gray-100' : ''}`} title={row[c.key]}>
                            {row[c.key] || <span className="text-gray-200">—</span>}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
