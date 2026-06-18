import { useState } from 'react';
import { X, CheckCircle2, Package, Truck, Search, Trash2, Calendar, ChevronDown, Upload, Download } from 'lucide-react';

const CP = '#445D46';
const CS = '#5F7A61';
const BD = '#D9DDD8';
const TX = '#2C2C2C';
const BG = '#F7F8F7';

const INP      = 'w-full border rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-600 transition-all';
const inpStyle = { borderColor: BD, color: TX };

const INCOTERMS   = ['FOB','CIF','EXW','FCA','CPT','DAP','DDP'];
const CONDICIONES = ['30 días','60 días','90 días','Carta de crédito','Contra entrega'];

const fieldLabel = (label: string) => (
  <label className="block text-[0.65rem] font-bold uppercase tracking-wide mb-1.5" style={{ color: TX, opacity: 0.55 }}>{label}</label>
);

type Tab = 'compromiso' | 'lotes' | 'despacho';

interface Props {
  orden: { id: string; cliente: string; lote: string; tipoProducto: string };
  initialTab?: Tab;
  onClose: () => void;
}

const TABS: { key: Tab; label: string; icon: React.ReactNode }[] = [
  { key: 'compromiso', label: 'Compromiso de Venta',  icon: <CheckCircle2 size={12} /> },
  { key: 'lotes',      label: 'Asignación de Lotes',  icon: <Package size={12} /> },
  { key: 'despacho',   label: 'Alistado y Despacho',  icon: <Truck size={12} /> },
];

function CompromisoContent({ orden }: { orden: Props['orden'] }) {
  const [nroContrato,   setNroContrato]   = useState('');
  const [fechaContrato, setFechaContrato] = useState('');
  const [comprador,     setComprador]     = useState(orden.cliente ?? '');
  const [precioUsd,     setPrecioUsd]     = useState('');
  const [cantidadKg,    setCantidadKg]    = useState('');
  const [incoterm,      setIncoterm]      = useState('');
  const [condPago,      setCondPago]      = useState('');
  const [fechaEntrega,  setFechaEntrega]  = useState('');
  const [notas,         setNotas]         = useState('');

  const total = precioUsd && cantidadKg ? parseFloat(precioUsd) * parseFloat(cantidadKg) : 0;

  return (
    <div className="space-y-5">
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
          {fieldLabel('Precio acordado (USD / kg)')}
          <input type="number" min={0} step="0.01" value={precioUsd} onChange={e => setPrecioUsd(e.target.value)} className={INP} style={inpStyle} placeholder="0.00" />
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
          <p className="font-black text-base" style={{ color: CP }}>USD {total.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</p>
        </div>
      )}

      <div>
        {fieldLabel('Observaciones')}
        <textarea rows={3} value={notas} onChange={e => setNotas(e.target.value)} className={`${INP} resize-none`} style={inpStyle} placeholder="Notas adicionales del contrato…" />
      </div>
    </div>
  );
}

interface LoteRow { id: number; codigo: string; nombre: string; producto: string; cantidad: string; sacos: string; productor: string; fechas: string; }
const LOTES_INIT: LoteRow[] = [
  { id: 1, codigo: 'LF1', nombre: 'DIAMANTE',    producto: 'PERGAMINO', cantidad: '', sacos: '', productor: 'CAFFE SAC', fechas: '' },
  { id: 2, codigo: 'LF2', nombre: 'ORO VERDE 3', producto: 'ORO',       cantidad: '', sacos: '', productor: 'JUAN',      fechas: '' },
];

function LotesContent() {
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
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[0.65rem] font-bold uppercase tracking-wide mb-1.5" style={{ color: TX, opacity: 0.55 }}>Asignación de lotes trillados</label>
          <div className="relative">
            <input value={busqLotes} onChange={e => setBusqLotes(e.target.value)} placeholder="Buscar lote trillado…" className={`${INP} pr-10`} style={inpStyle} />
            <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
        <div>
          <label className="block text-[0.65rem] font-bold uppercase tracking-wide mb-1.5" style={{ color: TX, opacity: 0.55 }}>Mermas reutilizables</label>
          <div className="relative">
            <input value={busqMermas} onChange={e => setBusqMermas(e.target.value)} placeholder="Buscar merma…" className={`${INP} pr-10`} style={inpStyle} />
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
                  <input type="number" min={0} value={l.cantidad} onChange={e => updateLote(l.id,'cantidad',e.target.value)} className="w-20 border rounded-full px-2 py-1 text-xs text-center focus:outline-none focus:ring-1 focus:ring-green-500" style={{ borderColor: BD }} placeholder="0 kg" />
                </td>
                <td className="py-2 px-3 text-center">
                  <input type="number" min={0} value={l.sacos} onChange={e => updateLote(l.id,'sacos',e.target.value)} className="w-16 border rounded-full px-2 py-1 text-xs text-center focus:outline-none focus:ring-1 focus:ring-green-500" style={{ borderColor: BD }} placeholder="0" />
                </td>
                <td className="py-2 px-3 text-center" style={{ color: TX }}>{l.productor}</td>
                <td className="py-2 px-3 text-center">
                  <input type="text" value={l.fechas} onChange={e => updateLote(l.id,'fechas',e.target.value)} className="w-28 border rounded-full px-2 py-1 text-xs text-center focus:outline-none focus:ring-1 focus:ring-green-500" style={{ borderColor: BD }} placeholder="dd/mm/aaaa" />
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
    </div>
  );
}

