import { useState, useEffect } from 'react';
import { Handshake, Calendar, ChevronDown } from 'lucide-react';
import { TopBar }      from '@/components/flow/TopBar';
import { StatusCards } from '@/components/flow/StatusCards';
import { useFlow }     from '@/contexts/FlowContext';

import { CheckCircle2 } from 'lucide-react';

const CP = '#445D46';
const BD = '#D9DDD8';
const TX = '#2C2C2C';
const BG = '#F7F8F7';

const INP      = 'w-full border rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-600 transition-all';
const inpStyle = { borderColor: BD, color: TX };

const INCOTERMS   = ['FOB','CIF','EXW','FCA','CPT','DAP','DDP'];
const CONDICIONES = ['30 días','60 días','90 días','Carta de crédito','Contra entrega'];

const field = (label: string, children: React.ReactNode) => (
  <div>
    <label className="block text-[0.65rem] font-bold uppercase tracking-wide mb-1.5" style={{ color: TX, opacity: 0.55 }}>{label}</label>
    {children}
  </div>
);

export function AlistadoCompromisoVentaPage() {
  const { setCurrentStep, saveAndNext, cancelToPrev } = useFlow();

  useEffect(() => { setCurrentStep('compromiso_venta'); }, []);

  const [nroContrato,  setNroContrato]  = useState('');
  const [fechaContrato,setFechaContrato]= useState('');
  const [comprador,    setComprador]    = useState('');
  const [precioUsd,    setPrecioUsd]    = useState('');
  const [moneda,       setMoneda]       = useState<'USD' | 'PEN'>('USD');
  const [cantidadKg,   setCantidadKg]   = useState('');
  const [incoterm,     setIncoterm]     = useState('');
  const [condPago,     setCondPago]     = useState('');
  const [fechaEntrega, setFechaEntrega] = useState('');
  const [notas,        setNotas]        = useState('');

  const monedaSymbol = moneda === 'PEN' ? 'S/.' : 'USD';

  return (
    <div className="min-h-full flex flex-col" style={{ backgroundColor: BG }}>
      <TopBar
        icon={<CheckCircle2 size={15} className="text-white" />}
        titulo="Alistado — Compromiso de Venta"
        subtitulo="Registrar contrato y términos del compromiso"
        onGuardar={() => saveAndNext('compromiso_venta')}
        onCancelar={() => cancelToPrev('compromiso_venta')}
      />

      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
        <div className="bg-white rounded-2xl border p-5 space-y-4" style={{ borderColor: BD }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {field('N° Contrato',
              <input value={nroContrato} onChange={e => setNroContrato(e.target.value)} className={INP} style={inpStyle} placeholder="CONT-2026-001" />
            )}
            {field('Fecha de contrato',
              <div className="relative">
                <input type="date" value={fechaContrato} onChange={e => setFechaContrato(e.target.value)} className={INP} style={inpStyle} />
                <Calendar size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            )}
            {field('Comprador / Cliente',
              <div className="flex items-center gap-2 border rounded-xl px-3 py-2.5 bg-gray-50" style={{ borderColor: '#D9DDD8' }}>
                <span className="flex-1 text-sm font-semibold truncate" style={{ color: '#2C2C2C' }}>{comprador || '—'}</span>
                <span className="text-[0.6rem] font-bold px-1.5 py-0.5 rounded" style={{ background: '#D1FAE5', color: '#065F46' }}>bloqueado</span>
              </div>
            )}
            {field(`Precio acordado (${moneda} / kg)`,
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
            )}
            {field('Cantidad comprometida (kg)',
              <input type="number" min={0} value={cantidadKg} onChange={e => setCantidadKg(e.target.value)} className={INP} style={inpStyle} placeholder="0" />
            )}
            {field('Incoterm',
              <div className="relative">
                <select value={incoterm} onChange={e => setIncoterm(e.target.value)} className={`${INP} pr-9 appearance-none`} style={inpStyle}>
                  <option value="">Seleccionar…</option>
                  {INCOTERMS.map(t => <option key={t}>{t}</option>)}
                </select>
                <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            )}
            {field('Condiciones de pago',
              <div className="relative">
                <select value={condPago} onChange={e => setCondPago(e.target.value)} className={`${INP} pr-9 appearance-none`} style={inpStyle}>
                  <option value="">Seleccionar…</option>
                  {CONDICIONES.map(c => <option key={c}>{c}</option>)}
                </select>
                <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            )}
            {field('Fecha de entrega estimada',
              <div className="relative">
                <input type="date" value={fechaEntrega} onChange={e => setFechaEntrega(e.target.value)} className={INP} style={inpStyle} />
                <Calendar size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            )}
          </div>

          
          {precioUsd && cantidadKg && (
            <div className="rounded-xl px-4 py-3 flex items-center gap-3" style={{ backgroundColor: `${CP}12` }}>
              <p className="text-[0.65rem] font-bold uppercase tracking-wide" style={{ color: CP }}>Total comprometido:</p>
              <p className="font-black text-base" style={{ color: CP }}>
                {monedaSymbol} {(parseFloat(precioUsd) * parseFloat(cantidadKg)).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
              </p>
            </div>
          )}

          {field('Observaciones',
            <textarea rows={3} value={notas} onChange={e => setNotas(e.target.value)}
              className={`${INP} resize-none`} style={inpStyle} placeholder="Notas adicionales del contrato…" />
          )}
        </div>

        <StatusCards steps={['compromiso_venta','asignacion_lotes','despacho']} currentStep="compromiso_venta" />
      </div>
    </div>
  );
}
