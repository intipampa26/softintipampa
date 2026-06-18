import { useState } from 'react';
import { X, Send, FileText, Calendar, ChevronDown, Search } from 'lucide-react';

const CP = '#445D46';
const BD = '#D9DDD8';
const TX = '#2C2C2C';
const BG = '#F7F8F7';

const INP      = 'w-full border rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-600 transition-all';
const inpStyle = { borderColor: BD, color: TX };

const INCOTERMS   = ['FOB','CIF','EXW','FCA','CPT','DAP','DDP'];
const PUERTOS     = ['Callao, Perú','Rotterdam, Países Bajos','Hamburg, Alemania','New York, EE.UU.','Amberes, Bélgica'];
const CONDICIONES = ['30 días','60 días','90 días','Contra entrega','Carta de crédito'];
const CLIENTES_MOCK = ['Volcafe Perú S.A.C.','Sucafina S.A.','Olam International','Nordic Approach AS','Caravela Coffee LLC','Trabocca B.V.'];

const fieldLabel = (label: string) => (
  <label className="block text-[0.65rem] font-bold uppercase tracking-wide mb-1.5" style={{ color: TX, opacity: 0.55 }}>{label}</label>
);

interface MuestraMock { id: number; codigo: string; lote: string; campana: string; productor: string; cantidad: string; tipoMuestra: string; fecha: string; costos: string; }
const MOCK_MUESTRAS: MuestraMock[] = [
  { id: 1, codigo: 'M0001', lote: 'LF-2026-001', campana: 'C.2025/26', productor: 'Juan Ríos',    cantidad: '', tipoMuestra: 'Papiro',   fecha: '09/01/2026', costos: '' },
  { id: 2, codigo: 'M0002', lote: 'LF-2026-002', campana: 'C.2025/26', productor: 'Mateo SAC',    cantidad: '', tipoMuestra: 'Granel',   fecha: '10/01/2026', costos: '' },
  { id: 3, codigo: 'M0003', lote: 'LF-2026-003', campana: 'C.2025/26', productor: 'Rosa Medina',  cantidad: '', tipoMuestra: 'Papiro',   fecha: '12/01/2026', costos: '' },
  { id: 4, codigo: 'M0004', lote: 'LF-2026-004', campana: 'C.2025/26', productor: 'Pedro Huamán', cantidad: '', tipoMuestra: 'Especial', fecha: '14/01/2026', costos: '' },
  { id: 5, codigo: 'M0005', lote: 'LF-2026-005', campana: 'C.2025/26', productor: 'Luis Vargas',  cantidad: '', tipoMuestra: 'Granel',   fecha: '15/01/2026', costos: '' },
];

type Tab = 'muestras' | 'cotizacion';

interface Props {
  orden: { id: string; cliente: string; lote: string; tipoProducto: string };
  initialTab?: Tab;
  onClose: () => void;
}

const TABS: { key: Tab; label: string; icon: React.ReactNode }[] = [
  { key: 'muestras',   label: 'Envío de Muestras',    icon: <Send size={12} /> },
  { key: 'cotizacion', label: 'Envío de Cotización',   icon: <FileText size={12} /> },
];

