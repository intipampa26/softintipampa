import { useState, useCallback, useEffect } from 'react';
import { muestrasService, Muestra, TipoMuestra, EstadoMuestra } from '@/services/muestras.service';
import { campanasService, Campana } from '@/services/campanas.service';
import { productoresService, Productor } from '@/services/productores.service';
import LoadingLogo from '@/components/LoadingLogo';
import { useToast } from '@/contexts/ToastContext';

interface ExcelRow {
  Codigo: string; Fecha: string; FechaCata: string; Tipo: string; CategoriaMuestra: string;
  Estado: string; Productor: string; Campaña: string; Lote: string; LoteFinal: string;
  CantidadKg: string; Rendimiento: string; Humedad: string;
  Variedad: string; Proceso: string; Base: string;
  AñoCosecha: string; Pais: string; Region: string;
  PuntajeFisico: string; PuntajeSensorial: string; Observaciones: string;
}

const COLS: (keyof ExcelRow)[] = [
  'Codigo','Fecha','FechaCata','Tipo','CategoriaMuestra',
  'Estado','Productor','Campaña','Lote','LoteFinal',
  'CantidadKg','Rendimiento','Humedad',
  'Variedad','Proceso','Base',
  'AñoCosecha','Pais','Region',
  'PuntajeFisico','PuntajeSensorial','Observaciones',
];

function muestraToRow(m: Muestra): ExcelRow {
  return {
    Codigo:           m.codigo,
    Fecha:            m.fecha ?? '',
    FechaCata:        m.fechaCata ?? '',
    Tipo:             m.tipoMuestra ? { pergamino: 'Pergamino', oro: 'Oro', grano_cacao: 'Grano Cacao' }[m.tipoMuestra] ?? '' : '',
    CategoriaMuestra: m.categoriaMuestra ?? '',
    Estado:           m.estado,
    Productor:        m.productor ? `${m.productor.nombre} ${m.productor.apellido ?? ''}`.trim() : `#${m.productorId}`,
    Campaña:          m.campana?.nombre ?? `#${m.campanaId}`,
    Lote:             m.lote?.codigo ?? '',
    LoteFinal:        (m as any).loteFinal?.codigo ?? '',
    CantidadKg:       m.cantidadKg   != null ? Number(m.cantidadKg).toFixed(2)   : '',
    Rendimiento:      m.rendimiento  != null ? Number(m.rendimiento).toFixed(2)  : '',
    Humedad:          m.humedad      != null ? Number(m.humedad).toFixed(2)      : '',
    Variedad:         m.variedad     ?? '',
    Proceso:          m.proceso      ?? '',
    Base:             m.base         ?? '',
    AñoCosecha:       m.añoCosecha   != null ? String(m.añoCosecha) : '',
    Pais:             m.pais         ?? '',
    Region:           m.region       ?? '',
    PuntajeFisico:    m.puntajeFisico    != null ? Number(m.puntajeFisico).toFixed(2)    : '',
    PuntajeSensorial: m.puntajeSensorial != null ? Number(m.puntajeSensorial).toFixed(2) : '',
    Observaciones:    m.observaciones ?? '',
  };
}

interface Props { onClose: () => void; }

