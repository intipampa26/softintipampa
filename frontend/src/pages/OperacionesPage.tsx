import { useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  Plus, Search, Pencil, Trash2, Package, CheckCircle2, Ship,
  BarChart3, ChevronRight, X, Calendar, User, Hash, FileText,
  Clock, CheckCheck, Circle,
} from 'lucide-react';

const CP  = '#1A2B23';
const CS  = '#283F34';
const CL  = '#3A5C4A';

type EstadoOrden = 'pre_venta' | 'alistado' | 'exportacion' | 'post_venta';

interface OrdenVenta {
  id: string;
  cliente: string;
  campana: string;
  fecha: string;
  estado: EstadoOrden;
  lote: string;
  cantidadKg: number;
  destino: string;
  tipoProducto: string;
}

interface PasoTimeline {
  label: string;
  fecha: string;
  usuario: string;
  estado: 'completado' | 'en_proceso' | 'pendiente';
}

const PASOS_BASE = [
  'Registrado', 'Documentos preparados', 'Recepcionado en almacén',
  'Control de calidad', 'Consolidado en contenedor',
  'Aforo / Aduana', 'Embarque', 'En tránsito', 'Entregado y liquidado',
];

function buildTimeline(completados: number, enProceso: number): PasoTimeline[] {
  const usuarios = ['ops.garcia', 'ops.quispe', 'supervisor', 'admin', 'aduanas'];
  const fechas = [
    '05/01/2026','08/01/2026','12/01/2026','15/01/2026','20/01/2026',
    '25/01/2026','28/01/2026','03/02/2026','10/02/2026',
  ];
  return PASOS_BASE.map((label, i) => {
    if (i < completados)          return { label, fecha: fechas[i], usuario: usuarios[i % usuarios.length], estado: 'completado' };
    if (i === completados && enProceso) return { label, fecha: fechas[i], usuario: usuarios[i % usuarios.length], estado: 'en_proceso' };
    return { label, fecha: '', usuario: '', estado: 'pendiente' };
  });
}

const MOCK_ORDENES: OrdenVenta[] = [
  {
    id: 'ORD-2026-001', cliente: 'Volcafe Perú S.A.C.', campana: 'Campaña 2025/2026',
    fecha: '05/01/2026', estado: 'post_venta', lote: 'LF-2026-001',
    cantidadKg: 18_000, destino: 'Alemania', tipoProducto: 'Café verde',
  },
  {
    id: 'ORD-2026-002', cliente: 'Sucafina S.A.', campana: 'Campaña 2025/2026',
    fecha: '10/01/2026', estado: 'exportacion', lote: 'LF-2026-002',
    cantidadKg: 12_500, destino: 'Estados Unidos', tipoProducto: 'Café pergamino',
  },
  {
    id: 'ORD-2026-003', cliente: 'Olam International', campana: 'Campaña 2025/2026',
    fecha: '14/01/2026', estado: 'exportacion', lote: 'LF-2026-003',
    cantidadKg: 9_800, destino: 'Bélgica', tipoProducto: 'Cacao en grano',
  },
  {
    id: 'ORD-2026-004', cliente: 'Nordic Approach AS', campana: 'Campaña 2025/2026',
    fecha: '18/01/2026', estado: 'alistado', lote: 'LF-2026-004',
    cantidadKg: 4_200, destino: 'Noruega', tipoProducto: 'Café especial SCA 85+',
  },
  {
    id: 'ORD-2026-005', cliente: 'Caravela Coffee LLC', campana: 'Campaña 2025/2026',
    fecha: '22/01/2026', estado: 'alistado', lote: 'LF-2026-005',
    cantidadKg: 6_600, destino: 'Países Bajos', tipoProducto: 'Café verde',
  },
  {
    id: 'ORD-2026-006', cliente: 'Trabocca B.V.', campana: 'Campaña 2025/2026',
    fecha: '25/01/2026', estado: 'pre_venta', lote: 'LF-2026-006',
    cantidadKg: 3_000, destino: 'Países Bajos', tipoProducto: 'Café especial SCA 83+',
  },
  {
    id: 'ORD-2026-007', cliente: 'Cofco International', campana: 'Campaña 2025/2026',
    fecha: '28/01/2026', estado: 'pre_venta', lote: 'LF-2026-007',
    cantidadKg: 20_000, destino: 'China', tipoProducto: 'Cacao en grano',
  },
  {
    id: 'ORD-2026-008', cliente: 'True Origins Coffee', campana: 'Campaña 2024/2025',
    fecha: '30/09/2025', estado: 'post_venta', lote: 'LF-2025-012',
    cantidadKg: 5_400, destino: 'Dinamarca', tipoProducto: 'Café especial SCA 85+',
  },
  {
    id: 'ORD-2026-009', cliente: 'Volcafe Perú S.A.C.', campana: 'Campaña 2024/2025',
    fecha: '15/10/2025', estado: 'post_venta', lote: 'LF-2025-013',
    cantidadKg: 14_200, destino: 'Italia', tipoProducto: 'Café verde',
  },
  {
    id: 'ORD-2026-010', cliente: 'Specialty Coffee UK', campana: 'Campaña 2025/2026',
    fecha: '01/02/2026', estado: 'pre_venta', lote: 'LF-2026-010',
    cantidadKg: 7_500, destino: 'Reino Unido', tipoProducto: 'Café verde',
  },
];

