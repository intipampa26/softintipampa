import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  lotesService, Lote, CreateLoteDto, FilterLotesDto, LoteEstado, PagedLotes,
} from '@/services/lotes.service';
import { tiposProductoService, TipoProducto } from '@/services/tipos-producto.service';
import { campanasService, Campana } from '@/services/campanas.service';
import { productoresService, Productor } from '@/services/productores.service';
import { parcelasService, Parcela } from '@/services/parcelas.service';
import { configuracionService } from '@/services/configuracion.service';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { TablePagination } from '@/components/TablePagination';
import LoadingLogo from '@/components/LoadingLogo';

const PLANTAS = ['CB Jaen', 'CB Lima', 'Kuska', 'Mego', 'Selva Norte'];

function parseVariedades(raw: string | null | undefined): string[] {
  try { return JSON.parse(raw ?? '[]') ?? []; } catch { return []; }
}

function VariedadSelect({ value, onChange, variedades, placeholder = 'Sin variedad', className = '' }: {
  value: string | undefined; onChange: (v: string | undefined) => void;
  variedades: string[]; placeholder?: string; className?: string;
}) {
  const isCustom = !!value && !variedades.includes(value);
  const [showCustom, setShowCustom] = useState(isCustom);
  useEffect(() => { setShowCustom(!!value && !variedades.includes(value)); }, [value, variedades]);
  return (
    <div className="space-y-1">
      <select
        value={showCustom ? 'otros' : (value ?? '')}
        onChange={(e) => {
          if (e.target.value === 'otros') { setShowCustom(true); onChange(''); }
          else { setShowCustom(false); onChange(e.target.value || undefined); }
        }}
        className={className}
      >
        <option value="">{placeholder}</option>
        {variedades.map((v) => <option key={v} value={v}>{v}</option>)}
        <option value="otros">Otros…</option>
      </select>
      {showCustom && (
        <input
          type="text"
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value || undefined)}
          placeholder="Ingresa la variedad…"
          className={className}
        />
      )}
    </div>
  );
}

const ESTADO_LABEL: Record<LoteEstado, string> = {
  PRE_ADQUISICION:  'Pre Adquisición',
  POST_ADQUISICION: 'Post Adquisición',
  PRE_TRILLADO:     'Pre Alistado',
  POST_TRILLADO:    'Post Alistado',
  PREPARADO:        'Preparado',
  EMBARCADO:        'Embarcado',
  EXPORTADO:        'Exportado',
};
const ESTADO_DOT: Record<LoteEstado, string> = {
  PRE_ADQUISICION:  'bg-orange-400',
  POST_ADQUISICION: 'bg-yellow-400',
  PRE_TRILLADO:     'bg-amber-500',
  POST_TRILLADO:    'bg-lime-500',
  PREPARADO:        'bg-green-500',
  EMBARCADO:        'bg-blue-500',
  EXPORTADO:        'bg-indigo-600',
};

