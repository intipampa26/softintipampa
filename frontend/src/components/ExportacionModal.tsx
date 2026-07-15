import { useState, useEffect, useCallback, useRef } from 'react';
import { X, Ship, Calendar, Package, FileText, Upload, Trash2, WifiOff, RefreshCw, Download } from 'lucide-react';
import jsPDF from 'jspdf';
import { ModalLoadingOverlay } from '@/components/ui/ModalLoadingOverlay';
import { useToast } from '@/contexts/ToastContext';
import { ordenesVentaService } from '../services/ordenes-venta.service';
import { lotesFinalesService } from '@/services/lotes-finales.service';

const CP = '#445D46';
const BD = '#D9DDD8';
const TX = '#2C2C2C';
const BG = '#F7F8F7';

const INP      = 'w-full border rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-600 transition-all';
const inpStyle = { borderColor: BD, color: TX };

const fieldLabel = (label: string) => (
  <label className="block text-[0.65rem] font-bold uppercase tracking-wide mb-1.5" style={{ color: TX, opacity: 0.55 }}>{label}</label>
);

function readCache<T>(key: string): T | null {
  try { return JSON.parse(localStorage.getItem(key) ?? 'null') as T; } catch { return null; }
}
function writeCache(key: string, value: unknown) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}
function removeCache(key: string) {
  try { localStorage.removeItem(key); } catch {}
}

function pdfCell(
  doc: jsPDF,
  x: number, y: number, w: number, h: number,
  text: string,
  opts: { fontSize?: number; bold?: boolean; bg?: [number,number,number]; color?: [number,number,number]; align?: 'left'|'center'|'right'; pad?: number } = {},
) {
  const { fontSize = 7, bold = false, bg, color = [30,30,30], align = 'left', pad = 1.5 } = opts;
  if (bg) { doc.setFillColor(bg[0], bg[1], bg[2]); doc.rect(x, y, w, h, 'F'); }
  doc.setDrawColor(180, 180, 180); doc.setLineWidth(0.2); doc.rect(x, y, w, h, 'S');
  doc.setFontSize(fontSize); doc.setFont('helvetica', bold ? 'bold' : 'normal');
  doc.setTextColor(color[0], color[1], color[2]);
  const sc = doc.internal.scaleFactor;
  const ty = y + h / 2 + (fontSize / sc) * 0.35;
  const maxW = w - pad * 2;
  if (align === 'center') doc.text(text, x + w / 2, ty, { align: 'center', maxWidth: maxW });
  else if (align === 'right') doc.text(text, x + w - pad, ty, { align: 'right', maxWidth: maxW });
  else doc.text(text, x + pad, ty, { maxWidth: maxW });
}

