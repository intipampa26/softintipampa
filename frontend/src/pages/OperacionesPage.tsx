import { useState, useEffect, useCallback, useRef } from 'react';
import LoadingLogo from '@/components/LoadingLogo';
import { useToast } from '@/contexts/ToastContext';
import { lotesFinalesService, LoteFinal } from '@/services/lotes-finales.service';
import type { LucideIcon } from 'lucide-react';
import {
  Plus, Search, Pencil, Trash2, Package, CheckCircle2, Ship,
  BarChart3, ChevronRight, X, Calendar, User, Hash, FileText,
  Clock, CheckCheck, Circle,
} from 'lucide-react';
import {
  ordenesVentaService,
  OrdenVentaFE,
  OrdenPasoFE,
  EstadoPaso,
  mapEstadoToEtapa,
  EstadoOrdenFE,
} from '@/services/ordenes-venta.service';

const CP  = '#1A2B23';
const CS  = '#283F34';

type EstadoOrden = EstadoOrdenFE;

interface OrdenOp extends OrdenVentaFE {}

const ESTADO_CONFIG: Record<EstadoOrden, { label: string; badge: string; icon: LucideIcon }> = {
  pre_venta:   { label: 'Pre Venta',   badge: 'bg-amber-100  text-amber-700  border border-amber-200',  icon: FileText    },
  alistado:    { label: 'Alistado',    badge: 'bg-blue-100   text-blue-700   border border-blue-200',   icon: Package     },
  exportacion: { label: 'Exportación', badge: 'bg-purple-100 text-purple-700 border border-purple-200', icon: Ship        },
  post_venta:  { label: 'Post Venta',  badge: 'bg-green-100  text-green-700  border border-green-200',  icon: CheckCircle2},
};

const INP = 'w-full border border-gray-300 bg-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-shadow';

function OperationFilters({
  filtroCliente, setFiltroCliente,
  filtroFecha, setFiltroFecha,
  filtroLote, setFiltroLote,
  onBuscar, onNueva,
}: {
  filtroCliente: string; setFiltroCliente: (v: string) => void;
  filtroFecha:   string; setFiltroFecha:   (v: string) => void;
  filtroLote:    string; setFiltroLote:    (v: string) => void;
  onBuscar: () => void;
  onNueva:  () => void;
}) {
  return (
    <div className="px-4 md:px-8 py-4 bg-white border-b border-gray-100">
      <div className="flex flex-col sm:flex-row flex-wrap gap-3 items-end">
        <div className="flex-1 min-w-[160px]">
          <label className="block text-[0.65rem] font-bold text-gray-600 uppercase tracking-wider mb-1">Cliente</label>
          <input value={filtroCliente} onChange={e => setFiltroCliente(e.target.value)} onKeyDown={e => e.key === 'Enter' && onBuscar()} placeholder="Buscar cliente…" className={INP} />
        </div>
        <div className="flex-1 min-w-[140px]">
          <label className="block text-[0.65rem] font-bold text-gray-600 uppercase tracking-wider mb-1">Fecha desde</label>
          <div className="relative">
            <input type="date" value={filtroFecha} onChange={e => setFiltroFecha(e.target.value)} className={INP + ' pr-9'} />
            <Calendar size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
        <div className="flex-1 min-w-[130px]">
          <label className="block text-[0.65rem] font-bold text-gray-600 uppercase tracking-wider mb-1">Lote</label>
          <input value={filtroLote} onChange={e => setFiltroLote(e.target.value)} onKeyDown={e => e.key === 'Enter' && onBuscar()} placeholder="Código lote…" className={INP} />
        </div>
        <button onClick={onBuscar} className="h-[38px] w-10 shrink-0 rounded-xl border border-gray-300 bg-white flex items-center justify-center hover:bg-gray-50 transition-colors" aria-label="Buscar">
          <Search size={15} className="text-gray-600" />
        </button>
        <button onClick={onNueva} className="h-[38px] shrink-0 flex items-center gap-2 px-4 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90 active:scale-95" style={{ backgroundColor: CP }}>
          <Plus size={15} />
          <span className="hidden sm:inline">Agregar Orden</span>
          <span className="sm:hidden">Nueva</span>
        </button>
      </div>
    </div>
  );
}

