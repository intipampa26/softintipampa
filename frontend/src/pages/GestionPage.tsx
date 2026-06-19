import { useState, useMemo, useEffect, useCallback } from 'react';
import LoadingLogo from '../components/LoadingLogo';
import {
  Search, Plus, Pencil, Trash2, Package, Ship, FileText,
  ChevronRight, X, Calendar, User, Hash,
  Clock, CheckCheck, Circle, Filter, BarChart3, TrendingUp,
  MapPin, Weight,
} from 'lucide-react';
import { PreventaModal }        from '../components/PreventaModal';
import { AlistadoModal }        from '../components/AlistadoModal';
import { ExportacionModal } from '../components/ExportacionModal';
import { PostVentaModal }  from '../components/PostVentaModal';
import { clientesService, Cliente }     from '../services/clientes.service';
import { lotesFinalesService, LoteFinal } from '../services/lotes-finales.service';
import { lotesService }                   from '../services/lotes.service';
import { campanasService, Campana }      from '../services/campanas.service';
import { ordenesVentaService, mapEstadoToEtapa } from '../services/ordenes-venta.service';

const CP  = '#445D46';
const CS  = '#5F7A61';
const CL  = '#8BA989';
const BG  = '#F7F8F7';
const BD  = '#D9DDD8';
const TX  = '#2C2C2C';

type EstadoOrden = 'pre_venta' | 'alistado' | 'exportacion' | 'post_venta';
type EstadoPaso  = 'completado' | 'en_proceso' | 'pendiente';

interface OrdenVenta {
  dbId:         number;
  id:           string;
  cliente:      string;
  productor:    string;
  campana:      string;
  fecha:        string;
  estado:       EstadoOrden;
  lote:         string;
  cantidadKg:   number;
  destino:      string;
  tipoProducto: string;
  montoUSD:     number;
}

interface PasoTimeline {
  label: string;
  fecha: string;
  hora: string;
  responsable: string;
  estado: EstadoPaso;
}

