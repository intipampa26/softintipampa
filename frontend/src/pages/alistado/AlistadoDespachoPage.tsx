import { useState, useEffect } from 'react';
import { Truck, Calendar, Download, Upload } from 'lucide-react';
import { TopBar }      from '@/components/flow/TopBar';
import { StatusCards } from '@/components/flow/StatusCards';
import { useFlow }     from '@/contexts/FlowContext';

const CP = '#445D46';
const BD = '#D9DDD8';
const TX = '#2C2C2C';
const BG = '#F7F8F7';

const INP      = 'w-full border rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-600 transition-all';
const INP_NUM  = 'w-full border rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-600 transition-all';
const inpStyle = { borderColor: BD, color: TX };

const field = (label: string, children: React.ReactNode, fullWidth = false) => (
  <div className={fullWidth ? 'sm:col-span-2' : ''}>
    <label className="block text-[0.65rem] font-bold uppercase tracking-wide mb-1.5" style={{ color: TX, opacity: 0.55 }}>{label}</label>
    {children}
  </div>
);

export function AlistadoDespachoPage() {
  const { setCurrentStep, saveAndNext, cancelToPrev } = useFlow();

  useEffect(() => { setCurrentStep('despacho'); }, []);

  
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

  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    setArchivos(prev => [...prev, ...files.map(f => f.name)]);
  };

  return (
    <div className="min-h-full flex flex-col" style={{ backgroundColor: BG }}>
      <TopBar
        icon={<Truck size={15} className="text-white" />}
        titulo="Alistado — Alistado y Despacho"
        subtitulo="Registrar proceso de alistado y despacho del lote"
        onGuardar={() => saveAndNext('despacho')}
        onCancelar={() => cancelToPrev('despacho')}
      />

      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">

        
        <div className="bg-white rounded-2xl border p-5" style={{ borderColor: BD }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {field('Nombre de planta / Almacén',
              <input value={planta} onChange={e => setPlanta(e.target.value)} className={INP} style={inpStyle} placeholder="Planta Lima Norte…" />
            )}
            {field('Fecha de alistado',
              <div className="relative">
                <input type="date" value={fechaAlist} onChange={e => setFechaAlist(e.target.value)} className={INP} style={inpStyle} />
                <Calendar size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            )}
            {field('Guía de remisión',
              <input value={guiaRem} onChange={e => setGuiaRem(e.target.value)} className={INP} style={inpStyle} placeholder="GR-2026-001" />
            )}
            {field('Fecha de traslado',
              <div className="relative">
                <input type="date" value={fechaTrasl} onChange={e => setFechaTrasl(e.target.value)} className={INP} style={inpStyle} />
                <Calendar size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            )}

            
            {field('Reportes de calidad de la planta',
              <div className="flex gap-2">
                <label className="flex-1 flex items-center justify-center gap-2 border rounded-xl px-3 py-2.5 text-sm cursor-pointer transition-colors hover:bg-gray-50"
                  style={{ borderColor: BD, color: '#6B7280' }}>
                  <Upload size={14} />
                  <span className="text-[0.7rem] font-semibold uppercase">Subir archivos…</span>
                  <input type="file" multiple className="hidden" onChange={handleFileChange} accept=".pdf,.xlsx,.jpg,.png" />
                </label>
                <button
                  className="w-10 h-10 shrink-0 rounded-xl border flex items-center justify-center transition-colors hover:bg-gray-50"
                  style={{ borderColor: BD, color: CP }}
                  title="Descargar plantilla"
                >
                  <Download size={15} />
                </button>
              </div>
            )}
            {field('Tipo de empaque',
              <input value={tipoEmpaque} onChange={e => setTipoEmpaque(e.target.value)} className={INP} style={inpStyle} placeholder="Sacos yute 69 kg, GrainPro…" />
            )}
            {field('Empresas de transporte / Traslado',
              <input value={transporte} onChange={e => setTransporte(e.target.value)} className={INP} style={inpStyle} placeholder="Transportes XYZ S.A.C…" />,
              true
            )}
          </div>

          
          {archivos.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {archivos.map((name, i) => (
                <span key={i} className="text-[0.6rem] px-2.5 py-1 rounded-full border font-medium" style={{ borderColor: BD, color: TX }}>
                  {name}
                </span>
              ))}
            </div>
          )}
        </div>

        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

          
          <div className="bg-white rounded-2xl border p-5 space-y-4" style={{ borderColor: BD }}>
            <p className="font-black text-sm uppercase tracking-widest" style={{ color: TX }}>Costos:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                ['Proceso de planta',   costoPlanta,  setCostoPlanta],
                ['Estiba / Desestiba',  costoEstiba,  setCostoEstiba],
                ['Empaque',             costoEmpaque, setCostoEmpaque],
                ['Transporte',          costoTransp,  setCostoTransp],
              ].map(([label, val, set]) => (
                <div key={label as string}>
                  <label className="block text-[0.62rem] font-bold uppercase tracking-wide mb-1" style={{ color: TX, opacity: 0.5 }}>{label as string}</label>
                  <input
                    type="number" min={0} step="0.01"
                    value={val as string}
                    onChange={e => (set as (v: string) => void)(e.target.value)}
                    className={INP_NUM}
                    style={inpStyle}
                    placeholder="0.00"
                  />
                </div>
              ))}
            </div>
            {totalCostos > 0 && (
              <div className="rounded-xl px-4 py-3 flex items-center justify-between" style={{ backgroundColor: `${CP}12` }}>
                <p className="text-[0.65rem] font-bold uppercase tracking-wide" style={{ color: CP }}>Total costos:</p>
                <p className="font-black text-base" style={{ color: CP }}>
                  S/ {totalCostos.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                </p>
              </div>
            )}
          </div>

          
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 space-y-3">
            <p className="font-black text-xs uppercase tracking-wide text-amber-800">Notas</p>
            {[
              'SEPARAR ALISTADO Y DESPACHO',
              'PLAN DE ALISTADO ES ANTES DEL DESPACHO',
              'COSTO DE VIÁTICOS',
            ].map(nota => (
              <p key={nota} className="text-[0.65rem] font-bold text-amber-700 uppercase tracking-wide border-l-2 border-amber-400 pl-3">
                {nota}
              </p>
            ))}
          </div>
        </div>

        
        <StatusCards steps={['compromiso_venta','asignacion_lotes','despacho']} currentStep="despacho" />
      </div>
    </div>
  );
}