function OperationCard({ orden, onEdit, onDelete, onTimeline }: {
  orden: OrdenOp;
  onEdit:     (o: OrdenOp) => void;
  onDelete:   (o: OrdenOp) => void;
  onTimeline: (o: OrdenOp) => void;
}) {
  const cfg  = ESTADO_CONFIG[orden.estado];
  const Icon = cfg.icon;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col overflow-hidden cursor-pointer group" onClick={() => onTimeline(orden)}>
      <div className="px-4 py-3 flex items-start justify-between gap-2" style={{ backgroundColor: `${CP}08` }}>
        <div className="min-w-0">
          <p className="font-headline font-black text-sm uppercase tracking-wider truncate" style={{ color: CP }}>{orden.id}</p>
          <p className="text-xs text-gray-500 mt-0.5 truncate font-medium">{orden.tipoProducto}</p>
        </div>
        <span className={`shrink-0 inline-flex items-center gap-1 text-[0.6rem] font-bold px-2 py-0.5 rounded-full ${cfg.badge}`}>
          <Icon size={9} />{cfg.label}
        </span>
      </div>
      <div className="px-4 py-3 flex-1 space-y-2">
        <div className="flex items-center gap-2"><User size={11} className="text-gray-400 shrink-0" /><span className="text-xs font-semibold text-gray-800 truncate">{orden.cliente}</span></div>
        <div className="flex items-center gap-2"><BarChart3 size={11} className="text-gray-400 shrink-0" /><span className="text-xs text-gray-500 truncate">{orden.campana || '—'}</span></div>
        <div className="flex items-center gap-2"><Hash size={11} className="text-gray-400 shrink-0" /><span className="text-xs text-gray-500 font-mono">{orden.lote || '—'}</span></div>
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5"><Calendar size={10} className="text-gray-400" /><span className="text-[0.65rem] text-gray-400">{orden.fecha || '—'}</span></div>
          <span className="text-[0.65rem] font-bold text-gray-700">{Number(orden.cantidadKg).toLocaleString()} kg</span>
        </div>
        <div className="flex items-center gap-1.5"><Ship size={10} className="text-gray-400" /><span className="text-[0.65rem] text-gray-500">{orden.destino || '—'}</span></div>
      </div>
      <div className="border-t border-gray-100 px-3 py-2 flex items-center justify-between">
        <button onClick={e => { e.stopPropagation(); onTimeline(orden); }} className="flex items-center gap-1 text-[0.65rem] font-semibold transition-colors hover:opacity-70" style={{ color: CS }}>
          Ver vida <ChevronRight size={10} />
        </button>
        <div className="flex items-center gap-1.5">
          <div className="flex flex-col items-center gap-0.5">
            <button onClick={e => { e.stopPropagation(); onEdit(orden); }} title="Editar" className="w-7 h-7 rounded-lg flex items-center justify-center hover:opacity-80 active:scale-95 transition-all" style={{ backgroundColor: '#a3e635' }}>
              <Pencil size={12} className="text-lime-900" />
            </button>
            <span className="text-[0.5rem] text-gray-400 font-medium">editar</span>
          </div>
          <div className="flex flex-col items-center gap-0.5">
            <button onClick={e => { e.stopPropagation(); onDelete(orden); }} title="Eliminar" className="w-7 h-7 rounded-lg flex items-center justify-center hover:opacity-80 active:scale-95 transition-all" style={{ backgroundColor: '#f87171' }}>
              <Trash2 size={12} className="text-red-900" />
            </button>
            <span className="text-[0.5rem] text-gray-400 font-medium">eliminar</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-pulse">
      <div className="px-4 py-3 flex items-center justify-between gap-2" style={{ backgroundColor: '#f9f9f9' }}>
        <div className="space-y-1.5"><div className="h-3 w-28 bg-gray-200 rounded" /><div className="h-2 w-20 bg-gray-100 rounded" /></div>
        <div className="h-5 w-20 bg-gray-200 rounded-full" />
      </div>
      <div className="px-4 py-3 space-y-2.5">{[80,60,50,40].map(w => <div key={w} className="h-2.5 bg-gray-100 rounded" style={{ width: `${w}%` }} />)}</div>
      <div className="border-t border-gray-100 px-3 py-2 flex justify-between">
        <div className="h-2.5 w-16 bg-gray-100 rounded" />
        <div className="flex gap-2"><div className="w-7 h-7 bg-gray-100 rounded-lg" /><div className="w-7 h-7 bg-gray-100 rounded-lg" /></div>
      </div>
    </div>
  );
}

