import { useState } from 'react';
import { X, Ship, Calendar, ChevronDown, Upload, FileText, Package } from 'lucide-react';

const CP = '#445D46';
const CS = '#5F7A61';
const BD = '#D9DDD8';
const TX = '#2C2C2C';
const BG = '#F7F8F7';

const INP      = 'w-full border rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-600 transition-all';
const inpStyle = { borderColor: BD, color: TX };

const fieldLabel = (label: string) => (
  <label className="block text-[0.65rem] font-bold uppercase tracking-wide mb-1.5" style={{ color: TX, opacity: 0.55 }}>{label}</label>
);

function Checkbox({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <div
      onClick={onChange}
      className="w-4 h-4 shrink-0 rounded border-2 flex items-center justify-center cursor-pointer transition-all"
      style={{ borderColor: checked ? CP : BD, backgroundColor: checked ? CP : '#fff' }}
    >
      {checked && (
        <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
          <path d="M1.5 4.5L3.5 6.5L7.5 2.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}
    </div>
  );
}

type Tab = 'aduanero' | 'datos_cliente' | 'plan';

interface Props {
  orden: { id: string; cliente: string; lote: string; tipoProducto: string };
  initialTab?: Tab;
  onClose: () => void;
}

const TABS: { key: Tab; label: string }[] = [
  { key: 'aduanero',      label: 'Despacho Aduanero'        },
  { key: 'datos_cliente', label: 'Envío de Datos al Cliente' },
  { key: 'plan',          label: 'Plan de Exportación'       },
];

const NAVIERAS    = ['Maersk','MSC','CMA CGM','Hapag-Lloyd','Evergreen','COSCO','ONE'];
const PUERTOS_OR  = ['Callao, Perú','Paita, Perú','Matarani, Perú'];
const PUERTOS_DE  = ['Rotterdam, Países Bajos','Hamburg, Alemania','Amberes, Bélgica','New York, EE.UU.','Los Ángeles, EE.UU.','Barcelona, España'];
const CONTENEDOR  = ["20' Standard","40' Standard","40' High Cube","20' Reefer","40' Reefer"];
const METODOS     = ['Correo electrónico','Courier DHL','Courier FedEx','Portal web cliente','WhatsApp'];
const DOCS_LIST   = ['BL / Conocimiento de embarque','Factura comercial','Packing list','Certificado de origen','Certificado fitosanitario','COA (Certificado de Análisis)','Certificado orgánico'];
const ESTADO_AVA  = ['Pendiente','En proceso','Completado'];
const CERTS_LIST  = ['Orgánico USDA','Orgánico EU','Rainforest Alliance','Fair Trade','UTZ','4C','BRC','ISO 22000'];

function InfoTag({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col min-w-0">
      <span className="text-[0.55rem] font-black uppercase tracking-widest" style={{ color: CP, opacity: 0.7 }}>{label}</span>
      <span className="text-xs font-semibold truncate mt-0.5" style={{ color: TX }}>{value || '—'}</span>
    </div>
  );
}

function AduaneroContent({ orden }: { orden: Props['orden'] }) {
  const [codExport,    setCodExport]    = useState('');
  const [fechaExport,  setFechaExport]  = useState('');
  const [tipoProducto, setTipoProducto] = useState(orden.tipoProducto ?? '');
  const [cantExport,   setCantExport]   = useState('');
  const [estadoAvanc,  setEstadoAvanc]  = useState('');
  const [nroDua,       setNroDua]       = useState('');
  const [fechaDesp,    setFechaDesp]    = useState('');
  const [agente,       setAgente]       = useState('');
  const [puertoOrig,   setPuertoOrig]   = useState('');
  const [puertoDest,   setPuertoDest]   = useState('');
  const [naviera,      setNaviera]      = useState('');
  const [nroBl,        setNroBl]        = useState('');
  const [fechaEmbarq,  setFechaEmbarq]  = useState('');
  const [contenedor,   setContenedor]   = useState('');
  const [nroPrecinto,  setNroPrecinto]  = useState('');
  const [kardexNro,    setKardexNro]    = useState('');
  const [kardexReg,    setKardexReg]    = useState(false);
  const [observ,       setObserv]       = useState('');

  return (
    <div className="space-y-6">
      <div className="rounded-2xl p-4 grid grid-cols-2 sm:grid-cols-4 gap-4" style={{ backgroundColor: BG }}>
        <div>
          {fieldLabel('Código de exportación')}
          <input value={codExport} onChange={e => setCodExport(e.target.value)} className={INP} style={inpStyle} placeholder="EXP-2026-001" />
        </div>
        <div>
          {fieldLabel('Fecha de exportación')}
          <div className="relative">
            <input type="date" value={fechaExport} onChange={e => setFechaExport(e.target.value)} className={INP} style={inpStyle} />
            <Calendar size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
        <div>
          {fieldLabel('Tipo de producto')}
          <input value={tipoProducto} onChange={e => setTipoProducto(e.target.value)} className={INP} style={inpStyle} placeholder="Café verde, Cacao…" />
        </div>
        <div>
          {fieldLabel('Cantidad exportada (kg)')}
          <input type="number" min={0} value={cantExport} onChange={e => setCantExport(e.target.value)} className={INP} style={inpStyle} placeholder="0" />
        </div>
        <div className="col-span-2 sm:col-span-2">
          {fieldLabel('Estado de avance')}
          <div className="relative">
            <select value={estadoAvanc} onChange={e => setEstadoAvanc(e.target.value)} className={`${INP} pr-9 appearance-none`} style={inpStyle}>
              <option value="">Seleccionar…</option>
              {ESTADO_AVA.map(e => <option key={e}>{e}</option>)}
            </select>
            <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
        <div className="col-span-2 sm:col-span-2">
          <div className="flex items-center gap-3 h-full pt-5">
            <div className="flex-1 rounded-xl border px-3 py-2.5 flex items-center gap-3" style={{ borderColor: kardexReg ? CP : BD, backgroundColor: kardexReg ? `${CP}08` : '#fff' }}>
              <Package size={14} style={{ color: CP, opacity: kardexReg ? 1 : 0.4 }} />
              <div className="flex-1 min-w-0">
                <p className="text-[0.6rem] font-black uppercase tracking-wide" style={{ color: TX, opacity: 0.5 }}>Inventario Kardex</p>
                <input
                  value={kardexNro}
                  onChange={e => setKardexNro(e.target.value)}
                  className="w-full text-xs bg-transparent outline-none font-semibold mt-0.5"
                  style={{ color: TX }}
                  placeholder="N° movimiento…"
                />
              </div>
              <label className="flex items-center gap-1.5 cursor-pointer shrink-0">
                <Checkbox checked={kardexReg} onChange={() => setKardexReg(v => !v)} />
                <span className="text-[0.6rem] font-bold uppercase" style={{ color: kardexReg ? CP : '#9CA3AF' }}>Registrado</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div>
        <p className="text-[0.65rem] font-black uppercase tracking-widest mb-3" style={{ color: TX }}>Datos aduaneros</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            {fieldLabel('N° DUA')}
            <input value={nroDua} onChange={e => setNroDua(e.target.value)} className={INP} style={inpStyle} placeholder="DUA-2026-001" />
          </div>
          <div>
            {fieldLabel('Fecha de despacho')}
            <div className="relative">
              <input type="date" value={fechaDesp} onChange={e => setFechaDesp(e.target.value)} className={INP} style={inpStyle} />
              <Calendar size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
          <div>
            {fieldLabel('Agente de aduanas')}
            <input value={agente} onChange={e => setAgente(e.target.value)} className={INP} style={inpStyle} placeholder="Agencia Aduanera XYZ…" />
          </div>
          <div>
            {fieldLabel('Naviera')}
            <div className="relative">
              <select value={naviera} onChange={e => setNaviera(e.target.value)} className={`${INP} pr-9 appearance-none`} style={inpStyle}>
                <option value="">Seleccionar…</option>
                {NAVIERAS.map(n => <option key={n}>{n}</option>)}
              </select>
              <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
          <div>
            {fieldLabel('Puerto de embarque')}
            <div className="relative">
              <select value={puertoOrig} onChange={e => setPuertoOrig(e.target.value)} className={`${INP} pr-9 appearance-none`} style={inpStyle}>
                <option value="">Seleccionar…</option>
                {PUERTOS_OR.map(p => <option key={p}>{p}</option>)}
              </select>
              <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
          <div>
            {fieldLabel('Puerto de destino')}
            <div className="relative">
              <select value={puertoDest} onChange={e => setPuertoDest(e.target.value)} className={`${INP} pr-9 appearance-none`} style={inpStyle}>
                <option value="">Seleccionar…</option>
                {PUERTOS_DE.map(p => <option key={p}>{p}</option>)}
              </select>
              <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
          <div>
            {fieldLabel('N° BL (Bill of Lading)')}
            <input value={nroBl} onChange={e => setNroBl(e.target.value)} className={INP} style={inpStyle} placeholder="MAEU2026001…" />
          </div>
          <div>
            {fieldLabel('Fecha de embarque')}
            <div className="relative">
              <input type="date" value={fechaEmbarq} onChange={e => setFechaEmbarq(e.target.value)} className={INP} style={inpStyle} />
              <Calendar size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
          <div>
            {fieldLabel('N° Contenedor')}
            <input value={contenedor} onChange={e => setContenedor(e.target.value)} className={INP} style={inpStyle} placeholder="MAEU1234567" />
          </div>
          <div>
            {fieldLabel('N° Precinto')}
            <input value={nroPrecinto} onChange={e => setNroPrecinto(e.target.value)} className={INP} style={inpStyle} placeholder="PR-2026-001" />
          </div>
          <div className="sm:col-span-2">
            {fieldLabel('Observaciones')}
            <textarea rows={2} value={observ} onChange={e => setObserv(e.target.value)} className={`${INP} resize-none`} style={inpStyle} placeholder="Notas del despacho aduanero…" />
          </div>
        </div>
      </div>
    </div>
  );
}

function DatosClienteContent({ orden }: { orden: Props['orden'] }) {
  const [fechaEnvio,  setFechaEnvio]  = useState('');
  const [metodo,      setMetodo]      = useState('');
  const [contacto,    setContacto]    = useState('');
  const [docs,        setDocs]        = useState<Record<string, boolean>>(
    Object.fromEntries(DOCS_LIST.map(d => [d, false]))
  );
  const [certs,       setCerts]       = useState<Record<string, boolean>>(
    Object.fromEntries(CERTS_LIST.map(c => [c, false]))
  );
  const [archivosDoc,  setArchivosDoc]  = useState<string[]>([]);
  const [archivosCert, setArchivosCert] = useState<string[]>([]);
  const [observ,       setObserv]       = useState('');
  void orden;

  const toggleDoc  = (d: string) => setDocs(prev => ({ ...prev, [d]: !prev[d] }));
  const toggleCert = (c: string) => setCerts(prev => ({ ...prev, [c]: !prev[c] }));

  const handleFilesDoc  = (e: React.ChangeEvent<HTMLInputElement>) =>
    setArchivosDoc(prev => [...prev, ...Array.from(e.target.files ?? []).map(f => f.name)]);
  const handleFilesCert = (e: React.ChangeEvent<HTMLInputElement>) =>
    setArchivosCert(prev => [...prev, ...Array.from(e.target.files ?? []).map(f => f.name)]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          {fieldLabel('Fecha de envío')}
          <div className="relative">
            <input type="date" value={fechaEnvio} onChange={e => setFechaEnvio(e.target.value)} className={INP} style={inpStyle} />
            <Calendar size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
        <div>
          {fieldLabel('Método de envío')}
          <div className="relative">
            <select value={metodo} onChange={e => setMetodo(e.target.value)} className={`${INP} pr-9 appearance-none`} style={inpStyle}>
              <option value="">Seleccionar…</option>
              {METODOS.map(m => <option key={m}>{m}</option>)}
            </select>
            <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
        <div className="sm:col-span-2">
          {fieldLabel('Contacto del cliente')}
          <input value={contacto} onChange={e => setContacto(e.target.value)} className={INP} style={inpStyle} placeholder="nombre@cliente.com / +1 555…" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-[0.65rem] font-black uppercase tracking-widest" style={{ color: TX }}>Documentos asociados</p>
            <label className="flex items-center gap-1.5 cursor-pointer text-[0.6rem] font-bold px-2.5 py-1 rounded-lg transition-colors hover:opacity-85" style={{ backgroundColor: `${CP}15`, color: CP }}>
              <Upload size={10} /> Adjuntar
              <input type="file" multiple className="hidden" onChange={handleFilesDoc} />
            </label>
          </div>
          <div className="space-y-1.5">
            {DOCS_LIST.map(d => (
              <label key={d} className="flex items-center gap-2.5 cursor-pointer select-none">
                <Checkbox checked={docs[d]} onChange={() => toggleDoc(d)} />
                <span className="text-xs font-medium" style={{ color: docs[d] ? CP : TX }}>{d}</span>
              </label>
            ))}
          </div>
          {archivosDoc.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {archivosDoc.map((f, i) => (
                <span key={i} className="flex items-center gap-1 text-[0.58rem] px-2 py-0.5 rounded-full border font-medium" style={{ borderColor: BD, color: TX }}>
                  <FileText size={9} style={{ color: CS }} />{f}
                </span>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-[0.65rem] font-black uppercase tracking-widest" style={{ color: TX }}>Certificaciones / Evidencias</p>
            <label className="flex items-center gap-1.5 cursor-pointer text-[0.6rem] font-bold px-2.5 py-1 rounded-lg transition-colors hover:opacity-85" style={{ backgroundColor: `${CP}15`, color: CP }}>
              <Upload size={10} /> Adjuntar
              <input type="file" multiple className="hidden" onChange={handleFilesCert} />
            </label>
          </div>
          <div className="space-y-1.5">
            {CERTS_LIST.map(c => (
              <label key={c} className="flex items-center gap-2.5 cursor-pointer select-none">
                <Checkbox checked={certs[c]} onChange={() => toggleCert(c)} />
                <span className="text-xs font-medium" style={{ color: certs[c] ? CP : TX }}>{c}</span>
              </label>
            ))}
          </div>
          {archivosCert.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {archivosCert.map((f, i) => (
                <span key={i} className="flex items-center gap-1 text-[0.58rem] px-2 py-0.5 rounded-full border font-medium" style={{ borderColor: BD, color: TX }}>
                  <FileText size={9} style={{ color: CS }} />{f}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div>
        {fieldLabel('Observaciones')}
        <textarea rows={2} value={observ} onChange={e => setObserv(e.target.value)} className={`${INP} resize-none`} style={inpStyle} placeholder="Notas adicionales…" />
      </div>
    </div>
  );
}

function PlanContent({ orden }: { orden: Props['orden'] }) {
  const [campana,     setCampana]     = useState('');
  const [lotes,       setLotes]       = useState('');
  const [fechaCorte,  setFechaCorte]  = useState('');
  const [fechaZarpe,  setFechaZarpe]  = useState('');
  const [fechaEta,    setFechaEta]    = useState('');
  const [naviera,     setNaviera]     = useState('');
  const [puertoOrig,  setPuertoOrig]  = useState('');
  const [puertoDest,  setPuertoDest]  = useState('');
  const [tipoCont,    setTipoCont]    = useState('');
  const [cantCont,    setCantCont]    = useState('');
  const [pesoNeto,    setPesoNeto]    = useState('');
  const [pesoBruto,   setPesoBruto]   = useState('');
  const [observ,      setObserv]      = useState('');

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border p-4 grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-3" style={{ borderColor: BD, backgroundColor: BG }}>
        <InfoTag label="Orden de venta" value={orden.id} />
        <InfoTag label="Cliente"        value={orden.cliente} />
        <InfoTag label="Lote ref."      value={orden.lote} />
        <InfoTag label="Tipo producto"  value={orden.tipoProducto} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          {fieldLabel('Campaña asociada')}
          <input value={campana} onChange={e => setCampana(e.target.value)} className={INP} style={inpStyle} placeholder="Campaña 2025/2026…" />
        </div>
        <div>
          {fieldLabel('Lotes finales asociados')}
          <input value={lotes} onChange={e => setLotes(e.target.value)} className={INP} style={inpStyle} placeholder="LF-2026-001, LF-2026-002…" />
        </div>
        <div>
          {fieldLabel('Fecha de corte de carga')}
          <div className="relative">
            <input type="date" value={fechaCorte} onChange={e => setFechaCorte(e.target.value)} className={INP} style={inpStyle} />
            <Calendar size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
        <div>
          {fieldLabel('Fecha de zarpe (ETD)')}
          <div className="relative">
            <input type="date" value={fechaZarpe} onChange={e => setFechaZarpe(e.target.value)} className={INP} style={inpStyle} />
            <Calendar size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
        <div>
          {fieldLabel('Fecha de arribo destino (ETA)')}
          <div className="relative">
            <input type="date" value={fechaEta} onChange={e => setFechaEta(e.target.value)} className={INP} style={inpStyle} />
            <Calendar size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
        <div>
          {fieldLabel('Naviera')}
          <div className="relative">
            <select value={naviera} onChange={e => setNaviera(e.target.value)} className={`${INP} pr-9 appearance-none`} style={inpStyle}>
              <option value="">Seleccionar…</option>
              {NAVIERAS.map(n => <option key={n}>{n}</option>)}
            </select>
            <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
        <div>
          {fieldLabel('Puerto de origen')}
          <div className="relative">
            <select value={puertoOrig} onChange={e => setPuertoOrig(e.target.value)} className={`${INP} pr-9 appearance-none`} style={inpStyle}>
              <option value="">Seleccionar…</option>
              {PUERTOS_OR.map(p => <option key={p}>{p}</option>)}
            </select>
            <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
        <div>
          {fieldLabel('Puerto de destino')}
          <div className="relative">
            <select value={puertoDest} onChange={e => setPuertoDest(e.target.value)} className={`${INP} pr-9 appearance-none`} style={inpStyle}>
              <option value="">Seleccionar…</option>
              {PUERTOS_DE.map(p => <option key={p}>{p}</option>)}
            </select>
            <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
        <div>
          {fieldLabel('Tipo de contenedor')}
          <div className="relative">
            <select value={tipoCont} onChange={e => setTipoCont(e.target.value)} className={`${INP} pr-9 appearance-none`} style={inpStyle}>
              <option value="">Seleccionar…</option>
              {CONTENEDOR.map(c => <option key={c}>{c}</option>)}
            </select>
            <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
        <div>
          {fieldLabel('Cantidad de contenedores')}
          <input type="number" min={1} value={cantCont} onChange={e => setCantCont(e.target.value)} className={INP} style={inpStyle} placeholder="1" />
        </div>
        <div>
          {fieldLabel('Peso neto (kg)')}
          <input type="number" min={0} value={pesoNeto} onChange={e => setPesoNeto(e.target.value)} className={INP} style={inpStyle} placeholder="0" />
        </div>
        <div>
          {fieldLabel('Peso bruto (kg)')}
          <input type="number" min={0} value={pesoBruto} onChange={e => setPesoBruto(e.target.value)} className={INP} style={inpStyle} placeholder="0" />
        </div>
        <div className="sm:col-span-2">
          {fieldLabel('Observaciones')}
          <textarea rows={2} value={observ} onChange={e => setObserv(e.target.value)} className={`${INP} resize-none`} style={inpStyle} placeholder="Instrucciones especiales…" />
        </div>
      </div>

      {fechaZarpe && fechaEta && (
        <div className="rounded-xl px-4 py-3 flex items-center gap-6" style={{ backgroundColor: `${CP}12` }}>
          <div>
            <p className="text-[0.6rem] font-bold uppercase tracking-wide" style={{ color: CP }}>ETD</p>
            <p className="text-xs font-black" style={{ color: CP }}>{new Date(fechaZarpe).toLocaleDateString('es-PE')}</p>
          </div>
          <div className="flex-1 h-px" style={{ backgroundColor: CP, opacity: 0.3 }} />
          <div className="text-right">
            <p className="text-[0.6rem] font-bold uppercase tracking-wide" style={{ color: CP }}>ETA</p>
            <p className="text-xs font-black" style={{ color: CP }}>{new Date(fechaEta).toLocaleDateString('es-PE')}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export function ExportacionModal({ orden, initialTab = 'aduanero', onClose }: Props) {
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
              <Ship size={15} className="text-white" />
            </div>
            <div className="min-w-0">
              <p className="font-black text-sm uppercase tracking-wide" style={{ color: TX }}>Exportación</p>
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
              {t.label}
            </button>
          ))}
        </div>

        <div className="overflow-y-auto flex-1 px-5 py-5">
          {activeTab === 'aduanero'      && <AduaneroContent orden={orden} />}
          {activeTab === 'datos_cliente' && <DatosClienteContent orden={orden} />}
          {activeTab === 'plan'          && <PlanContent orden={orden} />}
        </div>

        <div className="px-5 py-3 border-t shrink-0 flex justify-end" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
          <button onClick={onClose} className="text-[0.65rem] font-semibold px-3 py-1.5 rounded-lg text-gray-500 hover:bg-black/05 transition-all">Cerrar</button>
        </div>
      </div>
    </div>
  );
}