const ESTADO_CFG: Record<EstadoOrden, { label: string; badge: string; dot: string }> = {
  pre_venta:   { label: 'Pre Venta',   badge: 'bg-amber-50  text-amber-700  border-amber-200',   dot: 'bg-amber-400'  },
  alistado:    { label: 'Alistado',    badge: 'bg-sky-50    text-sky-700    border-sky-200',      dot: 'bg-sky-400'    },
  exportacion: { label: 'Exportación', badge: 'bg-violet-50 text-violet-700 border-violet-200',  dot: 'bg-violet-400' },
  post_venta:  { label: 'Post Venta',  badge: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-400' },
};

const FLOW_STEPS: { key: EstadoOrden; label: string; short: string }[] = [
  { key: 'pre_venta',   label: 'Pre Venta',   short: 'Preventa'   },
  { key: 'alistado',    label: 'Alistado',    short: 'Alistado'   },
  { key: 'exportacion', label: 'Exportación', short: 'Exportac.'  },
  { key: 'post_venta',  label: 'Post Venta',  short: 'Post Venta' },
];

function FlowProgress({ estado, onStageClick }: { estado: EstadoOrden; onStageClick?: (stage: EstadoOrden) => void }) {
  const activeIdx = FLOW_STEPS.findIndex(s => s.key === estado);
  return (
    <div className="px-4 py-3 border-t" style={{ borderColor: BG }}>
      <div className="flex items-center">
        {FLOW_STEPS.map((step, i) => {
          const done    = i < activeIdx;
          const active  = i === activeIdx;
          const pending = i > activeIdx;
          const clickable = true;
          return (
            <div key={step.key} className="flex items-center flex-1 min-w-0">
              <div className="flex flex-col items-center flex-1 min-w-0">
                <button
                  type="button"
                  onClick={e => { e.stopPropagation(); if (clickable) onStageClick?.(step.key); }}
                  className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 transition-all ${clickable ? 'hover:scale-125 cursor-pointer' : 'cursor-default'}`}
                  style={{
                    backgroundColor: done ? CP : active ? CP : '#E5E7EB',
                    border:     active ? `2px solid ${CP}` : done ? 'none' : '2px solid #D1D5DB',
                    boxShadow:  active ? `0 0 0 3px ${CP}25` : 'none',
                  }}
                  title={clickable ? `Ver ${step.label}` : undefined}
                >
                  {done && (
                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                      <path d="M1.5 4L3 5.5L6.5 2.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                  {active && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </button>
                <span
                  className="text-[0.5rem] font-semibold mt-1 text-center leading-tight truncate w-full"
                  style={{ color: pending ? '#9CA3AF' : CP }}
                >
                  {step.short}
                </span>
              </div>
              {i < FLOW_STEPS.length - 1 && (
                <div className="h-px flex-1 mx-0.5 mb-3" style={{ backgroundColor: done ? CP : '#E5E7EB' }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const PASOS = [
  'Registrado', 'Por subir documento', 'Recepcionado',
  'Verificado', 'Convalidado', 'Procesado', 'Pagado', 'Resolución',
];

const RESPONSABLES = ['ops.garcia', 'ops.quispe', 'supervisor', 'adm.torres', 'aduanas.peru'];
const HORAS = ['08:15', '09:30', '10:45', '11:00', '13:20', '14:35', '15:50', '16:10'];
const FECHAS_BASE = [
  '03/01/2026','06/01/2026','09/01/2026','12/01/2026',
  '15/01/2026','20/01/2026','24/01/2026','28/01/2026',
];

function buildTimeline(completados: number): PasoTimeline[] {
  return PASOS.map((label, i) => ({
    label,
    fecha:       i < completados ? FECHAS_BASE[i] : i === completados ? FECHAS_BASE[i] ?? '' : '',
    hora:        i <= completados ? HORAS[i] : '',
    responsable: i <= completados ? RESPONSABLES[i % RESPONSABLES.length] : '',
    estado:      i < completados ? 'completado' : i === completados ? 'en_proceso' : 'pendiente',
  }));
}

const TIMELINES: Record<string, PasoTimeline[]> = {};

const INP = `w-full border rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 transition-all duration-200`;
const inpStyle = { borderColor: BD, color: TX };

function StatChip({ label, value, icon, accent }: { label: string; value: string | number; icon: React.ReactNode; accent?: string }) {
  return (
    <div className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3 border shadow-sm" style={{ borderColor: BD }}>
      <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: accent ?? `${CP}18` }}>
        {icon}
      </div>
      <div>
        <p className="text-[0.62rem] font-semibold uppercase tracking-wide text-gray-400">{label}</p>
        <p className="text-sm font-black leading-none mt-0.5" style={{ color: TX }}>{value}</p>
      </div>
    </div>
  );
}

function StatusBadge({ estado }: { estado: EstadoOrden }) {
  const cfg = ESTADO_CFG[estado];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[0.65rem] font-bold border ${cfg.badge}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

type StageKey = 'preventa' | 'alistado' | 'exportacion' | 'post_venta';

interface CardProps {
  orden: OrdenVenta;
  active: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onFlow: (stage: StageKey, tab?: string) => void;
  onStageClick: (stage: EstadoOrden) => void;
}

function OrderCard({ orden, active, onSelect, onEdit, onDelete, onFlow, onStageClick }: CardProps) {
  return (
    <div
      className="group relative bg-white rounded-2xl border flex flex-col overflow-hidden transition-all duration-200 hover:-translate-y-0.5"
      style={{
        borderColor: active ? CP : BD,
        boxShadow: active
          ? `0 0 0 2px ${CP}40, 0 4px 20px ${CP}20`
          : '0 1px 4px rgba(0,0,0,0.06)',
      }}
    >
      
      {active && (
        <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl" style={{ backgroundColor: CP }} />
      )}

      
      <div className="px-4 pt-4 pb-3 flex items-start justify-between gap-2">
        <div>
          <p className="font-black text-xs uppercase tracking-widest" style={{ color: CP }}>{orden.id}</p>
          <p className="text-[0.65rem] text-gray-400 mt-0.5 font-medium">{orden.tipoProducto}</p>
        </div>
        <StatusBadge estado={orden.estado} />
      </div>

      <div className="w-full h-px" style={{ backgroundColor: BG }} />

      
      <div className="px-4 py-3 flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <User size={11} className="shrink-0" style={{ color: CL }} />
          <span className="text-xs font-semibold truncate" style={{ color: TX }}>{orden.cliente}</span>
        </div>
        <div className="flex items-center gap-2">
          <User size={11} className="shrink-0 opacity-60" style={{ color: CL }} />
          <span className="text-[0.65rem] truncate text-gray-500">{orden.productor}</span>
        </div>
        <div className="flex items-center gap-2">
          <BarChart3 size={11} className="shrink-0" style={{ color: CL }} />
          <span className="text-[0.65rem] text-gray-500 truncate">{orden.campana}</span>
        </div>
        <div className="flex items-center gap-2">
          <Hash size={11} className="shrink-0" style={{ color: CL }} />
          <span className="text-[0.65rem] font-mono text-gray-500">{orden.lote}</span>
        </div>
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5">
            <Calendar size={10} style={{ color: CL }} />
            <span className="text-[0.62rem] text-gray-400">{orden.fecha}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Weight size={10} style={{ color: CL }} />
            <span className="text-[0.65rem] font-bold" style={{ color: TX }}>{orden.cantidadKg.toLocaleString()} kg</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <MapPin size={10} style={{ color: CL }} />
          <span className="text-[0.62rem] text-gray-400">{orden.destino}</span>
          <span className="ml-auto text-[0.62rem] font-semibold text-emerald-600">USD {orden.montoUSD.toLocaleString()}</span>
        </div>
      </div>

      <FlowProgress estado={orden.estado} onStageClick={onStageClick} />

      <div className="px-4 py-2.5 border-t flex items-center justify-between" style={{ borderColor: BG, backgroundColor: BG }}>
        <button
          onClick={(e) => { e.stopPropagation(); onSelect(); }}
          className="flex items-center gap-1 text-[0.62rem] font-semibold transition-colors hover:underline"
          style={{ color: CS }}
        >
          Ver timeline <ChevronRight size={9} />
        </button>
        <div className="flex items-center gap-1">
          <button onClick={(e) => { e.stopPropagation(); onEdit(); }}
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:scale-105"
            style={{ backgroundColor: '#e8f5e9', color: CP }} title="Editar">
            <Pencil size={11} />
          </button>
          <button onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:scale-105"
            style={{ backgroundColor: '#fdecea', color: '#c62828' }} title="Eliminar">
            <Trash2 size={11} />
          </button>
        </div>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border overflow-hidden animate-pulse" style={{ borderColor: BD }}>
      <div className="px-4 pt-4 pb-3 flex justify-between">
        <div className="space-y-1.5"><div className="h-3 w-24 bg-gray-100 rounded" /><div className="h-2 w-16 bg-gray-100 rounded" /></div>
        <div className="h-5 w-20 bg-gray-100 rounded-full" />
      </div>
      <div className="px-4 py-3 space-y-2">
        {[85, 65, 55, 45, 70].map(w => <div key={w} className="h-2.5 bg-gray-100 rounded" style={{ width: `${w}%` }} />)}
      </div>
      <div className="px-4 py-2.5 border-t flex justify-between" style={{ borderColor: BG, backgroundColor: BG }}>
        <div className="h-2.5 w-16 bg-gray-100 rounded" />
        <div className="flex gap-1"><div className="w-7 h-7 bg-gray-100 rounded-lg" /><div className="w-7 h-7 bg-gray-100 rounded-lg" /></div>
      </div>
    </div>
  );
}

function EmptyState({ onNueva }: { onNueva: () => void }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: `${CP}12` }}>
        <Package size={28} style={{ color: CP }} />
      </div>
      <p className="font-black text-base uppercase tracking-wide mb-1" style={{ color: TX }}>Sin órdenes</p>
      <p className="text-sm text-gray-400 mb-5">No hay órdenes que coincidan con los filtros.</p>
      <button
        onClick={onNueva}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
        style={{ backgroundColor: CP }}
      >
        <Plus size={14} /> Agregar primera orden
      </button>
    </div>
  );
}

function TimelineStep({ paso, index, isLast }: { paso: PasoTimeline; index: number; isLast: boolean }) {
  const done    = paso.estado === 'completado';
  const active  = paso.estado === 'en_proceso';
  const pending = paso.estado === 'pendiente';

  const cardBg     = done ? CP : active ? CS : '#F3F4F6';
  const cardText   = done || active ? '#fff' : '#9CA3AF';
  const borderCol  = done ? CP : active ? CS : BD;
  const circleCol  = done ? CP : active ? CS : '#fff';
  const circleBrd  = done ? CP : active ? CS : BD;

  const Icon = done ? CheckCheck : active ? Clock : Circle;

  return (
    <div className="flex flex-col items-center shrink-0" style={{ width: 120 }}>
      
      <div
        className="w-full rounded-xl p-2.5 text-center border transition-all duration-200 shadow-sm"
        style={{ backgroundColor: cardBg, borderColor: borderCol, color: cardText }}
      >
        <p className="text-[0.58rem] font-black uppercase tracking-wide leading-tight mb-2">{paso.label}</p>
        {!pending ? (
          <>
            <div className="flex items-center justify-center gap-0.5 mb-0.5">
              <Calendar size={8} style={{ color: cardText, opacity: 0.75 }} />
              <span className="text-[0.52rem] font-semibold opacity-90">{paso.fecha}</span>
            </div>
            <div className="flex items-center justify-center gap-0.5 mb-0.5">
              <Clock size={8} style={{ color: cardText, opacity: 0.75 }} />
              <span className="text-[0.52rem] opacity-85">{paso.hora}</span>
            </div>
            <div className="flex items-center justify-center gap-0.5">
              <User size={8} style={{ color: cardText, opacity: 0.75 }} />
              <span className="text-[0.52rem] opacity-80 truncate max-w-[80px]">{paso.responsable}</span>
            </div>
          </>
        ) : (
          <p className="text-[0.52rem] opacity-50">Pendiente</p>
        )}
      </div>

      
      <div className="flex items-center w-full mt-2.5">
        <div className="flex-1 h-px" style={{ backgroundColor: index === 0 ? 'transparent' : done ? CP : BD }} />
        <div
          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${active ? 'ring-4 ring-green-200' : ''}`}
          style={{
            backgroundColor: circleCol,
            borderColor:     circleBrd,
          }}
        >
          <Icon size={10} className={done || active ? 'text-white' : 'text-gray-300'} />
        </div>
        <div className="flex-1 h-px" style={{ backgroundColor: isLast ? 'transparent' : done ? CP : BD }} />
      </div>

      <p className="text-[0.52rem] font-bold mt-1" style={{ color: done ? CP : active ? CS : '#9CA3AF' }}>
        {String(index + 1).padStart(2, '0')}
      </p>
    </div>
  );
}

function ProcessTimelineModal({ orden, onClose }: { orden: OrdenVenta; onClose: () => void }) {
  const timeline    = TIMELINES[orden.id] ?? buildTimeline(0);
  const completadas = timeline.filter(p => p.estado === 'completado').length;
  const pct         = Math.round((completadas / timeline.length) * 100);

  return (
    <div
      className="fixed inset-0 z-40 flex items-end sm:items-center justify-center p-0 sm:p-6"
      style={{ backgroundColor: 'rgba(0,0,0,0.38)', backdropFilter: 'blur(12px) saturate(0.75)' }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full sm:max-w-5xl rounded-t-3xl sm:rounded-3xl overflow-hidden flex flex-col"
        style={{
          background:     'rgba(255,255,255,0.88)',
          backdropFilter: 'blur(28px) saturate(1.4)',
          WebkitBackdropFilter: 'blur(28px) saturate(1.4)',
          border:         '1px solid rgba(255,255,255,0.6)',
          boxShadow:      '0 24px 60px rgba(0,0,0,0.22), 0 1px 0 rgba(255,255,255,0.8) inset',
          maxHeight:      '90vh',
        }}
      >
        
        <div className="flex items-center justify-between px-5 py-4 border-b shrink-0" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: CP }}>
              <TrendingUp size={14} className="text-white" />
            </div>
            <div className="min-w-0">
              <p className="font-black text-sm uppercase tracking-wide" style={{ color: TX }}>Vida de la Solicitud</p>
              <p className="text-[0.62rem] truncate text-gray-400">
                {orden.id} · {orden.cliente} · {orden.destino}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <StatusBadge estado={orden.estado} />
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-20 h-1.5 rounded-full overflow-hidden bg-gray-200">
                <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: CP }} />
              </div>
              <span className="text-[0.65rem] font-black" style={{ color: CP }}>{pct}%</span>
            </div>
            <span className="hidden sm:inline text-[0.62rem] text-gray-400">
              {completadas}/{timeline.length} etapas
            </span>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-black/06 transition-all"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        
        <div className="overflow-x-auto px-5 py-6">
          <div className="flex gap-2 min-w-max">
            {timeline.map((paso, i) => (
              <TimelineStep key={paso.label} paso={paso} index={i} isLast={i === timeline.length - 1} />
            ))}
          </div>
        </div>

        
        <div className="px-5 py-3 border-t flex items-center justify-between" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
          <div className="flex items-center gap-2">
            <div className="w-28 h-1 rounded-full overflow-hidden bg-gray-200">
              <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: CP }} />
            </div>
            <span className="text-[0.6rem] font-medium text-gray-400">
              {completadas} de {timeline.length} etapas completadas
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-[0.65rem] font-semibold px-3 py-1.5 rounded-lg text-gray-500 hover:bg-black/05 transition-all"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

interface ModalProps { initial?: OrdenVenta | null; onClose: () => void; onSave: (d: Partial<OrdenVenta>) => Promise<void>; }

interface ProductorOption { id: number; nombre: string; display: string; }

function OrderModal({ initial, onClose, onSave }: ModalProps) {
  const [form, setForm] = useState({
    cliente:      initial?.cliente      ?? '',
    productor:    initial?.productor    ?? '',
    campana:      initial?.campana      ?? '',
    fecha:        initial?.fecha        ?? '',
    lote:         initial?.lote         ?? '',
    cantidadKg:   initial?.cantidadKg   ?? 0,
    destino:      initial?.destino      ?? '',
    tipoProducto: initial?.tipoProducto ?? '',
    montoUSD:     initial?.montoUSD     ?? 0,
    estado:       (initial?.estado      ?? 'pre_venta') as EstadoOrden,
  });
  const [clientes,          setClientes]          = useState<Cliente[]>([]);
  const [campanas,          setCampanas]          = useState<Campana[]>([]);
  const [productores,       setProductores]       = useState<ProductorOption[]>([]);
  const [lotes,             setLotes]             = useState<LoteFinal[]>([]);
  const [selectedCampanaId, setSelectedCampanaId] = useState<number | null>(null);
  const [selectedProductorId, setSelectedProductorId] = useState<number | null>(null);
  const [loadingProds,      setLoadingProds]      = useState(false);
  const [loadingLotes,      setLoadingLotes]      = useState(false);
  const [moneda,            setMoneda]            = useState<'USD' | 'PEN'>('USD');
  const [loteCantidad,      setLoteCantidad]      = useState<number | null>(null);
  const [venderTodo,        setVenderTodo]        = useState(false);
  const [saving,            setSaving]            = useState(false);
  const [error,             setError]             = useState('');

  useEffect(() => {
    clientesService.getPage(1, 200).then(r => setClientes(r.data));
    campanasService.getPage(1, 200).then(r => setCampanas(r.data));
  }, []);

  const handleCampanaChange = useCallback(async (campanaId: number, campanaNombre: string) => {
    setSelectedCampanaId(campanaId);
    setSelectedProductorId(null);
    setProductores([]);
    setLotes([]);
    setLoteCantidad(null);
    setForm(f => ({ ...f, campana: campanaNombre, productor: '', lote: '', tipoProducto: '' }));
    if (!campanaId) return;
    setLoadingProds(true);
    try {
      const res = await lotesService.getPage({ campanaId, limit: 500 });
      const seen = new Set<number>();
      const opts: ProductorOption[] = [];
      for (const l of res.data) {
        if (l.productorId && !seen.has(l.productorId)) {
          seen.add(l.productorId);
          const nombre = l.productor
            ? `${l.productor.nombre}${l.productor.apellido ? ' ' + l.productor.apellido : ''}`.trim()
            : `Productor #${l.productorId}`;
          opts.push({ id: l.productorId, nombre, display: nombre });
        }
      }
      setProductores(opts);
    } finally {
      setLoadingProds(false);
    }
  }, []);

  const handleProductorChange = useCallback(async (productorId: number, productorNombre: string) => {
    setSelectedProductorId(productorId);
    setLotes([]);
    setLoteCantidad(null);
    setForm(f => ({ ...f, productor: productorNombre, lote: '', tipoProducto: '' }));
    if (!productorId || !selectedCampanaId) return;
    setLoadingLotes(true);
    try {
      const res = await lotesFinalesService.getPage({ campanaId: selectedCampanaId, productorId, limit: 500 });
      setLotes(res.data);
    } finally {
      setLoadingLotes(false);
    }
  }, [selectedCampanaId]);

  const set = <K extends keyof typeof form>(k: K, v: typeof form[K]) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = useCallback(async () => {
    setSaving(true); setError('');
    try { await onSave(form); onClose(); }
    catch (e: any) { setError(e?.response?.data?.message ?? 'Error al guardar'); }
    finally { setSaving(false); }
  }, [form, onSave, onClose]);

  const field = (label: string, children: React.ReactNode, labelExtra?: React.ReactNode) => (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="block text-[0.65rem] font-bold uppercase tracking-wide" style={{ color: TX, opacity: 0.6 }}>{label}</label>
        {labelExtra}
      </div>
      {children}
    </div>
  );

  const inputCls = `${INP} focus:ring-green-600`;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" style={{ backgroundColor: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }} onClick={e => !saving && e.target === e.currentTarget && onClose()}>
      <div className="relative bg-white w-full sm:max-w-xl rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col" style={{ maxHeight: '92vh' }}>
        {saving && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center rounded-t-3xl sm:rounded-2xl" style={{ backgroundColor: 'rgba(255,255,255,0.93)', backdropFilter: 'blur(2px)' }}>
            <LoadingLogo compact />
            <p className="text-sm font-semibold text-gray-600 mt-3">Guardando…</p>
          </div>
        )}
        {error && <p className="mx-6 mt-4 text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">{error}</p>}

        <div className="flex items-center justify-between px-6 py-4 border-b shrink-0" style={{ borderColor: BG }}>
          <div>
            <h2 className="font-black text-base uppercase tracking-wide" style={{ color: CP }}>
              {initial ? 'Editar Orden' : 'Nueva Orden de Venta'}
            </h2>
            {initial && <p className="text-xs text-gray-400 mt-0.5">{initial.id}</p>}
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all">
            <X size={17} />
          </button>
        </div>

        
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {field('Cliente', (
              <select value={form.cliente} onChange={e => set('cliente', e.target.value)} className={inputCls} style={inpStyle}>
                <option value="">Seleccionar…</option>
                {clientes.map(c => <option key={c.id} value={c.nombre}>{c.nombre}</option>)}
              </select>
            ))}
            {field('Campaña', (
              <select
                value={selectedCampanaId ?? ''}
                onChange={e => {
                  const id = Number(e.target.value);
                  const c  = campanas.find(x => x.id === id);
                  handleCampanaChange(id, c?.nombre ?? '');
                }}
                className={inputCls}
                style={inpStyle}
              >
                <option value="">Seleccionar…</option>
                {campanas.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
              </select>
            ))}
            {field('Productor', (
              <select
                value={selectedProductorId ?? ''}
                onChange={e => {
                  const id = Number(e.target.value);
                  const p  = productores.find(x => x.id === id);
                  handleProductorChange(id, p?.display ?? '');
                }}
                className={inputCls}
                style={inpStyle}
                disabled={!selectedCampanaId || loadingProds}
              >
                <option value="">{loadingProds ? 'Cargando…' : selectedCampanaId ? 'Seleccionar…' : 'Elige una campaña primero'}</option>
                {productores.map(p => <option key={p.id} value={p.id}>{p.display}</option>)}
              </select>
            ))}
            {field('Fecha', <input type="date" value={form.fecha} onChange={e => set('fecha', e.target.value)} className={inputCls} style={inpStyle} />)}
            {field('Lote', (
              <div className="space-y-1.5">
                <select
                  value={form.lote}
                  onChange={e => {
                    const codigo = e.target.value;
                    const lf = lotes.find(l => l.codigo === codigo);
                    const newKg = lf?.cantidadKg ?? null;
                    setLoteCantidad(newKg ? Number(newKg) : null);
                    if (lf?.tipoProducto) {
                      const t    = lf.tipoProducto;
                      const tipo = t.tipo.charAt(0).toUpperCase() + t.tipo.slice(1).toLowerCase();
                      const sub  = t.subtipoSalida ? ' ' + t.subtipoSalida.charAt(0).toUpperCase() + t.subtipoSalida.slice(1).toLowerCase() : '';
                      setForm(f => ({ ...f, lote: codigo, tipoProducto: (tipo + sub).trim(), ...(venderTodo && newKg !== null ? { cantidadKg: Number(newKg) } : {}) }));
                    } else {
                      setForm(f => ({ ...f, lote: codigo, ...(venderTodo && newKg !== null ? { cantidadKg: Number(newKg) } : {}) }));
                    }
                  }}
                  className={inputCls}
                  style={inpStyle}
                  disabled={!selectedProductorId || loadingLotes}
                >
                  <option value="">{loadingLotes ? 'Cargando…' : selectedProductorId ? (lotes.length === 0 ? 'Sin lotes disponibles' : 'Seleccionar…') : 'Elige un productor primero'}</option>
                  {lotes.map(l => <option key={l.id} value={l.codigo}>{l.codigo}{l.tipoProducto ? ` · ${l.tipoProducto.tipo}` : ''}</option>)}
                </select>
                {loteCantidad !== null && (
                  <p className="text-[0.62rem] font-medium" style={{ color: '#6B7280' }}>
                    Disponible en lote: <strong style={{ color: TX }}>{loteCantidad.toLocaleString()} kg</strong>
                  </p>
                )}
              </div>
            ))}
            {field('Tipo de producto', (
              <div className="relative">
                <input
                  value={form.tipoProducto}
                  onChange={e => set('tipoProducto', e.target.value)}
                  className={inputCls}
                  style={inpStyle}
                  placeholder="Auto desde lote o escribe…"
                />
                {form.lote && form.tipoProducto && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[0.55rem] font-bold px-1.5 py-0.5 rounded" style={{ background: '#D1FAE5', color: '#065F46' }}>auto</span>
                )}
              </div>
            ))}
            {field('Cantidad (kg)', (
              <div className="space-y-1.5">
                {loteCantidad !== null && (
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={venderTodo}
                      onChange={e => {
                        const checked = e.target.checked;
                        setVenderTodo(checked);
                        if (checked && loteCantidad !== null) set('cantidadKg', loteCantidad);
                      }}
                      className="rounded border-gray-300 accent-green-700 w-3.5 h-3.5"
                    />
                    <span className="text-[0.62rem] font-semibold" style={{ color: TX }}>Vender todo el lote ({loteCantidad.toLocaleString()} kg)</span>
                  </label>
                )}
                <input
                  type="number"
                  min={0}
                  max={loteCantidad ?? undefined}
                  value={form.cantidadKg}
                  onChange={e => { setVenderTodo(false); set('cantidadKg', Number(e.target.value)); }}
                  className={inputCls}
                  style={inpStyle}
                  disabled={venderTodo}
                />
                {loteCantidad !== null && form.cantidadKg > loteCantidad && (
                  <p className="text-[0.6rem] text-red-600 font-medium">Supera los {loteCantidad.toLocaleString()} kg disponibles</p>
                )}
              </div>
            ))}
            {field('Monto', (
              <input type="number" min={0} value={form.montoUSD} onChange={e => set('montoUSD', Number(e.target.value))} className={inputCls} style={inpStyle} />
            ), (
              <div className="flex rounded-lg overflow-hidden border text-[0.6rem] font-bold" style={{ borderColor: BD }}>
                {(['USD', 'PEN'] as const).map(m => (
                  <button key={m} type="button" onClick={() => setMoneda(m)}
                    className="px-2 py-0.5 transition-colors"
                    style={{ backgroundColor: moneda === m ? CP : 'transparent', color: moneda === m ? '#fff' : TX }}>
                    {m}
                  </button>
                ))}
              </div>
            ))}
            {field('Destino', <input value={form.destino} onChange={e => set('destino', e.target.value)} className={inputCls} style={inpStyle} placeholder="País destino…" />)}
            {field('Estado', (
              <select value={form.estado} onChange={e => set('estado', e.target.value as EstadoOrden)} className={inputCls} style={inpStyle}>
                {(Object.entries(ESTADO_CFG) as [EstadoOrden, typeof ESTADO_CFG[EstadoOrden]][]).map(([k, v]) => (
                  <option key={k} value={k}>{v.label}</option>
                ))}
              </select>
            ))}
          </div>
        </div>

        
        <div className="px-6 py-4 border-t flex gap-3 shrink-0" style={{ borderColor: BG }}>
          <button onClick={onClose} disabled={saving} className="flex-1 py-2.5 rounded-xl border text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-40" style={{ borderColor: BD }}>
            Cancelar
          </button>
          <button onClick={handleSave} disabled={saving} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60" style={{ backgroundColor: CP }}>
            {saving ? 'Guardando…' : initial ? 'Guardar cambios' : 'Crear orden'}
          </button>
        </div>
      </div>
    </div>
  );
}

