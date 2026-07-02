import { useState, useEffect } from 'react';
import { X, Calendar, ChevronDown, Search, Send } from 'lucide-react';
import { clientesService, Cliente } from '@/services/clientes.service';
import { StatusCards } from './flow/StatusCards';
import { StepKey }    from '@/contexts/FlowContext';

const CP = '#445D46';
const CS = '#5F7A61';
const BD = '#D9DDD8';
const TX = '#2C2C2C';
const BG = '#F7F8F7';

interface PreventaEnvioMuestrasModalProps {
  orden: { id: string; cliente: string; lote: string; tipoProducto: string };
  onClose: () => void;
  onGoToStep?: (step: StepKey) => void;
}

interface MuestraMock {
  id: number;
  codigo: string;
  lote: string;
  campana: string;
  productor: string;
  cantidad: string;
  tipoMuestra: string;
  fecha: string;
  costos: string;
}

const MOCK_MUESTRAS: MuestraMock[] = [
  { id: 1, codigo: 'M0001', lote: 'LF-2026-001', campana: 'C.2025/26', productor: 'Juan Ríos',    cantidad: '', tipoMuestra: 'Papiro',  fecha: '09/01/2026', costos: '' },
  { id: 2, codigo: 'M0002', lote: 'LF-2026-002', campana: 'C.2025/26', productor: 'Mateo SAC',    cantidad: '', tipoMuestra: 'Granel',  fecha: '10/01/2026', costos: '' },
  { id: 3, codigo: 'M0003', lote: 'LF-2026-003', campana: 'C.2025/26', productor: 'Rosa Medina',  cantidad: '', tipoMuestra: 'Papiro',  fecha: '12/01/2026', costos: '' },
  { id: 4, codigo: 'M0004', lote: 'LF-2026-004', campana: 'C.2025/26', productor: 'Pedro Huamán', cantidad: '', tipoMuestra: 'Especial',fecha: '14/01/2026', costos: '' },
  { id: 5, codigo: 'M0005', lote: 'LF-2026-005', campana: 'C.2025/26', productor: 'Luis Vargas',  cantidad: '', tipoMuestra: 'Granel',  fecha: '15/01/2026', costos: '' },
];


const INP = 'w-full border rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-600 transition-all';
const inpStyle = { borderColor: BD, color: TX };

function ProgressCard({ titulo, fecha, estado, pct, color, textColor }: {
  titulo: string; fecha: string; estado: string; pct: number; color: string; textColor: string;
}) {
  return (
    <div className="flex flex-col items-center">
      <div style={{ width: 0, height: 0, borderLeft: '10px solid transparent', borderRight: '10px solid transparent', borderBottom: `10px solid ${color}` }} />
      <div className="rounded-xl px-5 py-4 min-w-[160px]" style={{ backgroundColor: color }}>
        <p className="text-[0.6rem] font-black uppercase tracking-wider" style={{ color: textColor }}>{titulo}</p>
        <p className="text-xs font-semibold mt-1" style={{ color: textColor }}>{fecha || '—'}</p>
        <p className="text-[0.65rem] mt-0.5 font-medium" style={{ color: textColor, opacity: 0.8 }}>{estado}</p>
        <div className="mt-2 h-1.5 rounded-full bg-black/10 overflow-hidden">
          <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: textColor, opacity: 0.6 }} />
        </div>
        <p className="text-[0.7rem] font-black mt-1" style={{ color: textColor }}>{pct}%</p>
      </div>
    </div>
  );
}

