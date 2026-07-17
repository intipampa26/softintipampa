import { useState, useEffect, useCallback, useRef } from 'react';
import { X, CheckCheck, Calendar, ChevronDown, Star, FileText, Upload, Trash2, Globe } from 'lucide-react';
import { ModalLoadingOverlay } from '@/components/ui/ModalLoadingOverlay';
import { useToast } from '@/contexts/ToastContext';
import { ordenesVentaService } from '../services/ordenes-venta.service';
import { lotesService } from '@/services/lotes.service';

const CP = '#445D46';
const BD = '#D9DDD8';
const TX = '#2C2C2C';

const INP      = 'w-full border rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-600 transition-all';
const inpStyle = { borderColor: BD, color: TX };

const fieldLabel = (label: string) => (
  <label className="block text-[0.65rem] font-bold uppercase tracking-wide mb-1.5" style={{ color: TX, opacity: 0.55 }}>{label}</label>
);

type Tab = 'importacion' | 'feedback' | 'reclamos';

type UploadedEntry = { name: string; file: string };

interface Props {
  orden: { dbId: number; id: string; cliente: string; lote: string; tipoProducto: string };
  initialTab?: Tab;
  onClose: () => void;
}

const TABS: { key: Tab; label: string; short: string }[] = [
  { key: 'importacion', label: 'Importación',             short: 'Importación' },
  { key: 'feedback',    label: 'Feedback del Cliente',    short: 'Feedback'    },
  { key: 'reclamos',    label: 'Resolución de Problemas', short: 'Reclamos'    },
];

const TIPO_REC   = ['Calidad del producto','Cantidad / Peso','Documentación','Tiempo de entrega','Otro'];
const ESTADO_REC = ['Pendiente','En revisión','Resuelto','Cerrado sin solución'];

