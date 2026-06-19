import { useState, useEffect, useCallback, useRef } from 'react';
import { X, Ship, Calendar, ChevronDown, Package, FileText, Upload, Trash2, WifiOff, RefreshCw } from 'lucide-react';
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

// ── Cache helpers ──────────────────────────────────────────────────────────────
function readCache<T>(key: string): T | null {
  try { return JSON.parse(localStorage.getItem(key) ?? 'null') as T; } catch { return null; }
}
function writeCache(key: string, value: unknown) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}
function removeCache(key: string) {
  try { localStorage.removeItem(key); } catch {}
}

// ── Sub-components ─────────────────────────────────────────────────────────────
function CheckboxUI({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <div onClick={onChange} className="w-4 h-4 shrink-0 rounded border-2 flex items-center justify-center cursor-pointer transition-all"
      style={{ borderColor: checked ? CP : BD, backgroundColor: checked ? CP : '#fff' }}>
      {checked && <svg width="9" height="9" viewBox="0 0 9 9" fill="none"><path d="M1.5 4.5L3.5 6.5L7.5 2.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
    </div>
  );
}

// ── Types ──────────────────────────────────────────────────────────────────────
type Tab = 'plan' | 'despacho' | 'cierre';
type DocEntry    = { numero: string; fecha: string; observaciones: string };
type UploadedEntry = { name: string; file: string };

interface Props {
  orden: { dbId: number; id: string; cliente: string; lote: string; tipoProducto: string; campana?: string };
  initialTab?: Tab;
  onClose: () => void;
}

// ── Constants ──────────────────────────────────────────────────────────────────
const TABS: { key: Tab; label: string; short: string }[] = [
  { key: 'plan',     label: 'Plan de Exportación', short: 'Plan'     },
  { key: 'despacho', label: 'Despacho Aduanero',   short: 'Despacho' },
  { key: 'cierre',   label: 'Cierre de Venta',      short: 'Cierre'   },
];

const NAVIERAS   = ['Maersk','MSC','CMA CGM','Hapag-Lloyd','Evergreen','COSCO','ONE'];
const ESTADO_AVA = ['Pendiente','En proceso','Completado'];
const BANCOS     = ['BCP','BBVA','Interbank','Scotiabank','Banco de la Nación','Wells Fargo','Deutsche Bank'];
const ESTADO_PAG = ['Pendiente','Pago parcial','Pagado completamente'];

const DOC_TYPES: { key: string; label: string }[] = [
  { key: 'agente_aduanas',       label: 'Agente de Aduanas'       },
  { key: 'naviera',              label: 'Naviera'                  },
  { key: 'booking',              label: 'Booking / Fecha'          },
  { key: 'bl',                   label: 'BL (Bill of Lading)'      },
  { key: 'instruccion_embarque', label: 'Instrucción de Embarque'  },
  { key: 'agente_carga',         label: 'Agente de Carga'          },
  { key: 'cert_fitosanitario',   label: 'Certificado Fitosanitario'},
  { key: 'packing_list',         label: 'Packing List'             },
  { key: 'factura_comercial',    label: 'Factura Comercial'        },
  { key: 'cert_origen',          label: 'Certificado de Origen'    },
];

// ── Main component ─────────────────────────────────────────────────────────────
export function ExportacionModal({ orden, initialTab = 'plan', onClose }: Props) {
  const CACHE_KEY   = `ov_exp_${orden.dbId}`;
  const PENDING_KEY = `ov_exp_pnd_${orden.dbId}`;

  const [activeTab,    setActiveTab]    = useState<Tab>(initialTab);
  const [loading,      setLoading]      = useState(true);
  const [saving,       setSaving]       = useState(false);
  const [toast,        setToast]        = useState('');
  const [offline,      setOffline]      = useState(!navigator.onLine);
  const [pendingSync,  setPendingSync]  = useState(false);

  // ── Form state ───────────────────────────────────────────────────────────────
  const [codExport,    setCodExport]    = useState('');
  const [fechaExport,  setFechaExport]  = useState('');
  const [tipoProducto, setTipoProducto] = useState(orden.tipoProducto ?? '');
  const [cantExport,   setCantExport]   = useState('');
  const [estadoAvance, setEstadoAvance] = useState('');
  const [kardexNro,    setKardexNro]    = useState('');
  const [kardexRegistrado, setKardexRegistrado] = useState(false);

  // Despacho Aduanero
  const [agente,             setAgente]             = useState('');
  const [naviera,            setNaviera]            = useState('');
  const [almacen,            setAlmacen]            = useState('');
  const [nroDua,             setNroDua]             = useState('');
  const [avisoSalida,        setAvisoSalida]        = useState('');
  const [nroBl,              setNroBl]              = useState('');
  const [fechaSalidaNave,    setFechaSalidaNave]    = useState('');
  const [cantidadPallets,    setCantidadPallets]    = useState('');
  const [cantidadSacos,      setCantidadSacos]      = useState('');
  const [pesoTotal,          setPesoTotal]          = useState('');
  const [evidenciasDespacho, setEvidenciasDespacho] = useState('');
  const [costoFob,           setCostoFob]           = useState('');
  const [comisionAgente,     setComisionAgente]     = useState('');
  const [transporteAlmacen,  setTransporteAlmacen]  = useState('');
  const [costoCertificados,  setCostoCertificados]  = useState('');
  const [puertoEmbarque,     setPuertoEmbarque]     = useState('');
  const [puertoDestino,      setPuertoDestino]      = useState('');
  const [contenedor,         setContenedor]         = useState('');
  const [nroPrecinto,        setNroPrecinto]        = useState('');
  const [fechaEmbarque,      setFechaEmbarque]      = useState('');
  const [observAduanero,     setObservAduanero]     = useState('');

  // Plan
  const [campanaPlan,               setCampanaPlan]               = useState(orden.campana ?? '');
  const [lotesAsociados,            setLotesAsociados]            = useState(orden.lote ?? '');
  const [destinoPlan,               setDestinoPlan]               = useState('');
  const [documentosAsociados,       setDocumentosAsociados]       = useState<UploadedEntry[]>([]);
  const [reportesCalidad,           setReportesCalidad]           = useState<UploadedEntry[]>([]);
  const [documentacionExportacion,  setDocumentacionExportacion]  = useState<Record<string, DocEntry>>({});
  const [expandedDoc,               setExpandedDoc]               = useState<string | null>(null);
  const [uploadingDoc,              setUploadingDoc]              = useState(false);
  const [uploadingRep,              setUploadingRep]              = useState(false);
  // Hidden plan fields persisted to DB
  const [fechaCorte,       setFechaCorte]       = useState('');
  const [fechaZarpe,       setFechaZarpe]       = useState('');
  const [fechaEta,         setFechaEta]         = useState('');
  const [navieraPlan,      setNavieraPlan]      = useState('');
  const [puertoOrigenPlan, setPuertoOrigenPlan] = useState('');
  const [puertoDestinoPlan,setPuertoDestinoPlan]= useState('');
  const [tipoCont,         setTipoCont]         = useState('');
  const [cantCont,         setCantCont]         = useState('');
  const [pesoNeto,         setPesoNeto]         = useState('');
  const [pesoBruto,        setPesoBruto]        = useState('');
  const [observPlan,       setObservPlan]       = useState('');

  // Cierre
  const [nroFactura,      setNroFactura]      = useState('');
  const [fechaFactura,    setFechaFactura]    = useState('');
  const [montoFinal,      setMontoFinal]      = useState('');
  const [monedaCierre,    setMonedaCierre]    = useState<'USD' | 'PEN'>('USD');
  const [fechaPagoCierre, setFechaPagoCierre] = useState('');
  const [estadoPago,      setEstadoPago]      = useState('');
  const [banco,           setBanco]           = useState('');
  const [nroCuenta,       setNroCuenta]       = useState('');
  const [observCierre,    setObservCierre]    = useState('');

  const docFileRef = useRef<HTMLInputElement>(null);
  const repFileRef = useRef<HTMLInputElement>(null);

  // ── Toast ────────────────────────────────────────────────────────────────────
  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  }, []);

  // ── Apply data to state ───────────────────────────────────────────────────────
  const applyData = useCallback((data: any) => {
    if (!data) return;
    setCodExport(data.codExport ?? '');
    setFechaExport(data.fechaExport ?? '');
    setTipoProducto(data.tipoProducto ?? orden.tipoProducto ?? '');
    setCantExport(data.cantExport != null ? String(data.cantExport) : '');
    setEstadoAvance(data.estadoAvance ?? '');
    setKardexNro(data.kardexNro ?? '');
    setKardexRegistrado(data.kardexRegistrado ?? false);
    setAgente(data.agente ?? '');
    setNaviera(data.naviera ?? '');
    setAlmacen(data.almacen ?? '');
    setNroDua(data.nroDua ?? '');
    setAvisoSalida(data.avisoSalida ?? '');
    setNroBl(data.nroBl ?? '');
    setFechaSalidaNave(data.fechaSalidaNave ?? '');
    setCantidadPallets(data.cantidadPallets != null ? String(data.cantidadPallets) : '');
    setCantidadSacos(data.cantidadSacos != null ? String(data.cantidadSacos) : '');
    setPesoTotal(data.pesoTotal != null ? String(data.pesoTotal) : '');
    setEvidenciasDespacho(data.evidenciasDespacho ?? '');
    setCostoFob(data.costoFob != null ? String(data.costoFob) : '');
    setComisionAgente(data.comisionAgente != null ? String(data.comisionAgente) : '');
    setTransporteAlmacen(data.transporteAlmacen != null ? String(data.transporteAlmacen) : '');
    setCostoCertificados(data.costoCertificados != null ? String(data.costoCertificados) : '');
    setPuertoEmbarque(data.puertoEmbarque ?? '');
    setPuertoDestino(data.puertoDestino ?? '');
    setContenedor(data.contenedor ?? '');
    setNroPrecinto(data.nroPrecinto ?? '');
    setFechaEmbarque(data.fechaEmbarque ?? '');
    setObservAduanero(data.observAduanero ?? '');
    setCampanaPlan(data.campanaPlan ?? orden.campana ?? '');
    setLotesAsociados(data.lotesAsociados ?? orden.lote ?? '');
    setDestinoPlan(data.destinoPlan ?? '');
    setDocumentosAsociados(Array.isArray(data.documentosAsociados) ? data.documentosAsociados : []);
    setReportesCalidad(Array.isArray(data.reportesCalidad) ? data.reportesCalidad : []);
    if (data.documentacionExportacion && typeof data.documentacionExportacion === 'object') {
      setDocumentacionExportacion(data.documentacionExportacion as Record<string, DocEntry>);
    }
    setFechaCorte(data.fechaCorte ?? '');
    setFechaZarpe(data.fechaZarpe ?? '');
    setFechaEta(data.fechaEta ?? '');
    setNavieraPlan(data.navieraPlan ?? '');
    setPuertoOrigenPlan(data.puertoOrigenPlan ?? '');
    setPuertoDestinoPlan(data.puertoDestinoPlan ?? '');
    setTipoCont(data.tipoCont ?? '');
    setCantCont(data.cantCont != null ? String(data.cantCont) : '');
    setPesoNeto(data.pesoNeto != null ? String(data.pesoNeto) : '');
    setPesoBruto(data.pesoBruto != null ? String(data.pesoBruto) : '');
    setObservPlan(data.observPlan ?? '');
    setNroFactura(data.nroFactura ?? '');
    setFechaFactura(data.fechaFactura ?? '');
    setMontoFinal(data.montoFinal != null ? String(data.montoFinal) : '');
    setMonedaCierre((data.monedaCierre as 'USD' | 'PEN') ?? 'USD');
    setFechaPagoCierre(data.fechaPagoCierre ?? '');
    setEstadoPago(data.estadoPago ?? '');
    setBanco(data.banco ?? '');
    setNroCuenta(data.nroCuenta ?? '');
    setObservCierre(data.observCierre ?? '');
  }, [orden.tipoProducto, orden.campana, orden.lote]);

  // ── Build DTO from current state ─────────────────────────────────────────────
  const buildDto = useCallback((): Record<string, unknown> => ({
    codExport:     codExport    || null,
    fechaExport:   fechaExport  || null,
    tipoProducto:  tipoProducto || null,
    cantExport:    cantExport   ? parseFloat(cantExport) : null,
    estadoAvance:  estadoAvance || null,
    kardexNro:     kardexNro    || null,
    kardexRegistrado,
    agente:        agente       || null,
    naviera:       naviera      || null,
    almacen:       almacen      || null,
    nroDua:        nroDua       || null,
    avisoSalida:   avisoSalida  || null,
    nroBl:         nroBl        || null,
    fechaSalidaNave:  fechaSalidaNave  || null,
    cantidadPallets:  cantidadPallets  ? parseInt(cantidadPallets)  : null,
    cantidadSacos:    cantidadSacos    ? parseInt(cantidadSacos)    : null,
    pesoTotal:        pesoTotal        ? parseFloat(pesoTotal)      : null,
    evidenciasDespacho: evidenciasDespacho || null,
    costoFob:           costoFob           ? parseFloat(costoFob)           : null,
    comisionAgente:     comisionAgente     ? parseFloat(comisionAgente)     : null,
    transporteAlmacen:  transporteAlmacen  ? parseFloat(transporteAlmacen)  : null,
    costoCertificados:  costoCertificados  ? parseFloat(costoCertificados)  : null,
    puertoEmbarque:  puertoEmbarque  || null,
    puertoDestino:   puertoDestino   || null,
    contenedor:      contenedor      || null,
    nroPrecinto:     nroPrecinto     || null,
    fechaEmbarque:   fechaEmbarque   || null,
    observAduanero:  observAduanero  || null,
    campanaPlan:     campanaPlan     || null,
    lotesAsociados:  lotesAsociados  || null,
    destinoPlan:     destinoPlan     || null,
    documentosAsociados:      documentosAsociados.length      ? documentosAsociados      : null,
    reportesCalidad:          reportesCalidad.length          ? reportesCalidad          : null,
    documentacionExportacion: Object.keys(documentacionExportacion).length
      ? documentacionExportacion : null,
    fechaCorte:      fechaCorte      || null,
    fechaZarpe:      fechaZarpe      || null,
    fechaEta:        fechaEta        || null,
    navieraPlan:     navieraPlan     || null,
    puertoOrigenPlan:  puertoOrigenPlan   || null,
    puertoDestinoPlan: puertoDestinoPlan  || null,
    tipoCont:        tipoCont        || null,
    cantCont:        cantCont        ? parseInt(cantCont)    : null,
    pesoNeto:        pesoNeto        ? parseFloat(pesoNeto)  : null,
    pesoBruto:       pesoBruto       ? parseFloat(pesoBruto) : null,
    observPlan:      observPlan      || null,
    nroFactura:      nroFactura      || null,
    fechaFactura:    fechaFactura    || null,
    montoFinal:      montoFinal      ? parseFloat(montoFinal) : null,
    monedaCierre,
    fechaPagoCierre: fechaPagoCierre || null,
    estadoPago:      estadoPago      || null,
    banco:           banco           || null,
    nroCuenta:       nroCuenta       || null,
    observCierre:    observCierre    || null,
  }), [
    codExport, fechaExport, tipoProducto, cantExport, estadoAvance, kardexNro, kardexRegistrado,
    agente, naviera, almacen, nroDua, avisoSalida, nroBl, fechaSalidaNave,
    cantidadPallets, cantidadSacos, pesoTotal, evidenciasDespacho,
    costoFob, comisionAgente, transporteAlmacen, costoCertificados,
    puertoEmbarque, puertoDestino, contenedor, nroPrecinto, fechaEmbarque, observAduanero,
    campanaPlan, lotesAsociados, destinoPlan, documentosAsociados, reportesCalidad, documentacionExportacion,
    fechaCorte, fechaZarpe, fechaEta, navieraPlan, puertoOrigenPlan, puertoDestinoPlan,
    tipoCont, cantCont, pesoNeto, pesoBruto, observPlan,
    nroFactura, fechaFactura, montoFinal, monedaCierre, fechaPagoCierre, estadoPago, banco, nroCuenta, observCierre,
  ]);

  // ── Sync pending offline save ─────────────────────────────────────────────────
  const syncPending = useCallback(async () => {
    const pending = readCache<Record<string, unknown>>(PENDING_KEY);
    if (!pending) return;
    try {
      const result = await ordenesVentaService.upsertExportacion(orden.dbId, pending);
      removeCache(PENDING_KEY);
      writeCache(CACHE_KEY, result);
      setPendingSync(false);
      showToast('Cambios sincronizados');
    } catch { /* retry on next online event */ }
  }, [CACHE_KEY, PENDING_KEY, orden.dbId, showToast]);

  // ── Load + online/offline listeners ──────────────────────────────────────────
  useEffect(() => {
    if (readCache(PENDING_KEY)) setPendingSync(true);

    const load = async () => {
      if (!navigator.onLine) {
        const cached = readCache(CACHE_KEY);
        if (cached) applyData(cached);
        setOffline(true);
        setLoading(false);
        return;
      }
      try {
        const data = await ordenesVentaService.getExportacion(orden.dbId);
        if (data) { applyData(data); writeCache(CACHE_KEY, data); }
      } catch {
        const cached = readCache(CACHE_KEY);
        if (cached) { applyData(cached); setOffline(true); }
      }
      setLoading(false);
    };
    load();

    const handleOnline = async () => {
      setOffline(false);
      await syncPending();
    };
    const handleOffline = () => setOffline(true);

    window.addEventListener('online',  handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online',  handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [orden.dbId, CACHE_KEY, PENDING_KEY, applyData, syncPending]);

  // ── Save ─────────────────────────────────────────────────────────────────────
  const handleGuardar = useCallback(async () => {
    const dto = buildDto();
    if (offline) {
      writeCache(PENDING_KEY, dto);
      setPendingSync(true);
      showToast('Sin conexión — guardado localmente');
      return;
    }
    setSaving(true);
    try {
      const result = await ordenesVentaService.upsertExportacion(orden.dbId, dto);
      writeCache(CACHE_KEY, result);
      removeCache(PENDING_KEY);
      setPendingSync(false);
      showToast('Guardado correctamente');
    } catch {
      writeCache(PENDING_KEY, dto);
      setPendingSync(true);
      showToast('Error de red — guardado localmente');
    } finally {
      setSaving(false);
    }
  }, [buildDto, offline, orden.dbId, CACHE_KEY, PENDING_KEY, showToast]);

  // ── File upload handlers ──────────────────────────────────────────────────────
  const handleUploadDocumento = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!navigator.onLine) {
      showToast('Sin conexión — conectate para subir archivos');
      if (docFileRef.current) docFileRef.current.value = '';
      return;
    }
    setUploadingDoc(true);
    try {
      const updated = await ordenesVentaService.uploadExportacionFile(orden.dbId, 'documentos', file);
      setDocumentosAsociados(updated);
    } catch { showToast('Error al subir archivo'); }
    finally {
      setUploadingDoc(false);
      if (docFileRef.current) docFileRef.current.value = '';
    }
  };

  const handleDeleteDocumento = async (filename: string) => {
    if (!navigator.onLine) { showToast('Sin conexión'); return; }
    try {
      const updated = await ordenesVentaService.deleteExportacionFile(orden.dbId, 'documentos', filename);
      setDocumentosAsociados(updated);
    } catch { showToast('Error al eliminar'); }
  };

  const handleUploadReporte = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!navigator.onLine) {
      showToast('Sin conexión — conectate para subir archivos');
      if (repFileRef.current) repFileRef.current.value = '';
      return;
    }
    setUploadingRep(true);
    try {
      const updated = await ordenesVentaService.uploadExportacionFile(orden.dbId, 'reportes', file);
      setReportesCalidad(updated);
    } catch { showToast('Error al subir archivo'); }
    finally {
      setUploadingRep(false);
      if (repFileRef.current) repFileRef.current.value = '';
    }
  };

  const handleDeleteReporte = async (filename: string) => {
    if (!navigator.onLine) { showToast('Sin conexión'); return; }
    try {
      const updated = await ordenesVentaService.deleteExportacionFile(orden.dbId, 'reportes', filename);
      setReportesCalidad(updated);
    } catch { showToast('Error al eliminar'); }
  };

  const updateDocEntry = (key: string, field: keyof DocEntry, value: string) => {
    setDocumentacionExportacion(prev => ({
      ...prev,
      [key]: { ...(prev[key] ?? { numero: '', fecha: '', observaciones: '' }), [field]: value },
    }));
  };

  const toastOk = toast && !toast.toLowerCase().includes('error') && !toast.toLowerCase().includes('sin conexión');
  const monedaCierreSymbol = monedaCierre === 'PEN' ? 'S/.' : 'USD';

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.38)', backdropFilter: 'blur(12px) saturate(0.75)' }}
      onClick={e => !saving && e.target === e.currentTarget && onClose()}
    >
      <div
        className="relative w-full sm:max-w-5xl rounded-t-3xl sm:rounded-3xl flex flex-col overflow-hidden"
        style={{ background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(28px) saturate(1.4)', WebkitBackdropFilter: 'blur(28px) saturate(1.4)', border: '1px solid rgba(255,255,255,0.6)', boxShadow: '0 24px 60px rgba(0,0,0,0.22)', maxHeight: '92dvh' }}
      >
        {/* Loading / saving overlay */}
        {(saving || loading) && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center rounded-t-3xl sm:rounded-3xl" style={{ backgroundColor: 'rgba(255,255,255,0.93)', backdropFilter: 'blur(2px)' }}>
            <LoadingLogo compact />
            <p className="text-sm font-semibold text-gray-600 mt-3">{loading ? 'Cargando…' : 'Guardando…'}</p>
          </div>
        )}

        {/* Toast */}
        {toast && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30 px-4 py-2 rounded-xl text-xs font-bold shadow-lg max-w-[90vw] text-center"
            style={{ backgroundColor: toastOk ? '#d1fae5' : '#fee2e2', color: toastOk ? '#065f46' : '#991b1b' }}>
            {toast}
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-5 py-3 sm:py-4 border-b shrink-0" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: CP }}>
              <Ship size={14} className="text-white" />
            </div>
            <div className="min-w-0">
              <p className="font-black text-xs sm:text-sm uppercase tracking-wide" style={{ color: TX }}>Exportación</p>
              <p className="text-[0.6rem] text-gray-400 truncate">{orden.id} · {orden.cliente}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Offline / pending badge */}
            {offline && (
              <span className="hidden sm:flex items-center gap-1 text-[0.6rem] font-bold px-2 py-1 rounded-lg" style={{ backgroundColor: '#FEF3C7', color: '#92400E' }}>
                <WifiOff size={10} /> Sin conexión
              </span>
            )}
            {pendingSync && !offline && (
              <button onClick={syncPending} className="hidden sm:flex items-center gap-1 text-[0.6rem] font-bold px-2 py-1 rounded-lg transition-opacity hover:opacity-70" style={{ backgroundColor: '#DBEAFE', color: '#1E40AF' }}>
                <RefreshCw size={10} /> Sincronizar
              </button>
            )}
            <button onClick={handleGuardar} disabled={saving || loading}
              className="text-[0.65rem] font-bold px-3 sm:px-4 py-2 rounded-xl text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: offline ? '#92400E' : CP }}>
              {offline ? 'GUARDAR LOCAL' : 'GUARDAR'}
            </button>
            <button onClick={onClose} className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-600 transition-all">
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Mobile offline banner */}
        {offline && (
          <div className="flex sm:hidden items-center gap-2 px-4 py-2 text-[0.65rem] font-semibold" style={{ backgroundColor: '#FEF3C7', color: '#92400E' }}>
            <WifiOff size={11} />
            <span>Sin conexión — los cambios se guardan localmente</span>
          </div>
        )}
        {pendingSync && !offline && (
          <button onClick={syncPending} className="flex sm:hidden items-center justify-center gap-2 px-4 py-2 text-[0.65rem] font-semibold w-full" style={{ backgroundColor: '#DBEAFE', color: '#1E40AF' }}>
            <RefreshCw size={11} /> Cambios pendientes — toca para sincronizar
          </button>
        )}

        {/* Tabs */}
        <div className="flex gap-0.5 sm:gap-1 px-3 sm:px-5 pt-3 sm:pt-4 shrink-0 border-b overflow-x-auto scrollbar-none" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
          {TABS.map(t => (
            <button key={t.key} onClick={() => setActiveTab(t.key)}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-t-xl text-[0.65rem] sm:text-xs font-bold uppercase tracking-wide transition-all whitespace-nowrap shrink-0"
              style={{ backgroundColor: activeTab === t.key ? CP : 'transparent', color: activeTab === t.key ? '#fff' : '#9CA3AF', borderBottom: activeTab === t.key ? `2px solid ${CP}` : '2px solid transparent', marginBottom: '-1px' }}>
              <span className="sm:hidden">{t.short}</span>
              <span className="hidden sm:inline">{t.label}</span>
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="overflow-y-auto flex-1 px-4 sm:px-5 py-4 sm:py-5">

          {/* ── PLAN DE EXPORTACIÓN ── */}
          {activeTab === 'plan' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">

                {/* Left column */}
                <div className="space-y-4">
                  <div>
                    {fieldLabel('Código de Exportación')}
                    <input value={codExport} onChange={e => setCodExport(e.target.value)} className={INP} style={inpStyle} placeholder="EXP-2026-001" />
                  </div>
                  <div>
                    {fieldLabel('Campaña Asociada')}
                    <input value={campanaPlan} onChange={e => setCampanaPlan(e.target.value)} className={INP} style={inpStyle} placeholder="Campaña 2025/2026…" />
                  </div>
                  <div>
                    {fieldLabel('Cliente')}
                    <div className={INP} style={{ ...inpStyle, backgroundColor: BG, color: '#6B7280' }}>{orden.cliente || '—'}</div>
                  </div>
                  <div>
                    {fieldLabel('Lotes Asociados')}
                    <input value={lotesAsociados} onChange={e => setLotesAsociados(e.target.value)} className={INP} style={inpStyle} placeholder="LF-2026-001, LF-2026-002…" />
                  </div>

                  {/* Documentos Asociados */}
                  <div>
                    {fieldLabel('Documentos Asociados')}
                    <input ref={docFileRef} type="file" className="hidden" onChange={handleUploadDocumento} />
                    <button type="button" disabled={uploadingDoc || offline}
                      onClick={() => docFileRef.current?.click()}
                      className="w-full flex items-center justify-center gap-2 border-2 border-dashed rounded-xl py-2.5 text-xs font-semibold transition-colors disabled:opacity-50"
                      style={{ borderColor: offline ? '#D1D5DB' : BD, color: offline ? '#9CA3AF' : '#6B7280' }}>
                      {offline
                        ? <><WifiOff size={12} /> Sin conexión</>
                        : <><Upload size={12} style={{ color: uploadingDoc ? CP : '#9CA3AF' }} />{uploadingDoc ? 'Subiendo…' : 'Subir documento'}</>
                      }
                    </button>
                    {documentosAsociados.length > 0 && (
                      <div className="mt-2 flex flex-col gap-1">
                        {documentosAsociados.map((entry, i) => (
                          <div key={i} className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs min-w-0" style={{ backgroundColor: `${CP}08` }}>
                            <FileText size={12} style={{ color: CP, flexShrink: 0 }} />
                            <a href={`/uploads/exportacion/${orden.dbId}/documentos/${entry.file}`}
                              target="_blank" rel="noopener noreferrer"
                              className="flex-1 truncate font-medium hover:underline min-w-0"
                              style={{ color: TX }}>
                              {entry.name}
                            </a>
                            <button type="button" onClick={() => handleDeleteDocumento(entry.file)} className="shrink-0 hover:opacity-70 touch-manipulation">
                              <Trash2 size={12} className="text-red-400" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    {fieldLabel('Destino')}
                    <input value={destinoPlan} onChange={e => setDestinoPlan(e.target.value)} className={INP} style={inpStyle} placeholder="País / ciudad de destino…" />
                  </div>

                  {/* Reportes de Calidad */}
                  <div>
                    {fieldLabel('Reportes de Calidad')}
                    <input ref={repFileRef} type="file" className="hidden" onChange={handleUploadReporte} />
                    <button type="button" disabled={uploadingRep || offline}
                      onClick={() => repFileRef.current?.click()}
                      className="w-full flex items-center justify-center gap-2 border-2 border-dashed rounded-xl py-2.5 text-xs font-semibold transition-colors disabled:opacity-50"
                      style={{ borderColor: offline ? '#D1D5DB' : BD, color: offline ? '#9CA3AF' : '#6B7280' }}>
                      {offline
                        ? <><WifiOff size={12} /> Sin conexión</>
                        : <><Upload size={12} style={{ color: uploadingRep ? CP : '#9CA3AF' }} />{uploadingRep ? 'Subiendo…' : 'Subir reporte'}</>
                      }
                    </button>
                    {reportesCalidad.length > 0 && (
                      <div className="mt-2 flex flex-col gap-1">
                        {reportesCalidad.map((entry, i) => (
                          <div key={i} className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs min-w-0" style={{ backgroundColor: `${CP}08` }}>
                            <FileText size={12} style={{ color: CP, flexShrink: 0 }} />
                            <a href={`/uploads/exportacion/${orden.dbId}/reportes/${entry.file}`}
                              target="_blank" rel="noopener noreferrer"
                              className="flex-1 truncate font-medium hover:underline min-w-0"
                              style={{ color: TX }}>
                              {entry.name}
                            </a>
                            <button type="button" onClick={() => handleDeleteReporte(entry.file)} className="shrink-0 hover:opacity-70 touch-manipulation">
                              <Trash2 size={12} className="text-red-400" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right column */}
                <div className="space-y-4">
                  <div>
                    {fieldLabel('Fecha de Exportación')}
                    <div className="relative">
                      <input type="date" value={fechaExport} onChange={e => setFechaExport(e.target.value)} className={INP} style={inpStyle} />
                      <Calendar size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    {fieldLabel('Tipo de Producto')}
                    <input value={tipoProducto} onChange={e => setTipoProducto(e.target.value)} className={INP} style={inpStyle} placeholder="Tipo de producto…" />
                  </div>
                  <div>
                    {fieldLabel('Orden de Venta')}
                    <div className={INP} style={{ ...inpStyle, backgroundColor: BG, color: '#6B7280' }}>{orden.id || '—'}</div>
                  </div>
                  <div>
                    {fieldLabel('Cantidad Exportada (kg)')}
                    <input type="number" min={0} step="0.01" value={cantExport} onChange={e => setCantExport(e.target.value)} className={INP} style={inpStyle} placeholder="0.00" />
                  </div>
                  <div>
                    {fieldLabel('Fecha de Arribo (ETA)')}
                    <div className="relative">
                      <input type="date" value={fechaEta} onChange={e => setFechaEta(e.target.value)} className={INP} style={inpStyle} />
                      <Calendar size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Documentación de Exportación accordion */}
              <div>
                <p className="text-[0.65rem] font-black uppercase tracking-widest mb-3" style={{ color: TX }}>Documentación de Exportación</p>
                <div className="rounded-2xl border overflow-hidden" style={{ borderColor: BD }}>
                  {DOC_TYPES.map((dt, idx) => {
                    const entry: DocEntry = documentacionExportacion[dt.key] ?? { numero: '', fecha: '', observaciones: '' };
                    const isExpanded = expandedDoc === dt.key;
                    const hasData    = !!(entry.numero || entry.fecha || entry.observaciones);
                    return (
                      <div key={dt.key} style={{ borderBottom: idx < DOC_TYPES.length - 1 ? `1px solid ${BD}` : 'none' }}>
                        <button type="button"
                          onClick={() => setExpandedDoc(isExpanded ? null : dt.key)}
                          className="w-full flex items-center gap-3 px-3 sm:px-4 py-3 text-left active:bg-gray-100 hover:bg-gray-50 transition-colors touch-manipulation">
                          <div className="w-2 h-2 rounded-full shrink-0 transition-opacity"
                            style={{ backgroundColor: CP, opacity: hasData ? 1 : 0.25 }} />
                          <span className="flex-1 text-xs font-semibold min-w-0" style={{ color: TX }}>{dt.label}</span>
                          {hasData && (
                            <span className="text-[0.55rem] font-bold px-1.5 py-0.5 rounded-full shrink-0"
                              style={{ backgroundColor: `${CP}18`, color: CP }}>
                              ✓
                            </span>
                          )}
                          <ChevronDown size={13} className="text-gray-400 shrink-0 transition-transform"
                            style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }} />
                        </button>
                        {isExpanded && (
                          <div className="px-3 sm:px-4 pb-4 pt-1 grid grid-cols-1 sm:grid-cols-3 gap-3"
                            style={{ backgroundColor: BG }}>
                            <div>
                              {fieldLabel('Número')}
                              <input value={entry.numero} onChange={e => updateDocEntry(dt.key, 'numero', e.target.value)}
                                className={INP} style={inpStyle} placeholder="N° documento…" />
                            </div>
                            <div>
                              {fieldLabel('Fecha')}
                              <div className="relative">
                                <input type="date" value={entry.fecha} onChange={e => updateDocEntry(dt.key, 'fecha', e.target.value)}
                                  className={INP} style={inpStyle} />
                                <Calendar size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                              </div>
                            </div>
                            <div>
                              {fieldLabel('Observaciones')}
                              <input value={entry.observaciones} onChange={e => updateDocEntry(dt.key, 'observaciones', e.target.value)}
                                className={INP} style={inpStyle} placeholder="Notas…" />
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ── DESPACHO ADUANERO ── */}
          {activeTab === 'despacho' && (
            <div className="space-y-6">
              {/* Resumen */}
              <div className="rounded-2xl p-3 sm:p-4 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4" style={{ backgroundColor: BG }}>
                <div>
                  {fieldLabel('Código exportación')}
                  <input value={codExport} onChange={e => setCodExport(e.target.value)} className={INP} style={inpStyle} placeholder="EXP-2026-001" />
                </div>
                <div>
                  {fieldLabel('Fecha exportación')}
                  <div className="relative">
                    <input type="date" value={fechaExport} onChange={e => setFechaExport(e.target.value)} className={INP} style={inpStyle} />
                    <Calendar size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  {fieldLabel('Estado de avance')}
                  <div className="relative">
                    <select value={estadoAvance} onChange={e => setEstadoAvance(e.target.value)} className={`${INP} pr-8 appearance-none`} style={inpStyle}>
                      <option value="">Seleccionar…</option>
                      {ESTADO_AVA.map(e => <option key={e}>{e}</option>)}
                    </select>
                    <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 h-full pt-5">
                    <div className="flex-1 rounded-xl border px-3 py-2.5 flex items-center gap-2" style={{ borderColor: kardexRegistrado ? CP : BD, backgroundColor: kardexRegistrado ? `${CP}08` : '#fff' }}>
                      <Package size={13} style={{ color: CP, opacity: kardexRegistrado ? 1 : 0.4, flexShrink: 0 }} />
                      <div className="flex-1 min-w-0">
                        <p className="text-[0.55rem] font-black uppercase tracking-wide" style={{ color: TX, opacity: 0.5 }}>Kardex</p>
                        <input value={kardexNro} onChange={e => setKardexNro(e.target.value)} className="w-full text-xs bg-transparent outline-none font-semibold mt-0.5" style={{ color: TX }} placeholder="N° mov…" />
                      </div>
                      <label className="flex items-center gap-1 cursor-pointer shrink-0">
                        <CheckboxUI checked={kardexRegistrado} onChange={() => setKardexRegistrado(v => !v)} />
                        <span className="text-[0.55rem] font-bold uppercase" style={{ color: kardexRegistrado ? CP : '#9CA3AF' }}>OK</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Datos aduaneros */}
              <div>
                <p className="text-[0.65rem] font-black uppercase tracking-widest mb-3" style={{ color: TX }}>Datos aduaneros</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>{fieldLabel('Agente de aduanas')}<input value={agente} onChange={e => setAgente(e.target.value)} className={INP} style={inpStyle} placeholder="Agencia Aduanera XYZ…" /></div>
                  <div>
                    {fieldLabel('Naviera')}
                    <div className="relative">
                      <select value={naviera} onChange={e => setNaviera(e.target.value)} className={`${INP} pr-8 appearance-none`} style={inpStyle}>
                        <option value="">Seleccionar…</option>
                        {NAVIERAS.map(n => <option key={n}>{n}</option>)}
                      </select>
                      <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                  <div>{fieldLabel('Almacén')}<input value={almacen} onChange={e => setAlmacen(e.target.value)} className={INP} style={inpStyle} placeholder="Almacén de despacho…" /></div>
                  <div>{fieldLabel('DUA')}<input value={nroDua} onChange={e => setNroDua(e.target.value)} className={INP} style={inpStyle} placeholder="DUA-2026-001" /></div>
                  <div>{fieldLabel('Aviso de salida')}<input value={avisoSalida} onChange={e => setAvisoSalida(e.target.value)} className={INP} style={inpStyle} placeholder="N° aviso de salida…" /></div>
                  <div>{fieldLabel('BL')}<input value={nroBl} onChange={e => setNroBl(e.target.value)} className={INP} style={inpStyle} placeholder="MAEU2026001…" /></div>
                  <div>
                    {fieldLabel('Fecha de salida nave')}
                    <div className="relative">
                      <input type="date" value={fechaSalidaNave} onChange={e => setFechaSalidaNave(e.target.value)} className={INP} style={inpStyle} />
                      <Calendar size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                  <div>{fieldLabel('Cantidad de pallets')}<input type="number" min={0} value={cantidadPallets} onChange={e => setCantidadPallets(e.target.value)} className={INP} style={inpStyle} placeholder="0" /></div>
                  <div>{fieldLabel('Cantidad de sacos')}<input type="number" min={0} value={cantidadSacos} onChange={e => setCantidadSacos(e.target.value)} className={INP} style={inpStyle} placeholder="0" /></div>
                  <div>{fieldLabel('Peso total (kg)')}<input type="number" min={0} step="0.01" value={pesoTotal} onChange={e => setPesoTotal(e.target.value)} className={INP} style={inpStyle} placeholder="0.00" /></div>
                  <div className="sm:col-span-2">
                    {fieldLabel('Evidencias de despacho')}
                    <textarea rows={2} value={evidenciasDespacho} onChange={e => setEvidenciasDespacho(e.target.value)} className={`${INP} resize-none`} style={inpStyle} placeholder="Links, tracking, referencias…" />
                  </div>
                </div>
              </div>

              {/* Costos */}
              <div>
                <p className="text-[0.65rem] font-black uppercase tracking-widest mb-3" style={{ color: TX }}>Costos</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>{fieldLabel('FOB (USD)')}<input type="number" min={0} step="0.01" value={costoFob} onChange={e => setCostoFob(e.target.value)} className={INP} style={inpStyle} placeholder="0.00" /></div>
                  <div>{fieldLabel('Comisión agente (USD)')}<input type="number" min={0} step="0.01" value={comisionAgente} onChange={e => setComisionAgente(e.target.value)} className={INP} style={inpStyle} placeholder="0.00" /></div>
                  <div>{fieldLabel('Transporte a almacén (USD)')}<input type="number" min={0} step="0.01" value={transporteAlmacen} onChange={e => setTransporteAlmacen(e.target.value)} className={INP} style={inpStyle} placeholder="0.00" /></div>
                  <div>{fieldLabel('Certificados (USD)')}<input type="number" min={0} step="0.01" value={costoCertificados} onChange={e => setCostoCertificados(e.target.value)} className={INP} style={inpStyle} placeholder="0.00" /></div>
                  {(costoFob || comisionAgente || transporteAlmacen || costoCertificados) && (
                    <div className="sm:col-span-2 rounded-xl px-4 py-3 flex items-center gap-3" style={{ backgroundColor: `${CP}12` }}>
                      <p className="text-[0.65rem] font-bold uppercase tracking-wide" style={{ color: CP }}>Total:</p>
                      <p className="font-black text-base" style={{ color: CP }}>
                        USD {[costoFob, comisionAgente, transporteAlmacen, costoCertificados]
                          .map(v => parseFloat(v || '0')).reduce((a, b) => a + b, 0)
                          .toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Extra */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>{fieldLabel('N° Contenedor')}<input value={contenedor} onChange={e => setContenedor(e.target.value)} className={INP} style={inpStyle} placeholder="MAEU1234567" /></div>
                <div>{fieldLabel('N° Precinto')}<input value={nroPrecinto} onChange={e => setNroPrecinto(e.target.value)} className={INP} style={inpStyle} placeholder="PR-2026-001" /></div>
                <div className="sm:col-span-2">
                  {fieldLabel('Observaciones')}
                  <textarea rows={2} value={observAduanero} onChange={e => setObservAduanero(e.target.value)} className={`${INP} resize-none`} style={inpStyle} placeholder="Notas del despacho…" />
                </div>
              </div>
            </div>
          )}

          {/* ── CIERRE DE VENTA ── */}
          {activeTab === 'cierre' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>{fieldLabel('N° Factura')}<input value={nroFactura} onChange={e => setNroFactura(e.target.value)} className={INP} style={inpStyle} placeholder="F001-00001" /></div>
                <div>
                  {fieldLabel('Fecha de factura')}
                  <div className="relative">
                    <input type="date" value={fechaFactura} onChange={e => setFechaFactura(e.target.value)} className={INP} style={inpStyle} />
                    <Calendar size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  {fieldLabel('Monto final')}
                  <div className="flex gap-2">
                    <div className="flex rounded-xl overflow-hidden border shrink-0" style={{ borderColor: BD }}>
                      {(['USD','PEN'] as const).map(m => (
                        <button key={m} type="button" onClick={() => setMonedaCierre(m)}
                          className="px-3 py-2 text-xs font-bold transition-colors touch-manipulation"
                          style={{ backgroundColor: monedaCierre === m ? CP : 'transparent', color: monedaCierre === m ? '#fff' : TX }}>
                          {m}
                        </button>
                      ))}
                    </div>
                    <input type="number" min={0} step="0.01" value={montoFinal} onChange={e => setMontoFinal(e.target.value)} className={`${INP} flex-1`} style={inpStyle} placeholder="0.00" />
                  </div>
                </div>
                <div>
                  {fieldLabel('Fecha de pago')}
                  <div className="relative">
                    <input type="date" value={fechaPagoCierre} onChange={e => setFechaPagoCierre(e.target.value)} className={INP} style={inpStyle} />
                    <Calendar size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  {fieldLabel('Estado de pago')}
                  <div className="relative">
                    <select value={estadoPago} onChange={e => setEstadoPago(e.target.value)} className={`${INP} pr-8 appearance-none`} style={inpStyle}>
                      <option value="">Seleccionar…</option>
                      {ESTADO_PAG.map(e => <option key={e}>{e}</option>)}
                    </select>
                    <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  {fieldLabel('Banco')}
                  <div className="relative">
                    <select value={banco} onChange={e => setBanco(e.target.value)} className={`${INP} pr-8 appearance-none`} style={inpStyle}>
                      <option value="">Seleccionar…</option>
                      {BANCOS.map(b => <option key={b}>{b}</option>)}
                    </select>
                    <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div className="sm:col-span-2">{fieldLabel('N° Cuenta / SWIFT / IBAN')}<input value={nroCuenta} onChange={e => setNroCuenta(e.target.value)} className={INP} style={inpStyle} placeholder="Número de cuenta o código SWIFT…" /></div>
                {montoFinal && (
                  <div className="sm:col-span-2 rounded-xl px-4 py-3 flex items-center gap-3" style={{ backgroundColor: `${CP}12` }}>
                    <p className="text-[0.65rem] font-bold uppercase tracking-wide" style={{ color: CP }}>Monto final:</p>
                    <p className="font-black text-base" style={{ color: CP }}>{monedaCierreSymbol} {parseFloat(montoFinal).toLocaleString('es-PE', { minimumFractionDigits: 2 })}</p>
                  </div>
                )}
                <div className="sm:col-span-2">
                  {fieldLabel('Observaciones')}
                  <textarea rows={2} value={observCierre} onChange={e => setObservCierre(e.target.value)} className={`${INP} resize-none`} style={inpStyle} placeholder="Notas del cierre…" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 sm:px-5 py-3 border-t shrink-0 flex justify-end" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
          <button onClick={onClose} className="text-[0.65rem] font-semibold px-3 py-1.5 rounded-lg text-gray-500 hover:bg-black/05 transition-all touch-manipulation">Cerrar</button>
        </div>
      </div>
    </div>
  );
}