function EmptyState({ onNueva }: { onNueva: () => void }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: `${CP}12` }}><Package size={28} style={{ color: CP }} /></div>
      <p className="font-headline text-lg font-black uppercase tracking-wide text-gray-700">Sin órdenes</p>
      <p className="text-sm text-gray-400 mt-1 mb-5">No se encontraron órdenes con los filtros seleccionados.</p>
      <button onClick={onNueva} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90" style={{ backgroundColor: CP }}>
        <Plus size={14} /> Agregar primera orden
      </button>
    </div>
  );
}

function TimelineStep({ paso, isLast, index, onClick }: { paso: OrdenPasoFE; isLast: boolean; index: number; onClick: (p: OrdenPasoFE) => void }) {
  const completado = paso.estado === 'completado';
  const enProceso  = paso.estado === 'en_proceso';

  const bgCard  = completado ? CP     : enProceso ? CS       : '#F3F4F6';
  const txCard  = completado ? '#fff' : enProceso ? '#fff'   : '#9CA3AF';
  const borderC = completado ? CP     : enProceso ? CS       : '#E5E7EB';
  const StepIcon = completado ? CheckCheck : enProceso ? Clock : Circle;

  return (
    <div className="flex flex-col items-center shrink-0" style={{ width: '110px' }}>
      <button
        onClick={() => onClick(paso)}
        title={completado ? 'Marcar como pendiente' : enProceso ? 'Marcar como completado' : 'Iniciar este paso'}
        className="w-full rounded-xl p-2.5 text-center shadow-sm border transition-all hover:opacity-85 active:scale-95 cursor-pointer"
        style={{ backgroundColor: bgCard, borderColor: borderC, color: txCard }}
      >
        <p className="text-[0.6rem] font-black uppercase tracking-wide leading-tight mb-1.5">{paso.label}</p>
        {(completado || enProceso) ? (
          <>
            <div className="flex items-center justify-center gap-0.5 mb-0.5">
              <Calendar size={8} style={{ color: txCard, opacity: 0.7 }} />
              <span className="text-[0.55rem] font-semibold" style={{ opacity: 0.9 }}>{paso.fecha ?? '—'}</span>
            </div>
            <div className="flex items-center justify-center gap-0.5">
              <User size={8} style={{ color: txCard, opacity: 0.7 }} />
              <span className="text-[0.55rem]" style={{ opacity: 0.8 }}>{paso.usuario ?? '—'}</span>
            </div>
          </>
        ) : (
          <p className="text-[0.55rem]" style={{ color: '#9CA3AF' }}>Pendiente</p>
        )}
      </button>
      <div className="flex items-center w-full mt-2">
        <div className="flex-1 h-px" style={{ backgroundColor: index === 0 ? 'transparent' : completado ? CP : '#E5E7EB' }} />
        <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all" style={{ backgroundColor: completado ? CP : enProceso ? CS : '#fff', borderColor: completado ? CP : enProceso ? CS : '#D1D5DB' }}>
          <StepIcon size={10} className={completado || enProceso ? 'text-white' : 'text-gray-300'} />
        </div>
        <div className="flex-1 h-px" style={{ backgroundColor: isLast ? 'transparent' : completado ? CP : '#E5E7EB' }} />
      </div>
      <p className="text-[0.55rem] font-bold mt-1" style={{ color: completado ? CP : enProceso ? CS : '#9CA3AF' }}>{String(index + 1).padStart(2, '0')}</p>
    </div>
  );
}

