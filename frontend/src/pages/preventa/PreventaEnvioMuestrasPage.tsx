import { useState, useEffect } from 'react';
import { Send, Calendar, ChevronDown, Search } from 'lucide-react';
import { TopBar }     from '@/components/flow/TopBar';
import { StatusCards } from '@/components/flow/StatusCards';
import { useFlow }    from '@/contexts/FlowContext';

const CP = '#445D46';
const BD = '#D9DDD8';
const TX = '#2C2C2C';
const BG = '#F7F8F7';

const INP      = 'w-full border rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-600 transition-all';
const inpStyle = { borderColor: BD, color: TX };

const CLIENTES_MOCK = ['Volcafe Perú S.A.C.','Sucafina S.A.','Olam International','Nordic Approach AS','Caravela Coffee LLC'];

interface MuestraRow { id: number; codigo: string; lote: string; campana: string; productor: string; cantidad: string; tipo: string; fecha: string; costo: string; }

const MUESTRAS_INIT: MuestraRow[] = [
  { id: 1, codigo: 'M0001', lote: 'LF-2026-001', campana: 'C.2025/26', productor: 'Juan Ríos',    cantidad: '', tipo: 'Papiro',   fecha: '09/01/2026', costo: '' },
  { id: 2, codigo: 'M0002', lote: 'LF-2026-002', campana: 'C.2025/26', productor: 'Mateo SAC',    cantidad: '', tipo: 'Granel',   fecha: '10/01/2026', costo: '' },
  { id: 3, codigo: 'M0003', lote: 'LF-2026-003', campana: 'C.2025/26', productor: 'Rosa Medina',  cantidad: '', tipo: 'Papiro',   fecha: '12/01/2026', costo: '' },
  { id: 4, codigo: 'M0004', lote: 'LF-2026-004', campana: 'C.2025/26', productor: 'Pedro Huamán', cantidad: '', tipo: 'Especial', fecha: '14/01/2026', costo: '' },
  { id: 5, codigo: 'M0005', lote: 'LF-2026-005', campana: 'C.2025/26', productor: 'Luis Vargas',  cantidad: '', tipo: 'Granel',   fecha: '15/01/2026', costo: '' },
];

const field = (label: string, children: React.ReactNode) => (
  <div>
    <label className="block text-[0.65rem] font-bold uppercase tracking-wide mb-1.5" style={{ color: TX, opacity: 0.55 }}>{label}</label>
    {children}
  </div>
);

