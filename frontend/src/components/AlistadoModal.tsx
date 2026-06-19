import { useState, useEffect, useCallback } from 'react';
import { X, CheckCircle2, Package, Truck, Calendar, ChevronDown } from 'lucide-react';
import LoadingLogo from './LoadingLogo';
import { ordenesVentaService } from '../services/ordenes-venta.service';

const CP = '#445D46';
const BD = '#D9DDD8';
const TX = '#2C2C2C';
const BG = '#F7F8F7';

const INP      = 'w-full border rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-600 transition-all';
const inpStyle = { borderColor: BD, color: TX };

const fieldLabel = (label: string) => (
  <label className="block text-[0.65rem] font-bold uppercase tracking-wide mb-1.5" style={{ color: TX, opacity: 0.55 }}>{label}</label>
);

const INCOTERMS   = ['FOB','CIF','EXW','FCA','CPT','DAP','DDP'];
const CONDICIONES = ['30 días','60 días','90 días','Carta de crédito','Contra entrega'];

type Tab = 'compromiso' | 'lotes' | 'despacho';

interface Props {
  orden: { dbId: number; id: string; cliente: string; lote: string; tipoProducto: string };
  initialTab?: Tab;
  onClose: () => void;
}

const TABS: { key: Tab; label: string; icon: React.ReactNode }[] = [
  { key: 'compromiso', label: 'Compromiso de Venta',  icon: <CheckCircle2 size={12} /> },
  { key: 'lotes',      label: 'Asignación de Lotes',  icon: <Package size={12} /> },
  { key: 'despacho',   label: 'Alistado y Despacho',  icon: <Truck size={12} /> },
];