function OperationTimeline({ orden, pasos, loadingPasos, onStepClick }: {
  orden: OrdenOp | null;
  pasos: OrdenPasoFE[];
  loadingPasos: boolean;
  onStepClick: (paso: OrdenPasoFE) => void;
}) {
  if (!orden) return null;
  const completadas = pasos.filter(p => p.estado === 'completado').length;
  const pct = pasos.length > 0 ? Math.round((completadas / pasos.length) * 100) : 0;
  const cfg  = ESTADO_CONFIG[orden.estado];
  const Icon = cfg.icon;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between gap-3 flex-wrap" style={{ backgroundColor: `${CP}08` }}>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: CP }}><Clock size={14} className="text-white" /></div>
          <div className="min-w-0">
            <p className="font-headline text-sm font-black uppercase tracking-wide" style={{ color: CP }}>Vida de la Solicitud</p>
            <p className="text-[0.65rem] text-gray-400 truncate">{orden.id} · {orden.cliente}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={`inline-flex items-center gap-1 text-[0.6rem] font-bold px-2 py-0.5 rounded-full border ${cfg.badge}`}><Icon size={9} /> {cfg.label}</span>
          <div className="text-[0.65rem] text-gray-500 flex items-center gap-1">
            <span className="hidden sm:inline">Pasos:</span>
            <span className="font-black" style={{ color: CP }}>{completadas}/{pasos.length}</span>
          </div>
        </div>
      </div>

      <div className="px-4 py-5 overflow-x-auto">
        {loadingPasos ? (
          <div className="flex gap-2 min-w-max">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="w-[110px] h-[72px] bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="flex gap-2 min-w-max mx-auto" style={{ paddingBottom: '4px' }}>
            {pasos.map((paso, i) => (
              <TimelineStep key={paso.id} paso={paso} isLast={i === pasos.length - 1} index={i} onClick={onStepClick} />
            ))}
          </div>
        )}
      </div>

      <div className="px-4 pb-4">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[0.6rem] font-bold text-gray-500 uppercase tracking-wide">Progreso general</span>
          <span className="text-[0.65rem] font-black" style={{ color: CP }}>{pct}%</span>
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: CP }} />
        </div>
        <p className="text-[0.6rem] text-gray-400 mt-2">Haz clic en un paso para avanzar su estado · pendiente → en proceso → completado</p>
      </div>
    </div>
  );
}

