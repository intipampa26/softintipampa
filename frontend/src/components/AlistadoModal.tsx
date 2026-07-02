import { useState, useEffect, useCallback, useRef } from 'react';
import { X, CheckCircle2, Package, Truck, Calendar, ChevronDown, Upload, Trash2, FileText, Search, Plus } from 'lucide-react';
import { ModalLoadingOverlay } from '@/components/ui/ModalLoadingOverlay';
import { useToast } from '@/contexts/ToastContext';
import { ordenesVentaService } from '../services/ordenes-venta.service';
import { lotesFinalesService, LoteFinal } from '@/services/lotes-finales.service';
import { campanasService } from '@/services/campanas.service';

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

interface LoteAsignadoItem {
  loteFinalId: number;
  codigo: string;
  descripcion?: string;
  cantidadKg: number | null;
  nroSacos: number | null;
  fechaProceso: string | null;
  esManual?: boolean;
}

interface Props {
  orden: { dbId: number; id: string; cliente: string; lote: string; tipoProducto: string; campana: string };
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
  const [loading,            setLoading]            = useState(true);
  const [saving,             setSaving]             = useState(false);
  const [contratoFileName,   setContratoFileName]   = useState<string | null>(null);
  const [contratoFilePath,   setContratoFilePath]   = useState<string | null>(null);
  const [uploadingContrato,  setUploadingContrato]  = useState(false);
  const contratoFileRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

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

  const [lotesDisponibles,  setLotesDisponibles]  = useState<LoteFinal[]>([]);
  const [lotesAsignados,    setLotesAsignados]    = useState<LoteAsignadoItem[]>([]);
  const [loadingLotes,      setLoadingLotes]      = useState(false);
  const [lotesSearch,       setLotesSearch]       = useState('');

  useEffect(() => {
    Promise.all([
      ordenesVentaService.getAlistado(orden.dbId),
      ordenesVentaService.getCotizacion(orden.dbId),
    ]).then(([data, cot]) => {
        if (data) {
          setNroContrato(data.nroContrato ?? '');
          setFechaContrato(data.fechaContrato ?? '');
          setComprador(data.comprador ?? orden.cliente ?? '');
          setPrecioUsd(data.precioUsd != null ? String(data.precioUsd) : '');
          setCantidadKgCompromiso(data.cantidadKgCompromiso != null ? String(data.cantidadKgCompromiso) : '');
          setIncoterm(data.incoterm ?? '');
          setCondPago(data.condPago || cot?.condicionesPago || '');
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
          setContratoFileName(data.contratoFileName ?? null);
          setContratoFilePath(data.contratoFilePath ?? null);
          if (Array.isArray(data.lotesAsignados)) setLotesAsignados(data.lotesAsignados);
        } else if (cot?.condicionesPago) {
          setCondPago(cot.condicionesPago);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [orden.dbId, orden.cliente]);

  useEffect(() => {
    if (!orden.campana) return;
    setLoadingLotes(true);
    campanasService.getPage(1, 200)
      .then(campanasData => {
        const campanaObj = campanasData.data.find(c => c.nombre === orden.campana);
        if (!campanaObj) return;
        return lotesFinalesService.getPage({ campanaId: campanaObj.id, limit: 500 });
      })
      .then(res => { if (res) setLotesDisponibles(res.data); })
      .catch(() => {})
      .finally(() => setLoadingLotes(false));
  }, [orden.campana]);

  const handleUploadContrato = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';
    setUploadingContrato(true);
    try {
      const res = await ordenesVentaService.uploadAlistadoContrato(orden.dbId, file);
      setContratoFileName(res.contratoFileName);
      setContratoFilePath(res.contratoFilePath);
      toast.success('Contrato adjuntado correctamente');
    } catch { toast.error('Error al subir el archivo'); }
    finally { setUploadingContrato(false); }
  };

  const handleDeleteContrato = async () => {
    try {
      await ordenesVentaService.deleteAlistadoContrato(orden.dbId);
      setContratoFileName(null);
      setContratoFilePath(null);
      toast.success('Contrato eliminado');
    } catch { toast.error('Error al eliminar el archivo'); }
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
        lotesAsignados: lotesAsignados.length > 0 ? lotesAsignados : null,
      };
      await ordenesVentaService.upsertAlistado(orden.dbId, dto);
      toast.success('Guardado correctamente');
    } catch {
      toast.error('Error al guardar');
    } finally {
      setSaving(false);
    }
  }, [
    nroContrato, fechaContrato, comprador, precioUsd, cantidadKgCompromiso,
    incoterm, condPago, fechaEntrega, notasCompromiso,
    planta, fechaAlistado, guiaRemision, fechaTraslado, tipoEmpaque, transporte,
    costoPlanta, costoEstiba, costoEmpaque, costoTransporte,
    separarAlistado, planAlistado, costViaticos, lotesAsignados, orden.dbId,
  ]);