const TIMELINES_BY_ORDER: Record<string, PasoTimeline[]> = {
  'ORD-2026-001': buildTimeline(9, 0),
  'ORD-2026-002': buildTimeline(7, 1),
  'ORD-2026-003': buildTimeline(6, 1),
  'ORD-2026-004': buildTimeline(4, 1),
  'ORD-2026-005': buildTimeline(3, 1),
  'ORD-2026-006': buildTimeline(1, 1),
  'ORD-2026-007': buildTimeline(0, 1),
  'ORD-2026-008': buildTimeline(9, 0),
  'ORD-2026-009': buildTimeline(9, 0),
  'ORD-2026-010': buildTimeline(0, 1),
};

const MOCK_CAMPANAS = ['Campaña 2025/2026', 'Campaña 2024/2025'];
const MOCK_CLIENTES = [
  'Volcafe Perú S.A.C.', 'Sucafina S.A.', 'Olam International',
  'Nordic Approach AS', 'Caravela Coffee LLC', 'Trabocca B.V.',
  'Cofco International', 'True Origins Coffee', 'Specialty Coffee UK',
];

const ESTADO_CONFIG: Record<EstadoOrden, { label: string; badge: string; icon: LucideIcon }> = {
  pre_venta:   { label: 'Pre Venta',   badge: 'bg-amber-100  text-amber-700  border border-amber-200',  icon: FileText    },
  alistado:    { label: 'Alistado',    badge: 'bg-blue-100   text-blue-700   border border-blue-200',   icon: Package     },
  exportacion: { label: 'Exportación', badge: 'bg-purple-100 text-purple-700 border border-purple-200', icon: Ship        },
  post_venta:  { label: 'Post Venta',  badge: 'bg-green-100  text-green-700  border border-green-200',  icon: CheckCircle2},
};

const INP = 'w-full border border-gray-300 bg-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-shadow';

interface FiltersProps {
  campana: string; setCampana: (v: string) => void;
  cliente: string; setCliente: (v: string) => void;
  fecha: string;   setFecha:   (v: string) => void;
  lote: string;    setLote:    (v: string) => void;
  onBuscar: () => void;
  onNueva:  () => void;
}