function CheckboxUI({ checked, onChange }: { checked: boolean; onChange: () => void }) {
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

export function AlistadoModal({ orden, initialTab = 'compromiso', onClose }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>(initialTab);
  const [loading,   setLoading]   = useState(true);
  const [saving,    setSaving]    = useState(false);
  const [toast,     setToast]     = useState('');

  const [nroContrato,           setNroContrato]           = useState('');
  const [fechaContrato,         setFechaContrato]         = useState('');
  const [comprador,             setComprador]             = useState(orden.cliente ?? '');
  const [precioUsd,             setPrecioUsd]             = useState('');
  const [cantidadKgCompromiso,  setCantidadKgCompromiso]  = useState('');
  const [incoterm,              setIncoterm]              = useState('');
  const [condPago,              setCondPago]              = useState('');
  const [fechaEntrega,          setFechaEntrega]          = useState('');
  const [notasCompromiso,       setNotasCompromiso]       = useState('');

  const [planta,         setPlanta]         = useState('');
  const [fechaAlistado,  setFechaAlistado]  = useState('');
  const [guiaRemision,   setGuiaRemision]   = useState('');
  const [fechaTraslado,  setFechaTraslado]  = useState('');
  const [tipoEmpaque,    setTipoEmpaque]    = useState('');
  const [transporte,     setTransporte]     = useState('');
  const [costoPlanta,    setCostoPlanta]    = useState('');
  const [costoEstiba,    setCostoEstiba]    = useState('');
  const [costoEmpaque,   setCostoEmpaque]   = useState('');
  const [costoTransporte,setCostoTransporte]= useState('');
  const [separarAlistado,setSepararAlistado]= useState(false);
  const [planAlistado,   setPlanAlistado]   = useState(false);
  const [costViaticos,   setCostViaticos]   = useState(false);

  useEffect(() => {
    ordenesVentaService.getAlistado(orden.dbId)
      .then(data => {
        if (data) {
          setNroContrato(data.nroContrato ?? '');
          setFechaContrato(data.fechaContrato ?? '');
          setComprador(data.comprador ?? orden.cliente ?? '');
          setPrecioUsd(data.precioUsd != null ? String(data.precioUsd) : '');
          setCantidadKgCompromiso(data.cantidadKgCompromiso != null ? String(data.cantidadKgCompromiso) : '');
          setIncoterm(data.incoterm ?? '');
          setCondPago(data.condPago ?? '');
          setFechaEntrega(data.fechaEntrega ?? '');
          setNotasCompromiso(data.notasCompromiso ?? '');
          setPlanta(data.planta ?? '');
          setFechaAlistado(data.fechaAlistado ?? '');
          setGuiaRemision(data.guiaRemision ?? '');
          setFechaTraslado(data.fechaTraslado ?? '');
          setTipoEmpaque(data.tipoEmpaque ?? '');
          setTransporte(data.transporte ?? '');
          setCostoPlanta(data.costoPlanta != null ? String(data.costoPlanta) : '');
          setCostoEstiba(data.costoEstiba != null ? String(data.costoEstiba) : '');
          setCostoEmpaque(data.costoEmpaque != null ? String(data.costoEmpaque) : '');
          setCostoTransporte(data.costoTransporte != null ? String(data.costoTransporte) : '');
          setSepararAlistado(data.separarAlistado ?? false);
          setPlanAlistado(data.planAlistado ?? false);
          setCostViaticos(data.costViaticos ?? false);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [orden.dbId, orden.cliente]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  };

  const handleGuardar = useCallback(async () => {
    setSaving(true);
    try {
      const dto: Record<string, unknown> = {
        nroContrato:          nroContrato          || null,
        fechaContrato:        fechaContrato        || null,
        comprador:            comprador            || null,
        precioUsd:            precioUsd            ? parseFloat(precioUsd)            : null,
        cantidadKgCompromiso: cantidadKgCompromiso ? parseFloat(cantidadKgCompromiso) : null,
        incoterm:             incoterm             || null,
        condPago:             condPago             || null,
        fechaEntrega:         fechaEntrega         || null,
        notasCompromiso:      notasCompromiso      || null,
        planta:               planta               || null,
        fechaAlistado:        fechaAlistado        || null,
        guiaRemision:         guiaRemision         || null,
        fechaTraslado:        fechaTraslado        || null,
        tipoEmpaque:          tipoEmpaque          || null,
        transporte:           transporte           || null,
        costoPlanta:          costoPlanta          ? parseFloat(costoPlanta)    : null,
        costoEstiba:          costoEstiba          ? parseFloat(costoEstiba)    : null,
        costoEmpaque:         costoEmpaque         ? parseFloat(costoEmpaque)   : null,
        costoTransporte:      costoTransporte      ? parseFloat(costoTransporte): null,
        separarAlistado,
        planAlistado,
        costViaticos,
      };
      await ordenesVentaService.upsertAlistado(orden.dbId, dto);
      showToast('Guardado correctamente');
    } catch {
      showToast('Error al guardar');
    } finally {
      setSaving(false);
    }
  }, [
    nroContrato, fechaContrato, comprador, precioUsd, cantidadKgCompromiso,
    incoterm, condPago, fechaEntrega, notasCompromiso,
    planta, fechaAlistado, guiaRemision, fechaTraslado, tipoEmpaque, transporte,
    costoPlanta, costoEstiba, costoEmpaque, costoTransporte,
    separarAlistado, planAlistado, costViaticos, orden.dbId,
  ]);

  const totalCompromiso = precioUsd && cantidadKgCompromiso
    ? parseFloat(precioUsd) * parseFloat(cantidadKgCompromiso) : 0;

  const totalCostos = [costoPlanta, costoEstiba, costoEmpaque, costoTransporte]
    .reduce((s, v) => s + (parseFloat(v) || 0), 0);

  const toastOk = toast && !toast.toLowerCase().includes('error');

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6"
      style={{ backgroundColor: 'rgba(0,0,0,0.38)', backdropFilter: 'blur(12px) saturate(0.75)' }}
      onClick={e => !saving && e.target === e.currentTarget && onClose()}
    >
      <div
        className="relative w-full sm:max-w-5xl rounded-t-3xl sm:rounded-3xl flex flex-col overflow-hidden"
        style={{ background: 'rgba(255,255,255,0.96)', backdropFilter: 'blur(28px) saturate(1.4)', WebkitBackdropFilter: 'blur(28px) saturate(1.4)', border: '1px solid rgba(255,255,255,0.6)', boxShadow: '0 24px 60px rgba(0,0,0,0.22)', maxHeight: '92vh' }}
      >
        {(saving || loading) && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center rounded-t-3xl sm:rounded-3xl" style={{ backgroundColor: 'rgba(255,255,255,0.93)', backdropFilter: 'blur(2px)' }}>
            <LoadingLogo compact />
            <p className="text-sm font-semibold text-gray-600 mt-3">{loading ? 'Cargando…' : 'Guardando…'}</p>
          </div>
        )}

        {toast && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg transition-all"
            style={{ backgroundColor: toastOk ? '#d1fae5' : '#fee2e2', color: toastOk ? '#065f46' : '#991b1b' }}>
            {toast}
          </div>
        )}

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
            <button onClick={handleGuardar} disabled={saving || loading} className="text-[0.65rem] font-bold px-4 py-2 rounded-xl text-white transition-opacity hover:opacity-90 disabled:opacity-50" style={{ backgroundColor: CP }}>GUARDAR</button>
            <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-black/06 transition-all ml-1"><X size={16} /></button>
          </div>
        </div>

        <div className="flex gap-1 px-5 pt-4 shrink-0 border-b" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
          {TABS.map(t => (
            <button key={t.key} onClick={() => setActiveTab(t.key)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-t-xl text-xs font-bold uppercase tracking-wide transition-all"
              style={{ backgroundColor: activeTab === t.key ? CP : 'transparent', color: activeTab === t.key ? '#fff' : '#9CA3AF', borderBottom: activeTab === t.key ? `2px solid ${CP}` : '2px solid transparent', marginBottom: '-1px' }}>
              {t.icon}{t.label}
            </button>
          ))}
        </div>

        <div className="overflow-y-auto flex-1 px-5 py-5">

          {activeTab === 'compromiso' && (
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
                  <input type="number" min={0} value={cantidadKgCompromiso} onChange={e => setCantidadKgCompromiso(e.target.value)} className={INP} style={inpStyle} placeholder="0" />
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
              {totalCompromiso > 0 && (
                <div className="rounded-xl px-4 py-3 flex items-center gap-3" style={{ backgroundColor: `${CP}12` }}>
                  <p className="text-[0.65rem] font-bold uppercase tracking-wide" style={{ color: CP }}>Total comprometido:</p>
                  <p className="font-black text-base" style={{ color: CP }}>USD {totalCompromiso.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</p>
                </div>
              )}
              <div>
                {fieldLabel('Observaciones')}
                <textarea rows={3} value={notasCompromiso} onChange={e => setNotasCompromiso(e.target.value)} className={`${INP} resize-none`} style={inpStyle} placeholder="Notas adicionales del contrato…" />
              </div>
            </div>
          )}

          {activeTab === 'lotes' && (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <Package size={32} className="text-gray-300" />
              <p className="text-sm font-semibold text-gray-400">Asignación de lotes trillados</p>
              <p className="text-xs text-gray-400">Lote asociado a esta orden: <span className="font-bold" style={{ color: CP }}>{orden.lote || '—'}</span></p>
            </div>
          )}

          {activeTab === 'despacho' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  {fieldLabel('Nombre de planta / Almacén')}
                  <input value={planta} onChange={e => setPlanta(e.target.value)} className={INP} style={inpStyle} placeholder="Planta Lima Norte…" />
                </div>
                <div>
                  {fieldLabel('Fecha de alistado')}
                  <div className="relative">
                    <input type="date" value={fechaAlistado} onChange={e => setFechaAlistado(e.target.value)} className={INP} style={inpStyle} />
                    <Calendar size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  {fieldLabel('Guía de remisión')}
                  <input value={guiaRemision} onChange={e => setGuiaRemision(e.target.value)} className={INP} style={inpStyle} placeholder="GR-2026-001" />
                </div>
                <div>
                  {fieldLabel('Fecha de traslado')}
                  <div className="relative">
                    <input type="date" value={fechaTraslado} onChange={e => setFechaTraslado(e.target.value)} className={INP} style={inpStyle} />
                    <Calendar size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  {fieldLabel('Tipo de empaque')}
                  <input value={tipoEmpaque} onChange={e => setTipoEmpaque(e.target.value)} className={INP} style={inpStyle} placeholder="Sacos yute 69 kg, GrainPro…" />
                </div>
                <div>
                  {fieldLabel('Empresa de transporte / Traslado')}
                  <input value={transporte} onChange={e => setTransporte(e.target.value)} className={INP} style={inpStyle} placeholder="Transportes XYZ S.A.C…" />
                </div>
                <div className="flex flex-col justify-center gap-3 pt-1">
                  {([
                    ['SEPARAR ALISTADO Y DESPACHO', separarAlistado, setSepararAlistado],
                    ['PLAN DE ALISTADO ANTES DEL DESPACHO', planAlistado, setPlanAlistado],
                    ['COSTO DE VIÁTICOS', costViaticos, setCostViaticos],
                  ] as [string, boolean, React.Dispatch<React.SetStateAction<boolean>>][]).map(([label, checked, set]) => (
                    <label key={label} className="flex items-start gap-2.5 cursor-pointer select-none">
                      <CheckboxUI checked={checked} onChange={() => set(v => !v)} />
                      <span className="text-[0.65rem] font-bold uppercase tracking-wide leading-tight" style={{ color: checked ? CP : '#6B7280' }}>{label}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[0.65rem] font-black uppercase tracking-widest mb-3" style={{ color: TX }}>Costos</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {([
                    ['Proceso de planta',  costoPlanta,   setCostoPlanta],
                    ['Estiba / Desestiba', costoEstiba,   setCostoEstiba],
                    ['Empaque',            costoEmpaque,  setCostoEmpaque],
                    ['Transporte',         costoTransporte,setCostoTransporte],
                  ] as [string, string, React.Dispatch<React.SetStateAction<string>>][]).map(([label, val, set]) => (
                    <div key={label}>
                      <label className="block text-[0.62rem] font-bold uppercase tracking-wide mb-1.5" style={{ color: TX, opacity: 0.5 }}>{label}</label>
                      <input type="number" min={0} step="0.01" value={val} onChange={e => set(e.target.value)} className={INP} style={inpStyle} placeholder="0.00" />
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
            </div>
          )}
        </div>

        <div className="px-5 py-3 border-t shrink-0 flex justify-end" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
          <button onClick={onClose} className="text-[0.65rem] font-semibold px-3 py-1.5 rounded-lg text-gray-500 hover:bg-black/05 transition-all">Cerrar</button>
        </div>
      </div>
    </div>
  );
}
