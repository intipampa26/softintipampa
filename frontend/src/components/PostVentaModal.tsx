import { useState } from 'react';
import { X, CheckCheck, Calendar, ChevronDown, Star } from 'lucide-react';

const CP = '#445D46';
const BD = '#D9DDD8';
const TX = '#2C2C2C';

const INP      = 'w-full border rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-600 transition-all';
const inpStyle = { borderColor: BD, color: TX };

const fieldLabel = (label: string) => (
  <label className="block text-[0.65rem] font-bold uppercase tracking-wide mb-1.5" style={{ color: TX, opacity: 0.55 }}>{label}</label>
);

type Tab = 'cierre' | 'feedback' | 'reclamos';

interface Props {
  orden: { id: string; cliente: string; lote: string; tipoProducto: string };
  initialTab?: Tab;
  onClose: () => void;
}

const TABS: { key: Tab; label: string }[] = [
  { key: 'cierre',    label: 'Cierre de Venta'        },
  { key: 'feedback',  label: 'Feedback del Cliente'    },
  { key: 'reclamos',  label: 'Resolución de Reclamos'  },
];

const BANCOS     = ['BCP','BBVA','Interbank','Scotiabank','Banco de la Nación','Wells Fargo','Deutsche Bank'];
const ESTADO_PAG = ['Pendiente','Pago parcial','Pagado completamente'];
const TIPO_REC   = ['Calidad del producto','Cantidad / Peso','Documentación','Tiempo de entrega','Otro'];
const ESTADO_REC = ['Pendiente','En revisión','Resuelto','Cerrado sin solución'];

function CierreContent({ orden }: { orden: Props['orden'] }) {
  const [nroFactura,  setNroFactura]  = useState('');
  const [fechaFact,   setFechaFact]   = useState('');
  const [montoFinal,  setMontoFinal]  = useState('');
  const [moneda,      setMoneda]      = useState<'USD' | 'PEN'>('USD');
  const [fechaPago,   setFechaFago]   = useState('');
  const [estadoPago,  setEstadoPago]  = useState('');
  const [banco,       setBanco]       = useState('');
  const [nroCuenta,   setNroCuenta]   = useState('');
  const [observ,      setObserv]      = useState('');
  void orden;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          {fieldLabel('N° Factura')}
          <input value={nroFactura} onChange={e => setNroFactura(e.target.value)} className={INP} style={inpStyle} placeholder="F001-00001" />
        </div>
        <div>
          {fieldLabel('Fecha de factura')}
          <div className="relative">
            <input type="date" value={fechaFact} onChange={e => setFechaFact(e.target.value)} className={INP} style={inpStyle} />
            <Calendar size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
        <div>
          {fieldLabel('Monto final')}
          <div className="flex gap-2">
            <div className="flex rounded-xl overflow-hidden border shrink-0" style={{ borderColor: BD }}>
              {(['USD','PEN'] as const).map(m => (
                <button key={m} type="button" onClick={() => setMoneda(m)}
                  className="px-3 py-2 text-xs font-bold transition-colors"
                  style={{ backgroundColor: moneda === m ? CP : 'transparent', color: moneda === m ? '#fff' : TX }}>
                  {m}
                </button>
              ))}
            </div>
            <input type="number" min={0} step="0.01" value={montoFinal} onChange={e => setMontoFinal(e.target.value)} className={`${INP} flex-1`} style={inpStyle} placeholder="0.00" />
          </div>
        </div>
        <div>
          {fieldLabel('Fecha de pago')}
          <div className="relative">
            <input type="date" value={fechaPago} onChange={e => setFechaFago(e.target.value)} className={INP} style={inpStyle} />
            <Calendar size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
        <div>
          {fieldLabel('Estado de pago')}
          <div className="relative">
            <select value={estadoPago} onChange={e => setEstadoPago(e.target.value)} className={`${INP} pr-9 appearance-none`} style={inpStyle}>
              <option value="">Seleccionar…</option>
              {ESTADO_PAG.map(e => <option key={e}>{e}</option>)}
            </select>
            <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
        <div>
          {fieldLabel('Banco')}
          <div className="relative">
            <select value={banco} onChange={e => setBanco(e.target.value)} className={`${INP} pr-9 appearance-none`} style={inpStyle}>
              <option value="">Seleccionar…</option>
              {BANCOS.map(b => <option key={b}>{b}</option>)}
            </select>
            <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
        <div className="sm:col-span-2">
          {fieldLabel('N° Cuenta / SWIFT / IBAN')}
          <input value={nroCuenta} onChange={e => setNroCuenta(e.target.value)} className={INP} style={inpStyle} placeholder="Número de cuenta o código SWIFT…" />
        </div>
        <div className="sm:col-span-2">
          {fieldLabel('Observaciones')}
          <textarea rows={2} value={observ} onChange={e => setObserv(e.target.value)} className={`${INP} resize-none`} style={inpStyle} placeholder="Notas del cierre de venta…" />
        </div>
      </div>
    </div>
  );
}