function MuestrasContent({ orden }: { orden: Props['orden'] }) {
  const [fechaEnvio,     setFechaEnvio]     = useState('');
  const [fechaRecepcion, setFechaRecepcion] = useState('');
  const [rucDni,         setRucDni]         = useState('');
  const [cliente,        setCliente]        = useState(orden.cliente ?? '');
  const [courier,        setCourier]        = useState('');
  const [costoCourier,   setCostoCourier]   = useState('');
  const [fitosanitario,  setFitosanitario]  = useState<'si' | 'no' | ''>('');
  const [busqueda,       setBusqueda]       = useState('');
  const [muestras,       setMuestras]       = useState<MuestraMock[]>(MOCK_MUESTRAS);

  const filtradas = muestras.filter(m => {
    const q = busqueda.toLowerCase();
    return !q || [m.codigo, m.lote, m.productor, m.tipoMuestra].some(v => v.toLowerCase().includes(q));
  });
  const updateMuestra = (id: number, field: 'cantidad' | 'costos', value: string) =>
    setMuestras(prev => prev.map(m => m.id === id ? { ...m, [field]: value } : m));

  return (
    <div className="space-y-5">
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
            <select value={cliente} onChange={e => setCliente(e.target.value)} className={`${INP} pr-9 appearance-none`} style={inpStyle}>
              <option value="">Seleccionar cliente…</option>
              {CLIENTES_MOCK.map(c => <option key={c} value={c}>{c}</option>)}
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
            {(['si','no'] as const).map(v => (
              <label key={v} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={fitosanitario === v} onChange={() => setFitosanitario(fitosanitario === v ? '' : v)} className="w-4 h-4 rounded-sm" style={{ accentColor: CP }} />
                <span className="text-sm font-semibold" style={{ color: TX }}>{v.toUpperCase()}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="flex-1">
          <p className="text-[0.6rem] font-bold uppercase tracking-wide bg-amber-50 border border-amber-200 text-amber-700 rounded-lg px-3 py-2 leading-relaxed">
            FALTA CONTROLAR LA CANTIDAD EN KG QUE CONSUME LA MUESTRA Y SE LE ASIGNE AL ENVÍO DE MUESTRA
          </p>
        </div>
      </div>

      <div className="relative">
        <input value={busqueda} onChange={e => setBusqueda(e.target.value)} placeholder="Buscar muestra…" className={INP} style={inpStyle} />
        <Search size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
      </div>

      <div className="overflow-x-auto rounded-xl border" style={{ borderColor: BD }}>
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
                  <input type="number" value={m.cantidad} onChange={e => updateMuestra(m.id,'cantidad',e.target.value)} className="w-20 border rounded-full px-2 py-1 text-xs text-center focus:outline-none focus:ring-1 focus:ring-green-500" style={{ borderColor: BD }} placeholder="0 kg" />
                </td>
                <td className="py-2 px-3 text-center text-gray-500">{m.tipoMuestra}</td>
                <td className="py-2 px-3 text-center text-gray-400">{m.fecha}</td>
                <td className="py-2 px-3 text-center">
                  <input type="number" value={m.costos} onChange={e => updateMuestra(m.id,'costos',e.target.value)} className="w-20 border rounded-full px-2 py-1 text-xs text-center focus:outline-none focus:ring-1 focus:ring-green-500" style={{ borderColor: BD }} placeholder="$ 0" />
                </td>
              </tr>
            ))}
            {filtradas.length === 0 && (
              <tr><td colSpan={8} className="py-6 text-center text-xs text-gray-400">Sin resultados para "{busqueda}"</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CotizacionContent({ orden }: { orden: Props['orden'] }) {
  const [nroCotizacion, setNroCotizacion] = useState('');
  const [fechaCotiz,    setFechaCotiz]    = useState('');
  const [precioUsd,     setPrecioUsd]     = useState('');
  const [pesoKg,        setPesoKg]        = useState('');
  const [incoterm,      setIncoterm]      = useState('');
  const [puerto,        setPuerto]        = useState('');
  const [condPago,      setCondPago]      = useState('');
  const [validez,       setValidez]       = useState('');
  const [observaciones, setObservaciones] = useState('');
  void orden;

  const total = precioUsd && pesoKg ? parseFloat(precioUsd) * parseFloat(pesoKg) : 0;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          {fieldLabel('N° Cotización')}
          <input value={nroCotizacion} onChange={e => setNroCotizacion(e.target.value)} className={INP} style={inpStyle} placeholder="COT-2026-001" />
        </div>
        <div>
          {fieldLabel('Fecha de cotización')}
          <div className="relative">
            <input type="date" value={fechaCotiz} onChange={e => setFechaCotiz(e.target.value)} className={INP} style={inpStyle} />
            <Calendar size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
        <div>
          {fieldLabel('Precio (USD / kg)')}
          <input type="number" min={0} step="0.01" value={precioUsd} onChange={e => setPrecioUsd(e.target.value)} className={INP} style={inpStyle} placeholder="0.00" />
        </div>
        <div>
          {fieldLabel('Peso total (kg)')}
          <input type="number" min={0} value={pesoKg} onChange={e => setPesoKg(e.target.value)} className={INP} style={inpStyle} placeholder="0" />
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
          {fieldLabel('Puerto de destino')}
          <div className="relative">
            <select value={puerto} onChange={e => setPuerto(e.target.value)} className={`${INP} pr-9 appearance-none`} style={inpStyle}>
              <option value="">Seleccionar…</option>
              {PUERTOS.map(p => <option key={p}>{p}</option>)}
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
          {fieldLabel('Validez de la oferta (días)')}
          <input type="number" min={1} value={validez} onChange={e => setValidez(e.target.value)} className={INP} style={inpStyle} placeholder="15" />
        </div>
      </div>

      {total > 0 && (
        <div className="rounded-xl px-4 py-3 flex items-center gap-3" style={{ backgroundColor: `${CP}12` }}>
          <p className="text-[0.65rem] font-bold uppercase tracking-wide" style={{ color: CP }}>Total estimado:</p>
          <p className="font-black text-base" style={{ color: CP }}>USD {total.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</p>
        </div>
      )}

      <div>
        {fieldLabel('Observaciones')}
        <textarea rows={3} value={observaciones} onChange={e => setObservaciones(e.target.value)} className={`${INP} resize-none`} style={inpStyle} placeholder="Condiciones especiales, notas al cliente…" />
      </div>
    </div>
  );
}

export function PreventaModal({ orden, initialTab = 'muestras', onClose }: Props) {
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
              <Send size={15} className="text-white" />
            </div>
            <div className="min-w-0">
              <p className="font-black text-sm uppercase tracking-wide" style={{ color: TX }}>Preventa</p>
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
          {activeTab === 'muestras'   && <MuestrasContent   orden={orden} />}
          {activeTab === 'cotizacion' && <CotizacionContent orden={orden} />}
        </div>

        <div className="px-5 py-3 border-t shrink-0 flex justify-end" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
          <button onClick={onClose} className="text-[0.65rem] font-semibold px-3 py-1.5 rounded-lg text-gray-500 hover:bg-black/05 transition-all">Cerrar</button>
        </div>
      </div>
    </div>
  );
}
