import { useState } from 'react';
import { X, Truck, Calendar, Download, Upload } from 'lucide-react';
import { StatusCards } from './flow/StatusCards';
import { StepKey }    from '@/contexts/FlowContext';

const CP = '#445D46';
const BD = '#D9DDD8';
const TX = '#2C2C2C';

const INP      = 'w-full border rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-600 transition-all';
const inpStyle = { borderColor: BD, color: TX };

interface Props {
  orden: { id: string; cliente: string; lote: string; tipoProducto: string };
  onClose: () => void;
  onGoToStep?: (step: StepKey) => void;
}

const fieldLabel = (label: string) => (
  <label className="block text-[0.65rem] font-bold uppercase tracking-wide mb-1.5" style={{ color: TX, opacity: 0.55 }}>{label}</label>
);

export function AlistadoDespachoModal({ orden, onClose, onGoToStep }: Props) {
  const [planta,       setPlanta]       = useState('');
  const [fechaAlist,   setFechaAlist]   = useState('');
  const [guiaRem,      setGuiaRem]      = useState('');
  const [fechaTrasl,   setFechaTrasl]   = useState('');
  const [tipoEmpaque,  setTipoEmpaque]  = useState('');
  const [transporte,   setTransporte]   = useState('');
  const [archivos,     setArchivos]     = useState<string[]>([]);
  const [costoPlanta,  setCostoPlanta]  = useState('');
  const [costoEstiba,  setCostoEstiba]  = useState('');
  const [costoEmpaque, setCostoEmpaque] = useState('');
  const [costoTransp,  setCostoTransp]  = useState('');

  const totalCostos = [costoPlanta, costoEstiba, costoEmpaque, costoTransp]
    .reduce((s, v) => s + (parseFloat(v) || 0), 0);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    setArchivos(prev => [...prev, ...files.map(f => f.name)]);
  };

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
              <Truck size={15} className="text-white" />
            </div>
            <div className="min-w-0">
              <p className="font-black text-sm uppercase tracking-wide" style={{ color: TX }}>Alistado — Alistado y Despacho</p>
              <p className="text-[0.62rem] text-gray-400 truncate">{orden.id} · {orden.cliente} · {orden.lote}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button onClick={onClose}                                    className="text-[0.65rem] font-bold px-4 py-2 rounded-xl transition-colors hover:bg-green-400" style={{ backgroundColor: '#86efac', color: '#14532d' }}>GUARDAR</button>
            <button onClick={() => onGoToStep?.('asignacion_lotes')}     className="text-[0.65rem] font-bold px-4 py-2 rounded-xl text-white bg-pink-500 hover:bg-pink-600 transition-colors">CANCELAR</button>
            <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-black/06 transition-all ml-1"><X size={16} /></button>
          </div>
        </div>

        
        <div className="overflow-y-auto flex-1 px-5 py-5 space-y-5">

          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              {fieldLabel('Nombre de planta / Almacén')}
              <input value={planta} onChange={e => setPlanta(e.target.value)} className={INP} style={inpStyle} placeholder="Planta Lima Norte…" />
            </div>
            <div>
              {fieldLabel('Fecha de alistado')}
              <div className="relative">
                <input type="date" value={fechaAlist} onChange={e => setFechaAlist(e.target.value)} className={INP} style={inpStyle} />
                <Calendar size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div>
              {fieldLabel('Guía de remisión')}
              <input value={guiaRem} onChange={e => setGuiaRem(e.target.value)} className={INP} style={inpStyle} placeholder="GR-2026-001" />
            </div>
            <div>
              {fieldLabel('Fecha de traslado')}
              <div className="relative">
                <input type="date" value={fechaTrasl} onChange={e => setFechaTrasl(e.target.value)} className={INP} style={inpStyle} />
                <Calendar size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div>
              {fieldLabel('Reportes de calidad de la planta')}
              <div className="flex gap-2">
                <label className="flex-1 flex items-center justify-center gap-2 border rounded-xl px-3 py-2.5 text-sm cursor-pointer transition-colors hover:bg-gray-50" style={{ borderColor: BD, color: '#6B7280' }}>
                  <Upload size={14} />
                  <span className="text-[0.7rem] font-semibold uppercase">Subir archivos…</span>
                  <input type="file" multiple className="hidden" onChange={handleFiles} accept=".pdf,.xlsx,.jpg,.png" />
                </label>
                <button className="w-10 h-10 shrink-0 rounded-xl border flex items-center justify-center hover:bg-gray-50" style={{ borderColor: BD, color: CP }} title="Descargar plantilla">
                  <Download size={15} />
                </button>
              </div>
            </div>
            <div>
              {fieldLabel('Tipo de empaque')}
              <input value={tipoEmpaque} onChange={e => setTipoEmpaque(e.target.value)} className={INP} style={inpStyle} placeholder="Sacos yute 69 kg, GrainPro…" />
            </div>
            <div className="sm:col-span-2">
              {fieldLabel('Empresas de transporte / Traslado')}
              <input value={transporte} onChange={e => setTransporte(e.target.value)} className={INP} style={inpStyle} placeholder="Transportes XYZ S.A.C…" />
            </div>
          </div>

          {archivos.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {archivos.map((name, i) => (
                <span key={i} className="text-[0.6rem] px-2.5 py-1 rounded-full border font-medium" style={{ borderColor: BD, color: TX }}>{name}</span>
              ))}
            </div>
          )}

          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-3">
              <p className="font-black text-xs uppercase tracking-widest" style={{ color: TX }}>Costos:</p>
              <div className="grid grid-cols-2 gap-3">
                {([['Proceso de planta', costoPlanta, setCostoPlanta],['Estiba / Desestiba', costoEstiba, setCostoEstiba],['Empaque', costoEmpaque, setCostoEmpaque],['Transporte', costoTransp, setCostoTransp]] as const).map(([label, val, set]) => (
                  <div key={label}>
                    <label className="block text-[0.62rem] font-bold uppercase tracking-wide mb-1" style={{ color: TX, opacity: 0.5 }}>{label}</label>
                    <input type="number" min={0} step="0.01" value={val} onChange={e => (set as (v: string) => void)(e.target.value)} className={INP} style={inpStyle} placeholder="0.00" />
                  </div>
                ))}
              </div>
              {totalCostos > 0 && (
                <div className="rounded-xl px-4 py-3 flex items-center justify-between" style={{ backgroundColor: `${CP}12` }}>
                  <p className="text-[0.65rem] font-bold uppercase" style={{ color: CP }}>Total costos:</p>
                  <p className="font-black text-sm" style={{ color: CP }}>S/ {totalCostos.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</p>
                </div>
              )}
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 space-y-3">
              <p className="font-black text-xs uppercase tracking-wide text-amber-800">Notas</p>
              {['SEPARAR ALISTADO Y DESPACHO','PLAN DE ALISTADO ES ANTES DEL DESPACHO','COSTO DE VIÁTICOS'].map(n => (
                <p key={n} className="text-[0.65rem] font-bold text-amber-700 uppercase tracking-wide border-l-2 border-amber-400 pl-3">{n}</p>
              ))}
            </div>
          </div>

          <StatusCards steps={['compromiso_venta','asignacion_lotes','despacho']} currentStep="despacho" onStepClick={onGoToStep} />
        </div>

        <div className="px-5 py-3 border-t shrink-0 flex justify-end" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
          <button onClick={onClose} className="text-[0.65rem] font-semibold px-3 py-1.5 rounded-lg text-gray-500 hover:bg-black/05 transition-all">Cerrar</button>
        </div>
      </div>
    </div>
  );
}