function DespachoContent() {
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
  const [separarAlist, setSepararAlist] = useState(false);
  const [planAlist,    setPlanAlist]    = useState(false);
  const [costViat,     setCostViat]     = useState(false);

  const totalCostos = [costoPlanta, costoEstiba, costoEmpaque, costoTransp]
    .reduce((s, v) => s + (parseFloat(v) || 0), 0);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    setArchivos(prev => [...prev, ...files.map(f => f.name)]);
  };

  const handleSave = () => {
    console.log({
      planta, fechaAlist, guiaRem, fechaTrasl, tipoEmpaque, transporte, archivos,
      costoPlanta, costoEstiba, costoEmpaque, costoTransp,
      checkboxes: { separarAlist, planAlist, costViat },
    });
  };

  const CHECKBOXES: [string, boolean, (v: boolean) => void][] = [
    ['SEPARAR ALISTADO Y DESPACHO',        separarAlist, setSepararAlist],
    ['PLAN DE ALISTADO ES ANTES DEL DESPACHO', planAlist, setPlanAlist],
    ['COSTO DE VIÁTICOS',                  costViat,    setCostViat],
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          {fieldLabel('Nombre de planta de proceso / Almacén')}
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
              <input type="file" multiple className="hidden" onChange={handleFiles} />
            </label>
            <button type="button" className="w-10 h-10 shrink-0 rounded-xl border flex items-center justify-center hover:bg-gray-50 transition-colors" style={{ borderColor: BD, color: CP }} title="Descargar plantilla">
              <Download size={15} />
            </button>
          </div>
          {archivos.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {archivos.map((name, i) => (
                <span key={i} className="text-[0.58rem] px-2 py-0.5 rounded-full border font-medium" style={{ borderColor: BD, color: TX }}>{name}</span>
              ))}
            </div>
          )}
        </div>
        <div>
          {fieldLabel('Tipo de empaque')}
          <input value={tipoEmpaque} onChange={e => setTipoEmpaque(e.target.value)} className={INP} style={inpStyle} placeholder="Sacos yute 69 kg, GrainPro…" />
        </div>
        <div>
          {fieldLabel('Empresas de transporte / Traslado')}
          <input value={transporte} onChange={e => setTransporte(e.target.value)} className={INP} style={inpStyle} placeholder="Transportes XYZ S.A.C…" />
        </div>
        <div className="flex flex-col justify-center gap-3 pt-1">
          {CHECKBOXES.map(([label, checked, set]) => (
            <label key={label} className="flex items-start gap-2.5 cursor-pointer select-none group">
              <div
                className="w-4 h-4 shrink-0 mt-0.5 rounded border-2 flex items-center justify-center transition-all"
                style={{
                  borderColor:     checked ? CP : BD,
                  backgroundColor: checked ? CP : '#fff',
                }}
                onClick={() => set(!checked)}
              >
                {checked && (
                  <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                    <path d="M1.5 4.5L3.5 6.5L7.5 2.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
              <span className="text-[0.65rem] font-bold uppercase tracking-wide leading-tight" style={{ color: checked ? CP : '#6B7280' }}>{label}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <p className="text-[0.65rem] font-black uppercase tracking-widest mb-3" style={{ color: TX }}>Costos</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {([
            ['Proceso de planta',  costoPlanta,  setCostoPlanta],
            ['Estiba / Desestiba', costoEstiba,  setCostoEstiba],
            ['Empaque',            costoEmpaque, setCostoEmpaque],
            ['Transporte',         costoTransp,  setCostoTransp],
          ] as const).map(([label, val, set]) => (
            <div key={label}>
              <label className="block text-[0.62rem] font-bold uppercase tracking-wide mb-1.5" style={{ color: TX, opacity: 0.5 }}>{label}</label>
              <input
                type="number" min={0} step="0.01"
                value={val}
                onChange={e => (set as (v: string) => void)(e.target.value)}
                className={INP} style={inpStyle} placeholder="0.00"
              />
            </div>
          ))}
        </div>
        {totalCostos > 0 && (
          <div className="mt-3 rounded-xl px-4 py-3 flex items-center justify-between" style={{ backgroundColor: `${CP}12` }}>
            <p className="text-[0.65rem] font-bold uppercase tracking-wide" style={{ color: CP }}>Total costos:</p>
            <p className="font-black text-sm" style={{ color: CP }}>S/ {totalCostos.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</p>
          </div>
        )}
      </div>

      <div className="flex justify-end pt-1">
        <button
          onClick={handleSave}
          className="px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: CS }}
        >
          Guardar despacho
        </button>
      </div>
    </div>
  );
}

export function AlistadoModal({ orden, initialTab = 'compromiso', onClose }: Props) {
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
              <CheckCircle2 size={15} className="text-white" />
            </div>
            <div className="min-w-0">
              <p className="font-black text-sm uppercase tracking-wide" style={{ color: TX }}>Alistado</p>
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
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>

        <div className="overflow-y-auto flex-1 px-5 py-5">
          {activeTab === 'compromiso' && <CompromisoContent orden={orden} />}
          {activeTab === 'lotes'      && <LotesContent />}
          {activeTab === 'despacho'   && <DespachoContent />}
        </div>

        <div className="px-5 py-3 border-t shrink-0 flex justify-end" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
          <button onClick={onClose} className="text-[0.65rem] font-semibold px-3 py-1.5 rounded-lg text-gray-500 hover:bg-black/05 transition-all">Cerrar</button>
        </div>
      </div>
    </div>
  );
}