export function PreventaEnvioMuestrasPage() {
  const { setCurrentStep, saveAndNext, cancelToPrev } = useFlow();

  useEffect(() => { setCurrentStep('envio_muestra'); }, []);

  const [fechaEnvio,    setFechaEnvio]    = useState('');
  const [fechaRecep,    setFechaRecep]    = useState('');
  const [ruc,           setRuc]           = useState('');
  const [cliente,       setCliente]       = useState('');
  const [courier,       setCourier]       = useState('');
  const [costoCourier,  setCostoCourier]  = useState('');
  const [fito,          setFito]          = useState<'si'|'no'|''>('');
  const [busqueda,      setBusqueda]      = useState('');
  const [muestras,      setMuestras]      = useState<MuestraRow[]>(MUESTRAS_INIT);

  const update = (id: number, field: 'cantidad'|'costo', val: string) =>
    setMuestras(prev => prev.map(m => m.id === id ? { ...m, [field]: val } : m));

  const filtradas = muestras.filter(m => {
    const q = busqueda.toLowerCase();
    return !q || [m.codigo, m.lote, m.productor, m.tipo].some(v => v.toLowerCase().includes(q));
  });

  return (
    <div className="min-h-full flex flex-col" style={{ backgroundColor: BG }}>
      <TopBar
        icon={<Send size={15} className="text-white" />}
        titulo="Preventa — Envío de Muestras"
        subtitulo="Registrar envío de muestras al cliente"
        onGuardar={() => saveAndNext('envio_muestra')}
        onCancelar={() => cancelToPrev('envio_muestra')}
      />

      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">

        
        <div className="bg-white rounded-2xl border p-5" style={{ borderColor: BD }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {field('Fecha de envío',
              <div className="relative">
                <input type="date" value={fechaEnvio} onChange={e => setFechaEnvio(e.target.value)} className={INP} style={inpStyle} />
                <Calendar size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            )}
            {field('Fecha de recepción',
              <div className="relative">
                <input type="date" value={fechaRecep} onChange={e => setFechaRecep(e.target.value)} className={INP} style={inpStyle} />
                <Calendar size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            )}
            {field('RUC / DNI',
              <input type="text" value={ruc} onChange={e => setRuc(e.target.value)} className={INP} style={inpStyle} placeholder="20xxxxxxxxx" />
            )}
            {field('Razón social / Cliente',
              <div className="relative">
                <select value={cliente} onChange={e => setCliente(e.target.value)} className={`${INP} pr-9 appearance-none`} style={inpStyle}>
                  <option value="">Seleccionar…</option>
                  {CLIENTES_MOCK.map(c => <option key={c}>{c}</option>)}
                </select>
                <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            )}
            {field('Nombre del courier',
              <input type="text" value={courier} onChange={e => setCourier(e.target.value)} className={INP} style={inpStyle} placeholder="DHL, FedEx…" />
            )}
            {field('Costo del courier',
              <input type="number" min={0} value={costoCourier} onChange={e => setCostoCourier(e.target.value)} className={INP} style={inpStyle} placeholder="0.00" />
            )}
          </div>

          
          <div className="flex flex-col sm:flex-row gap-4 mt-4 items-start">
            <div className="shrink-0">
              <p className="text-[0.65rem] font-bold uppercase tracking-wide mb-2" style={{ color: TX }}>Fitosanitario:</p>
              <div className="flex gap-4">
                {(['si','no'] as const).map(v => (
                  <label key={v} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={fito === v} onChange={() => setFito(fito === v ? '' : v)} className="w-4 h-4 rounded-sm" style={{ accentColor: CP }} />
                    <span className="text-sm font-semibold uppercase" style={{ color: TX }}>{v}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex-1">
              <p className="text-[0.6rem] font-bold uppercase tracking-wide bg-amber-50 border border-amber-200 text-amber-700 rounded-lg px-3 py-2 leading-relaxed">
                FALTA CONTROLAR LA CANTIDAD EN KG QUE CONSUME LA MUESTRA Y SE LE ASIGNE AL ENVÍO DE MUESTRA
              </p>
              <p className="text-[0.6rem] font-semibold uppercase text-gray-400 mt-1.5 pl-1">
                EDICIÓN DE CADA MUESTRA ENVIADA — RELACIÓN AL CLIENTE
              </p>
            </div>
          </div>
        </div>

        
        <div className="relative">
          <input value={busqueda} onChange={e => setBusqueda(e.target.value)} placeholder="Buscar muestra…" className={`${INP} bg-white`} style={inpStyle} />
          <Search size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>

        
        <div className="overflow-x-auto rounded-xl border bg-white" style={{ borderColor: BD }}>
          <table className="w-full text-xs border-collapse min-w-[700px]">
            <thead>
              <tr style={{ backgroundColor: BG }}>
                {['CÓDIGO','LOTE','CAMPAÑA','PRODUCTOR','CANTIDAD','TIPO DE MUESTRA','FECHA','COSTOS'].map(h => (
                  <th key={h} className="text-[0.6rem] font-black uppercase tracking-wide text-center py-2.5 px-3" style={{ color: CP, borderBottom: `2px solid ${BD}` }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtradas.map((m, i) => (
                <tr key={m.id} style={{ backgroundColor: i % 2 === 0 ? '#fff' : BG }}>
                  <td className="py-2 px-3 text-center font-mono font-semibold" style={{ color: CP }}>{m.codigo}</td>
                  <td className="py-2 px-3 text-center" style={{ color: TX }}>{m.lote}</td>
                  <td className="py-2 px-3 text-center text-gray-500">{m.campana}</td>
                  <td className="py-2 px-3 text-center" style={{ color: TX }}>{m.productor}</td>
                  <td className="py-2 px-3 text-center">
                    <input type="number" value={m.cantidad} onChange={e => update(m.id,'cantidad',e.target.value)}
                      className="w-20 border rounded-full px-2 py-1 text-xs text-center focus:outline-none focus:ring-1 focus:ring-green-500" style={{ borderColor: BD }} placeholder="0 kg" />
                  </td>
                  <td className="py-2 px-3 text-center text-gray-500">{m.tipo}</td>
                  <td className="py-2 px-3 text-center text-gray-400">{m.fecha}</td>
                  <td className="py-2 px-3 text-center">
                    <input type="number" value={m.costo} onChange={e => update(m.id,'costo',e.target.value)}
                      className="w-20 border rounded-full px-2 py-1 text-xs text-center focus:outline-none focus:ring-1 focus:ring-green-500" style={{ borderColor: BD }} placeholder="$ 0" />
                  </td>
                </tr>
              ))}
              {filtradas.length === 0 && (
                <tr><td colSpan={8} className="py-6 text-center text-xs text-gray-400">Sin resultados para "{busqueda}"</td></tr>
              )}
            </tbody>
          </table>
        </div>

        
        <StatusCards steps={['envio_muestra','envio_cotizacion']} currentStep="envio_muestra" />
      </div>
    </div>
  );
}