function LoteFormModal({ tiposProducto, campanas, variedades, onClose, onSave, initial }: {
  tiposProducto: TipoProducto[];
  campanas: Campana[];
  variedades: string[];
  onClose: () => void;
  onSave: (dto: Partial<CreateLoteDto>) => Promise<void>;
  initial?: Lote;
}) {
  const isEdit = !!initial;
  const [productores, setProductores] = useState<Productor[]>([]);
  const [parcelas,    setParcelas]    = useState<Parcela[]>([]);
  const [form, setForm] = useState<Partial<CreateLoteDto>>({
    tipoProductoId:   initial?.tipoProductoId   ?? undefined,
    campanaId:        initial?.campanaId         ?? undefined,
    productorId:      initial?.productorId       ?? undefined,
    parcelaId:        initial?.parcelaId         ?? undefined,
    cantidadKg:       initial?.cantidadKg        ?? undefined,
    cantidadSacos:    initial?.cantidadSacos     ?? undefined,
    fechaAdquisicion: initial?.fechaAdquisicion  ?? undefined,
    variedad:         initial?.variedad          ?? undefined,
    planta:           initial?.planta            ?? undefined,
    observaciones:    initial?.observaciones     ?? undefined,
  });
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState('');
  const [plantaOtro, setPlantaOtro] = useState(() => {
    const p = initial?.planta;
    return !!p && !PLANTAS.includes(p);
  });

  useEffect(() => {
    if (!form.campanaId) { setProductores([]); return; }
    productoresService.getPage(1, 100, form.campanaId).then(r => setProductores(r.data));
  }, [form.campanaId]);

  useEffect(() => {
    if (!form.productorId) { setParcelas([]); if (!isEdit) setForm(f => ({ ...f, parcelaId: undefined })); return; }
    parcelasService.getPage(1, 100, form.productorId).then(r => setParcelas(r.data));
  }, [form.productorId, isEdit]);

  const cls = 'w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.tipoProductoId || !form.productorId || !form.cantidadKg) {
      setError('Tipo de producto, productor y cantidad son requeridos');
      return;
    }
    setSaving(true); setError('');
    try { await onSave(form); onClose(); }
    catch (err) { setError((err as Error).message || 'Error al guardar'); }
    finally { setSaving(false); }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4" style={{ backgroundColor: 'rgba(0,0,0,0.45)' }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="relative bg-white rounded-t-2xl sm:rounded-2xl shadow-xl w-full sm:max-w-lg max-h-[92dvh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h2 className="font-bold text-gray-800">{isEdit ? `Editar lote — ${initial!.codigo}` : 'Nuevo lote'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg></button>
        </div>
        {saving && <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-2 rounded-2xl" style={{ backgroundColor: 'rgba(255,255,255,0.93)', backdropFilter: 'blur(2px)' }}><LoadingLogo compact /></div>}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-3">
          {error && <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">{error}</p>}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Tipo Producto *</label>
              <select value={form.tipoProductoId ?? ''} onChange={e => setForm(f => ({ ...f, tipoProductoId: e.target.value ? Number(e.target.value) : undefined }))} className={cls}>
                <option value="">Seleccionar…</option>
                {tiposProducto.map(t => <option key={t.id} value={t.id}>{t.tipo} ({t.subtipoEntrada})</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Campaña</label>
              <select value={form.campanaId ?? ''} onChange={e => setForm(f => ({ ...f, campanaId: e.target.value ? Number(e.target.value) : undefined, productorId: undefined }))} className={cls}>
                <option value="">Sin campaña</option>
                {campanas.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Productor *</label>
            <select
              value={form.productorId ?? ''}
              onChange={e => setForm(f => ({ ...f, productorId: e.target.value ? Number(e.target.value) : undefined, parcelaId: undefined }))}
              disabled={!form.campanaId}
              className={`${cls} disabled:opacity-50`}
            >
              <option value="">{!form.campanaId ? 'Selecciona campaña primero' : 'Seleccionar productor…'}</option>
              {productores.map(p => <option key={p.id} value={p.id}>{p.nombre} {p.apellido ?? ''}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
              Parcela
              {parcelas.length === 0 && form.productorId && (
                <span className="ml-2 text-gray-400 font-normal normal-case">(este productor no tiene parcelas)</span>
              )}
            </label>
            <select
              value={form.parcelaId ?? ''}
              onChange={e => setForm(f => ({ ...f, parcelaId: e.target.value ? Number(e.target.value) : undefined }))}
              disabled={!form.productorId || parcelas.length === 0}
              className={`${cls} disabled:opacity-50`}
            >
              <option value="">{!form.productorId ? 'Selecciona productor primero' : '— Sin parcela —'}</option>
              {parcelas.map(p => (
                <option key={p.id} value={p.id}>
                  {p.nombre} {p.codigo ? `(${p.codigo})` : ''}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Cantidad (kg) *</label>
              <input type="number" min={0.01} step={0.01} value={form.cantidadKg ?? ''} onChange={e => setForm(f => ({ ...f, cantidadKg: e.target.value ? Number(e.target.value) : undefined }))} className={cls} placeholder="0.00" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Sacos (ref.)</label>
              <input type="number" min={0} value={form.cantidadSacos ?? ''} onChange={e => setForm(f => ({ ...f, cantidadSacos: e.target.value ? Number(e.target.value) : undefined }))} className={cls} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Fecha adquisición</label>
            <input type="date" value={form.fechaAdquisicion ?? ''} onChange={e => setForm(f => ({ ...f, fechaAdquisicion: e.target.value || undefined }))} className={cls} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Variedad</label>
              <VariedadSelect
                value={form.variedad}
                onChange={(v) => setForm(f => ({ ...f, variedad: v }))}
                variedades={variedades}
                placeholder="Sin variedad"
                className={cls}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Planta</label>
              <select
                value={plantaOtro ? 'Otro' : (form.planta ?? '')}
                onChange={e => {
                  const v = e.target.value;
                  if (v === 'Otro') { setPlantaOtro(true); setForm(f => ({ ...f, planta: undefined })); }
                  else { setPlantaOtro(false); setForm(f => ({ ...f, planta: v || undefined })); }
                }}
                className={cls}
              >
                <option value="">Sin planta</option>
                {PLANTAS.map(p => <option key={p} value={p}>{p}</option>)}
                <option value="Otro">Otro</option>
              </select>
              {plantaOtro && (
                <input
                  value={form.planta ?? ''}
                  onChange={e => setForm(f => ({ ...f, planta: e.target.value || undefined }))}
                  className={`${cls} mt-1`}
                  placeholder="Especificar planta…"
                  autoFocus
                />
              )}
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Observaciones</label>
            <textarea value={form.observaciones ?? ''} onChange={e => setForm(f => ({ ...f, observaciones: e.target.value || undefined }))} rows={2} className={`${cls} resize-none`} />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50">Cancelar</button>
            <button type="submit" disabled={saving} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor: '#1A2B23' }}>{isEdit ? 'Guardar cambios' : 'Crear lote'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DeleteConfirm({ lote, onClose, onConfirm }: { lote: Lote; onClose: () => void; onConfirm: () => Promise<void> }) {
  const [loading, setLoading] = useState(false);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}>
      <div className="relative overflow-hidden bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
        {loading && <div className="absolute inset-0 z-20 flex items-center justify-center rounded-2xl" style={{ backgroundColor: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(2px)' }}><LoadingLogo compact /></div>}
        <h3 className="font-bold text-gray-800 mb-2">Eliminar lote</h3>
        <p className="text-sm text-gray-500 mb-5">¿Eliminar <strong>"{lote.codigo}"</strong>? Esta acción no se puede deshacer.</p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50">Cancelar</button>
          <button disabled={loading} onClick={async () => { setLoading(true); await onConfirm(); setLoading(false); }} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor: '#dc2626' }}>Eliminar</button>
        </div>
      </div>
    </div>
  );
}

export function LotesPage() {
  const navigate = useNavigate();
  const { isOffline } = useNetworkStatus();
  const [lotes, setLotes] = useState<Lote[]>([]);
  const [meta,  setMeta]  = useState({ total: 0, page: 1, lastPage: 1, limit: 10 });
  const [loading, setLoading] = useState(true);
  const [page,  setPage]  = useState(1);
  const [modal, setModal] = useState<'create' | 'edit' | 'delete' | null>(null);
  const [selected, setSelected] = useState<Lote | null>(null);

  const [tiposProducto, setTiposProducto] = useState<TipoProducto[]>([]);
  const [campanas,      setCampanas]      = useState<Campana[]>([]);
  const [variedades,    setVariedades]    = useState<string[]>([]);

  const [filterTipo,     setFilterTipo]     = useState('');
  const [filterEstado,   setFilterEstado]   = useState<LoteEstado | ''>('');
  const [filterCampana,  setFilterCampana]  = useState('');
  const [filterVariedad, setFilterVariedad] = useState('');
  const [filterPlanta,   setFilterPlanta]   = useState('');
  const [filterProductor, setFilterProductor] = useState('');
  const [productores, setProductores] = useState<Productor[]>([]);

  useEffect(() => {
    tiposProductoService.getAll().then(setTiposProducto);
    campanasService.getPage(1, 100).then(r => setCampanas(r.data));
    configuracionService.get().then(c => setVariedades(parseVariedades(c?.variedades)));
    productoresService.getPage(1, 200).then(r => setProductores(r.data));
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    const filter: FilterLotesDto = { page, limit: 10 };
    if (filterTipo)      filter.tipoProductoId = Number(filterTipo);
    if (filterEstado)    filter.estado         = filterEstado;
    if (filterCampana)   filter.campanaId      = Number(filterCampana);
    if (filterVariedad)  filter.variedad       = filterVariedad;
    if (filterPlanta)    filter.planta         = filterPlanta;
    if (filterProductor) filter.productorId    = Number(filterProductor);
    const result = await lotesService.getPage(filter);
    setLotes(result.data);
    setMeta(result.meta);
    setLoading(false);
  }, [page, filterTipo, filterEstado, filterCampana, filterVariedad, filterProductor, filterPlanta]);

  useEffect(() => { load(); }, [load]);

  async function handleCreate(dto: Partial<CreateLoteDto>) {
    await lotesService.create(dto as CreateLoteDto);
    await load();
  }

  async function handleEdit(dto: Partial<CreateLoteDto>) {
    if (!selected) return;
    await lotesService.update(selected.id, dto);
    await load();
  }

  async function handleDelete() {
    if (!selected) return;
    await lotesService.remove(selected.id);
    setModal(null); setSelected(null);
    await load();
  }

  return (
    <div className="min-h-full bg-white flex flex-col">
      <div className="px-4 md:px-8 pt-6 pb-3">
        <h1 className="font-headline text-2xl sm:text-3xl font-black uppercase tracking-wide text-gray-800" style={{ letterSpacing: '0.05em' }}>Lotes</h1>
        <p className="text-xs text-gray-400 mt-0.5">Gestión de lotes de café y cacao desde adquisición hasta Lote Final</p>
      </div>

      <div className="px-4 md:px-8 py-4 bg-white border-b border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-end gap-3">
          <div className="flex flex-wrap gap-3 flex-1">
            <div className="w-full sm:w-52">
              <label className="block text-[0.65rem] font-bold text-gray-600 uppercase tracking-wider mb-1">Campaña</label>
              <select
                value={filterCampana}
                onChange={e => { setFilterCampana(e.target.value); setPage(1); }}
                className="w-full border border-gray-300 bg-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Todas las campañas</option>
                {campanas.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
              </select>
            </div>
            <div className="w-full sm:w-40">
              <label className="block text-[0.65rem] font-bold text-gray-600 uppercase tracking-wider mb-1">Tipo Producto</label>
              <select value={filterTipo} onChange={e => { setFilterTipo(e.target.value); setPage(1); }} className="w-full border border-gray-300 bg-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                <option value="">Todos</option>
                {tiposProducto.map(t => <option key={t.id} value={t.id}>{t.tipo}</option>)}
              </select>
            </div>
            <div className="w-full sm:w-40">
              <label className="block text-[0.65rem] font-bold text-gray-600 uppercase tracking-wider mb-1">Productor</label>
              <select
                value={filterProductor}
                onChange={e => { setFilterProductor(e.target.value); setPage(1); }}
                className="w-full border border-gray-300 bg-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Todos</option>
                {productores.map(p => <option key={p.id} value={p.id}>{p.nombre} {p.apellido ?? ''}</option>)}
              </select>
            </div>
            <div className="w-full sm:w-36">
              <label className="block text-[0.65rem] font-bold text-gray-600 uppercase tracking-wider mb-1">Variedad</label>
              <input
                value={filterVariedad}
                onChange={e => { setFilterVariedad(e.target.value); setPage(1); }}
                className="w-full border border-gray-300 bg-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Variedad…"
              />
            </div>
            <div className="w-full sm:w-40">
              <label className="block text-[0.65rem] font-bold text-gray-600 uppercase tracking-wider mb-1">Planta</label>
              <select value={filterPlanta} onChange={e => { setFilterPlanta(e.target.value); setPage(1); }} className="w-full border border-gray-300 bg-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                <option value="">Todas</option>
                {PLANTAS.map(p => <option key={p} value={p}>{p}</option>)}
                <option value="Otro">Otro</option>
              </select>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => navigate('/dashboard/lotes-finales')} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-white" style={{ backgroundColor: '#2d5a3d' }}>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 12l2 2 4-4"/></svg>
              <span className="hidden sm:inline">Lotes Finales</span>
              <span className="sm:hidden">Finales</span>
            </button>
            <button onClick={() => navigate('/dashboard/mermas')} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-white" style={{ backgroundColor: '#B45309' }}>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
              Mermas
            </button>
            <button onClick={() => setModal('create')} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white" style={{ backgroundColor: '#1A2B23' }}>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>
              Nuevo
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mt-3">
          {(['', 'PRE_ADQUISICION', 'POST_ADQUISICION', 'PRE_TRILLADO', 'POST_TRILLADO', 'PREPARADO', 'EMBARCADO', 'EXPORTADO'] as const).map(e => (
            <button key={e} onClick={() => { setFilterEstado(e as LoteEstado | ''); setPage(1); }} className={`px-2.5 py-1 rounded-full text-[0.65rem] font-semibold border transition-all ${filterEstado === e ? 'text-white border-transparent' : 'bg-white text-gray-500 border-gray-300 hover:border-gray-500'}`} style={filterEstado === e ? { backgroundColor: '#1A2B23' } : {}}>
              {e === '' ? 'Todos' : ESTADO_LABEL[e as LoteEstado]}
            </button>
          ))}
        </div>
      </div>

      <div className="relative flex-1 px-4 md:px-8 py-6">
        {isOffline && <div className="mb-4 text-xs text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-2.5 inline-flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"/>Modo offline</div>}
        {loading && <div className="absolute inset-0 z-40 flex items-center justify-center" style={{ backgroundColor: 'rgba(249,250,251,0.9)', backdropFilter: 'blur(2px)' }}><LoadingLogo /></div>}

        {!loading && lotes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400">
            <svg className="w-14 h-14 mb-3 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg>
            <p className="text-sm font-semibold">Sin lotes registrados</p>
            <p className="text-xs mt-1">Crea el primer lote de adquisición</p>
          </div>
        ) : (
          <>
          <div className="sm:hidden space-y-3 mb-4">
            {lotes.map(l => (
              <div key={l.id} onClick={() => navigate(`/dashboard/lotes/${l.id}`)}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 cursor-pointer active:bg-gray-50">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <p className="font-bold text-gray-800 text-sm">{l.codigo}</p>
                    {l.tipoProducto && <p className="text-xs text-gray-400 mt-0.5">{l.tipoProducto.tipo} · {l.tipoProducto.subtipoEntrada}</p>}
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600 shrink-0">
                    <span className={`w-2 h-2 rounded-full ${ESTADO_DOT[l.estado]}`}/>
                    {ESTADO_LABEL[l.estado]}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-500">
                  <span>Cantidad: <strong className="text-gray-700 font-mono">{Number(l.cantidadKg).toFixed(2)} kg</strong></span>
                  <span>Campaña: <strong className="text-gray-700">{l.campana?.nombre ?? '—'}</strong></span>
                  {l.productor && <span className="col-span-2">Productor: <strong className="text-gray-700">{l.productor.nombre} {l.productor.apellido ?? ''}</strong></span>}
                  {l.variedad && <span className="col-span-2">Variedad: <strong className="text-gray-700">{l.variedad}</strong></span>}
                </div>
              </div>
            ))}
            <TablePagination total={meta.total} page={page} lastPage={meta.lastPage} limit={10} onPageChange={setPage} onLimitChange={() => {}} />
          </div>

          <div className="hidden sm:block bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[700px]">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    {['Código', 'Tipo', 'Variedad', 'Cantidad (kg)', 'Estado', 'Productor', 'Campaña', ''].map(h => (
                      <th key={h} className="text-left px-5 py-3 text-[0.68rem] font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {lotes.map(l => (
                    <tr key={l.id} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => navigate(`/dashboard/lotes/${l.id}`)}>
                      <td className="px-5 py-4">
                        <p className="font-semibold text-gray-800">{l.codigo}</p>
                        {l.tipoProducto && <p className="text-xs text-gray-400">{l.tipoProducto.subtipoEntrada}</p>}
                      </td>
                      <td className="px-5 py-4 text-xs font-bold text-gray-600">{l.tipoProducto?.tipo ?? `#${l.tipoProductoId}`}</td>
                      <td className="px-5 py-4 text-xs text-gray-500">{l.variedad || '—'}</td>
                      <td className="px-5 py-4 font-semibold text-gray-800 tabular-nums">{Number(l.cantidadKg).toFixed(2)}</td>
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600">
                          <span className={`w-1.5 h-1.5 rounded-full ${ESTADO_DOT[l.estado]}`}/>
                          {ESTADO_LABEL[l.estado]}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-xs text-gray-500">{l.productor ? `${l.productor.nombre} ${l.productor.apellido ?? ''}`.trim() : `#${l.productorId}`}</td>
                      <td className="px-5 py-4 text-xs text-gray-500">{l.campana?.nombre ?? '—'}</td>
                      <td className="px-5 py-4" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => navigate(`/dashboard/lotes/${l.id}`)} title="Ver detalle" className="p-1.5 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                          </button>
                          <button onClick={() => { setSelected(l); setModal('edit'); }} title="Editar" className="p-1.5 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125"/></svg>
                          </button>
                          <button onClick={() => { setSelected(l); setModal('delete'); }} title="Eliminar" className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <TablePagination total={meta.total} page={page} lastPage={meta.lastPage} limit={10} onPageChange={setPage} onLimitChange={() => {}} />
          </div>
          </>
        )}
      </div>

      {modal === 'create' && (
        <LoteFormModal tiposProducto={tiposProducto} campanas={campanas} variedades={variedades} onClose={() => setModal(null)} onSave={handleCreate} />
      )}
      {modal === 'edit' && selected && (
        <LoteFormModal tiposProducto={tiposProducto} campanas={campanas} variedades={variedades} onClose={() => { setModal(null); setSelected(null); }} onSave={handleEdit} initial={selected} />
      )}
      {modal === 'delete' && selected && (
        <DeleteConfirm lote={selected} onClose={() => setModal(null)} onConfirm={handleDelete} />
      )}
    </div>
  );
}