export function ExportarMuestrasModal({ onClose }: Props) {
  const [campanas,    setCampanas]    = useState<Campana[]>([]);
  const [productores, setProductores] = useState<Productor[]>([]);

  const [filterCampanaId,   setFilterCampanaId]   = useState('');
  const [filterProductorId, setFilterProductorId] = useState('');
  const [filterLote,        setFilterLote]        = useState('');
  const [filterTipo,        setFilterTipo]        = useState<TipoMuestra | ''>('');
  const [filterEstado,      setFilterEstado]      = useState<EstadoMuestra | ''>('');

  const [rows,        setRows]        = useState<ExcelRow[]>([]);
  const [loading,     setLoading]     = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [searched,    setSearched]    = useState(false);
  const toast = useToast();

  useEffect(() => {
    campanasService.getPage(1, 100).then(r => setCampanas(r.data));
  }, []);

  useEffect(() => {
    productoresService.getPage(1, 100, filterCampanaId ? Number(filterCampanaId) : undefined)
      .then(r => setProductores(r.data));
  }, [filterCampanaId]);

  const buildParams = useCallback(() => ({
    page: 1, limit: 500,
    ...(filterCampanaId   && { campanaId:   Number(filterCampanaId)   }),
    ...(filterProductorId && { productorId: Number(filterProductorId) }),
    ...(filterTipo        && { tipoMuestra: filterTipo }),
    ...(filterEstado      && { estado:      filterEstado }),
    ...(filterLote        && { search:      filterLote }),
  }), [filterCampanaId, filterProductorId, filterTipo, filterEstado, filterLote]);

  async function handleBuscar() {
    setLoading(true); setSearched(false);
    try {
      const result = await muestrasService.getPage(buildParams());
      setRows(result.data.map(muestraToRow));
      setSearched(true);
    } catch { toast.error('Error al cargar datos.'); }
    finally { setLoading(false); }
  }

  async function handleDescargar() {
    if (!rows.length) return;
    setDownloading(true);
    try {
      const blob = await muestrasService.exportExcel(buildParams());
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href = url; a.download = 'muestras.xlsx'; a.click();
      URL.revokeObjectURL(url);
    } catch { toast.error('Error al descargar el Excel.'); }
    finally { setDownloading(false); }
  }

  const sel = 'w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white';

  return (
    <div
      onClick={e => e.target === e.currentTarget && onClose()}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1rem', backgroundColor: 'rgba(0,0,0,0.55)',
      }}>
      <div style={{ width: '100%', maxWidth: '72rem', maxHeight: '92vh', display: 'flex', flexDirection: 'column' }}
        className="bg-white rounded-2xl shadow-2xl">

        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100 shrink-0">
          <div>
            <h2 className="font-black text-gray-800 uppercase tracking-wide">Exportar Muestras</h2>
            <p className="text-xs text-gray-400 mt-0.5">Previsualiza y descarga las muestras filtradas en Excel</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <div className="px-6 py-4 border-b border-gray-100 shrink-0 bg-gray-50">
          <div className="flex flex-wrap gap-3 items-end">
            <div className="w-44">
              <label className="block text-[0.65rem] font-bold text-gray-500 uppercase tracking-wider mb-1">Campaña</label>
              <select value={filterCampanaId} onChange={e => { setFilterCampanaId(e.target.value); setFilterProductorId(''); }} className={sel}>
                <option value="">Todas</option>
                {campanas.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
              </select>
            </div>
            <div className="w-44">
              <label className="block text-[0.65rem] font-bold text-gray-500 uppercase tracking-wider mb-1">Productor</label>
              <select value={filterProductorId} onChange={e => setFilterProductorId(e.target.value)} className={sel}>
                <option value="">Todos</option>
                {productores.map(p => <option key={p.id} value={p.id}>{p.nombre} {p.apellido ?? ''}</option>)}
              </select>
            </div>
            <div className="w-32">
              <label className="block text-[0.65rem] font-bold text-gray-500 uppercase tracking-wider mb-1">Tipo</label>
              <select value={filterTipo} onChange={e => setFilterTipo(e.target.value as TipoMuestra | '')} className={sel}>
                <option value="">Todos</option>
                <option value="cafe">Café</option>
                <option value="cacao">Cacao</option>
              </select>
            </div>
            <div className="w-32">
              <label className="block text-[0.65rem] font-bold text-gray-500 uppercase tracking-wider mb-1">Estado</label>
              <select value={filterEstado} onChange={e => setFilterEstado(e.target.value as EstadoMuestra | '')} className={sel}>
                <option value="">Todos</option>
                <option value="pendiente">Pendiente</option>
                <option value="en_proceso">En proceso</option>
                <option value="completada">Completada</option>
                <option value="rechazada">Rechazada</option>
              </select>
            </div>
            <div className="flex gap-2 items-end">
              <button onClick={handleBuscar} disabled={loading}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white disabled:opacity-50"
                style={{ backgroundColor: '#1A2B23' }}>
                {loading
                  ? <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin inline-block" />
                  : <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="11" cy="11" r="8"/><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35"/></svg>
                }
                {loading ? 'Buscando…' : 'Buscar'}
              </button>
              {rows.length > 0 && (
                <button onClick={handleDescargar} disabled={downloading}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white disabled:opacity-50"
                  style={{ backgroundColor: '#2d5a3d' }}>
                  {downloading
                    ? <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin inline-block" />
                    : <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                  }
                  {downloading ? 'Descargando…' : `Descargar Excel (${rows.length})`}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto px-6 py-4">
          {loading && (
            <div className="flex items-center justify-center py-16"><LoadingLogo /></div>
          )}

          {!loading && !searched && (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <svg className="w-12 h-12 mb-3 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
              <p className="text-sm">Aplica filtros y presiona <strong>Buscar</strong> para previsualizar</p>
            </div>
          )}

          {!loading && searched && rows.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <p className="text-sm">Sin resultados para los filtros seleccionados</p>
            </div>
          )}

          {!loading && rows.length > 0 && (
            <>
              <p className="text-xs text-gray-500 mb-3">
                <strong className="text-gray-800">{rows.length}</strong> registro{rows.length !== 1 ? 's' : ''} · máx. 500 filas en previsualización
              </p>
              <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs min-w-max border-collapse">
                    <thead>
                      <tr>
                        <th style={{ backgroundColor: '#2d5a3d', color: '#fff' }} className="px-3 py-2 text-[0.6rem] font-bold text-center border-r border-green-700 w-8 uppercase tracking-wider">#</th>
                        {COLS.map(col => (
                          <th key={col} style={{ backgroundColor: '#2d5a3d', color: '#fff' }} className="px-3 py-2 text-[0.6rem] font-bold text-left border-r border-green-700 last:border-r-0 whitespace-nowrap uppercase tracking-wider">{col}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((row, i) => (
                        <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-3 py-1.5 text-gray-400 text-center border-r border-gray-100 font-mono">{i + 1}</td>
                          {COLS.map(col => (
                            <td key={col} className="px-3 py-1.5 text-gray-700 border-r border-gray-100 last:border-r-0 whitespace-nowrap max-w-[180px] truncate" title={row[col]}>
                              {row[col] || <span className="text-gray-300">—</span>}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="px-6 py-4 border-t border-gray-100 shrink-0 flex justify-end">
          <button onClick={onClose} className="px-5 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
