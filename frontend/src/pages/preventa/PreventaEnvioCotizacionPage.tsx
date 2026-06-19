import { useState, useEffect } from 'react';
import { FileText, Calendar, ChevronDown } from 'lucide-react';
import { TopBar }      from '@/components/flow/TopBar';
import { StatusCards } from '@/components/flow/StatusCards';
import { useFlow }     from '@/contexts/FlowContext';

const CP = '#445D46';
const BD = '#D9DDD8';
const TX = '#2C2C2C';
const BG = '#F7F8F7';

const INP      = 'w-full border rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-600 transition-all';
const inpStyle = { borderColor: BD, color: TX };

const INCOTERMS    = ['FOB','CIF','EXW','FCA','CPT','DAP','DDP'];
const PUERTOS      = ['Callao, Perú','Rotterdam, Países Bajos','Hamburg, Alemania','New York, EE.UU.','Amberes, Bélgica'];
const CONDICIONES  = ['30 días','60 días','90 días','Contra entrega','Carta de crédito'];

const field = (label: string, children: React.ReactNode) => (
  <div>
    <label className="block text-[0.65rem] font-bold uppercase tracking-wide mb-1.5" style={{ color: TX, opacity: 0.55 }}>{label}</label>
    {children}
  </div>
);

export function PreventaEnvioCotizacionPage() {
  const { setCurrentStep, saveAndNext, cancelToPrev } = useFlow();

  useEffect(() => { setCurrentStep('envio_cotizacion'); }, []);

  const [nroCotizacion, setNroCotizacion] = useState('');
  const [fechaCotiz,    setFechaCotiz]    = useState('');
  const [validez,       setValidez]       = useState('');
  const [precioUsd,     setPrecioUsd]     = useState('');
  const [moneda,        setMoneda]        = useState<'USD' | 'PEN'>('USD');
  const [pesoKg,        setPesoKg]        = useState('');
  const [incoterm,      setIncoterm]      = useState('');
  const [puerto,        setPuerto]        = useState('');
  const [condPago,      setCondPago]      = useState('');
  const [observaciones, setObservaciones] = useState('');

  const monedaSymbol = moneda === 'PEN' ? 'S/.' : 'USD';

  return (
    <div className="min-h-full flex flex-col" style={{ backgroundColor: BG }}>
      <TopBar
        icon={<FileText size={15} className="text-white" />}
        titulo="Preventa — Envío de Cotización"
        subtitulo="Registrar oferta comercial al cliente"
        onGuardar={() => saveAndNext('envio_cotizacion')}
        onCancelar={() => cancelToPrev('envio_cotizacion')}
      />

      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
        <div className="bg-white rounded-2xl border p-5 space-y-4" style={{ borderColor: BD }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {field('Fecha de cotización',
              <div className="relative">
                <input type="date" value={fechaCotiz} onChange={e => setFechaCotiz(e.target.value)} className={INP} style={inpStyle} />
                <Calendar size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            )}
            {field(`Precio (${moneda} / kg)`,
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
            {field('Peso total (kg)',
              <input type="number" min={0} value={pesoKg} onChange={e => setPesoKg(e.target.value)} className={INP} style={inpStyle} placeholder="0" />
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
            {field('Puerto de destino',
              <div className="relative">
                <select value={puerto} onChange={e => setPuerto(e.target.value)} className={`${INP} pr-9 appearance-none`} style={inpStyle}>
                  <option value="">Seleccionar…</option>
                  {PUERTOS.map(p => <option key={p}>{p}</option>)}
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
            {field('Validez de la oferta (días)',
              <input type="number" min={1} value={validez} onChange={e => setValidez(e.target.value)} className={INP} style={inpStyle} placeholder="15" />
            )}
          </div>

          {precioUsd && pesoKg && (
            <div className="rounded-xl px-4 py-3 flex items-center gap-3" style={{ backgroundColor: `${CP}12` }}>
              <p className="text-[0.65rem] font-bold uppercase tracking-wide" style={{ color: CP }}>Total estimado:</p>
              <p className="font-black text-base" style={{ color: CP }}>
                {monedaSymbol} {(parseFloat(precioUsd) * parseFloat(pesoKg)).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
              </p>
            </div>
          )}

          {field('Observaciones',
            <textarea rows={3} value={observaciones} onChange={e => setObservaciones(e.target.value)}
              className={`${INP} resize-none`} style={inpStyle} placeholder="Condiciones especiales, notas al cliente…" />
          )}
        </div>

        <StatusCards steps={['envio_muestra','envio_cotizacion']} currentStep="envio_cotizacion" />
      </div>
    </div>
  );
}