function DeleteConfirm({ orden, onClose, onConfirm }: { orden: OrdenVenta; onClose: () => void; onConfirm: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
        <div className="px-6 py-5 flex flex-col items-center text-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center">
            <Trash2 size={22} className="text-red-500" />
          </div>
          <div>
            <p className="font-black text-gray-800">¿Eliminar orden?</p>
            <p className="text-sm text-gray-400 mt-1">
              <span className="font-semibold text-gray-600">{orden.id}</span> · {orden.cliente} se eliminará permanentemente.
            </p>
          </div>
        </div>
        <div className="px-6 pb-5 flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors" style={{ borderColor: BD }}>
            Cancelar
          </button>
          <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors">
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}

interface FilterBarProps {
  campana: string; setCampana: (v: string) => void;
  productor: string; setProductor: (v: string) => void;
  fecha: string; setFecha: (v: string) => void;
  lote: string; setLote: (v: string) => void;
  onBuscar: () => void;
  onNueva: () => void;
  campanasOpts: string[];
  productoresOpts: string[];
}

function FilterBar({ campana, setCampana, productor, setProductor, fecha, setFecha, lote, setLote, onBuscar, onNueva, campanasOpts, productoresOpts }: FilterBarProps) {
  const selCls = `${INP} pr-8 appearance-none bg-white focus:ring-green-600`;
  const wrapCls = 'relative';

  return (
    <div className="bg-white border-b px-4 md:px-8 py-4" style={{ borderColor: BD }}>
      <div className="flex flex-col sm:flex-row flex-wrap gap-3 items-end">

        <div className={`${wrapCls} flex-1 min-w-[150px]`}>
          <label className="block text-[0.62rem] font-bold uppercase tracking-wide mb-1.5 text-gray-500">Campaña</label>
          <select value={campana} onChange={e => setCampana(e.target.value)} className={selCls} style={inpStyle}>
            <option value="">Todas las campañas</option>
            {campanasOpts.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div className={`${wrapCls} flex-1 min-w-[150px]`}>
          <label className="block text-[0.62rem] font-bold uppercase tracking-wide mb-1.5 text-gray-500">Productor</label>
          <select value={productor} onChange={e => setProductor(e.target.value)} className={selCls} style={inpStyle}>
            <option value="">Todos los productores</option>
            {productoresOpts.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>

        <div className={`${wrapCls} flex-1 min-w-[130px]`}>
          <label className="block text-[0.62rem] font-bold uppercase tracking-wide mb-1.5 text-gray-500">Fecha</label>
          <div className="relative">
            <input type="date" value={fecha} onChange={e => setFecha(e.target.value)} className={`${INP} pr-9 focus:ring-green-600`} style={inpStyle} />
            <Calendar size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div className={`${wrapCls} flex-1 min-w-[120px]`}>
          <label className="block text-[0.62rem] font-bold uppercase tracking-wide mb-1.5 text-gray-500">Lote</label>
          <div className="relative">
            <input value={lote} onChange={e => setLote(e.target.value)} onKeyDown={e => e.key === 'Enter' && onBuscar()} className={`${INP} pr-9 focus:ring-green-600`} style={inpStyle} placeholder="LF-2026-…" />
            <Hash size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <button
          onClick={onBuscar}
          className="h-[42px] w-11 shrink-0 rounded-xl border flex items-center justify-center hover:bg-gray-50 transition-colors"
          style={{ borderColor: BD, color: TX }}
          title="Buscar"
        >
          <Search size={16} />
        </button>

        <button
          onClick={onNueva}
          className="h-[42px] shrink-0 flex items-center gap-2 px-4 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-90 active:scale-[0.98] sm:whitespace-nowrap w-full sm:w-auto justify-center"
          style={{ backgroundColor: CP }}
        >
          <Plus size={15} />
          <span>Agregar Orden de Venta</span>
        </button>
      </div>
    </div>
  );
}

type ModalType = 'create' | 'edit' | 'delete' | StageKey | null;

export function GestionPage() {
  const [ordenes,        setOrdenes]        = useState<OrdenVenta[]>([]);
  const [loading,        setLoading]        = useState(true);
  const [modal,          setModal]          = useState<ModalType>(null);
  const [flowTab,        setFlowTab]        = useState<string | undefined>(undefined);
  const [selected,       setSelected]       = useState<OrdenVenta | null>(null);
  const [activeTimeline, setActiveTimeline] = useState<OrdenVenta | null>(null);
  const [showTimeline,   setShowTimeline]   = useState(false);

  const [filtroCampana,   setFiltroCampana]   = useState('');
  const [filtroProductor, setFiltroProductor] = useState('');
  const [filtroFecha,     setFiltroFecha]     = useState('');
  const [filtroLote,      setFiltroLote]      = useState('');
  const [page,            setPage]            = useState(1);

  const ITEMS_PER_PAGE = 6;

  useEffect(() => {
    loadOrdenes();
  }, []);

  async function loadOrdenes() {
    setLoading(true);
    try {
      const list = await ordenesVentaService.getAll();
      setOrdenes(list as OrdenVenta[]);
    } finally {
      setLoading(false);
    }
  }

  const displayed = useMemo(() => {
    setPage(1);
    return ordenes.filter(o => {
      if (filtroCampana   && o.campana   !== filtroCampana)                                   return false;
      if (filtroProductor && o.productor !== filtroProductor)                                 return false;
      if (filtroLote      && !o.lote.toLowerCase().includes(filtroLote.toLowerCase()))        return false;
      return true;
    });
  }, [ordenes, filtroCampana, filtroProductor, filtroLote]);

  const totalPages = Math.max(1, Math.ceil(displayed.length / ITEMS_PER_PAGE));
  const paginated  = displayed.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const campanasOpts   = useMemo(() => [...new Set(ordenes.map(o => o.campana).filter(Boolean))].sort(), [ordenes]);
  const productoresOpts = useMemo(() => [...new Set(ordenes.map(o => o.productor).filter(Boolean))].sort(), [ordenes]);

  function handleBuscar() {
    setPage(1);
  }

  async function handleSave(data: Partial<OrdenVenta>) {
    if (modal === 'edit' && selected) {
      const updated = await ordenesVentaService.update(selected.dbId, {
        cliente:      data.cliente,
        productor:    data.productor,
        campana:      data.campana,
        fecha:        data.fecha,
        lote:         data.lote,
        cantidadKg:   data.cantidadKg,
        destino:      data.destino,
        tipoProducto: data.tipoProducto,
        montoUSD:     data.montoUSD,
        etapaActual:  data.estado ? mapEstadoToEtapa(data.estado) : undefined,
      });
      const mapped = updated as OrdenVenta;
      setOrdenes(prev => prev.map(o => o.dbId === selected.dbId ? mapped : o));
      if (activeTimeline?.dbId === selected.dbId) setActiveTimeline(mapped);
    } else {
      const created = await ordenesVentaService.create({
        cliente:      data.cliente      ?? '',
        productor:    data.productor    ?? '',
        campana:      data.campana,
        fecha:        data.fecha,
        lote:         data.lote,
        cantidadKg:   data.cantidadKg   ?? 0,
        destino:      data.destino,
        tipoProducto: data.tipoProducto,
        montoUSD:     data.montoUSD     ?? 0,
        etapaActual:  data.estado ? mapEstadoToEtapa(data.estado) : 'preventa',
      });
      const mapped = created as OrdenVenta;
      setOrdenes(prev => [mapped, ...prev]);
      setActiveTimeline(mapped);
    }
  }

  async function handleDelete() {
    if (!selected) return;
    try {
      await ordenesVentaService.remove(selected.dbId);
      setOrdenes(prev => prev.filter(o => o.dbId !== selected.dbId));
      if (activeTimeline?.dbId === selected.dbId) setActiveTimeline(null);
    } finally {
      setModal(null);
      setSelected(null);
    }
  }

  
  const totalKg  = ordenes.reduce((s, o) => s + o.cantidadKg, 0);
  const totalUSD = ordenes.reduce((s, o) => s + o.montoUSD, 0);
  const counts   = Object.fromEntries(
    (Object.keys(ESTADO_CFG) as EstadoOrden[]).map(k => [k, ordenes.filter(o => o.estado === k).length])
  ) as Record<EstadoOrden, number>;

  return (
    <div className="min-h-full flex flex-col" style={{ backgroundColor: BG }}>

      
      <div className="bg-white border-b px-4 md:px-8 pt-6 pb-5" style={{ borderColor: BD }}>
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0" style={{ backgroundColor: CP }}>
              <Package size={22} className="text-white" />
            </div>
            <div>
              <h1 className="font-headline text-2xl sm:text-3xl font-black uppercase tracking-widest leading-none" style={{ color: TX }}>
                Gestión de Operaciones
              </h1>
              <p className="text-xs text-gray-400 mt-1 font-medium">Control de órdenes de venta y seguimiento de exportación</p>
            </div>
          </div>

          
          <div className="flex flex-wrap gap-2">
            <StatChip label="Total órdenes" value={ordenes.length} icon={<FileText size={15} style={{ color: CP }} />} />
            <StatChip label="En exportación" value={counts.exportacion} icon={<Ship size={15} style={{ color: '#7c3aed' }} />} accent="#f5f3ff" />
            <StatChip label="Total KG" value={`${(totalKg / 1000).toFixed(1)} t`} icon={<Weight size={15} style={{ color: CS }} />} />
            <StatChip label="Monto USD" value={`$${(totalUSD / 1000).toFixed(0)}k`} icon={<TrendingUp size={15} style={{ color: '#059669' }} />} accent="#ecfdf5" />
          </div>
        </div>

        
        <div className="flex flex-wrap gap-2 mt-4">
          {(Object.entries(ESTADO_CFG) as [EstadoOrden, typeof ESTADO_CFG[EstadoOrden]][]).map(([k, v]) => (
            <div key={k} className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[0.65rem] font-bold border ${v.badge}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${v.dot}`} />
              {v.label}: <span className="font-black ml-0.5">{counts[k]}</span>
            </div>
          ))}
        </div>
      </div>

      
      <FilterBar
        campana={filtroCampana}     setCampana={setFiltroCampana}
        productor={filtroProductor} setProductor={setFiltroProductor}
        fecha={filtroFecha}         setFecha={setFiltroFecha}
        lote={filtroLote}           setLote={setFiltroLote}
        onBuscar={handleBuscar}
        onNueva={() => { setSelected(null); setModal('create'); }}
        campanasOpts={campanasOpts}
        productoresOpts={productoresOpts}
      />

      
      <div className="flex-1 px-4 md:px-8 py-6 space-y-6">

        
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            : displayed.length === 0
              ? <EmptyState onNueva={() => { setSelected(null); setModal('create'); }} />
              : paginated.map(o => (
                  <OrderCard
                    key={o.id}
                    orden={o}
                    active={activeTimeline?.id === o.id}
                    onSelect={() => { setActiveTimeline(o); setShowTimeline(true); }}
                    onEdit={() => { setSelected(o); setModal('edit'); }}
                    onDelete={() => { setSelected(o); setModal('delete'); }}
                    onFlow={(stage, tab) => { setSelected(o); setFlowTab(tab); setModal(stage); }}
                    onStageClick={(stage) => {
                      setSelected(o);
                      const stageMap: Partial<Record<EstadoOrden, StageKey>> = {
                        pre_venta:   'preventa',
                        alistado:    'alistado',
                        exportacion: 'exportacion',
                        post_venta:  'post_venta',
                      };
                      const s = stageMap[stage];
                      if (s) { setFlowTab(undefined); setModal(s); }
                    }}
                  />
                ))
          }
        </div>

        {!loading && displayed.length > ITEMS_PER_PAGE && (
          <div className="flex items-center justify-center gap-2 pt-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-8 h-8 rounded-xl border flex items-center justify-center text-sm font-bold transition-all disabled:opacity-30 hover:bg-white"
              style={{ borderColor: BD, color: TX }}
            >
              ‹
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
              <button
                key={n}
                onClick={() => setPage(n)}
                className="w-8 h-8 rounded-xl border text-[0.72rem] font-black transition-all"
                style={{
                  borderColor:     n === page ? CP : BD,
                  backgroundColor: n === page ? CP : 'transparent',
                  color:           n === page ? '#fff' : TX,
                }}
              >
                {n}
              </button>
            ))}
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="w-8 h-8 rounded-xl border flex items-center justify-center text-sm font-bold transition-all disabled:opacity-30 hover:bg-white"
              style={{ borderColor: BD, color: TX }}
            >
              ›
            </button>
            <span className="text-[0.62rem] text-gray-400 ml-1">
              {(page - 1) * ITEMS_PER_PAGE + 1}–{Math.min(page * ITEMS_PER_PAGE, displayed.length)} de {displayed.length}
            </span>
          </div>
        )}

      </div>

      
      {(modal === 'create' || modal === 'edit') && (
        <OrderModal
          initial={modal === 'edit' ? selected : null}
          onClose={() => { setModal(null); setSelected(null); }}
          onSave={async (data) => { await handleSave(data); }}
        />
      )}
      {modal === 'delete' && selected && (
        <DeleteConfirm
          orden={selected}
          onClose={() => { setModal(null); setSelected(null); }}
          onConfirm={handleDelete}
        />
      )}

      
      {selected && modal === 'preventa'   && (
        <PreventaModal
          orden={selected}
          initialTab={(flowTab as 'muestras' | 'cotizacion') ?? 'muestras'}
          onClose={() => { setModal(null); setSelected(null); setFlowTab(undefined); }}
        />
      )}
      {selected && modal === 'alistado'   && (
        <AlistadoModal
          orden={selected}
          initialTab={(flowTab as 'compromiso' | 'lotes') ?? 'compromiso'}
          onClose={() => { setModal(null); setSelected(null); setFlowTab(undefined); }}
        />
      )}
      {selected && modal === 'exportacion' && (
        <ExportacionModal
          orden={selected}
          initialTab={(flowTab as 'plan' | 'despacho' | 'cierre') ?? 'plan'}
          onClose={() => { setModal(null); setSelected(null); setFlowTab(undefined); }}
        />
      )}
      {selected && modal === 'post_venta' && (
        <PostVentaModal
          orden={selected}
          initialTab={(flowTab as 'feedback' | 'reclamos') ?? 'feedback'}
          onClose={() => { setModal(null); setSelected(null); setFlowTab(undefined); }}
        />
      )}

      
      {showTimeline && activeTimeline && (
        <ProcessTimelineModal
          orden={activeTimeline}
          onClose={() => setShowTimeline(false)}
        />
      )}
    </div>
  );
}