export function PreventaEnvioMuestrasModal({ orden, onClose, onGoToStep }: PreventaEnvioMuestrasModalProps) {
  const [fechaEnvio,          setFechaEnvio]          = useState('');
  const [fechaRecepcion,      setFechaRecepcion]      = useState('');
  const [rucDni,              setRucDni]              = useState('');
  const [clienteSeleccionado, setClienteSeleccionado] = useState(orden.cliente ?? '');
  const [courier,             setCourier]             = useState('');
  const [costoCourier,        setCostoCourier]        = useState('');
  const [fitosanitario,       setFitosanitario]       = useState<'si' | 'no' | ''>('');
  const [busqueda,            setBusqueda]            = useState('');
  const [clientes,            setClientes]            = useState<Cliente[]>([]);

  const [muestras, setMuestras] = useState<MuestraMock[]>(MOCK_MUESTRAS);

  useEffect(() => {
    clientesService.getPage(1, 200).then(r => setClientes(r.data)).catch(() => {});
  }, []);

  function handleClienteChange(nombre: string) {
    setClienteSeleccionado(nombre);
    const cliente = clientes.find(c => c.nombre === nombre);
    setRucDni(cliente?.nroDocumento ?? '');
  }

  const muestrasFiltradas = muestras.filter(m => {
    const q = busqueda.toLowerCase();
    return !q || [m.codigo, m.lote, m.productor, m.tipoMuestra].some(v => v.toLowerCase().includes(q));
  });

  const updateMuestra = (id: number, field: 'cantidad' | 'costos', value: string) => {
    setMuestras(prev => prev.map(m => m.id === id ? { ...m, [field]: value } : m));
  };

  const fieldLabel = (label: string) => (
    <label className="block text-[0.65rem] font-bold uppercase tracking-wide mb-1.5" style={{ color: TX, opacity: 0.6 }}>{label}</label>
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6"
      style={{ backgroundColor: 'rgba(0,0,0,0.38)', backdropFilter: 'blur(12px) saturate(0.75)' }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full sm:max-w-5xl rounded-t-3xl sm:rounded-3xl flex flex-col overflow-hidden"
        style={{
          background:           'rgba(255,255,255,0.96)',
          backdropFilter:       'blur(28px) saturate(1.4)',
          WebkitBackdropFilter: 'blur(28px) saturate(1.4)',
          border:               '1px solid rgba(255,255,255,0.6)',
          boxShadow:            '0 24px 60px rgba(0,0,0,0.22), 0 1px 0 rgba(255,255,255,0.8) inset',
          maxHeight:            '92vh',
        }}
      >
        
        <div className="flex items-center justify-between px-5 py-4 border-b shrink-0" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: CP }}>
              <Send size={15} className="text-white" />
            </div>
            <div className="min-w-0">
              <p className="font-black text-sm uppercase tracking-wide" style={{ color: TX }}>Preventa — Envío de Muestras</p>
              <p className="text-[0.62rem] text-gray-400 truncate">{orden.id} · {orden.cliente} · {orden.lote}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => { onGoToStep?.('envio_cotizacion'); }}
              className="text-[0.65rem] font-bold px-4 py-2 rounded-xl transition-colors hover:bg-green-400"
              style={{ backgroundColor: '#86efac', color: '#14532d' }}
            >
              GUARDAR
            </button>
            <button
              onClick={onClose}
              className="text-[0.65rem] font-bold px-4 py-2 rounded-xl text-white transition-colors hover:bg-pink-600 bg-pink-500"
            >
              CANCELAR
            </button>
            <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-black/06 transition-all ml-1">
              <X size={16} />
            </button>
          </div>
        </div>

        
        <div className="overflow-y-auto flex-1 px-5 py-5 space-y-5">

          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              {fieldLabel('Fecha de envío')}
              <div className="relative">
                <input type="date" value={fechaEnvio} onChange={e => setFechaEnvio(e.target.value)} className={INP} style={inpStyle} />
                <Calendar size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div>
              {fieldLabel('Fecha de recepción')}
              <div className="relative">
                <input type="date" value={fechaRecepcion} onChange={e => setFechaRecepcion(e.target.value)} className={INP} style={inpStyle} />
                <Calendar size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div>
              {fieldLabel('RUC / DNI')}
              <input type="text" value={rucDni} onChange={e => setRucDni(e.target.value)} className={INP} style={inpStyle} placeholder="20xxxxxxxxx" />
            </div>
            <div>
              {fieldLabel('Razón social / Cliente')}
              <div className="relative">
                <select value={clienteSeleccionado} onChange={e => handleClienteChange(e.target.value)} className={`${INP} pr-9 appearance-none`} style={inpStyle}>
                  <option value="">Seleccionar cliente…</option>
                  {clientes.map(c => <option key={c.id} value={c.nombre}>{c.nombre}</option>)}
                </select>
                <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div>
              {fieldLabel('Nombre del courier')}
              <input type="text" value={courier} onChange={e => setCourier(e.target.value)} className={INP} style={inpStyle} placeholder="DHL, FedEx, Olva…" />
            </div>
            <div>
              {fieldLabel('Costo del courier')}
              <input type="number" min={0} value={costoCourier} onChange={e => setCostoCourier(e.target.value)} className={INP} style={inpStyle} placeholder="0.00" />
            </div>
          </div>

          
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <div className="shrink-0">
              <p className="text-[0.65rem] font-bold uppercase tracking-wide mb-2" style={{ color: TX }}>Fitosanitario:</p>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={fitosanitario === 'si'}
                    onChange={() => setFitosanitario(fitosanitario === 'si' ? '' : 'si')}
                    className="w-4 h-4 rounded-sm"
                    style={{ accentColor: CP }}
                  />
                  <span className="text-sm font-semibold" style={{ color: TX }}>SI</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={fitosanitario === 'no'}
                    onChange={() => setFitosanitario(fitosanitario === 'no' ? '' : 'no')}
                    className="w-4 h-4 rounded-sm"
                    style={{ accentColor: CP }}
                  />
                  <span className="text-sm font-semibold" style={{ color: TX }}>NO</span>
                </label>
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

          
          <div className="relative">
            <input
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
              placeholder="Buscar muestra…"
              className={INP}
              style={inpStyle}
            />
            <Search size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          
          <div className="overflow-x-auto rounded-xl border" style={{ borderColor: BD }}>
            <table className="w-full text-xs border-collapse min-w-[700px]">
              <thead>
                <tr style={{ backgroundColor: BG }}>
                  {['CÓDIGO','LOTE','CAMPAÑA','PRODUCTOR','CANTIDAD','TIPO DE MUESTRA','FECHA','COSTOS'].map(h => (
                    <th key={h} className="text-[0.6rem] font-black uppercase tracking-wide text-center py-2.5 px-3" style={{ color: CP, borderBottom: `2px solid ${BD}` }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {muestrasFiltradas.map((m, i) => (
                  <tr key={m.id} style={{ backgroundColor: i % 2 === 0 ? '#fff' : BG }}>
                    <td className="py-2 px-3 text-center font-mono font-semibold" style={{ color: CP }}>{m.codigo}</td>
                    <td className="py-2 px-3 text-center" style={{ color: TX }}>{m.lote}</td>
                    <td className="py-2 px-3 text-center text-gray-500">{m.campana}</td>
                    <td className="py-2 px-3 text-center" style={{ color: TX }}>{m.productor}</td>
                    <td className="py-2 px-3 text-center">
                      
                      <input
                        type="number"
                        value={m.cantidad}
                        onChange={e => updateMuestra(m.id, 'cantidad', e.target.value)}
                        className="w-20 border rounded-full px-2 py-1 text-xs text-center focus:outline-none focus:ring-1 focus:ring-green-500"
                        style={{ borderColor: BD }}
                        placeholder="0 kg"
                      />
                    </td>
                    <td className="py-2 px-3 text-center text-gray-500">{m.tipoMuestra}</td>
                    <td className="py-2 px-3 text-center text-gray-400">{m.fecha}</td>
                    <td className="py-2 px-3 text-center">
                      
                      <input
                        type="number"
                        value={m.costos}
                        onChange={e => updateMuestra(m.id, 'costos', e.target.value)}
                        className="w-20 border rounded-full px-2 py-1 text-xs text-center focus:outline-none focus:ring-1 focus:ring-green-500"
                        style={{ borderColor: BD }}
                        placeholder="$ 0"
                      />
                    </td>
                  </tr>
                ))}
                {muestrasFiltradas.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-6 text-center text-xs text-gray-400">Sin resultados para "{busqueda}"</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          
          <StatusCards
            steps={['envio_muestra', 'envio_cotizacion']}
            currentStep="envio_muestra"
            onStepClick={onGoToStep}
          />

        </div>

        
        <div className="px-5 py-3 border-t shrink-0 flex items-center justify-between" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
          <p className="text-[0.6rem] text-gray-400 font-medium">{muestras.length} muestras registradas</p>
          <button onClick={onClose} className="text-[0.65rem] font-semibold px-3 py-1.5 rounded-lg text-gray-500 hover:bg-black/05 transition-all">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
