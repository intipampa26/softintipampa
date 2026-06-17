import { useState } from 'react';
import { X, Package, Search, Trash2 } from 'lucide-react';
import { StatusCards } from './flow/StatusCards';
import { StepKey }    from '@/contexts/FlowContext';

const CP = '#445D46';
const BD = '#D9DDD8';
const TX = '#2C2C2C';
const BG = '#F7F8F7';

const INP_SEARCH = 'w-full border rounded-xl px-3 py-2.5 pr-10 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-600 transition-all';
const inpStyle   = { borderColor: BD, color: TX };

interface LoteRow { id: number; codigo: string; nombre: string; producto: string; cantidad: string; sacos: string; productor: string; fechas: string; }

const LOTES_INIT: LoteRow[] = [
  { id: 1, codigo: 'LF1', nombre: 'DIAMANTE',    producto: 'PERGAMINO', cantidad: '', sacos: '', productor: 'CAFFE SAC', fechas: '' },
  { id: 2, codigo: 'LF2', nombre: 'ORO VERDE 3', producto: 'ORO',       cantidad: '', sacos: '', productor: 'JUAN',      fechas: '' },
];

interface Props {
  orden: { id: string; cliente: string; lote: string; tipoProducto: string };
  onClose: () => void;
  onGoToStep?: (step: StepKey) => void;
}

export function AlistadoAsignacionLotesModal({ orden, onClose, onGoToStep }: Props) {
  const [busqLotes,  setBusqLotes]  = useState('');
  const [busqMermas, setBusqMermas] = useState('');
  const [lotes,      setLotes]      = useState<LoteRow[]>(LOTES_INIT);

  const updateLote = (id: number, field: keyof LoteRow, val: string) =>
    setLotes(prev => prev.map(l => l.id === id ? { ...l, [field]: val } : l));
  const deleteLote = (id: number) => setLotes(prev => prev.filter(l => l.id !== id));

  const filtrados = lotes.filter(l => {
    const q = busqLotes.toLowerCase();
    return !q || [l.codigo, l.nombre, l.producto, l.productor].some(v => v.toLowerCase().includes(q));
  });

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
              <Package size={15} className="text-white" />
            </div>
            <div className="min-w-0">
              <p className="font-black text-sm uppercase tracking-wide" style={{ color: TX }}>Alistado — Asignación de Lotes</p>
              <p className="text-[0.62rem] text-gray-400 truncate">{orden.id} · {orden.cliente} · {orden.lote}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button onClick={() => onGoToStep?.('despacho')} className="text-[0.65rem] font-bold px-4 py-2 rounded-xl transition-colors hover:bg-green-400" style={{ backgroundColor: '#86efac', color: '#14532d' }}>GUARDAR</button>
            <button onClick={() => onGoToStep?.('compromiso_venta')} className="text-[0.65rem] font-bold px-4 py-2 rounded-xl text-white bg-pink-500 hover:bg-pink-600 transition-colors">CANCELAR</button>
            <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-black/06 transition-all ml-1"><X size={16} /></button>
          </div>
        </div>

        
        <div className="overflow-y-auto flex-1 px-5 py-5 space-y-5">

          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[0.65rem] font-bold uppercase tracking-wide mb-1.5" style={{ color: TX, opacity: 0.55 }}>Asignación de lotes trillados</label>
              <div className="relative">
                <input value={busqLotes} onChange={e => setBusqLotes(e.target.value)} placeholder="Buscar lote trillado…" className={INP_SEARCH} style={inpStyle} />
                <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block text-[0.65rem] font-bold uppercase tracking-wide mb-1.5" style={{ color: TX, opacity: 0.55 }}>Mermas reutilizables</label>
              <div className="relative">
                <input value={busqMermas} onChange={e => setBusqMermas(e.target.value)} placeholder="Buscar merma…" className={INP_SEARCH} style={inpStyle} />
                <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
              <p className="text-[0.58rem] font-black uppercase tracking-wide text-amber-700 mt-1.5">REVISAR SI SE PUEDE AGREGAR LA PLANTA</p>
            </div>
          </div>

          
          <div className="overflow-x-auto rounded-xl border bg-white" style={{ borderColor: BD }}>
            <table className="w-full text-xs border-collapse min-w-[780px]">
              <thead>
                <tr style={{ backgroundColor: BG }}>
                  {['CÓDIGO','NOMBRE DEL LOTE','PRODUCTO','CANTIDAD','# SACOS','PRODUCTOR','FECHAS DE PROCESO','ACCIONES'].map(h => (
                    <th key={h} className="text-[0.6rem] font-black uppercase tracking-wide text-center py-2.5 px-3" style={{ color: CP, borderBottom: `2px solid ${BD}` }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtrados.map((l, i) => (
                  <tr key={l.id} style={{ backgroundColor: i % 2 === 0 ? '#fff' : BG }}>
                    <td className="py-2 px-3 text-center font-mono font-semibold" style={{ color: CP }}>{l.codigo}</td>
                    <td className="py-2 px-3 text-center font-semibold" style={{ color: TX }}>{l.nombre}</td>
                    <td className="py-2 px-3 text-center text-gray-500">{l.producto}</td>
                    <td className="py-2 px-3 text-center">
                      <input type="number" min={0} value={l.cantidad} onChange={e => updateLote(l.id,'cantidad',e.target.value)}
                        className="w-20 border rounded-full px-2 py-1 text-xs text-center focus:outline-none focus:ring-1 focus:ring-green-500" style={{ borderColor: BD }} placeholder="0 kg" />
                    </td>
                    <td className="py-2 px-3 text-center">
                      <input type="number" min={0} value={l.sacos} onChange={e => updateLote(l.id,'sacos',e.target.value)}
                        className="w-16 border rounded-full px-2 py-1 text-xs text-center focus:outline-none focus:ring-1 focus:ring-green-500" style={{ borderColor: BD }} placeholder="0" />
                    </td>
                    <td className="py-2 px-3 text-center" style={{ color: TX }}>{l.productor}</td>
                    <td className="py-2 px-3 text-center">
                      <input type="text" value={l.fechas} onChange={e => updateLote(l.id,'fechas',e.target.value)}
                        className="w-28 border rounded-full px-2 py-1 text-xs text-center focus:outline-none focus:ring-1 focus:ring-green-500" style={{ borderColor: BD }} placeholder="dd/mm/aaaa" />
                    </td>
                    <td className="py-2 px-3 text-center">
                      <button onClick={() => deleteLote(l.id)} className="w-7 h-7 rounded-lg flex items-center justify-center mx-auto transition-all hover:scale-105" style={{ backgroundColor: '#fdecea', color: '#c62828' }} title="Eliminar">
                        <Trash2 size={12} />
                      </button>
                    </td>
                  </tr>
                ))}
                {filtrados.length === 0 && (
                  <tr><td colSpan={8} className="py-8 text-center text-xs text-gray-400">{busqLotes ? `Sin resultados para "${busqLotes}"` : 'Sin lotes asignados'}</td></tr>
                )}
              </tbody>
            </table>
          </div>

          <StatusCards steps={['compromiso_venta','asignacion_lotes','despacho']} currentStep="asignacion_lotes" onStepClick={onGoToStep} />
        </div>

        <div className="px-5 py-3 border-t shrink-0 flex justify-end" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
          <button onClick={onClose} className="text-[0.65rem] font-semibold px-3 py-1.5 rounded-lg text-gray-500 hover:bg-black/05 transition-all">Cerrar</button>
        </div>
      </div>
    </div>
  );
}