function CheckboxUI({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <div onClick={onChange} className="w-5 h-5 shrink-0 rounded border-2 flex items-center justify-center cursor-pointer transition-all"
      style={{ borderColor: checked ? CP : BD, backgroundColor: checked ? CP : '#fff' }}>
      {checked && <svg width="10" height="10" viewBox="0 0 9 9" fill="none"><path d="M1.5 4.5L3.5 6.5L7.5 2.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
    </div>
  );
}

export function PostVentaModal({ orden, initialTab = 'importacion', onClose }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>(initialTab);
  const [loading,   setLoading]   = useState(true);
  const [saving,    setSaving]    = useState(false);
  const toast = useToast();

  // ── Importación ────────────────────────────────────────────────────────────────
  const [agenteAduanaCliente, setAgenteAduanaCliente] = useState('');
  const [fechaLlegada,        setFechaLlegada]        = useState('');
  const [puertoLlegada,       setPuertoLlegada]       = useState('');
  const [inspeccionDestino,   setInspeccionDestino]   = useState(false);
  const [filesMapPostVenta,   setFilesMapPostVenta]   = useState<Record<string, UploadedEntry[]>>({});
  const fileInputRef  = useRef<HTMLInputElement>(null);
  const pendingCatRef = useRef<string | null>(null);

  // ── Feedback ───────────────────────────────────────────────────────────────────
  const [fechaFeedback,  setFechaFeedback]  = useState('');
  const [rating,         setRating]         = useState(0);
  const [hoverRating,    setHoverRating]    = useState(0);
  const [comentCalidad,  setComentCalidad]  = useState('');
  const [comentServicio, setComentServicio] = useState('');
  const [recomendaria,   setRecomendaria]   = useState<'si' | 'no' | ''>('');
  const [observFeedback, setObservFeedback] = useState('');

  // ── Reclamos ───────────────────────────────────────────────────────────────────
  const [nroReclamo,          setNroReclamo]          = useState('');
  const [fechaReclamo,        setFechaReclamo]        = useState('');
  const [tipoReclamo,         setTipoReclamo]         = useState('');
  const [descripcionReclamo,  setDescripcionReclamo]  = useState('');
  const [estadoReclamo,       setEstadoReclamo]       = useState('');
  const [solucion,            setSolucion]            = useState('');
  const [fechaResolucion,     setFechaResolucion]     = useState('');
  const [responsable,         setResponsable]         = useState('');
  const [observReclamo,       setObservReclamo]       = useState('');

  useEffect(() => {
    ordenesVentaService.getPostVenta(orden.dbId)
      .then(data => {
        if (!data) return;
        // Importación
        setAgenteAduanaCliente(data.agenteAduanaCliente ?? '');
        setFechaLlegada(data.fechaLlegada ?? '');
        setPuertoLlegada(data.puertoLlegada ?? '');
        setInspeccionDestino(data.inspeccionDestino ?? false);
        if (data.filesMapPostVenta && typeof data.filesMapPostVenta === 'object') {
          setFilesMapPostVenta(data.filesMapPostVenta as Record<string, UploadedEntry[]>);
        }
        // Feedback
        setFechaFeedback(data.fechaFeedback ?? '');
        setRating(data.rating ?? 0);
        setComentCalidad(data.comentCalidad ?? '');
        setComentServicio(data.comentServicio ?? '');
        setRecomendaria((data.recomendaria as 'si' | 'no' | '') ?? '');
        setObservFeedback(data.observFeedback ?? '');
        // Reclamos
        setNroReclamo(data.nroReclamo ?? '');
        setFechaReclamo(data.fechaReclamo ?? '');
        setTipoReclamo(data.tipoReclamo ?? '');
        setDescripcionReclamo(data.descripcionReclamo ?? '');
        setEstadoReclamo(data.estadoReclamo ?? '');
        setSolucion(data.solucion ?? '');
        setFechaResolucion(data.fechaResolucion ?? '');
        setResponsable(data.responsable ?? '');
        setObservReclamo(data.observReclamo ?? '');
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [orden.dbId]);

  const handleGuardar = useCallback(async () => {
    setSaving(true);
    try {
      const dto: Record<string, unknown> = {
        agenteAduanaCliente:  agenteAduanaCliente  || null,
        fechaLlegada:         fechaLlegada         || null,
        puertoLlegada:        puertoLlegada        || null,
        inspeccionDestino,
        filesMapPostVenta:    Object.keys(filesMapPostVenta).length > 0 ? filesMapPostVenta : null,
        fechaFeedback:        fechaFeedback        || null,
        rating:               rating > 0 ? rating  : null,
        comentCalidad:        comentCalidad        || null,
        comentServicio:       comentServicio       || null,
        recomendaria:         recomendaria         || null,
        observFeedback:       observFeedback       || null,
        nroReclamo:           nroReclamo           || null,
        fechaReclamo:         fechaReclamo         || null,
        tipoReclamo:          tipoReclamo          || null,
        descripcionReclamo:   descripcionReclamo   || null,
        estadoReclamo:        estadoReclamo        || null,
        solucion:             solucion             || null,
        fechaResolucion:      fechaResolucion      || null,
        responsable:          responsable          || null,
        observReclamo:        observReclamo        || null,
      };
      await ordenesVentaService.upsertPostVenta(orden.dbId, dto);
      toast.success('Guardado correctamente');
      try {
        const alistado = await ordenesVentaService.getAlistado(orden.dbId);
        const ids: number[] = (alistado?.lotesAsignados ?? []).map((a: any) => Number(a.loteFinalId)).filter(Boolean);
        if (ids.length) lotesService.updateEstadoByLoteFinals(ids, 'EXPORTADO').catch(() => {});
      } catch { /* silent */ }
    } catch {
      toast.error('Error al guardar');
    } finally {
      setSaving(false);
    }
  }, [
    agenteAduanaCliente, fechaLlegada, puertoLlegada, inspeccionDestino, filesMapPostVenta,
    fechaFeedback, rating, comentCalidad, comentServicio, recomendaria, observFeedback,
    nroReclamo, fechaReclamo, tipoReclamo, descripcionReclamo, estadoReclamo,
    solucion, fechaResolucion, responsable, observReclamo, orden.dbId,
  ]);

  // ── File uploads ──────────────────────────────────────────────────────────────
  const triggerUpload = (cat: string) => {
    pendingCatRef.current = cat;
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const cat  = pendingCatRef.current;
    if (!file || !cat) return;
    e.target.value = '';
    pendingCatRef.current = null;
    try {
      const updated = await ordenesVentaService.uploadPostVentaFile(orden.dbId, cat, file);
      setFilesMapPostVenta(prev => ({ ...prev, [cat]: updated }));
    } catch { toast.error('Error al subir archivo'); }
  };

  const handleDeleteFile = async (cat: string, filename: string) => {
    try {
      const updated = await ordenesVentaService.deletePostVentaFile(orden.dbId, cat, filename);
      setFilesMapPostVenta(prev => ({ ...prev, [cat]: updated }));
    } catch { toast.error('Error al eliminar'); }
  };

  const getFiles = (cat: string): UploadedEntry[] => filesMapPostVenta[cat] ?? [];

  const renderFileBlock = (cat: string, label: string) => {
    const files = getFiles(cat);
    return (
      <div>
        {fieldLabel(label)}
        <button type="button" onClick={() => triggerUpload(cat)}
          className="w-full flex items-center justify-center gap-2 border-2 border-dashed rounded-xl py-2 text-xs font-semibold transition-colors hover:opacity-80"
          style={{ borderColor: BD, color: '#6B7280' }}>
          <Upload size={12}/> Adjuntar
        </button>
        {files.length > 0 && (
          <div className="mt-1.5 flex flex-col gap-1">
            {files.map((f, i) => (
              <div key={i} className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs min-w-0" style={{ backgroundColor: `${CP}08` }}>
                <FileText size={12} style={{ color: CP, flexShrink: 0 }} />
                <a href={`/uploads/post-venta/${orden.dbId}/${cat}/${f.file}`} target="_blank" rel="noopener noreferrer"
                  className="flex-1 truncate font-medium hover:underline min-w-0" style={{ color: TX }}>{f.name}</a>
                <button type="button" onClick={() => handleDeleteFile(cat, f.file)} className="shrink-0 hover:opacity-70">
                  <Trash2 size={12} className="text-red-400" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6"
      style={{ backgroundColor: 'rgba(0,0,0,0.38)', backdropFilter: 'blur(12px) saturate(0.75)' }}
      onClick={e => !saving && e.target === e.currentTarget && onClose()}
    >
      <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileChange}
        accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg" />

      <div
        className="relative w-full sm:max-w-4xl rounded-t-3xl sm:rounded-3xl flex flex-col overflow-hidden"
        style={{ background: 'rgba(255,255,255,0.96)', backdropFilter: 'blur(28px) saturate(1.4)', WebkitBackdropFilter: 'blur(28px) saturate(1.4)', border: '1px solid rgba(255,255,255,0.6)', boxShadow: '0 24px 60px rgba(0,0,0,0.22)', maxHeight: '92vh' }}
      >
        <ModalLoadingOverlay show={saving || loading} message={loading ? 'Cargando…' : 'Guardando…'} />

        <div className="flex items-center justify-between px-5 py-4 border-b shrink-0" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: CP }}>
              <CheckCheck size={15} className="text-white" />
            </div>
            <div className="min-w-0">
              <p className="font-black text-sm uppercase tracking-wide" style={{ color: TX }}>Post Venta</p>
              <p className="text-[0.62rem] text-gray-400 truncate">{orden.id} · {orden.cliente} · {orden.lote}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button onClick={handleGuardar} disabled={saving || loading} className="text-[0.65rem] font-bold px-4 py-2 rounded-xl text-white transition-opacity hover:opacity-90 disabled:opacity-50" style={{ backgroundColor: CP }}>GUARDAR</button>
            <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-600 transition-all ml-1"><X size={16} /></button>
          </div>
        </div>

        <div className="flex gap-0.5 px-5 pt-4 shrink-0 border-b overflow-x-auto scrollbar-none" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
          {TABS.map(t => (
            <button key={t.key} onClick={() => setActiveTab(t.key)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-t-xl text-xs font-bold uppercase tracking-wide transition-all whitespace-nowrap shrink-0"
              style={{ backgroundColor: activeTab === t.key ? CP : 'transparent', color: activeTab === t.key ? '#fff' : '#9CA3AF', borderBottom: activeTab === t.key ? `2px solid ${CP}` : '2px solid transparent', marginBottom: '-1px' }}>
              <span className="sm:hidden">{t.short}</span>
              <span className="hidden sm:inline">{t.label}</span>
            </button>
          ))}
        </div>

        <div className="overflow-y-auto flex-1 px-5 py-5">

          {/* ── IMPORTACIÓN ── */}
          {activeTab === 'importacion' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  {fieldLabel('Agente de aduana cliente')}
                  <input value={agenteAduanaCliente} onChange={e => setAgenteAduanaCliente(e.target.value)} className={INP} style={inpStyle} placeholder="Nombre del agente de aduanas del cliente…" />
                </div>
                <div>
                  {fieldLabel('Fecha de llegada')}
                  <div className="relative">
                    <input type="date" value={fechaLlegada} onChange={e => setFechaLlegada(e.target.value)} className={INP} style={inpStyle} />
                    <Calendar size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  {fieldLabel('Puerto llegada')}
                  <input value={puertoLlegada} onChange={e => setPuertoLlegada(e.target.value)} className={INP} style={inpStyle} placeholder="Rotterdam, Hamburg, NY…" />
                </div>
                <div className="sm:col-span-2">
                  <div className="flex items-center gap-3 rounded-xl px-4 py-3 border cursor-pointer" style={{ borderColor: BD }} onClick={() => setInspeccionDestino(v => !v)}>
                    <CheckboxUI checked={inspeccionDestino} onChange={() => {}} />
                    <div>
                      <p className="text-sm font-semibold" style={{ color: TX }}>Inspección en destino</p>
                      <p className="text-[0.62rem] text-gray-400">Marcar si el cliente informa inspección en destino</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Documentos */}
              <div>
                <p className="text-[0.65rem] font-black uppercase tracking-widest mb-3" style={{ color: TX }}>Documentos</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {renderFileBlock('transmision_datos', 'Transmisión de datos')}
                  {renderFileBlock('fda_traces', 'FDA / Traces / Otro')}
                  {renderFileBlock('packing_list', 'Packing List')}
                  {renderFileBlock('factura_comercial', 'Factura comercial')}
                </div>
              </div>

              {/* Info panel */}
              <div className="rounded-xl px-4 py-3 flex items-start gap-3" style={{ backgroundColor: `${CP}08`, border: `1px solid ${CP}20` }}>
                <Globe size={14} style={{ color: CP, flexShrink: 0, marginTop: 2 }} />
                <p className="text-xs text-gray-500">Registra el proceso de importación en el país del cliente: llegada del contenedor, inspecciones y documentación de aduana internacional.</p>
              </div>
            </div>
          )}

          {/* ── FEEDBACK DEL CLIENTE ── */}
          {activeTab === 'feedback' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  {fieldLabel('Fecha de feedback')}
                  <div className="relative">
                    <input type="date" value={fechaFeedback} onChange={e => setFechaFeedback(e.target.value)} className={INP} style={inpStyle} />
                    <Calendar size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  {fieldLabel('Calificación general')}
                  <div className="flex items-center gap-1 h-[42px]">
                    {[1,2,3,4,5].map(n => (
                      <button key={n} type="button"
                        onMouseEnter={() => setHoverRating(n)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setRating(n === rating ? 0 : n)}
                        className="transition-transform hover:scale-110">
                        <Star size={22} fill={(hoverRating || rating) >= n ? '#F59E0B' : 'none'} stroke={(hoverRating || rating) >= n ? '#F59E0B' : '#D1D5DB'} />
                      </button>
                    ))}
                    {rating > 0 && <span className="ml-2 text-xs font-bold" style={{ color: '#F59E0B' }}>{rating}/5</span>}
                  </div>
                </div>
                <div className="sm:col-span-2">
                  {fieldLabel('Comentarios sobre la calidad del producto')}
                  <textarea rows={3} value={comentCalidad} onChange={e => setComentCalidad(e.target.value)} className={`${INP} resize-none`} style={inpStyle} placeholder="Opinión del cliente sobre el producto recibido…" />
                </div>
                <div className="sm:col-span-2">
                  {fieldLabel('Comentarios sobre el servicio')}
                  <textarea rows={3} value={comentServicio} onChange={e => setComentServicio(e.target.value)} className={`${INP} resize-none`} style={inpStyle} placeholder="Opinión del cliente sobre la atención y proceso…" />
                </div>
                <div>
                  {fieldLabel('¿Nos recomendaría?')}
                  <div className="flex gap-4 mt-1">
                    {(['si','no'] as const).map(v => (
                      <div key={v} className="flex items-center gap-2 cursor-pointer" onClick={() => setRecomendaria(recomendaria === v ? '' : v)}>
                        <CheckboxUI checked={recomendaria === v} onChange={() => {}} />
                        <span className="text-sm font-semibold" style={{ color: TX }}>{v === 'si' ? 'Sí' : 'No'}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  {fieldLabel('Observaciones adicionales')}
                  <textarea rows={2} value={observFeedback} onChange={e => setObservFeedback(e.target.value)} className={`${INP} resize-none`} style={inpStyle} placeholder="Notas internas…" />
                </div>
              </div>
            </div>
          )}

          {/* ── RESOLUCIÓN DE PROBLEMAS ── */}
          {activeTab === 'reclamos' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  {fieldLabel('N° Reclamo')}
                  <input value={nroReclamo} onChange={e => setNroReclamo(e.target.value)} className={INP} style={inpStyle} placeholder="REC-2026-001" />
                </div>
                <div>
                  {fieldLabel('Fecha del reclamo')}
                  <div className="relative">
                    <input type="date" value={fechaReclamo} onChange={e => setFechaReclamo(e.target.value)} className={INP} style={inpStyle} />
                    <Calendar size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  {fieldLabel('Tipo de reclamo')}
                  <div className="relative">
                    <select value={tipoReclamo} onChange={e => setTipoReclamo(e.target.value)} className={`${INP} pr-9 appearance-none`} style={inpStyle}>
                      <option value="">Seleccionar…</option>
                      {TIPO_REC.map(t => <option key={t}>{t}</option>)}
                    </select>
                    <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  {fieldLabel('Estado del reclamo')}
                  <div className="relative">
                    <select value={estadoReclamo} onChange={e => setEstadoReclamo(e.target.value)} className={`${INP} pr-9 appearance-none`} style={inpStyle}>
                      <option value="">Seleccionar…</option>
                      {ESTADO_REC.map(e => <option key={e}>{e}</option>)}
                    </select>
                    <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  {fieldLabel('Descripción del reclamo')}
                  <textarea rows={3} value={descripcionReclamo} onChange={e => setDescripcionReclamo(e.target.value)} className={`${INP} resize-none`} style={inpStyle} placeholder="Detalle del reclamo presentado por el cliente…" />
                </div>
                <div className="sm:col-span-2">
                  {fieldLabel('Solución aplicada')}
                  <textarea rows={3} value={solucion} onChange={e => setSolucion(e.target.value)} className={`${INP} resize-none`} style={inpStyle} placeholder="Acciones tomadas para resolver el reclamo…" />
                </div>
                <div>
                  {fieldLabel('Fecha de resolución')}
                  <div className="relative">
                    <input type="date" value={fechaResolucion} onChange={e => setFechaResolucion(e.target.value)} className={INP} style={inpStyle} />
                    <Calendar size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  {fieldLabel('Responsable')}
                  <input value={responsable} onChange={e => setResponsable(e.target.value)} className={INP} style={inpStyle} placeholder="Nombre del responsable…" />
                </div>
                <div className="sm:col-span-2">
                  {fieldLabel('Observaciones')}
                  <textarea rows={2} value={observReclamo} onChange={e => setObservReclamo(e.target.value)} className={`${INP} resize-none`} style={inpStyle} placeholder="Notas internas adicionales…" />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="px-5 py-3 border-t shrink-0 flex justify-end" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
          <button onClick={onClose} className="text-[0.65rem] font-semibold px-3 py-1.5 rounded-lg text-gray-500 hover:bg-black/05 transition-all">Cerrar</button>
        </div>
      </div>
    </div>
  );
}
