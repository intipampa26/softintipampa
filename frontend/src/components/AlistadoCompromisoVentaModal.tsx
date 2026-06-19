import { useState } from 'react';
import { X, CheckCircle2, Calendar, ChevronDown } from 'lucide-react';
import { StatusCards } from './flow/StatusCards';
import { StepKey }    from '@/contexts/FlowContext';

const CP = '#445D46';
const BD = '#D9DDD8';
const TX = '#2C2C2C';

const INP      = 'w-full border rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-600 transition-all';
const inpStyle = { borderColor: BD, color: TX };

const INCOTERMS   = ['FOB','CIF','EXW','FCA','CPT','DAP','DDP'];
const CONDICIONES = ['30 días','60 días','90 días','Carta de crédito','Contra entrega'];

interface Props {
  orden: { id: string; cliente: string; lote: string; tipoProducto: string };
  onClose: () => void;
  onGoToStep?: (step: StepKey) => void;
}

const fieldLabel = (label: string) => (
  <label className="block text-[0.65rem] font-bold uppercase tracking-wide mb-1.5" style={{ color: TX, opacity: 0.55 }}>{label}</label>
);

export function AlistadoCompromisoVentaModal({ orden, onClose, onGoToStep }: Props) {
  const [nroContrato,   setNroContrato]   = useState('');
  const [fechaContrato, setFechaContrato] = useState('');
  const [comprador,     setComprador]     = useState(orden.cliente ?? '');
  const [precioUsd,     setPrecioUsd]     = useState('');
  const [moneda,        setMoneda]        = useState<'USD' | 'PEN'>('USD');
  const [cantidadKg,    setCantidadKg]    = useState('');
  const [incoterm,      setIncoterm]      = useState('');
  const [condPago,      setCondPago]      = useState('');
  const [fechaEntrega,  setFechaEntrega]  = useState('');
  const [notas,         setNotas]         = useState('');

  const total = precioUsd && cantidadKg ? parseFloat(precioUsd) * parseFloat(cantidadKg) : 0;
  const monedaSymbol = moneda === 'PEN' ? 'S/.' : 'USD';

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6"
      style={{ backgroundColor: 'rgba(0,0,0,0.38)', backdropFilter: 'blur(12px) saturate(0.75)' }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full sm:max-w-4xl rounded-t-3xl sm:rounded-3xl flex flex-col overflow-hidden"
        style={{ background: 'rgba(255,255,255,0.96)', backdropFilter: 'blur(28px) saturate(1.4)', WebkitBackdropFilter: 'blur(28px) saturate(1.4)', border: '1px solid rgba(255,255,255,0.6)', boxShadow: '0 24px 60px rgba(0,0,0,0.22)', maxHeight: '92vh' }}
      >
        
        <div className="flex items-center justify-between px-5 py-4 border-b shrink-0" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: CP }}>
              <CheckCircle2 size={15} className="text-white" />
            </div>
            <div className="min-w-0">
              <p className="font-black text-sm uppercase tracking-wide" style={{ color: TX }}>Alistado — Compromiso de Venta</p>
              <p className="text-[0.62rem] text-gray-400 truncate">{orden.id} · {orden.cliente} · {orden.lote}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button onClick={() => onGoToStep?.('asignacion_lotes')} className="text-[0.65rem] font-bold px-4 py-2 rounded-xl transition-colors hover:bg-green-400" style={{ backgroundColor: '#86efac', color: '#14532d' }}>GUARDAR</button>
            <button onClick={onClose}                                 className="text-[0.65rem] font-bold px-4 py-2 rounded-xl text-white bg-pink-500 hover:bg-pink-600 transition-colors">CANCELAR</button>
            <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-black/06 transition-all ml-1"><X size={16} /></button>
          </div>
        </div>

        
        <div className="overflow-y-auto flex-1 px-5 py-5 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              {fieldLabel('N° Contrato')}
              <input value={nroContrato} onChange={e => setNroContrato(e.target.value)} className={INP} style={inpStyle} placeholder="CONT-2026-001" />
            </div>
            <div>
              {fieldLabel('Fecha de contrato')}
              <div className="relative">
                <input type="date" value={fechaContrato} onChange={e => setFechaContrato(e.target.value)} className={INP} style={inpStyle} />
                <Calendar size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div>
              {fieldLabel('Comprador / Cliente')}
              <input value={comprador} onChange={e => setComprador(e.target.value)} className={INP} style={inpStyle} placeholder="Razón social…" />
            </div>
            <div>
              {fieldLabel(`Precio acordado (${moneda} / kg)`)}
              <div className="flex gap-2">
                <div className="flex rounded-xl overflow-hidden border shrink-0" style={{ borderColor: BD }}>
                  {(['USD', 'PEN'] as const).map(m => (
                    <button key={m} type="button"
                      onClick={() => setMoneda(m)}
                      className="px-3 py-2 text-xs font-bold transition-colors"
                      style={{ backgroundColor: moneda === m ? CP : '#fff', color: moneda === m ? '#fff' : '#6B7280' }}>
                      {m}
                    </button>
                  ))}
                </div>
                <input type="number" min={0} step="0.01" value={precioUsd} onChange={e => setPrecioUsd(e.target.value)} className={INP} style={inpStyle} placeholder="0.00" />
              </div>
            </div>
            <div>
              {fieldLabel('Cantidad comprometida (kg)')}
              <input type="number" min={0} value={cantidadKg} onChange={e => setCantidadKg(e.target.value)} className={INP} style={inpStyle} placeholder="0" />
            </div>
            <div>
              {fieldLabel('Incoterm')}
              <div className="relative">
                <select value={incoterm} onChange={e => setIncoterm(e.target.value)} className={`${INP} pr-9 appearance-none`} style={inpStyle}>
                  <option value="">Seleccionar…</option>
                  {INCOTERMS.map(t => <option key={t}>{t}</option>)}
                </select>
                <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div>
              {fieldLabel('Condiciones de pago')}
              <div className="relative">
                <select value={condPago} onChange={e => setCondPago(e.target.value)} className={`${INP} pr-9 appearance-none`} style={inpStyle}>
                  <option value="">Seleccionar…</option>
                  {CONDICIONES.map(c => <option key={c}>{c}</option>)}
                </select>
                <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div>
              {fieldLabel('Fecha de entrega estimada')}
              <div className="relative">
                <input type="date" value={fechaEntrega} onChange={e => setFechaEntrega(e.target.value)} className={INP} style={inpStyle} />
                <Calendar size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {total > 0 && (
            <div className="rounded-xl px-4 py-3 flex items-center gap-3" style={{ backgroundColor: `${CP}12` }}>
              <p className="text-[0.65rem] font-bold uppercase tracking-wide" style={{ color: CP }}>Total comprometido:</p>
              <p className="font-black text-base" style={{ color: CP }}>{monedaSymbol} {total.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</p>
            </div>
          )}

          <div>
            {fieldLabel('Observaciones')}
            <textarea rows={3} value={notas} onChange={e => setNotas(e.target.value)} className={`${INP} resize-none`} style={inpStyle} placeholder="Notas adicionales del contrato…" />
          </div>

          <StatusCards steps={['compromiso_venta','asignacion_lotes','despacho']} currentStep="compromiso_venta" onStepClick={onGoToStep} />
        </div>

        <div className="px-5 py-3 border-t shrink-0 flex justify-end" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
          <button onClick={onClose} className="text-[0.65rem] font-semibold px-3 py-1.5 rounded-lg text-gray-500 hover:bg-black/05 transition-all">Cerrar</button>
        </div>
      </div>
    </div>
  );
}