function OperationFilters({ campana, setCampana, cliente, setCliente, fecha, setFecha, lote, setLote, onBuscar, onNueva }: FiltersProps) {
  return (
    <div className="px-4 md:px-8 py-4 bg-white border-b border-gray-100">
      <div className="flex flex-col sm:flex-row flex-wrap gap-3 items-end">

        
        <div className="flex-1 min-w-[160px]">
          <label className="block text-[0.65rem] font-bold text-gray-600 uppercase tracking-wider mb-1">Campaña</label>
          <select value={campana} onChange={e => setCampana(e.target.value)} className={INP}>
            <option value="">Todas las campañas</option>
            {MOCK_CAMPANAS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        
        <div className="flex-1 min-w-[160px]">
          <label className="block text-[0.65rem] font-bold text-gray-600 uppercase tracking-wider mb-1">Cliente</label>
          <select value={cliente} onChange={e => setCliente(e.target.value)} className={INP}>
            <option value="">Todos los clientes</option>
            {MOCK_CLIENTES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        
        <div className="flex-1 min-w-[140px]">
          <label className="block text-[0.65rem] font-bold text-gray-600 uppercase tracking-wider mb-1">Fecha</label>
          <div className="relative">
            <input type="date" value={fecha} onChange={e => setFecha(e.target.value)} className={INP + ' pr-9'} />
            <Calendar size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        
        <div className="flex-1 min-w-[130px]">
          <label className="block text-[0.65rem] font-bold text-gray-600 uppercase tracking-wider mb-1">Lote</label>
          <input
            value={lote} onChange={e => setLote(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && onBuscar()}
            placeholder="Código lote…" className={INP}
          />
        </div>

        
        <button
          onClick={onBuscar}
          className="h-[38px] w-10 shrink-0 rounded-xl border border-gray-300 bg-white flex items-center justify-center hover:bg-gray-50 transition-colors"
          aria-label="Buscar"
        >
          <Search size={15} className="text-gray-600" />
        </button>

        
        <button
          onClick={onNueva}
          className="h-[38px] shrink-0 flex items-center gap-2 px-4 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90 active:scale-95"
          style={{ backgroundColor: CP }}
        >
          <Plus size={15} />
          <span className="hidden sm:inline">Agregar Orden</span>
          <span className="sm:hidden">Nueva</span>
        </button>
      </div>
    </div>
  );
}

interface CardProps {
  orden: OrdenVenta;
  onEdit:    (o: OrdenVenta) => void;
  onDelete:  (o: OrdenVenta) => void;
  onTimeline:(o: OrdenVenta) => void;
}

function OperationCard({ orden, onEdit, onDelete, onTimeline }: CardProps) {
  const cfg = ESTADO_CONFIG[orden.estado];
  const Icon = cfg.icon;

  return (
    <div
      className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col overflow-hidden cursor-pointer group"
      onClick={() => onTimeline(orden)}
    >
      
      <div className="px-4 py-3 flex items-start justify-between gap-2" style={{ backgroundColor: `${CP}08` }}>
        <div className="min-w-0">
          <p className="font-headline font-black text-sm uppercase tracking-wider truncate" style={{ color: CP }}>
            {orden.id}
          </p>
          <p className="text-xs text-gray-500 mt-0.5 truncate font-medium">{orden.tipoProducto}</p>
        </div>
        <span className={`shrink-0 inline-flex items-center gap-1 text-[0.6rem] font-bold px-2 py-0.5 rounded-full ${cfg.badge}`}>
          <Icon size={9} />
          {cfg.label}
        </span>
      </div>

      
      <div className="px-4 py-3 flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <User size={11} className="text-gray-400 shrink-0" />
          <span className="text-xs font-semibold text-gray-800 truncate">{orden.cliente}</span>
        </div>
        <div className="flex items-center gap-2">
          <BarChart3 size={11} className="text-gray-400 shrink-0" />
          <span className="text-xs text-gray-500 truncate">{orden.campana}</span>
        </div>
        <div className="flex items-center gap-2">
          <Hash size={11} className="text-gray-400 shrink-0" />
          <span className="text-xs text-gray-500 font-mono">{orden.lote}</span>
        </div>
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5">
            <Calendar size={10} className="text-gray-400" />
            <span className="text-[0.65rem] text-gray-400">{orden.fecha}</span>
          </div>
          <span className="text-[0.65rem] font-bold text-gray-700">
            {orden.cantidadKg.toLocaleString()} kg
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Ship size={10} className="text-gray-400" />
          <span className="text-[0.65rem] text-gray-500">{orden.destino}</span>
        </div>
      </div>

      
      <div className="border-t border-gray-100 px-3 py-2 flex items-center justify-between">
        <button
          onClick={e => { e.stopPropagation(); onTimeline(orden); }}
          className="flex items-center gap-1 text-[0.65rem] font-semibold transition-colors hover:opacity-70"
          style={{ color: CS }}
        >
          Ver vida <ChevronRight size={10} />
        </button>
        <div className="flex items-center gap-1.5">
          <div className="flex flex-col items-center gap-0.5">
            <button
              onClick={e => { e.stopPropagation(); onEdit(orden); }}
              title="Editar"
              className="w-7 h-7 rounded-lg flex items-center justify-center hover:opacity-80 active:scale-95 transition-all"
              style={{ backgroundColor: '#a3e635' }}
            >
              <Pencil size={12} className="text-lime-900" />
            </button>
            <span className="text-[0.5rem] text-gray-400 font-medium">editar</span>
          </div>
          <div className="flex flex-col items-center gap-0.5">
            <button
              onClick={e => { e.stopPropagation(); onDelete(orden); }}
              title="Eliminar"
              className="w-7 h-7 rounded-lg flex items-center justify-center hover:opacity-80 active:scale-95 transition-all"
              style={{ backgroundColor: '#f87171' }}
            >
              <Trash2 size={12} className="text-red-900" />
            </button>
            <span className="text-[0.5rem] text-gray-400 font-medium">eliminar</span>
          </div>
        </div>
      </div>
    </div>
  );
}

interface GridProps {
  ordenes: OrdenVenta[];
  loading: boolean;
  onEdit:     (o: OrdenVenta) => void;
  onDelete:   (o: OrdenVenta) => void;
  onTimeline: (o: OrdenVenta) => void;
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-pulse">
      <div className="px-4 py-3 flex items-center justify-between gap-2" style={{ backgroundColor: '#f9f9f9' }}>
        <div className="space-y-1.5">
          <div className="h-3 w-28 bg-gray-200 rounded" />
          <div className="h-2 w-20 bg-gray-100 rounded" />
        </div>
        <div className="h-5 w-20 bg-gray-200 rounded-full" />
      </div>
      <div className="px-4 py-3 space-y-2.5">
        {[80, 60, 50, 40].map(w => (
          <div key={w} className="h-2.5 bg-gray-100 rounded" style={{ width: `${w}%` }} />
        ))}
      </div>
      <div className="border-t border-gray-100 px-3 py-2 flex justify-between">
        <div className="h-2.5 w-16 bg-gray-100 rounded" />
        <div className="flex gap-2">
          <div className="w-7 h-7 bg-gray-100 rounded-lg" />
          <div className="w-7 h-7 bg-gray-100 rounded-lg" />
        </div>
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
      <p className="font-headline text-lg font-black uppercase tracking-wide text-gray-700">Sin órdenes</p>
      <p className="text-sm text-gray-400 mt-1 mb-5">No se encontraron órdenes con los filtros seleccionados.</p>
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

function OperationGrid({ ordenes, loading, onEdit, onDelete, onTimeline }: GridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {ordenes.length === 0
        ? <EmptyState onNueva={() => {}} />
        : ordenes.map(o => (
            <OperationCard key={o.id} orden={o} onEdit={onEdit} onDelete={onDelete} onTimeline={onTimeline} />
          ))
      }
    </div>
  );
}

interface StepProps {
  paso: PasoTimeline;
  isLast: boolean;
  index: number;
}

function TimelineStep({ paso, isLast, index }: StepProps) {
  const completado  = paso.estado === 'completado';
  const enProceso   = paso.estado === 'en_proceso';

  const bgCard  = completado ? CP       : enProceso ? CS        : '#F3F4F6';
  const txCard  = completado ? '#fff'   : enProceso ? '#fff'    : '#9CA3AF';
  const borderC = completado ? CP       : enProceso ? CS        : '#E5E7EB';

  const StepIcon = completado ? CheckCheck : enProceso ? Clock : Circle;

  return (
    <div className="flex flex-col items-center shrink-0" style={{ width: '110px' }}>
      
      <div
        className="w-full rounded-xl p-2.5 text-center shadow-sm border transition-all"
        style={{ backgroundColor: bgCard, borderColor: borderC, color: txCard }}
      >
        <p className="text-[0.6rem] font-black uppercase tracking-wide leading-tight mb-1.5">{paso.label}</p>

        {completado || enProceso ? (
          <>
            <div className="flex items-center justify-center gap-0.5 mb-0.5">
              <Calendar size={8} style={{ color: txCard, opacity: 0.7 }} />
              <span className="text-[0.55rem] font-semibold" style={{ opacity: 0.9 }}>{paso.fecha}</span>
            </div>
            <div className="flex items-center justify-center gap-0.5">
              <User size={8} style={{ color: txCard, opacity: 0.7 }} />
              <span className="text-[0.55rem]" style={{ opacity: 0.8 }}>{paso.usuario}</span>
            </div>
          </>
        ) : (
          <p className="text-[0.55rem]" style={{ color: '#9CA3AF' }}>Pendiente</p>
        )}
      </div>

      
      <div className="flex items-center w-full mt-2">
        
        <div
          className="flex-1 h-px"
          style={{ backgroundColor: index === 0 ? 'transparent' : completado ? CP : '#E5E7EB' }}
        />

        
        <div
          className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all"
          style={{
            backgroundColor: completado ? CP : enProceso ? CS : '#fff',
            borderColor:     completado ? CP : enProceso ? CS : '#D1D5DB',
          }}
        >
          <StepIcon
            size={10}
            className={completado || enProceso ? 'text-white' : 'text-gray-300'}
          />
        </div>

        
        <div
          className="flex-1 h-px"
          style={{ backgroundColor: isLast ? 'transparent' : completado ? CP : '#E5E7EB' }}
        />
      </div>

      
      <p className="text-[0.55rem] font-bold mt-1" style={{ color: completado ? CP : enProceso ? CS : '#9CA3AF' }}>
        {String(index + 1).padStart(2, '0')}
      </p>
    </div>
  );
}

interface TimelineProps {
  orden: OrdenVenta | null;
}

function OperationTimeline({ orden }: TimelineProps) {
  if (!orden) return null;

  const timeline = TIMELINES_BY_ORDER[orden.id] ?? buildTimeline(0, 1);
  const completadas = timeline.filter(p => p.estado === 'completado').length;
  const pct = Math.round((completadas / timeline.length) * 100);
  const cfg = ESTADO_CONFIG[orden.estado];
  const Icon = cfg.icon;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      
      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between gap-3 flex-wrap" style={{ backgroundColor: `${CP}08` }}>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: CP }}>
            <Clock size={14} className="text-white" />
          </div>
          <div className="min-w-0">
            <p className="font-headline text-sm font-black uppercase tracking-wide" style={{ color: CP }}>
              Vida de la Solicitud
            </p>
            <p className="text-[0.65rem] text-gray-400 truncate">{orden.id} · {orden.cliente}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={`inline-flex items-center gap-1 text-[0.6rem] font-bold px-2 py-0.5 rounded-full border ${cfg.badge}`}>
            <Icon size={9} /> {cfg.label}
          </span>
          <div className="text-[0.65rem] text-gray-500 flex items-center gap-1">
            <span className="hidden sm:inline">Pasos:</span>
            <span className="font-black" style={{ color: CP }}>{completadas}/{timeline.length}</span>
          </div>
        </div>
      </div>

      
      <div className="px-4 py-5 overflow-x-auto">
        <div className="flex gap-2 min-w-max mx-auto" style={{ paddingBottom: '4px' }}>
          {timeline.map((paso, i) => (
            <TimelineStep
              key={paso.label}
              paso={paso}
              isLast={i === timeline.length - 1}
              index={i}
            />
          ))}
        </div>
      </div>

      
      <div className="px-4 pb-4">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[0.6rem] font-bold text-gray-500 uppercase tracking-wide">Progreso general</span>
          <span className="text-[0.65rem] font-black" style={{ color: CP }}>{pct}%</span>
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${pct}%`, backgroundColor: CP }}
          />
        </div>
      </div>
    </div>
  );
}

interface OrdenModalProps {
  initial?: OrdenVenta | null;
  onClose: () => void;
  onSave:  (data: Partial<OrdenVenta>) => void;
}

function OrdenModal({ initial, onClose, onSave }: OrdenModalProps) {
  const [form, setForm] = useState({
    cliente:      initial?.cliente      ?? '',
    campana:      initial?.campana      ?? '',
    fecha:        initial?.fecha        ?? '',
    lote:         initial?.lote         ?? '',
    cantidadKg:   initial?.cantidadKg   ?? 0,
    destino:      initial?.destino      ?? '',
    tipoProducto: initial?.tipoProducto ?? '',
    estado:       initial?.estado       ?? 'pre_venta' as EstadoOrden,
  });

  const set = <K extends keyof typeof form>(k: K, v: typeof form[K]) =>
    setForm(f => ({ ...f, [k]: v }));

  const cls = INP;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col" style={{ maxHeight: '90vh' }}>
        
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
          <div>
            <h2 className="font-headline text-base font-black uppercase tracking-wide" style={{ color: CP }}>
              {initial ? 'Editar Orden' : 'Nueva Orden de Venta'}
            </h2>
            {initial && <p className="text-xs text-gray-400 mt-0.5">{initial.id}</p>}
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
            <X size={18} />
          </button>
        </div>

        
        <div className="overflow-y-auto flex-1 px-5 py-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Cliente</label>
              <select value={form.cliente} onChange={e => set('cliente', e.target.value)} className={cls}>
                <option value="">Seleccionar cliente…</option>
                {MOCK_CLIENTES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Campaña</label>
              <select value={form.campana} onChange={e => set('campana', e.target.value)} className={cls}>
                <option value="">Seleccionar…</option>
                {MOCK_CAMPANAS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Fecha</label>
              <input type="date" value={form.fecha} onChange={e => set('fecha', e.target.value)} className={cls} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Lote</label>
              <input value={form.lote} onChange={e => set('lote', e.target.value)} className={cls} placeholder="LF-2025-…" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Cantidad (kg)</label>
              <input type="number" min={0} step={100} value={form.cantidadKg} onChange={e => set('cantidadKg', Number(e.target.value))} className={cls} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Tipo de Producto</label>
              <input value={form.tipoProducto} onChange={e => set('tipoProducto', e.target.value)} className={cls} placeholder="Café verde, Cacao…" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Destino</label>
              <input value={form.destino} onChange={e => set('destino', e.target.value)} className={cls} placeholder="País destino…" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Estado</label>
              <select value={form.estado} onChange={e => set('estado', e.target.value as EstadoOrden)} className={cls}>
                {(Object.keys(ESTADO_CONFIG) as EstadoOrden[]).map(k => (
                  <option key={k} value={k}>{ESTADO_CONFIG[k].label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        
        <div className="px-5 py-4 border-t border-gray-100 flex gap-3 shrink-0">
          <button type="button" onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => { onSave(form); onClose(); }}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: CP }}
          >
            {initial ? 'Guardar cambios' : 'Crear orden'}
          </button>
        </div>
      </div>
    </div>
  );
}

function DeleteConfirm({ orden, onClose, onConfirm }: { orden: OrdenVenta; onClose: () => void; onConfirm: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
          <Trash2 size={22} className="text-red-600" />
        </div>
        <div className="text-center">
          <p className="font-bold text-gray-800">¿Eliminar orden?</p>
          <p className="text-sm text-gray-500 mt-1">
            Se eliminará <span className="font-semibold">{orden.id}</span> — {orden.cliente}. Esta acción no se puede deshacer.
          </p>
        </div>
        <div className="flex gap-3 w-full">
          <button onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50">
            Cancelar
          </button>
          <button onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors">
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}

type ModalType = 'create' | 'edit' | 'delete' | null;

export function OperacionesPage() {
  
  const [filtroCampana, setFiltroCampana] = useState('');
  const [filtroCliente, setFiltroCliente] = useState('');
  const [filtroFecha,   setFiltroFecha]   = useState('');
  const [filtroLote,    setFiltroLote]    = useState('');

  
  const [ordenes, setOrdenes] = useState<OrdenVenta[]>(MOCK_ORDENES);
  const [loading, setLoading] = useState(false);
  const [modal,   setModal]   = useState<ModalType>(null);
  const [selected, setSelected] = useState<OrdenVenta | null>(null);
  const [activeTimeline, setActiveTimeline] = useState<OrdenVenta | null>(MOCK_ORDENES[1]);

  
  function handleBuscar() {
    setLoading(true);
    setTimeout(() => {
      setOrdenes(
        MOCK_ORDENES.filter(o => {
          if (filtroCampana && o.campana !== filtroCampana) return false;
          if (filtroCliente && o.cliente !== filtroCliente) return false;
          if (filtroLote    && !o.lote.toLowerCase().includes(filtroLote.toLowerCase())) return false;
          return true;
        })
      );
      setLoading(false);
    }, 350);
  }

  function handleSave(data: Partial<OrdenVenta>) {
    if (modal === 'edit' && selected) {
      setOrdenes(prev => prev.map(o => o.id === selected.id ? { ...o, ...data } : o));
    } else {
      const nueva: OrdenVenta = {
        id:           `ORD-2026-${String(ordenes.length + 1).padStart(3, '0')}`,
        cliente:      data.cliente      ?? '',
        campana:      data.campana      ?? '',
        fecha:        data.fecha        ?? '',
        estado:       data.estado       ?? 'pre_venta',
        lote:         data.lote         ?? '',
        cantidadKg:   data.cantidadKg   ?? 0,
        destino:      data.destino      ?? '',
        tipoProducto: data.tipoProducto ?? '',
      };
      setOrdenes(prev => [nueva, ...prev]);
    }
  }

  function handleDelete() {
    if (!selected) return;
    setOrdenes(prev => prev.filter(o => o.id !== selected.id));
    if (activeTimeline?.id === selected.id) setActiveTimeline(null);
    setModal(null);
    setSelected(null);
  }

  
  const counts = (Object.keys(ESTADO_CONFIG) as EstadoOrden[]).map(k => ({
    ...ESTADO_CONFIG[k], key: k, count: ordenes.filter(o => o.estado === k).length,
  }));

  return (
    <div className="min-h-full bg-gray-50 flex flex-col">

      
      <div className="px-4 md:px-8 pt-6 pb-3 bg-white border-b border-gray-100">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h1 className="font-headline text-2xl sm:text-3xl font-black uppercase tracking-wide text-gray-800" style={{ letterSpacing: '0.05em' }}>
              Gestión de Operaciones
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">Control de órdenes de venta y seguimiento de exportación</p>
          </div>

          
          <div className="flex flex-wrap gap-2 pb-1">
            {counts.map(c => {
              const Icon = c.icon;
              return (
                <div key={c.key} className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[0.65rem] font-bold border ${c.badge}`}>
                  <Icon size={10} /> {c.label}: {c.count}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      
      <OperationFilters
        campana={filtroCampana} setCampana={setFiltroCampana}
        cliente={filtroCliente} setCliente={setFiltroCliente}
        fecha={filtroFecha}     setFecha={setFiltroFecha}
        lote={filtroLote}       setLote={setFiltroLote}
        onBuscar={handleBuscar}
        onNueva={() => { setSelected(null); setModal('create'); }}
      />

      
      <div className="flex-1 px-4 md:px-8 py-6 space-y-6">

        
        <OperationGrid
          ordenes={ordenes}
          loading={loading}
          onEdit={o => { setSelected(o); setModal('edit'); }}
          onDelete={o => { setSelected(o); setModal('delete'); }}
          onTimeline={o => setActiveTimeline(o)}
        />

        
        <OperationTimeline orden={activeTimeline} />

      </div>

      
      {(modal === 'create' || modal === 'edit') && (
        <OrdenModal
          initial={modal === 'edit' ? selected : null}
          onClose={() => { setModal(null); setSelected(null); }}
          onSave={handleSave}
        />
      )}

      {modal === 'delete' && selected && (
        <DeleteConfirm
          orden={selected}
          onClose={() => { setModal(null); setSelected(null); }}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