function FeedbackContent({ orden }: { orden: Props['orden'] }) {
  const [fecha,        setFecha]        = useState('');
  const [rating,       setRating]       = useState(0);
  const [hoverRating,  setHoverRating]  = useState(0);
  const [comentCalid,  setComentCalid]  = useState('');
  const [comentServ,   setComentServ]   = useState('');
  const [recomend,     setRecomend]     = useState<'si' | 'no' | ''>('');
  const [observ,       setObserv]       = useState('');
  void orden;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          {fieldLabel('Fecha de feedback')}
          <div className="relative">
            <input type="date" value={fecha} onChange={e => setFecha(e.target.value)} className={INP} style={inpStyle} />
            <Calendar size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
        <div>
          {fieldLabel('Calificación general')}
          <div className="flex items-center gap-1 h-[42px]">
            {[1,2,3,4,5].map(n => (
              <button
                key={n}
                type="button"
                onMouseEnter={() => setHoverRating(n)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(n)}
                className="transition-transform hover:scale-110"
              >
                <Star
                  size={22}
                  fill={(hoverRating || rating) >= n ? '#F59E0B' : 'none'}
                  stroke={(hoverRating || rating) >= n ? '#F59E0B' : '#D1D5DB'}
                />
              </button>
            ))}
            {rating > 0 && (
              <span className="ml-2 text-xs font-bold" style={{ color: '#F59E0B' }}>{rating}/5</span>
            )}
          </div>
        </div>
        <div className="sm:col-span-2">
          {fieldLabel('Comentarios sobre la calidad del producto')}
          <textarea rows={3} value={comentCalid} onChange={e => setComentCalid(e.target.value)} className={`${INP} resize-none`} style={inpStyle} placeholder="Opinión del cliente sobre el producto recibido…" />
        </div>
        <div className="sm:col-span-2">
          {fieldLabel('Comentarios sobre el servicio')}
          <textarea rows={3} value={comentServ} onChange={e => setComentServ(e.target.value)} className={`${INP} resize-none`} style={inpStyle} placeholder="Opinión del cliente sobre la atención y proceso…" />
        </div>
        <div>
          {fieldLabel('¿Nos recomendaría?')}
          <div className="flex gap-3 mt-1">
            {(['si','no'] as const).map(v => (
              <label key={v} className="flex items-center gap-2 cursor-pointer">
                <div
                  className="w-4 h-4 rounded border-2 flex items-center justify-center transition-all"
                  style={{ borderColor: recomend === v ? CP : BD, backgroundColor: recomend === v ? CP : '#fff' }}
                  onClick={() => setRecomend(recomend === v ? '' : v)}
                >
                  {recomend === v && (
                    <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                      <path d="M1.5 4.5L3.5 6.5L7.5 2.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
                <span className="text-sm font-semibold" style={{ color: TX }}>{v === 'si' ? 'Sí' : 'No'}</span>
              </label>
            ))}
          </div>
        </div>
        <div>
          {fieldLabel('Observaciones adicionales')}
          <textarea rows={2} value={observ} onChange={e => setObserv(e.target.value)} className={`${INP} resize-none`} style={inpStyle} placeholder="Notas internas…" />
        </div>
      </div>
    </div>
  );
}

function ReclamosContent() {
  const [nroReclamo,   setNroReclamo]   = useState('');
  const [fechaReclamo, setFechaReclamo] = useState('');
  const [tipoReclamo,  setTipoReclamo]  = useState('');
  const [descripcion,  setDescripcion]  = useState('');
  const [estado,       setEstado]       = useState('');
  const [solucion,     setSolucion]     = useState('');
  const [fechaResol,   setFechaResol]   = useState('');
  const [responsable,  setResponsable]  = useState('');
  const [observ,       setObserv]       = useState('');

  return (
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
            <select value={estado} onChange={e => setEstado(e.target.value)} className={`${INP} pr-9 appearance-none`} style={inpStyle}>
              <option value="">Seleccionar…</option>
              {ESTADO_REC.map(e => <option key={e}>{e}</option>)}
            </select>
            <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
        <div className="sm:col-span-2">
          {fieldLabel('Descripción del reclamo')}
          <textarea rows={3} value={descripcion} onChange={e => setDescripcion(e.target.value)} className={`${INP} resize-none`} style={inpStyle} placeholder="Detalle del reclamo presentado por el cliente…" />
        </div>
        <div className="sm:col-span-2">
          {fieldLabel('Solución aplicada')}
          <textarea rows={3} value={solucion} onChange={e => setSolucion(e.target.value)} className={`${INP} resize-none`} style={inpStyle} placeholder="Acciones tomadas para resolver el reclamo…" />
        </div>
        <div>
          {fieldLabel('Fecha de resolución')}
          <div className="relative">
            <input type="date" value={fechaResol} onChange={e => setFechaResol(e.target.value)} className={INP} style={inpStyle} />
            <Calendar size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
        <div>
          {fieldLabel('Responsable')}
          <input value={responsable} onChange={e => setResponsable(e.target.value)} className={INP} style={inpStyle} placeholder="Nombre del responsable…" />
        </div>
        <div className="sm:col-span-2">
          {fieldLabel('Observaciones')}
          <textarea rows={2} value={observ} onChange={e => setObserv(e.target.value)} className={`${INP} resize-none`} style={inpStyle} placeholder="Notas internas adicionales…" />
        </div>
      </div>
    </div>
  );
}

export function PostVentaModal({ orden, initialTab = 'cierre', onClose }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>(initialTab);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6"
      style={{ backgroundColor: 'rgba(0,0,0,0.38)', backdropFilter: 'blur(12px) saturate(0.75)' }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full sm:max-w-5xl rounded-t-3xl sm:rounded-3xl flex flex-col overflow-hidden"
        style={{ background: 'rgba(255,255,255,0.96)', backdropFilter: 'blur(28px) saturate(1.4)', WebkitBackdropFilter: 'blur(28px) saturate(1.4)', border: '1px solid rgba(255,255,255,0.6)', boxShadow: '0 24px 60px rgba(0,0,0,0.22)', maxHeight: '92vh' }}
      >
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
            <button className="text-[0.65rem] font-bold px-4 py-2 rounded-xl text-white transition-opacity hover:opacity-90" style={{ backgroundColor: CP }}>GUARDAR</button>
            <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-black/06 transition-all ml-1"><X size={16} /></button>
          </div>
        </div>

        <div className="flex gap-1 px-5 pt-4 shrink-0 border-b" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-t-xl text-xs font-bold uppercase tracking-wide transition-all"
              style={{
                backgroundColor: activeTab === t.key ? CP : 'transparent',
                color:           activeTab === t.key ? '#fff' : '#9CA3AF',
                borderBottom:    activeTab === t.key ? `2px solid ${CP}` : '2px solid transparent',
                marginBottom:    '-1px',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="overflow-y-auto flex-1 px-5 py-5">
          {activeTab === 'cierre'   && <CierreContent   orden={orden} />}
          {activeTab === 'feedback' && <FeedbackContent orden={orden} />}
          {activeTab === 'reclamos' && <ReclamosContent />}
        </div>

        <div className="px-5 py-3 border-t shrink-0 flex justify-end" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
          <button onClick={onClose} className="text-[0.65rem] font-semibold px-3 py-1.5 rounded-lg text-gray-500 hover:bg-black/05 transition-all">Cerrar</button>
        </div>
      </div>
    </div>
  );
}