  const totalCompromiso = precioUsd && cantidadKgCompromiso
    ? parseFloat(precioUsd) * parseFloat(cantidadKgCompromiso) : 0;

  const totalCostos = [costoPlanta, costoEstiba, costoEmpaque, costoTransporte]
    .reduce((s, v) => s + (parseFloat(v) || 0), 0);

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
        <ModalLoadingOverlay show={saving || loading} message={loading ? 'Cargando…' : 'Guardando…'} />

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
                  <input value={comprador} readOnly className={INP} style={{ ...inpStyle, backgroundColor: '#F3F4F6', cursor: 'default', color: '#6B7280' }} />
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

              {/* Adjuntar Contrato */}
              <div>
                {fieldLabel('Adjuntar Contrato del Cliente')}
                <input ref={contratoFileRef} type="file" className="hidden" accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" onChange={handleUploadContrato} />
                {contratoFileName && contratoFilePath ? (
                  <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl border" style={{ borderColor: CP + '66', backgroundColor: CP + '08' }}>
                    <FileText size={15} style={{ color: CP, flexShrink: 0 }} />
                    <a
                      href={`/uploads/alistado/${orden.dbId}/${contratoFilePath}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-xs font-semibold truncate hover:underline"
                      style={{ color: CP }}
                    >
                      {contratoFileName}
                    </a>
                    <button
                      type="button"
                      onClick={handleDeleteContrato}
                      className="flex-shrink-0 text-red-400 hover:text-red-600 transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    disabled={uploadingContrato}
                    onClick={() => contratoFileRef.current?.click()}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-dashed text-xs font-semibold transition-colors hover:opacity-80 disabled:opacity-50"
                    style={{ borderColor: BD, color: '#9CA3AF' }}
                  >
                    <Upload size={13} />
                    {uploadingContrato ? 'Subiendo…' : 'Seleccionar archivo (PDF, DOC, imagen)'}
                  </button>
                )}
              </div>
            </div>
          )}

          {activeTab === 'lotes' && (
            <div className="space-y-5">
              {/* ASIGNACIÓN DE LOTES TRILLADOS */}
              <div className="rounded-2xl overflow-hidden border" style={{ borderColor: '#B8DDB8' }}>
                <div className="flex items-center justify-between px-4 py-3" style={{ backgroundColor: '#4E644E' }}>
                  <div className="flex items-center gap-2">
                    <Package size={14} className="text-white" />
                    <span className="text-xs font-black uppercase tracking-widest text-white">Asignación de Lotes Trillados</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[0.6rem] font-bold px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: 'rgba(255,255,255,0.18)' }}>
                      {lotesAsignados.length} asignado{lotesAsignados.length !== 1 ? 's' : ''}
                    </span>
                    <button
                      onClick={() => setLotesAsignados(prev => [...prev, {
                        loteFinalId: -(Date.now()),
                        codigo: '',
                        descripcion: '',
                        cantidadKg: null,
                        nroSacos: null,
                        fechaProceso: null,
                        esManual: true,
                      }])}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[0.6rem] font-black uppercase tracking-wide transition-all hover:opacity-90"
                      style={{ backgroundColor: 'rgba(255,255,255,0.22)', color: '#fff' }}
                    >
                      <Plus size={10} />Otros
                    </button>
                  </div>
                </div>
                <div className="px-4 py-3 border-b" style={{ borderColor: '#B8DDB8', backgroundColor: '#F0F7F0' }}>
                  <div className="relative">
                    <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      value={lotesSearch}
                      onChange={e => setLotesSearch(e.target.value)}
                      placeholder="Buscar lote por código o tipo…"
                      className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border bg-white focus:outline-none focus:ring-2 focus:ring-green-600"
                      style={{ borderColor: '#B8DDB8' }}
                    />
                  </div>
                </div>
                {loadingLotes ? (
                  <div className="flex items-center justify-center py-10">
                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    <span className="ml-2 text-xs text-gray-400">Cargando lotes…</span>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[640px] text-xs">
                      <thead>
                        <tr style={{ backgroundColor: '#E8F3E8' }}>
                          {['CÓDIGO', 'SKU', 'PRODUCTO', 'DISPONIBLE', 'KG ASIGNADOS', '# SACOS', 'FECHA PROCESO', 'ACCIONES'].map(h => (
                            <th key={h} className="px-3 py-2.5 text-left font-black uppercase tracking-wide whitespace-nowrap" style={{ color: '#4E644E', fontSize: '0.6rem' }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {lotesDisponibles
                          .filter(l => !lotesSearch || l.codigo.toLowerCase().includes(lotesSearch.toLowerCase()) || (l.tipoProducto?.tipo ?? '').toLowerCase().includes(lotesSearch.toLowerCase()))
                          .map(lote => {
                            const asig = lotesAsignados.find(a => a.loteFinalId === lote.id);
                            const needsFito = !!(asig && lote.sku?.requiereFito);
                            return (
                              <tr
                                key={lote.id}
                                className="border-t transition-colors"
                                style={{
                                  borderColor: '#E8F3E8',
                                  backgroundColor: needsFito ? '#FFFBEB' : asig ? '#F0F7F0' : undefined,
                                  borderLeft: needsFito ? '3px solid #D97706' : asig ? '3px solid #4E644E' : '3px solid transparent',
                                }}
                              >
                                <td className="px-3 py-2.5 font-bold" style={{ color: '#4E644E' }}>{lote.codigo}</td>
                                <td className="px-3 py-2.5">
                                  {lote.sku?.nombre
                                    ? <span className="px-2 py-0.5 rounded-full text-[0.58rem] font-bold bg-green-50 text-green-700">{lote.sku.nombre}</span>
                                    : <span className="text-gray-400">—</span>}
                                </td>
                                <td className="px-3 py-2.5 text-gray-600">{lote.tipoProducto?.tipo ?? '—'}</td>
                                <td className="px-3 py-2.5 font-semibold" style={{ color: '#4E644E' }}>{Number(lote.cantidadKg).toLocaleString()} kg</td>
                                <td className="px-3 py-2">
                                  <input
                                    type="number"
                                    min={0}
                                    value={asig?.cantidadKg ?? ''}
                                    placeholder="0"
                                    onChange={e => {
                                      const val = e.target.value === '' ? null : Number(e.target.value);
                                      setLotesAsignados(prev => {
                                        const exists = prev.find(a => a.loteFinalId === lote.id);
                                        if (exists) return prev.map(a => a.loteFinalId === lote.id ? { ...a, cantidadKg: val } : a);
                                        return [...prev, { loteFinalId: lote.id, codigo: lote.codigo, cantidadKg: val, nroSacos: null, fechaProceso: null }];
                                      });
                                    }}
                                    className="w-24 border rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-green-600 bg-white"
                                    style={{ borderColor: '#B8DDB8' }}
                                  />
                                </td>
                                <td className="px-3 py-2">
                                  <input
                                    type="number"
                                    min={0}
                                    value={asig?.nroSacos ?? ''}
                                    placeholder="0"
                                    onChange={e => {
                                      const val = e.target.value === '' ? null : Number(e.target.value);
                                      setLotesAsignados(prev => {
                                        const exists = prev.find(a => a.loteFinalId === lote.id);
                                        if (exists) return prev.map(a => a.loteFinalId === lote.id ? { ...a, nroSacos: val } : a);
                                        return [...prev, { loteFinalId: lote.id, codigo: lote.codigo, cantidadKg: null, nroSacos: val, fechaProceso: null }];
                                      });
                                    }}
                                    className="w-20 border rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-green-600 bg-white"
                                    style={{ borderColor: '#B8DDB8' }}
                                  />
                                </td>
                                <td className="px-3 py-2">
                                  <input
                                    type="date"
                                    value={asig?.fechaProceso ?? ''}
                                    onChange={e => {
                                      const val = e.target.value || null;
                                      setLotesAsignados(prev => {
                                        const exists = prev.find(a => a.loteFinalId === lote.id);
                                        if (exists) return prev.map(a => a.loteFinalId === lote.id ? { ...a, fechaProceso: val } : a);
                                        return [...prev, { loteFinalId: lote.id, codigo: lote.codigo, cantidadKg: null, nroSacos: null, fechaProceso: val }];
                                      });
                                    }}
                                    className="border rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-green-600 bg-white"
                                    style={{ borderColor: '#B8DDB8' }}
                                  />
                                </td>
                                <td className="px-3 py-2">
                                  <div className="flex items-center gap-1.5">
                                    {needsFito && (
                                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[0.58rem] font-black whitespace-nowrap" style={{ backgroundColor: '#FEF3C7', color: '#92400E' }}>
                                        ⚠ Fito
                                      </span>
                                    )}
                                    {asig && (
                                      <button
                                        onClick={() => setLotesAsignados(prev => prev.filter(a => a.loteFinalId !== lote.id))}
                                        className="w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:opacity-90 shrink-0"
                                        style={{ backgroundColor: '#FF0059' }}
                                        title="Quitar asignación"
                                      >
                                        <Trash2 size={11} className="text-white" />
                                      </button>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        {lotesDisponibles.length === 0 && !loadingLotes && lotesAsignados.filter(a => a.esManual).length === 0 && (
                          <tr>
                            <td colSpan={8} className="px-3 py-10 text-center text-xs text-gray-400">
                              {orden.campana ? 'No hay lotes trillados para esta campaña' : 'Sin campaña asignada a la orden'}
                            </td>
                          </tr>
                        )}
                        {lotesAsignados.filter(a => a.esManual).map(item => (
                          <tr key={item.loteFinalId} className="border-t" style={{ borderColor: '#E8F3E8', backgroundColor: '#FFFDF5', borderLeft: '3px solid #D97706' }}>
                            <td className="px-3 py-2">
                              <input
                                value={item.codigo}
                                onChange={e => setLotesAsignados(prev => prev.map(a => a.loteFinalId === item.loteFinalId ? { ...a, codigo: e.target.value } : a))}
                                placeholder="Código"
                                className="w-28 border rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-yellow-500 bg-white"
                                style={{ borderColor: '#D97706' }}
                              />
                            </td>
                            <td className="px-3 py-2" colSpan={2}>
                              <input
                                value={item.descripcion ?? ''}
                                onChange={e => setLotesAsignados(prev => prev.map(a => a.loteFinalId === item.loteFinalId ? { ...a, descripcion: e.target.value } : a))}
                                placeholder="Descripción / producto"
                                className="w-full border rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-yellow-500 bg-white"
                                style={{ borderColor: '#D97706' }}
                              />
                            </td>
                            <td className="px-3 py-2.5 text-[0.6rem] text-gray-400 italic">manual</td>
                            <td className="px-3 py-2">
                              <input
                                type="number" min={0}
                                value={item.cantidadKg ?? ''}
                                placeholder="0"
                                onChange={e => {
                                  const val = e.target.value === '' ? null : Number(e.target.value);
                                  setLotesAsignados(prev => prev.map(a => a.loteFinalId === item.loteFinalId ? { ...a, cantidadKg: val } : a));
                                }}
                                className="w-24 border rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-yellow-500 bg-white"
                                style={{ borderColor: '#D97706' }}
                              />
                            </td>
                            <td className="px-3 py-2">
                              <input
                                type="number" min={0}
                                value={item.nroSacos ?? ''}
                                placeholder="0"
                                onChange={e => {
                                  const val = e.target.value === '' ? null : Number(e.target.value);
                                  setLotesAsignados(prev => prev.map(a => a.loteFinalId === item.loteFinalId ? { ...a, nroSacos: val } : a));
                                }}
                                className="w-20 border rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-yellow-500 bg-white"
                                style={{ borderColor: '#D97706' }}
                              />
                            </td>
                            <td className="px-3 py-2">
                              <input
                                type="date"
                                value={item.fechaProceso ?? ''}
                                onChange={e => {
                                  const val = e.target.value || null;
                                  setLotesAsignados(prev => prev.map(a => a.loteFinalId === item.loteFinalId ? { ...a, fechaProceso: val } : a));
                                }}
                                className="border rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-yellow-500 bg-white"
                                style={{ borderColor: '#D97706' }}
                              />
                            </td>
                            <td className="px-3 py-2">
                              <button
                                onClick={() => setLotesAsignados(prev => prev.filter(a => a.loteFinalId !== item.loteFinalId))}
                                className="w-7 h-7 rounded-lg flex items-center justify-center hover:opacity-90"
                                style={{ backgroundColor: '#FF0059' }}
                              >
                                <Trash2 size={11} className="text-white" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                {lotesAsignados.length > 0 && (
                  <div className="px-4 py-3 flex items-center justify-between border-t" style={{ borderColor: '#B8DDB8', backgroundColor: '#F0F7F0' }}>
                    <span className="text-[0.62rem] font-bold uppercase tracking-wide" style={{ color: '#4E644E' }}>Total asignado</span>
                    <span className="text-sm font-black" style={{ color: '#4E644E' }}>
                      {lotesAsignados.reduce((s, a) => s + (a.cantidadKg ?? 0), 0).toLocaleString()} kg
                      {' · '}
                      {lotesAsignados.reduce((s, a) => s + (a.nroSacos ?? 0), 0)} sacos
                    </span>
                  </div>
                )}
              </div>

              {/* MERMAS REUTILIZABLES */}
              <div className="rounded-2xl overflow-hidden border" style={{ borderColor: '#B8DDB8' }}>
                <div className="flex items-center gap-2 px-4 py-3" style={{ backgroundColor: '#6B8F71' }}>
                  <Package size={14} className="text-white opacity-80" />
                  <span className="text-xs font-black uppercase tracking-widest text-white">Mermas Reutilizables</span>
                </div>
                <div className="flex items-center justify-center py-10 gap-2 text-gray-400">
                  <Package size={20} className="opacity-40" />
                  <span className="text-xs">Las mermas reutilizables se registran desde la ficha de trillado</span>
                </div>
              </div>
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