function CheckboxUI({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <div onClick={onChange} className="w-5 h-5 shrink-0 rounded border-2 flex items-center justify-center cursor-pointer transition-all"
      style={{ borderColor: checked ? CP : BD, backgroundColor: checked ? CP : '#fff' }}>
      {checked && <svg width="10" height="10" viewBox="0 0 9 9" fill="none"><path d="M1.5 4.5L3.5 6.5L7.5 2.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
    </div>
  );
}

type Tab = 'plan' | 'despacho' | 'cierre';

interface LoteConPrecio {
  key: string;
  loteFinalId: number;
  codigo: string;
  sku: string;
  tipoProducto: string;
  codigoHS: string | null;
  cantidadKg: number;
  tipoEmpaque: string;
  nroSacos: number | null;
  fito: boolean;
  paleta: number | null;
  colorEmpaque: string;
  precioPorKg: string;
  precioAlistado: number | null;
}

type UploadedEntry = { name: string; file: string };

interface Props {
  orden: { dbId: number; id: string; cliente: string; lote: string; tipoProducto: string; campana?: string };
  initialTab?: Tab;
  onClose: () => void;
}

const TABS: { key: Tab; label: string; short: string }[] = [
  { key: 'plan',     label: 'Plan de Exportación',   short: 'Plan'     },
  { key: 'despacho', label: 'Despacho Aduanero',     short: 'Despacho' },
  { key: 'cierre',   label: 'Cierre de Exportación', short: 'Cierre'   },
];

export function ExportacionModal({ orden, initialTab = 'plan', onClose }: Props) {
  const CACHE_KEY   = `ov_exp_${orden.dbId}`;
  const PENDING_KEY = `ov_exp_pnd_${orden.dbId}`;

  const [activeTab,   setActiveTab]   = useState<Tab>(initialTab);
  const [loading,     setLoading]     = useState(true);
  const [saving,      setSaving]      = useState(false);
  const toast = useToast();
  const [offline,     setOffline]     = useState(!navigator.onLine);
  const [pendingSync, setPendingSync] = useState(false);

  // System
  const [codExport,        setCodExport]        = useState('');
  const [tipoProducto,     setTipoProducto]     = useState(orden.tipoProducto ?? '');
  const [kardexNro,        setKardexNro]        = useState('');
  const [kardexRegistrado, setKardexRegistrado] = useState(false);

  // ── Plan tab ──────────────────────────────────────────────────────────────────
  const [fechaCutoff,         setFechaCutoff]         = useState('');
  const [fechaSalidaNave,     setFechaSalidaNave]     = useState('');
  const [fechaFitosanitario,  setFechaFitosanitario]  = useState('');
  const [fechaEntregaCarga,   setFechaEntregaCarga]   = useState('');
  const [agenteAduanasPlan,   setAgenteAduanasPlan]   = useState('');
  const [agenteCarga,         setAgenteCarga]         = useState('');
  const [valorProductos,      setValorProductos]      = useState('');
  const [pesoTotalPlan,       setPesoTotalPlan]       = useState('');
  const [navieraPlan,         setNavieraPlan]         = useState('');
  const [puertoExportacion,   setPuertoExportacion]   = useState('');
  const [fullContainer,       setFullContainer]       = useState(false);
  const [cantidadPaletasPlan, setCantidadPaletasPlan] = useState('');
  const [deshumedecedores,    setDeshumedecedores]    = useState(false);
  const [controlTemperatura,  setControlTemperatura]  = useState(false);
  const [numBooking,          setNumBooking]          = useState('');

  // ── Despacho tab ─────────────────────────────────────────────────────────────
  const [lotesConPrecio,   setLotesConPrecio]   = useState<LoteConPrecio[]>([]);
  const [loadingLotes,     setLoadingLotes]     = useState(false);
  const [fechaIngresoCarga,setFechaIngresoCarga]= useState('');
  const [fechaSenasa,      setFechaSenasa]      = useState('');
  const [cantidadPallets,  setCantidadPallets]  = useState('');
  const [cantidadPaquetes, setCantidadPaquetes] = useState('');
  const [pesoBruto,        setPesoBruto]        = useState('');

  // ── Cierre tab ────────────────────────────────────────────────────────────────
  const [costoTransporteAlmacen, setCostoTransporteAlmacen] = useState('');
  const [costoComisionAgente,    setCostoComisionAgente]    = useState('');
  const [costoAlmacenPortuario,  setCostoAlmacenPortuario]  = useState('');
  const [costoCertificados,      setCostoCertificados]      = useState('');
  const [costoFlete,             setCostoFlete]             = useState('');
  const [costoSeguro,            setCostoSeguro]            = useState('');
  const [pesoTotalCierre,        setPesoTotalCierre]        = useState('');
  const [contenedor,             setContenedor]             = useState('');
  const [nroBl,                  setNroBl]                  = useState('');
  const [nroDua,                 setNroDua]                 = useState('');
  const [avisoSalida,            setAvisoSalida]            = useState('');
  const [nroCertFito,            setNroCertFito]            = useState('');
  const [nroCertOrigen,          setNroCertOrigen]          = useState('');
  const [nroPrecinto,            setNroPrecinto]            = useState('');
  const [guiaRemisionCierre,     setGuiaRemisionCierre]     = useState('');
  const [facturaSupanat,         setFacturaSupanat]         = useState('');

  // ── Files (dynamic categories) ───────────────────────────────────────────────
  const [filesMap,      setFilesMap]      = useState<Record<string, UploadedEntry[]>>({});
  const fileInputRef  = useRef<HTMLInputElement>(null);
  const pendingCatRef = useRef<string | null>(null);

  // ── Apply data ────────────────────────────────────────────────────────────────
  const applyData = useCallback((data: any) => {
    if (!data) return;
    setCodExport(data.codExport ?? '');
    setTipoProducto(data.tipoProducto ?? orden.tipoProducto ?? '');
    setKardexNro(data.kardexNro ?? '');
    setKardexRegistrado(data.kardexRegistrado ?? false);
    // Plan
    setFechaCutoff(data.fechaCutoff ?? data.fechaCorte ?? '');
    setFechaSalidaNave(data.fechaSalidaNave ?? data.fechaZarpe ?? '');
    setFechaFitosanitario(data.fechaFitosanitario ?? '');
    setFechaEntregaCarga(data.fechaEntregaCarga ?? '');
    setAgenteAduanasPlan(data.agenteAduanasPlan ?? data.nombreAgente ?? data.agente ?? '');
    setAgenteCarga(data.agenteCarga ?? '');
    setValorProductos(data.valorProductos != null ? String(data.valorProductos) : '');
    setPesoTotalPlan(data.pesoTotalPlan != null ? String(data.pesoTotalPlan) : '');
    setNavieraPlan(data.navieraPlan ?? data.naviera ?? '');
    setPuertoExportacion(data.puertoExportacion ?? data.puertoEmbarque ?? '');
    setFullContainer(data.fullContainer ?? false);
    setCantidadPaletasPlan(data.cantidadPaletasPlan != null ? String(data.cantidadPaletasPlan) : (data.cantidadPallets != null ? String(data.cantidadPallets) : ''));
    setDeshumedecedores(data.deshumedecedores ?? false);
    setControlTemperatura(data.controlTemperatura ?? false);
    setNumBooking(data.numBooking ?? '');
    // Despacho
    setFechaIngresoCarga(data.fechaIngresoCarga ?? '');
    setFechaSenasa(data.fechaSenasa ?? '');
    setCantidadPallets(data.cantidadPalletsDesp != null ? String(data.cantidadPalletsDesp) : '');
    setCantidadPaquetes(data.cantidadPaquetes != null ? String(data.cantidadPaquetes) : '');
    setPesoBruto(data.pesoBruto != null ? String(data.pesoBruto) : '');
    // Cierre
    setCostoTransporteAlmacen(data.costoTransporteAlmacen != null ? String(data.costoTransporteAlmacen) : (data.transporteAlmacen != null ? String(data.transporteAlmacen) : ''));
    setCostoComisionAgente(data.costoComisionAgente != null ? String(data.costoComisionAgente) : (data.comisionAgente != null ? String(data.comisionAgente) : ''));
    setCostoAlmacenPortuario(data.costoAlmacenPortuario != null ? String(data.costoAlmacenPortuario) : '');
    setCostoCertificados(data.costoCertificados != null ? String(data.costoCertificados) : '');
    setCostoFlete(data.costoFlete != null ? String(data.costoFlete) : (data.costoFob != null ? String(data.costoFob) : ''));
    setCostoSeguro(data.costoSeguro != null ? String(data.costoSeguro) : '');
    setPesoTotalCierre(data.pesoTotalCierre != null ? String(data.pesoTotalCierre) : (data.pesoTotal != null ? String(data.pesoTotal) : ''));
    setContenedor(data.contenedor ?? '');
    setNroBl(data.nroBl ?? '');
    setNroDua(data.nroDua ?? '');
    setAvisoSalida(data.avisoSalida ?? '');
    setNroCertFito(data.nroCertFito ?? '');
    setNroCertOrigen(data.nroCertOrigen ?? '');
    setNroPrecinto(data.nroPrecinto ?? '');
    setGuiaRemisionCierre(data.guiaRemisionCierre ?? '');
    setFacturaSupanat(data.facturaSupanat ?? data.nroFactura ?? '');
    // Files
    if (data.filesMap && typeof data.filesMap === 'object') {
      setFilesMap(data.filesMap as Record<string, UploadedEntry[]>);
    }
    // Lotes (only from DB if available)
    if (Array.isArray(data.lotesConPrecio) && data.lotesConPrecio.length > 0) {
      setLotesConPrecio(data.lotesConPrecio as LoteConPrecio[]);
    }
  }, [orden.tipoProducto]);

  // ── Build DTO ─────────────────────────────────────────────────────────────────
  const buildDto = useCallback((): Record<string, unknown> => ({
    tipoProducto:       tipoProducto       || null,
    kardexNro:          kardexNro          || null,
    kardexRegistrado,
    fechaCutoff:        fechaCutoff        || null,
    fechaSalidaNave:    fechaSalidaNave    || null,
    fechaFitosanitario: fechaFitosanitario || null,
    fechaEntregaCarga:  fechaEntregaCarga  || null,
    agenteAduanasPlan:  agenteAduanasPlan  || null,
    agenteCarga:        agenteCarga        || null,
    valorProductos:     valorProductos     ? parseFloat(valorProductos)      : null,
    pesoTotalPlan:      pesoTotalPlan      ? parseFloat(pesoTotalPlan)       : null,
    navieraPlan:        navieraPlan        || null,
    puertoExportacion:  puertoExportacion  || null,
    fullContainer,
    cantidadPaletasPlan: cantidadPaletasPlan ? parseInt(cantidadPaletasPlan) : null,
    deshumedecedores,
    controlTemperatura,
    numBooking:         numBooking         || null,
    fechaIngresoCarga:  fechaIngresoCarga  || null,
    fechaSenasa:        fechaSenasa        || null,
    cantidadPalletsDesp: cantidadPallets   ? parseInt(cantidadPallets)       : null,
    cantidadPaquetes:   cantidadPaquetes   ? parseInt(cantidadPaquetes)      : null,
    pesoBruto:          pesoBruto          ? parseFloat(pesoBruto)           : null,
    costoTransporteAlmacen: costoTransporteAlmacen ? parseFloat(costoTransporteAlmacen) : null,
    costoComisionAgente:    costoComisionAgente    ? parseFloat(costoComisionAgente)    : null,
    costoAlmacenPortuario:  costoAlmacenPortuario  ? parseFloat(costoAlmacenPortuario)  : null,
    costoCertificados:      costoCertificados      ? parseFloat(costoCertificados)      : null,
    costoFlete:             costoFlete             ? parseFloat(costoFlete)             : null,
    costoSeguro:            costoSeguro            ? parseFloat(costoSeguro)            : null,
    pesoTotalCierre:        pesoTotalCierre        ? parseFloat(pesoTotalCierre)        : null,
    contenedor:             contenedor             || null,
    nroBl:                  nroBl                  || null,
    nroDua:                 nroDua                 || null,
    avisoSalida:            avisoSalida            || null,
    nroCertFito:            nroCertFito            || null,
    nroCertOrigen:          nroCertOrigen          || null,
    nroPrecinto:            nroPrecinto            || null,
    guiaRemisionCierre:     guiaRemisionCierre     || null,
    facturaSupanat:         facturaSupanat         || null,
    filesMap:               Object.keys(filesMap).length > 0 ? filesMap : null,
    lotesConPrecio:         lotesConPrecio.length > 0 ? lotesConPrecio : null,
  }), [
    tipoProducto, kardexNro, kardexRegistrado,
    fechaCutoff, fechaSalidaNave, fechaFitosanitario, fechaEntregaCarga,
    agenteAduanasPlan, agenteCarga, valorProductos, pesoTotalPlan,
    navieraPlan, puertoExportacion, fullContainer, cantidadPaletasPlan,
    deshumedecedores, controlTemperatura, numBooking,
    fechaIngresoCarga, fechaSenasa, cantidadPallets, cantidadPaquetes, pesoBruto,
    costoTransporteAlmacen, costoComisionAgente, costoAlmacenPortuario,
    costoCertificados, costoFlete, costoSeguro, pesoTotalCierre,
    contenedor, nroBl, nroDua, avisoSalida, nroCertFito, nroCertOrigen,
    nroPrecinto, guiaRemisionCierre, facturaSupanat,
    filesMap, lotesConPrecio,
  ]);

  // ── Packing List PDF ──────────────────────────────────────────────────────────
  const generatePackingListPDF = useCallback(() => {
    const doc = new jsPDF({ orientation: 'l', unit: 'mm', format: 'a4' });
    const M = 12; const PW = 297 - M * 2;
    const CP_RGB: [number,number,number] = [68, 93, 70];
    const BG_RGB: [number,number,number] = [247, 248, 247];

    doc.setFillColor(...CP_RGB); doc.rect(M, M, PW, 11, 'F');
    doc.setFont('helvetica', 'bold'); doc.setFontSize(11); doc.setTextColor(255,255,255);
    doc.text('PACKING LIST', M + PW / 2, M + 7.5, { align: 'center' });

    let y = M + 17;
    const info: [string,string,string,string][] = [
      ['Exportación:', codExport || '—', 'Cliente:', orden.cliente || '—'],
      ['Orden de Venta:', orden.id || '—', 'Producto:', tipoProducto || '—'],
      ['Agente Aduanas:', agenteAduanasPlan || '—', 'Puerto salida:', puertoExportacion || '—'],
    ];
    for (const [l1,v1,l2,v2] of info) {
      doc.setFont('helvetica','bold'); doc.setFontSize(7); doc.setTextColor(30,30,30);
      doc.text(l1, M, y); doc.setFont('helvetica','normal'); doc.text(v1, M + 28, y);
      doc.setFont('helvetica','bold'); doc.text(l2, M + PW/2, y); doc.setFont('helvetica','normal'); doc.text(v2, M + PW/2 + 32, y);
      y += 5;
    }
    y += 3;

    const cols = [
      { label: 'N°',            w: 9,  align: 'center' as const },
      { label: 'Código',        w: 28, align: 'left'   as const },
      { label: 'SKU',           w: 42, align: 'left'   as const },
      { label: 'Tipo Producto', w: 30, align: 'left'   as const },
      { label: 'Sacos',         w: 16, align: 'center' as const },
      { label: 'Paleta',        w: 16, align: 'center' as const },
      { label: 'Peso Neto (kg)',w: 28, align: 'center' as const },
      { label: 'Precio USD/kg', w: 26, align: 'center' as const },
      { label: 'Total USD',     w: 26, align: 'center' as const },
      { label: 'Fito',          w: 12, align: 'center' as const },
    ];
    const rowH = 8; let x = M;
    for (const col of cols) {
      pdfCell(doc, x, y, col.w, rowH, col.label, { bold: true, bg: CP_RGB, color: [255,255,255], align: col.align, fontSize: 6.5 });
      x += col.w;
    }
    y += rowH;

    let totSacos = 0, totPalets = 0, totKg = 0, totUSD = 0;
    lotesConPrecio.forEach((lote, idx) => {
      const precio = lote.precioAlistado ?? (lote.precioPorKg ? parseFloat(lote.precioPorKg) : null);
      const total  = precio != null ? precio * lote.cantidadKg : null;
      totSacos += lote.nroSacos ?? 0; totPalets += lote.paleta ?? 0;
      totKg += lote.cantidadKg; totUSD += total ?? 0;
      const bg: [number,number,number] = idx % 2 === 0 ? [255,255,255] : BG_RGB;
      const row = [String(idx+1), lote.codigo, lote.sku, lote.tipoProducto || '—',
        lote.nroSacos != null ? String(lote.nroSacos) : '—',
        lote.paleta   != null ? String(lote.paleta)   : '—',
        lote.cantidadKg.toFixed(2),
        precio != null ? precio.toFixed(2) : '—',
        total  != null ? total.toFixed(2)  : '—',
        lote.fito ? 'Sí' : 'No',
      ];
      x = M;
      for (let i = 0; i < cols.length; i++) {
        pdfCell(doc, x, y, cols[i].w, rowH, row[i], { bg, align: cols[i].align, fontSize: 6.5 });
        x += cols[i].w;
      }
      y += rowH;
    });

    x = M;
    const totRow = ['', 'TOTAL', '', '', String(totSacos || '—'), String(totPalets || '—'), totKg.toFixed(2), '', totUSD.toFixed(2), ''];
    for (let i = 0; i < cols.length; i++) {
      pdfCell(doc, x, y, cols[i].w, rowH, totRow[i], { bold: true, bg: [230,237,230], color: CP_RGB, align: cols[i].align, fontSize: 6.5 });
      x += cols[i].w;
    }

    doc.save(`PackingList_${orden.id || 'OV'}_${codExport || 'EXP'}.pdf`);
  }, [lotesConPrecio, codExport, orden, tipoProducto, agenteAduanasPlan, puertoExportacion]);

  // ── Sync pending ──────────────────────────────────────────────────────────────
  const syncPending = useCallback(async () => {
    const pending = readCache<Record<string, unknown>>(PENDING_KEY);
    if (!pending) return;
    try {
      const result = await ordenesVentaService.upsertExportacion(orden.dbId, pending);
      removeCache(PENDING_KEY);
      writeCache(CACHE_KEY, result);
      setPendingSync(false);
      toast.success('Cambios sincronizados');
    } catch { /* retry later */ }
  }, [CACHE_KEY, PENDING_KEY, orden.dbId, toast]);

  const syncPendingRef = useRef(syncPending);
  const applyDataRef   = useRef(applyData);
  useEffect(() => { syncPendingRef.current = syncPending; }, [syncPending]);
  useEffect(() => { applyDataRef.current   = applyData;   }, [applyData]);

  // ── Load ──────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (readCache(PENDING_KEY)) setPendingSync(true);

    const load = async () => {
      if (!navigator.onLine) {
        const cached = readCache(CACHE_KEY);
        if (cached) applyDataRef.current(cached);
        setOffline(true); setLoading(false); return;
      }
      let expData: any = null;
      try {
        expData = await ordenesVentaService.getExportacion(orden.dbId);
        if (expData) { applyDataRef.current(expData); writeCache(CACHE_KEY, expData); }
      } catch {
        const cached = readCache(CACHE_KEY);
        if (cached) { applyDataRef.current(cached); setOffline(true); expData = cached; }
      }
      setLoading(false);

      try {
        const alistado = await ordenesVentaService.getAlistado(orden.dbId);
        const asignados: any[] = Array.isArray(alistado?.lotesAsignados) ? alistado.lotesAsignados : [];
        if (asignados.length > 0) {
          setLoadingLotes(true);
          const savedLotes: LoteConPrecio[] = Array.isArray(expData?.lotesConPrecio) ? expData.lotesConPrecio : [];
          const merged: LoteConPrecio[] = [];
          for (const a of asignados) {
            const lfId = Number(a.loteFinalId ?? 0);
            const key  = a.esManual ? `manual-${a.codigo}` : `lf-${lfId}`;
            const saved = savedLotes.find(p => p.key === key);
            let sku         = a.descripcion ?? a.codigo ?? '—';
            let codigo      = a.codigo ?? '';
            let cantidadKg  = Number(a.cantidadKg ?? 0);
            let loteTipoProd = '';
            let codigoHS: string | null = null;
            let loteTipoEmpaque = '';
            if (!a.esManual && lfId > 0) {
              try {
                const det = await lotesFinalesService.getDetalle(lfId);
                sku          = (det.loteFinal.sku?.nombre ?? codigo) || '—';
                if (!codigo) codigo = det.loteFinal.codigo ?? '';
                if (!cantidadKg) cantidadKg = Number(det.loteFinal.cantidadKg ?? 0);
                loteTipoProd    = det.loteFinal.tipoProducto?.tipo ?? '';
                codigoHS        = det.loteFinal.sku?.codigoHS ?? null;
              } catch { /* keep defaults */ }
            }
            merged.push({
              key, loteFinalId: lfId, codigo, sku,
              tipoProducto: saved?.tipoProducto ?? loteTipoProd,
              codigoHS:     saved?.codigoHS     ?? codigoHS,
              cantidadKg,
              tipoEmpaque:  saved?.tipoEmpaque  ?? loteTipoEmpaque,
              nroSacos:     saved?.nroSacos     ?? (a.nroSacos ?? null),
              fito:         saved?.fito         ?? false,
              paleta:       saved?.paleta       ?? (a.paleta ?? null),
              colorEmpaque: saved?.colorEmpaque ?? '',
              precioPorKg:  saved?.precioPorKg  ?? '',
              precioAlistado: a.precio ?? null,
            });
          }
          setLotesConPrecio(merged);
          setLoadingLotes(false);
        }
      } catch { /* silent */ }
    };
    load();

    const handleOnline  = async () => { setOffline(false); await syncPendingRef.current(); };
    const handleOffline = () => setOffline(true);
    window.addEventListener('online',  handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online',  handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orden.dbId, CACHE_KEY, PENDING_KEY]);

  // ── Save ──────────────────────────────────────────────────────────────────────
  const handleGuardar = useCallback(async () => {
    const dto = buildDto();
    if (offline) {
      writeCache(PENDING_KEY, dto);
      setPendingSync(true);
      toast.offline('Sin conexión — guardado localmente');
      return;
    }
    setSaving(true);
    try {
      const result = await ordenesVentaService.upsertExportacion(orden.dbId, dto);
      writeCache(CACHE_KEY, result);
      removeCache(PENDING_KEY);
      setPendingSync(false);
      if (!kardexRegistrado) {
        try {
          await ordenesVentaService.updateEtapa(orden.dbId, 'exportacion', 'en_proceso', new Date().toISOString().slice(0,10));
          const updated = await ordenesVentaService.getExportacion(orden.dbId);
          if (updated) { setKardexNro(updated.kardexNro ?? ''); setKardexRegistrado(updated.kardexRegistrado ?? false); writeCache(CACHE_KEY, updated); }
        } catch { /* silent */ }
      }
      toast.success('Guardado correctamente');
    } catch {
      writeCache(PENDING_KEY, dto);
      setPendingSync(true);
      toast.offline('Error de red — guardado localmente');
    } finally { setSaving(false); }
  }, [buildDto, offline, orden.dbId, CACHE_KEY, PENDING_KEY, toast, kardexRegistrado]);

  // ── File uploads ──────────────────────────────────────────────────────────────
  const triggerUpload = (cat: string) => {
    pendingCatRef.current = cat;
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const cat  = pendingCatRef.current;
    if (!file || !cat) return;
    e.target.value = '';
    pendingCatRef.current = null;
    if (!navigator.onLine) { toast.offline('Sin conexión'); return; }
    try {
      const updated = await ordenesVentaService.uploadExportacionFile(orden.dbId, cat, file);
      setFilesMap(prev => ({ ...prev, [cat]: updated }));
    } catch { toast.error('Error al subir archivo'); }
  };

  const handleDeleteFile = async (cat: string, filename: string) => {
    if (!navigator.onLine) { toast.offline('Sin conexión'); return; }
    try {
      const updated = await ordenesVentaService.deleteExportacionFile(orden.dbId, cat, filename);
      setFilesMap(prev => ({ ...prev, [cat]: updated }));
    } catch { toast.error('Error al eliminar'); }
  };

  const getFiles = (cat: string): UploadedEntry[] => filesMap[cat] ?? [];

  const totalCostsCierre = [costoTransporteAlmacen, costoComisionAgente, costoAlmacenPortuario, costoCertificados, costoFlete, costoSeguro]
    .reduce((s, v) => s + (parseFloat(v) || 0), 0);

  // File attachment block (rendered inline, no hooks)
  const renderFileBlock = (cat: string, label: string) => {
    const files = getFiles(cat);
    return (
      <div>
        {fieldLabel(label)}
        <button type="button" disabled={offline}
          onClick={() => triggerUpload(cat)}
          className="w-full flex items-center justify-center gap-2 border-2 border-dashed rounded-xl py-2 text-xs font-semibold transition-colors disabled:opacity-50"
          style={{ borderColor: offline ? '#D1D5DB' : BD, color: offline ? '#9CA3AF' : '#6B7280' }}>
          {offline ? <><WifiOff size={12}/> Sin conexión</> : <><Upload size={12}/> Adjuntar</>}
        </button>
        {files.length > 0 && (
          <div className="mt-1.5 flex flex-col gap-1">
            {files.map((f, i) => (
              <div key={i} className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs min-w-0" style={{ backgroundColor: `${CP}08` }}>
                <FileText size={12} style={{ color: CP, flexShrink: 0 }} />
                <a href={`/uploads/exportacion/${orden.dbId}/${cat}/${f.file}`} target="_blank" rel="noopener noreferrer"
                  className="flex-1 truncate font-medium hover:underline min-w-0" style={{ color: TX }}>{f.name}</a>
                <button type="button" onClick={() => handleDeleteFile(cat, f.file)} className="shrink-0 hover:opacity-70">
                  <Trash2 size={12} className="text-red-400" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.38)', backdropFilter: 'blur(12px) saturate(0.75)' }}
      onClick={e => !saving && e.target === e.currentTarget && onClose()}
    >
      <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileChange}
        accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg" />

      <div
        className="relative w-full sm:max-w-5xl rounded-t-3xl sm:rounded-3xl flex flex-col overflow-hidden"
        style={{ background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(28px) saturate(1.4)', WebkitBackdropFilter: 'blur(28px) saturate(1.4)', border: '1px solid rgba(255,255,255,0.6)', boxShadow: '0 24px 60px rgba(0,0,0,0.22)', maxHeight: '92dvh' }}
      >
        <ModalLoadingOverlay show={saving || loading} message={loading ? 'Cargando…' : 'Guardando…'} />

        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-5 py-3 sm:py-4 border-b shrink-0" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: CP }}>
              <Ship size={14} className="text-white" />
            </div>
            <div className="min-w-0">
              <p className="font-black text-xs sm:text-sm uppercase tracking-wide" style={{ color: TX }}>Exportación</p>
              <p className="text-[0.6rem] text-gray-400 truncate">{codExport || orden.id} · {orden.cliente}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
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

        {/* Content */}
        <div className="overflow-y-auto flex-1 px-4 sm:px-5 py-4 sm:py-5">

          {/* ── PLAN DE EXPORTACIÓN ── */}
          {activeTab === 'plan' && (
            <div className="space-y-6">
              {/* Fechas */}
              <div>
                <p className="text-[0.65rem] font-black uppercase tracking-widest mb-3" style={{ color: TX }}>Fechas</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    {fieldLabel('Fecha cut off')}
                    <div className="relative">
                      <input type="date" value={fechaCutoff} onChange={e => setFechaCutoff(e.target.value)} className={INP} style={inpStyle} />
                      <Calendar size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    {fieldLabel('Fecha salida nave')}
                    <div className="relative">
                      <input type="date" value={fechaSalidaNave} onChange={e => setFechaSalidaNave(e.target.value)} className={INP} style={inpStyle} />
                      <Calendar size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    {fieldLabel('Fecha fitosanitario')}
                    <div className="relative">
                      <input type="date" value={fechaFitosanitario} onChange={e => setFechaFitosanitario(e.target.value)} className={INP} style={inpStyle} />
                      <Calendar size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    {fieldLabel('Fecha entrega carga')}
                    <div className="relative">
                      <input type="date" value={fechaEntregaCarga} onChange={e => setFechaEntregaCarga(e.target.value)} className={INP} style={inpStyle} />
                      <Calendar size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Agentes y logística */}
              <div>
                <p className="text-[0.65rem] font-black uppercase tracking-widest mb-3" style={{ color: TX }}>Agentes y Logística</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    {fieldLabel('Agente de aduanas')}
                    <input value={agenteAduanasPlan} onChange={e => setAgenteAduanasPlan(e.target.value)} className={INP} style={inpStyle} placeholder="Nombre del agente de aduanas…" />
                  </div>
                  <div>
                    {fieldLabel('Agente de carga')}
                    <input value={agenteCarga} onChange={e => setAgenteCarga(e.target.value)} className={INP} style={inpStyle} placeholder="Nombre del agente de carga…" />
                  </div>
                  <div>
                    {fieldLabel('Naviera')}
                    <input value={navieraPlan} onChange={e => setNavieraPlan(e.target.value)} className={INP} style={inpStyle} placeholder="Maersk, MSC, CMA CGM…" />
                  </div>
                  <div>
                    {fieldLabel('Puerto de exportación')}
                    <input value={puertoExportacion} onChange={e => setPuertoExportacion(e.target.value)} className={INP} style={inpStyle} placeholder="Callao, Paita…" />
                  </div>
                  <div className="sm:col-span-2">
                    {fieldLabel('Num booking')}
                    <input value={numBooking} onChange={e => setNumBooking(e.target.value)} className={INP} style={inpStyle} placeholder="Número de booking…" />
                  </div>
                </div>
              </div>

              {/* Carga */}
              <div>
                <p className="text-[0.65rem] font-black uppercase tracking-widest mb-3" style={{ color: TX }}>Carga</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    {fieldLabel('Valor de productos')}
                    <input type="number" min={0} step="0.01" value={valorProductos} onChange={e => setValorProductos(e.target.value)} className={INP} style={inpStyle} placeholder="0.00" />
                  </div>
                  <div>
                    {fieldLabel('Peso total')}
                    <input type="number" min={0} step="0.01" value={pesoTotalPlan} onChange={e => setPesoTotalPlan(e.target.value)} className={INP} style={inpStyle} placeholder="0.00" />
                  </div>
                  <div>
                    {fieldLabel('Cantidad de paletas')}
                    <input type="number" min={0} value={cantidadPaletasPlan} onChange={e => setCantidadPaletasPlan(e.target.value)} className={INP} style={inpStyle} placeholder="0" />
                  </div>
                  <div className="flex flex-col gap-2.5">
                    <div className="flex items-center gap-3 rounded-xl px-4 py-3 border cursor-pointer" style={{ borderColor: BD }} onClick={() => setFullContainer(v => !v)}>
                      <CheckboxUI checked={fullContainer} onChange={() => {}} />
                      <span className="text-sm" style={{ color: TX }}>Full container</span>
                    </div>
                    <div className="flex items-center gap-3 rounded-xl px-4 py-3 border cursor-pointer" style={{ borderColor: BD }} onClick={() => setDeshumedecedores(v => !v)}>
                      <CheckboxUI checked={deshumedecedores} onChange={() => {}} />
                      <span className="text-sm" style={{ color: TX }}>Deshumedecedores</span>
                    </div>
                    <div className="flex items-center gap-3 rounded-xl px-4 py-3 border cursor-pointer" style={{ borderColor: BD }} onClick={() => setControlTemperatura(v => !v)}>
                      <CheckboxUI checked={controlTemperatura} onChange={() => {}} />
                      <span className="text-sm" style={{ color: TX }}>Control de temperatura</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Documentos */}
              <div>
                <p className="text-[0.65rem] font-black uppercase tracking-widest mb-3" style={{ color: TX }}>Documentos</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {renderFileBlock('booking', 'Documento booking')}
                  {renderFileBlock('instruccion_embarque', 'Instrucción de embarque')}
                  {renderFileBlock('costeo_operacion', 'Costeo operación')}
                </div>
              </div>
            </div>
          )}

          {/* ── DESPACHO ADUANERO ── */}
          {activeTab === 'despacho' && (
            <div className="space-y-6">
              {/* Tabla de lotes */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[0.65rem] font-black uppercase tracking-widest" style={{ color: TX }}>Detalle de carga exportada</p>
                  {lotesConPrecio.length > 0 && (
                    <button type="button" onClick={generatePackingListPDF}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[0.65rem] font-black uppercase tracking-wide text-white hover:opacity-90 transition-all"
                      style={{ backgroundColor: CP }}>
                      <Download size={11} /> Packing List
                    </button>
                  )}
                </div>
                {loadingLotes ? (
                  <div className="flex items-center justify-center py-10 text-gray-400 text-xs gap-2">
                    <div className="w-4 h-4 border-2 rounded-full animate-spin" style={{ borderColor: `${CP}40`, borderTopColor: CP }} />
                    Cargando lotes…
                  </div>
                ) : lotesConPrecio.length === 0 ? (
                  <div className="flex items-center justify-center py-10 rounded-xl border border-dashed text-gray-400 text-xs gap-2" style={{ borderColor: BD }}>
                    <Package size={15} className="opacity-40" />
                    No hay lotes asignados. Completa Alistado → Asignación de Lotes primero.
                  </div>
                ) : (
                  <div className="rounded-2xl border overflow-hidden" style={{ borderColor: '#B8DDB8' }}>
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[950px] text-xs">
                        <thead>
                          <tr style={{ backgroundColor: '#4E644E' }}>
                            {['CÓDIGO LOTE','SKU','TIPO PRODUCTO','HS','KILOS','TIPO EMPAQUE','SACOS','FITO','N° PALETA','COLOR EMPAQUE'].map(h => (
                              <th key={h} className="px-3 py-2.5 text-left font-black uppercase tracking-wide whitespace-nowrap text-white" style={{ fontSize: '0.6rem' }}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {lotesConPrecio.map((lote, i) => (
                            <tr key={lote.key} className="border-t" style={{ borderColor: '#E8F3E8', backgroundColor: i % 2 === 0 ? '#fff' : BG }}>
                              <td className="px-3 py-2 font-mono font-semibold text-[0.65rem]" style={{ color: '#4E644E' }}>{lote.codigo}</td>
                              <td className="px-3 py-2">
                                {lote.sku
                                  ? <span className="px-2 py-0.5 rounded-full text-[0.58rem] font-bold bg-green-50 text-green-700">{lote.sku}</span>
                                  : <span className="text-gray-400">—</span>}
                              </td>
                              <td className="px-3 py-2">
                                <input value={lote.tipoProducto}
                                  onChange={e => setLotesConPrecio(prev => prev.map(l => l.key === lote.key ? { ...l, tipoProducto: e.target.value } : l))}
                                  className="w-28 border rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-green-600 bg-white" style={{ borderColor: '#B8DDB8' }} placeholder="—" />
                              </td>
                              <td className="px-3 py-2 text-center">
                                {lote.codigoHS
                                  ? <span className="px-2 py-0.5 rounded-full text-[0.58rem] font-black bg-amber-50 text-amber-700">{lote.codigoHS}</span>
                                  : <span className="text-gray-400 text-[0.6rem]">—</span>}
                              </td>
                              <td className="px-3 py-2 font-semibold tabular-nums" style={{ color: '#4E644E' }}>{Number(lote.cantidadKg).toFixed(2)}</td>
                              <td className="px-3 py-2">
                                <input value={lote.tipoEmpaque}
                                  onChange={e => setLotesConPrecio(prev => prev.map(l => l.key === lote.key ? { ...l, tipoEmpaque: e.target.value } : l))}
                                  className="w-24 border rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-green-600 bg-white" style={{ borderColor: '#B8DDB8' }} placeholder="—" />
                              </td>
                              <td className="px-3 py-2">
                                <input type="number" min={0} value={lote.nroSacos ?? ''}
                                  onChange={e => setLotesConPrecio(prev => prev.map(l => l.key === lote.key ? { ...l, nroSacos: e.target.value === '' ? null : Number(e.target.value) } : l))}
                                  className="w-16 border rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-green-600 bg-white" style={{ borderColor: '#B8DDB8' }} placeholder="0" />
                              </td>
                              <td className="px-3 py-2 text-center">
                                <CheckboxUI checked={lote.fito}
                                  onChange={() => setLotesConPrecio(prev => prev.map(l => l.key === lote.key ? { ...l, fito: !l.fito } : l))} />
                              </td>
                              <td className="px-3 py-2">
                                <input type="number" min={0} value={lote.paleta ?? ''}
                                  onChange={e => setLotesConPrecio(prev => prev.map(l => l.key === lote.key ? { ...l, paleta: e.target.value === '' ? null : Number(e.target.value) } : l))}
                                  className="w-16 border rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-green-600 bg-white" style={{ borderColor: '#B8DDB8' }} placeholder="0" />
                              </td>
                              <td className="px-3 py-2">
                                <input value={lote.colorEmpaque}
                                  onChange={e => setLotesConPrecio(prev => prev.map(l => l.key === lote.key ? { ...l, colorEmpaque: e.target.value } : l))}
                                  className="w-20 border rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-green-600 bg-white" style={{ borderColor: '#B8DDB8' }} placeholder="—" />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr style={{ backgroundColor: '#E6EDE6' }}>
                            <td colSpan={4} className="px-3 py-2 font-black text-[0.65rem] uppercase tracking-wide" style={{ color: '#4E644E' }}>TOTAL</td>
                            <td className="px-3 py-2 font-black tabular-nums text-xs" style={{ color: '#4E644E' }}>{lotesConPrecio.reduce((s, l) => s + l.cantidadKg, 0).toFixed(2)}</td>
                            <td />
                            <td className="px-3 py-2 font-black tabular-nums" style={{ color: '#4E644E' }}>{lotesConPrecio.reduce((s, l) => s + (l.nroSacos ?? 0), 0)}</td>
                            <td />
                            <td className="px-3 py-2 font-black tabular-nums" style={{ color: '#4E644E' }}>{lotesConPrecio.reduce((s, l) => s + (l.paleta ?? 0), 0)}</td>
                            <td />
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                )}
              </div>

              {/* Archivos adjuntos */}
              <div>
                <p className="text-[0.65rem] font-black uppercase tracking-widest mb-3" style={{ color: TX }}>Archivos adjuntos</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {renderFileBlock('ticket_balanza', 'Ticket de balanza')}
                  {renderFileBlock('ficha_ingreso', 'Ficha de ingreso')}
                  {renderFileBlock('detalle_paletizado', 'Detalle Paletizado')}
                  {renderFileBlock('inspeccion_sanitaria', 'Inspección sanitaria')}
                </div>
              </div>

              {/* Datos generales */}
              <div>
                <p className="text-[0.65rem] font-black uppercase tracking-widest mb-3" style={{ color: TX }}>Datos generales</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    {fieldLabel('Fecha ingreso de carga')}
                    <div className="relative">
                      <input type="date" value={fechaIngresoCarga} onChange={e => setFechaIngresoCarga(e.target.value)} className={INP} style={inpStyle} />
                      <Calendar size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    {fieldLabel('Fecha de Senasa')}
                    <div className="relative">
                      <input type="date" value={fechaSenasa} onChange={e => setFechaSenasa(e.target.value)} className={INP} style={inpStyle} />
                      <Calendar size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                  <div>{fieldLabel('Cantidad de pallets')} <input type="number" min={0} value={cantidadPallets} onChange={e => setCantidadPallets(e.target.value)} className={INP} style={inpStyle} placeholder="0" /></div>
                  <div>{fieldLabel('Cantidad de paquetes')} <input type="number" min={0} value={cantidadPaquetes} onChange={e => setCantidadPaquetes(e.target.value)} className={INP} style={inpStyle} placeholder="0" /></div>
                  <div>{fieldLabel('Peso bruto')} <input type="number" min={0} step="0.01" value={pesoBruto} onChange={e => setPesoBruto(e.target.value)} className={INP} style={inpStyle} placeholder="0.00" /></div>
                </div>
              </div>
            </div>
          )}

          {/* ── CIERRE DE EXPORTACIÓN ── */}
          {activeTab === 'cierre' && (
            <div className="space-y-6">
              {/* Costos */}
              <div>
                <p className="text-[0.65rem] font-black uppercase tracking-widest mb-3" style={{ color: TX }}>Costos</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>{fieldLabel('Costo transporte a almacén puerto')} <input type="number" min={0} step="0.01" value={costoTransporteAlmacen} onChange={e => setCostoTransporteAlmacen(e.target.value)} className={INP} style={inpStyle} placeholder="0.00" /></div>
                  <div>{fieldLabel('Costo comisión agente')} <input type="number" min={0} step="0.01" value={costoComisionAgente} onChange={e => setCostoComisionAgente(e.target.value)} className={INP} style={inpStyle} placeholder="0.00" /></div>
                  <div>{fieldLabel('Costo almacén portuario')} <input type="number" min={0} step="0.01" value={costoAlmacenPortuario} onChange={e => setCostoAlmacenPortuario(e.target.value)} className={INP} style={inpStyle} placeholder="0.00" /></div>
                  <div>{fieldLabel('Costo certificados')} <input type="number" min={0} step="0.01" value={costoCertificados} onChange={e => setCostoCertificados(e.target.value)} className={INP} style={inpStyle} placeholder="0.00" /></div>
                  <div>{fieldLabel('Costo flete')} <input type="number" min={0} step="0.01" value={costoFlete} onChange={e => setCostoFlete(e.target.value)} className={INP} style={inpStyle} placeholder="0.00" /></div>
                  <div>{fieldLabel('Costo seguro')} <input type="number" min={0} step="0.01" value={costoSeguro} onChange={e => setCostoSeguro(e.target.value)} className={INP} style={inpStyle} placeholder="0.00" /></div>
                  {totalCostsCierre > 0 && (
                    <div className="sm:col-span-2 rounded-xl px-4 py-3 flex items-center justify-between" style={{ backgroundColor: `${CP}12` }}>
                      <span className="text-[0.65rem] font-bold uppercase tracking-wide" style={{ color: CP }}>Total costos:</span>
                      <span className="font-black text-base" style={{ color: CP }}>USD {totalCostsCierre.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Datos de embarque */}
              <div>
                <p className="text-[0.65rem] font-black uppercase tracking-widest mb-3" style={{ color: TX }}>Datos de embarque</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>{fieldLabel('Peso total')} <input type="number" min={0} step="0.01" value={pesoTotalCierre} onChange={e => setPesoTotalCierre(e.target.value)} className={INP} style={inpStyle} placeholder="0.00" /></div>
                  <div>{fieldLabel('Número de contenedor')} <input value={contenedor} onChange={e => setContenedor(e.target.value)} className={INP} style={inpStyle} placeholder="MAEU1234567" /></div>
                  <div>{fieldLabel('Número de precinto')} <input value={nroPrecinto} onChange={e => setNroPrecinto(e.target.value)} className={INP} style={inpStyle} placeholder="PR-2026-001" /></div>
                  <div>{fieldLabel('Guía de remisión')} <input value={guiaRemisionCierre} onChange={e => setGuiaRemisionCierre(e.target.value)} className={INP} style={inpStyle} placeholder="GR-2026-001" /></div>
                  <div className="sm:col-span-2">{fieldLabel('Factura SUNAT')} <input value={facturaSupanat} onChange={e => setFacturaSupanat(e.target.value)} className={INP} style={inpStyle} placeholder="F001-00001" /></div>
                </div>
              </div>

              {/* Documentos numerados */}
              <div>
                <p className="text-[0.65rem] font-black uppercase tracking-widest mb-3" style={{ color: TX }}>Documentos</p>
                <div className="space-y-3">
                  {([
                    ['nroBl',        setNroBl,        'Número de BL',          nroBl,        'bl_doc',          'BL (documento)'],
                    ['nroDua',       setNroDua,       'DUA',                   nroDua,       'dua_doc',         'DUA (documento)'],
                    ['avisoSalida',  setAvisoSalida,  'Aviso de salida',       avisoSalida,  'aviso_salida_doc','Aviso de salida (doc)'],
                    ['nroCertFito',  setNroCertFito,  'Cert. Fitosanitario N°',nroCertFito,  'cert_fito_doc',   'Cert. Fitosanitario (doc)'],
                    ['nroCertOrigen',setNroCertOrigen,'Cert. Origen N°',       nroCertOrigen,'cert_origen_doc', 'Cert. Origen (doc)'],
                  ] as [string, React.Dispatch<React.SetStateAction<string>>, string, string, string, string][]).map(([_key, setter, label, val, cat, catLabel]) => (
                    <div key={_key} className="grid grid-cols-2 gap-3">
                      <div>
                        {fieldLabel(label)}
                        <input value={val} onChange={e => setter(e.target.value)} className={INP} style={inpStyle} placeholder="N°…" />
                      </div>
                      {renderFileBlock(cat, catLabel)}
                    </div>
                  ))}
                  <div className="grid grid-cols-2 gap-3">
                    {renderFileBlock('balance_costos', 'Balance de costos')}
                    {renderFileBlock('dam_doc', 'DAM rectificada')}
                  </div>
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
