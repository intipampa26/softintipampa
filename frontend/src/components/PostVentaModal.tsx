import { useState, useEffect, useCallback } from 'react';
import { X, CheckCheck, Calendar, ChevronDown, Star } from 'lucide-react';
import { ModalLoadingOverlay } from '@/components/ui/ModalLoadingOverlay';
import { useToast } from '@/contexts/ToastContext';
import { ordenesVentaService } from '../services/ordenes-venta.service';

const CP = '#445D46';
const BD = '#D9DDD8';
const TX = '#2C2C2C';

const INP      = 'w-full border rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-600 transition-all';
const inpStyle = { borderColor: BD, color: TX };

const fieldLabel = (label: string) => (
  <label className="block text-[0.65rem] font-bold uppercase tracking-wide mb-1.5" style={{ color: TX, opacity: 0.55 }}>{label}</label>
);

type Tab = 'feedback' | 'reclamos';

interface Props {
  orden: { dbId: number; id: string; cliente: string; lote: string; tipoProducto: string };
  initialTab?: Tab;
  onClose: () => void;
}

const TABS: { key: Tab; label: string }[] = [
  { key: 'feedback',  label: 'Envío de Documentos Comerciales' },
  { key: 'reclamos',  label: 'Resolución de Problemas' },
];

const TIPO_REC   = ['Calidad del producto','Cantidad / Peso','Documentación','Tiempo de entrega','Otro'];
const ESTADO_REC = ['Pendiente','En revisión','Resuelto','Cerrado sin solución'];

function CheckboxUI({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <div onClick={onChange} className="w-4 h-4 rounded border-2 flex items-center justify-center cursor-pointer transition-all"
      style={{ borderColor: checked ? CP : BD, backgroundColor: checked ? CP : '#fff' }}>
      {checked && <svg width="9" height="9" viewBox="0 0 9 9" fill="none"><path d="M1.5 4.5L3.5 6.5L7.5 2.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
    </div>
  );
}

export function PostVentaModal({ orden, initialTab = 'feedback', onClose }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>(initialTab);
  const [loading,   setLoading]   = useState(true);
  const [saving,    setSaving]    = useState(false);
  const toast = useToast();

  const [fechaFeedback,  setFechaFeedback]  = useState('');
  const [rating,         setRating]         = useState(0);
  const [hoverRating,    setHoverRating]    = useState(0);
  const [comentCalidad,  setComentCalidad]  = useState('');
  const [comentServicio, setComentServicio] = useState('');
  const [recomendaria,   setRecomendaria]   = useState<'si' | 'no' | ''>('');
  const [observFeedback, setObservFeedback] = useState('');

  const [nroReclamo,       setNroReclamo]       = useState('');
  const [fechaReclamo,     setFechaReclamo]     = useState('');
  const [tipoReclamo,      setTipoReclamo]      = useState('');
  const [descripcionReclamo,setDescripcionReclamo]=useState('');
  const [estadoReclamo,    setEstadoReclamo]    = useState('');
  const [solucion,         setSolucion]         = useState('');
  const [fechaResolucion,  setFechaResolucion]  = useState('');
  const [responsable,      setResponsable]      = useState('');
  const [observReclamo,    setObservReclamo]    = useState('');

  useEffect(() => {
    ordenesVentaService.getPostVenta(orden.dbId)
      .then(data => {
        if (data) {
          setFechaFeedback(data.fechaFeedback ?? '');
          setRating(data.rating ?? 0);
          setComentCalidad(data.comentCalidad ?? '');
          setComentServicio(data.comentServicio ?? '');
          setRecomendaria((data.recomendaria as 'si' | 'no' | '') ?? '');
          setObservFeedback(data.observFeedback ?? '');
          setNroReclamo(data.nroReclamo ?? '');
          setFechaReclamo(data.fechaReclamo ?? '');
          setTipoReclamo(data.tipoReclamo ?? '');
          setDescripcionReclamo(data.descripcionReclamo ?? '');
          setEstadoReclamo(data.estadoReclamo ?? '');
          setSolucion(data.solucion ?? '');
          setFechaResolucion(data.fechaResolucion ?? '');
          setResponsable(data.responsable ?? '');
          setObservReclamo(data.observReclamo ?? '');
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [orden.dbId]);

  const handleGuardar = useCallback(async () => {
    setSaving(true);
    try {
      const dto: Record<string, unknown> = {
        fechaFeedback:  fechaFeedback  || null,
        rating:         rating > 0 ? rating : null,
        comentCalidad:  comentCalidad  || null,
        comentServicio: comentServicio || null,
        recomendaria:   recomendaria   || null,
        observFeedback: observFeedback || null,
        nroReclamo:       nroReclamo       || null,
        fechaReclamo:     fechaReclamo     || null,
        tipoReclamo:      tipoReclamo      || null,
        descripcionReclamo: descripcionReclamo || null,
        estadoReclamo:    estadoReclamo    || null,
        solucion:         solucion         || null,
        fechaResolucion:  fechaResolucion  || null,
        responsable:      responsable      || null,
        observReclamo:    observReclamo    || null,
      };
      await ordenesVentaService.upsertPostVenta(orden.dbId, dto);
      toast.success('Guardado correctamente');
    } catch {
      toast.error('Error al guardar');
    } finally {
      setSaving(false);
    }
  }, [
    fechaFeedback, rating, comentCalidad, comentServicio, recomendaria, observFeedback,
    nroReclamo, fechaReclamo, tipoReclamo, descripcionReclamo, estadoReclamo, solucion, fechaResolucion, responsable, observReclamo,
    orden.dbId,
  ]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6"
      style={{ backgroundColor: 'rgba(0,0,0,0.38)', backdropFilter: 'blur(12px) saturate(0.75)' }}
      onClick={e => !saving && e.target === e.currentTarget && onClose()}
    >
      <div
        className="relative w-full sm:max-w-5xl rounded-t-3xl sm:rounded-3xl flex flex-col overflow-hidden"
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
            <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-black/06 transition-all ml-1"><X size={16} /></button>
          </div>
        </div>

        <div className="flex gap-1 px-5 pt-4 shrink-0 border-b" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
          {TABS.map(t => (
            <button key={t.key} onClick={() => setActiveTab(t.key)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-t-xl text-xs font-bold uppercase tracking-wide transition-all"
              style={{ backgroundColor: activeTab === t.key ? CP : 'transparent', color: activeTab === t.key ? '#fff' : '#9CA3AF', borderBottom: activeTab === t.key ? `2px solid ${CP}` : '2px solid transparent', marginBottom: '-1px' }}>
              {t.label}
            </button>
          ))}
        </div>

        <div className="overflow-y-auto flex-1 px-5 py-5">

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
                        onClick={() => setRating(n)}
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
                  <div className="flex gap-3 mt-1">
                    {(['si','no'] as const).map(v => (
                      <label key={v} className="flex items-center gap-2 cursor-pointer">
                        <CheckboxUI checked={recomendaria === v} onChange={() => setRecomendaria(recomendaria === v ? '' : v)} />
                        <span className="text-sm font-semibold" style={{ color: TX }}>{v === 'si' ? 'Sí' : 'No'}</span>
                      </label>
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