function OrdenModal({ initial, onClose, onSave }: { initial?: OrdenOp | null; onClose: () => void; onSave: (data: Partial<OrdenOp>) => Promise<void> }) {
  const [form, setForm] = useState({
    cliente:      initial?.cliente      ?? '',
    campana:      initial?.campana      ?? '',
    fecha:        initial?.fecha        ?? '',
    lote:         initial?.lote         ?? '',
    cantidadKg:   initial?.cantidadKg   ?? 0,
    destino:      initial?.destino      ?? '',
    tipoProducto: initial?.tipoProducto ?? '',
    montoUSD:     initial?.montoUSD     ?? 0,
    estado:       initial?.estado       ?? 'pre_venta' as EstadoOrden,
  });
  const [lotes,        setLotes]        = useState<LoteFinal[]>([]);
  const [saving,       setSaving]       = useState(false);
  const toast = useToast();
  const [loteCantidad, setLoteCantidad] = useState<number | null>(null);
  const [venderTodo,   setVenderTodo]   = useState(false);
  const autoTp = useRef(false);

  useEffect(() => {
    lotesFinalesService.getPage({ limit: 200 } as never).then(r => setLotes(r.data));
  }, []);

  const set = <K extends keyof typeof form>(k: K, v: typeof form[K]) => setForm(f => ({ ...f, [k]: v }));

  async function handleSave() {
    setSaving(true);
    try { await onSave(form); onClose(); }
    catch (e: any) { toast.error(e?.response?.data?.message ?? 'Error al guardar'); }
    finally { setSaving(false); }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={e => !saving && e.target === e.currentTarget && onClose()}>
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col" style={{ maxHeight: '90vh' }}>
        {saving && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center rounded-2xl" style={{ backgroundColor: 'rgba(255,255,255,0.93)', backdropFilter: 'blur(2px)' }}>
            <LoadingLogo compact />
            <p className="text-sm font-semibold text-gray-600 mt-3">Guardando…</p>
          </div>
        )}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
          <div>
            <h2 className="font-headline text-base font-black uppercase tracking-wide" style={{ color: CP }}>{initial ? 'Editar Orden' : 'Nueva Orden de Venta'}</h2>
            {initial && <p className="text-xs text-gray-400 mt-0.5">{initial.id}</p>}
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"><X size={18} /></button>
        </div>
        <div className="overflow-y-auto flex-1 px-5 py-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Cliente</label>
              <input value={form.cliente} onChange={e => set('cliente', e.target.value)} className={INP} placeholder="Razón social del cliente…" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Campaña</label>
              <input value={form.campana} onChange={e => set('campana', e.target.value)} className={INP} placeholder="Campaña 2025/2026…" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Fecha</label>
              <input type="date" value={form.fecha} onChange={e => set('fecha', e.target.value)} className={INP} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Lote Final</label>
              <select
                value={form.lote}
                onChange={e => {
                  const codigo = e.target.value;
                  const lf = lotes.find(l => l.codigo === codigo);
                  const newKg = lf?.cantidadKg ?? null;
                  setLoteCantidad(newKg);
                  if (lf?.tipoProducto) {
                    const t    = lf.tipoProducto;
                    const tipo = t.tipo.charAt(0).toUpperCase() + t.tipo.slice(1).toLowerCase();
                    const sub  = t.subtipoSalida ? ' ' + t.subtipoSalida.charAt(0).toUpperCase() + t.subtipoSalida.slice(1).toLowerCase() : '';
                    autoTp.current = true;
                    setForm(f => ({ ...f, lote: codigo, tipoProducto: (tipo + sub).trim(), ...(venderTodo && newKg !== null ? { cantidadKg: newKg } : {}) }));
                  } else {
                    setForm(f => ({ ...f, lote: codigo, ...(venderTodo && newKg !== null ? { cantidadKg: newKg } : {}) }));
                  }
                }}
                className={INP}
              >
                <option value="">Seleccionar…</option>
                {lotes.map(l => <option key={l.id} value={l.codigo}>{l.codigo}{l.tipoProducto ? ` · ${l.tipoProducto.tipo}` : ''}</option>)}
              </select>
              {loteCantidad !== null && (
                <p className="mt-1 text-[0.62rem] font-medium text-gray-500">
                  Disponible: <strong className="text-gray-800">{loteCantidad.toLocaleString()} kg</strong>
                </p>
              )}
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Cantidad (kg)</label>
              {loteCantidad !== null && (
                <label className="flex items-center gap-2 cursor-pointer select-none mb-1.5">
                  <input
                    type="checkbox"
                    checked={venderTodo}
                    onChange={e => {
                      const checked = e.target.checked;
                      setVenderTodo(checked);
                      if (checked && loteCantidad !== null) set('cantidadKg', loteCantidad);
                    }}
                    className="rounded border-gray-300 w-3.5 h-3.5 accent-green-800"
                  />
                  <span className="text-[0.62rem] font-semibold text-gray-700">Vender todo el lote ({loteCantidad.toLocaleString()} kg)</span>
                </label>
              )}
              <input
                type="number"
                min={0}
                max={loteCantidad ?? undefined}
                step={100}
                value={form.cantidadKg}
                onChange={e => { setVenderTodo(false); set('cantidadKg', Number(e.target.value)); }}
                className={INP}
                disabled={venderTodo}
              />
              {loteCantidad !== null && form.cantidadKg > loteCantidad && (
                <p className="mt-1 text-[0.6rem] text-red-600 font-medium">Supera los {loteCantidad.toLocaleString()} kg disponibles</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Monto USD</label>
              <input type="number" min={0} step={100} value={form.montoUSD} onChange={e => set('montoUSD', Number(e.target.value))} className={INP} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                Tipo de Producto
                {autoTp.current && form.tipoProducto && (
                  <span className="ml-2 text-[0.55rem] font-bold px-1.5 py-0.5 rounded" style={{ background: '#D1FAE5', color: '#065F46' }}>auto</span>
                )}
              </label>
              <input
                value={form.tipoProducto}
                onChange={e => { autoTp.current = false; set('tipoProducto', e.target.value); }}
                className={INP}
                placeholder="Auto desde lote o escribe…"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Destino</label>
              <input value={form.destino} onChange={e => set('destino', e.target.value)} className={INP} placeholder="País destino…" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Estado</label>
              <select value={form.estado} onChange={e => set('estado', e.target.value as EstadoOrden)} className={INP}>
                {(Object.keys(ESTADO_CONFIG) as EstadoOrden[]).map(k => <option key={k} value={k}>{ESTADO_CONFIG[k].label}</option>)}
              </select>
            </div>
          </div>
        </div>
        <div className="px-5 py-4 border-t border-gray-100 flex gap-3 shrink-0">
          <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">Cancelar</button>
          <button type="button" onClick={handleSave} disabled={saving} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60" style={{ backgroundColor: CP }}>
            {saving ? 'Guardando…' : initial ? 'Guardar cambios' : 'Crear orden'}
          </button>
        </div>
      </div>
    </div>
  );
}

function DeleteConfirm({ orden, onClose, onConfirm }: { orden: OrdenOp; onClose: () => void; onConfirm: () => Promise<void> }) {
  const [loading, setLoading] = useState(false);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center"><Trash2 size={22} className="text-red-600" /></div>
        <div className="text-center">
          <p className="font-bold text-gray-800">¿Eliminar orden?</p>
          <p className="text-sm text-gray-500 mt-1">Se eliminará <span className="font-semibold">{orden.id}</span> — {orden.cliente}. Esta acción no se puede deshacer.</p>
        </div>
        <div className="flex gap-3 w-full">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50">Cancelar</button>
          <button onClick={async () => { setLoading(true); await onConfirm(); setLoading(false); }} disabled={loading} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors disabled:opacity-60">
            {loading ? 'Eliminando…' : 'Eliminar'}
          </button>
        </div>
      </div>
    </div>
  );
}

type ModalType = 'create' | 'edit' | 'delete' | null;

const NEXT_ESTADO: Record<EstadoPaso, EstadoPaso> = {
  pendiente:  'en_proceso',
  en_proceso: 'completado',
  completado: 'pendiente',
};

export function OperacionesPage() {
  const [ordenes, setOrdenes]             = useState<OrdenOp[]>([]);
  const [loading, setLoading]             = useState(true);
  const [modal, setModal]                 = useState<ModalType>(null);
  const [selected, setSelected]           = useState<OrdenOp | null>(null);
  const [activeTimeline, setActiveTimeline] = useState<OrdenOp | null>(null);
  const [pasos, setPasos]                 = useState<OrdenPasoFE[]>([]);
  const [loadingPasos, setLoadingPasos]   = useState(false);

  const [filtroCliente, setFiltroCliente] = useState('');
  const [filtroFecha,   setFiltroFecha]   = useState('');
  const [filtroLote,    setFiltroLote]    = useState('');

  const loadOrdenes = useCallback(async (params?: Record<string, unknown>) => {
    setLoading(true);
    try {
      const data = await ordenesVentaService.getAll({ limit: 200, ...params });
      setOrdenes(data);
      if (!activeTimeline && data.length > 0) setActiveTimeline(data[0]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadOrdenes(); }, [loadOrdenes]);

  useEffect(() => {
    if (!activeTimeline) { setPasos([]); return; }
    setLoadingPasos(true);
    ordenesVentaService.getPasos(activeTimeline.dbId)
      .then(setPasos)
      .finally(() => setLoadingPasos(false));
  }, [activeTimeline]);

  function handleBuscar() {
    const params: Record<string, unknown> = {};
    if (filtroCliente.trim()) params.search = filtroCliente.trim();
    if (filtroLote.trim())    params.lote   = filtroLote.trim();
    loadOrdenes(params);
  }

  async function handleSave(data: Partial<OrdenOp>) {
    if (modal === 'edit' && selected) {
      const updated = await ordenesVentaService.update(selected.dbId, {
        cliente:      data.cliente,
        campana:      data.campana,
        fecha:        data.fecha,
        lote:         data.lote,
        cantidadKg:   data.cantidadKg,
        destino:      data.destino,
        tipoProducto: data.tipoProducto,
        montoUSD:     data.montoUSD,
        etapaActual:  data.estado ? mapEstadoToEtapa(data.estado) : undefined,
      });
      setOrdenes(prev => prev.map(o => o.dbId === selected.dbId ? updated : o));
      if (activeTimeline?.dbId === selected.dbId) setActiveTimeline(updated);
    } else {
      const created = await ordenesVentaService.create({
        cliente:      data.cliente      ?? '',
        productor:    '',
        campana:      data.campana,
        fecha:        data.fecha,
        lote:         data.lote,
        cantidadKg:   data.cantidadKg   ?? 0,
        destino:      data.destino,
        tipoProducto: data.tipoProducto,
        montoUSD:     data.montoUSD     ?? 0,
        etapaActual:  data.estado ? mapEstadoToEtapa(data.estado) : 'preventa',
      });
      setOrdenes(prev => [created, ...prev]);
      setActiveTimeline(created);
    }
  }

  async function handleDelete() {
    if (!selected) return;
    await ordenesVentaService.remove(selected.dbId);
    setOrdenes(prev => prev.filter(o => o.dbId !== selected.dbId));
    if (activeTimeline?.dbId === selected.dbId) {
      const remaining = ordenes.filter(o => o.dbId !== selected.dbId);
      setActiveTimeline(remaining[0] ?? null);
    }
    setModal(null);
    setSelected(null);
  }

  async function handleStepClick(paso: OrdenPasoFE) {
    if (!activeTimeline) return;
    const nextEstado = NEXT_ESTADO[paso.estado];
    const today = new Date().toISOString().slice(0, 10);
    const updated = await ordenesVentaService.updatePaso(activeTimeline.dbId, paso.indice, {
      estado:  nextEstado,
      fecha:   nextEstado !== 'pendiente' ? today : undefined,
      usuario: nextEstado !== 'pendiente' ? 'admin' : undefined,
    });
    setPasos(prev => prev.map(p => p.indice === paso.indice ? updated : p));
  }

  const counts = (Object.keys(ESTADO_CONFIG) as EstadoOrden[]).map(k => ({
    ...ESTADO_CONFIG[k], key: k, count: ordenes.filter(o => o.estado === k).length,
  }));

  return (
    <div className="min-h-full bg-gray-50 flex flex-col">
      <div className="px-4 md:px-8 pt-6 pb-3 bg-white border-b border-gray-100">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h1 className="font-headline text-2xl sm:text-3xl font-black uppercase tracking-wide text-gray-800" style={{ letterSpacing: '0.05em' }}>Gestión de Operaciones</h1>
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
        filtroCliente={filtroCliente} setFiltroCliente={setFiltroCliente}
        filtroFecha={filtroFecha}     setFiltroFecha={setFiltroFecha}
        filtroLote={filtroLote}       setFiltroLote={setFiltroLote}
        onBuscar={handleBuscar}
        onNueva={() => { setSelected(null); setModal('create'); }}
      />

      <div className="flex-1 px-4 md:px-8 py-6 space-y-6">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {ordenes.length === 0
              ? <EmptyState onNueva={() => { setSelected(null); setModal('create'); }} />
              : ordenes.map(o => (
                  <OperationCard
                    key={o.dbId}
                    orden={o}
                    onEdit={ord => { setSelected(ord); setModal('edit'); }}
                    onDelete={ord => { setSelected(ord); setModal('delete'); }}
                    onTimeline={ord => setActiveTimeline(ord)}
                  />
                ))
            }
          </div>
        )}

        <OperationTimeline
          orden={activeTimeline}
          pasos={pasos}
          loadingPasos={loadingPasos}
          onStepClick={handleStepClick}
        />
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
