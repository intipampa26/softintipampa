import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  lotesFinalesService,
  LoteFinal, LoteFinalEstado, DetalleLoteFinal,
  TrillarDto, BatchTrillarDto, BatchTrillarResumen, GrupoTrilla, MovimientoKardex, LoteOverride,
} from '@/services/lotes-finales.service';
import { tiposProductoService, TipoProducto } from '@/services/tipos-producto.service';
import { skusService, Sku } from '@/services/skus.service';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { TablePagination } from '@/components/TablePagination';
import LoadingLogo from '@/components/LoadingLogo';
import { useToast } from '@/contexts/ToastContext';

const ESTADO_LABEL: Record<LoteFinalEstado, string> = {
  PENDIENTE_TRILLADO: 'Pendiente trillado',
  TRILLADO: 'Trillado',
};
const ESTADO_COLOR: Record<LoteFinalEstado, string> = {
  PENDIENTE_TRILLADO: 'bg-orange-100 text-orange-700 border-orange-200',
  TRILLADO:           'bg-green-100 text-green-700 border-green-200',
};
const ORIGEN_LABEL = { DIRECTO: 'Directo', DIVISION: 'División', MEZCLA: 'Mezcla' };

function TrilladoModal({ lf, onClose, onConfirm }: { lf: LoteFinal; onClose: () => void; onConfirm: (dto: TrillarDto) => Promise<void> }) {
  const PLANTAS = ['CB JAEN', 'CB LIMA', 'EXPOCAFÉ', 'KUSKA', 'MEGO', 'SELVA NORTE', 'AICASA', 'NORANDINO', 'NEGRISA'];

  const [form, setForm] = useState<Partial<TrillarDto>>({
    fecha: new Date().toISOString().slice(0, 10),
    pesoPorQuintalKg: undefined,
    pesoPfKg: undefined,
    mermaReutilizableKg: 0,
    mermaDesechableKg: 0,
    sobranteExportableKg: 0,
    nroLiquidacion: undefined,
  });
  const [newSkuNombre, setNewSkuNombre] = useState('');
  const [creatingNewSku, setCreatingNewSku] = useState(false);
  const [plantaOtro, setPlantaOtro] = useState(false);
  const [saving, setSaving] = useState(false);
  const [skus, setSkus] = useState<Sku[]>([]);
  const [grupos, setGrupos] = useState<GrupoTrilla[]>([]);
  const [modoLiq, setModoLiq] = useState<'select' | 'nuevo'>('select');
  const toast = useToast();

  useEffect(() => {
    skusService.findAll().then(setSkus);
    lotesFinalesService.getGruposTrilla().then(g => {
      setGrupos(g);
      setModoLiq(g.length > 0 ? 'select' : 'nuevo');
    });
  }, []);

  const tipo = lf.tipoProducto?.tipo ?? '';
  const filteredSkus = skus.filter(s => {
    if (s.soloOtros) return false;
    if (tipo === 'CAFE')  return s.codigo?.startsWith('CF') ?? false;
    if (tipo === 'CACAO') return s.codigo?.startsWith('CA') ?? false;
    return true;
  });

  const cantLf = Number(lf.cantidadKg);
  const suma = Number(form.pesoPfKg ?? 0) + Number(form.mermaReutilizableKg ?? 0) + Number(form.mermaDesechableKg ?? 0) + Number(form.sobranteExportableKg ?? 0);
  const diferencia = Math.abs(suma - cantLf);
  const r4Ok = diferencia <= 0.5;

  
  const quintales = form.pesoPfKg && form.pesoPorQuintalKg
    ? Math.floor(Number(form.pesoPfKg) / Number(form.pesoPorQuintalKg))
    : null;
  const kgSueltos = form.pesoPfKg && form.pesoPorQuintalKg
    ? Number((Number(form.pesoPfKg) % Number(form.pesoPorQuintalKg)).toFixed(2))
    : null;

  const cls = 'w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.fecha || form.pesoPorQuintalKg == null || form.pesoPfKg == null) {
      toast.error( 'Fecha, peso por quintal y PF son requeridos');
      return;
    }
    if (!form.planta?.trim() || !form.malla?.trim() || !form.tipoSeleccion?.trim() || !form.encargado?.trim()) {
      toast.error( 'Planta, malla, tipo de selección y encargado son requeridos');
      return;
    }
    if (!r4Ok) { toast.error( `R4 — Suma (${suma.toFixed(2)} kg) ≠ LF (${cantLf.toFixed(2)} kg). Diferencia ${diferencia.toFixed(2)} kg > 0.5 kg`); return; }
    setSaving(true);
    try {
      await onConfirm({
        fecha: form.fecha!,
        planta: form.planta,
        malla: form.malla,
        tipoSeleccion: form.tipoSeleccion,
        encargado: form.encargado,
        pesoPorQuintalKg: Number(form.pesoPorQuintalKg),
        pesoPfKg: Number(form.pesoPfKg),
        mermaReutilizableKg: Number(form.mermaReutilizableKg ?? 0),
        mermaDesechableKg: Number(form.mermaDesechableKg ?? 0),
        sobranteExportableKg: Number(form.sobranteExportableKg ?? 0),
        skuId: form.skuId,
        nroLiquidacion: form.nroLiquidacion,
        observaciones: form.observaciones,
      });
      onClose();
    } catch (err) { toast.error( (err as Error).message); }
    finally { setSaving(false); }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4" style={{ backgroundColor: 'rgba(0,0,0,0.45)' }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-2xl max-h-[95dvh] flex flex-col relative">
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100 shrink-0">
          <div>
            <h2 className="font-black text-gray-800 uppercase tracking-wide">Alistado de Exportación (Trillado)</h2>
            <p className="text-xs text-gray-400 mt-0.5">{lf.codigo} · {Number(lf.cantidadKg).toFixed(2)} kg a trillar</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg></button>
        </div>
        {saving && <div className="absolute inset-0 z-20 flex items-center justify-center rounded-2xl" style={{ backgroundColor: 'rgba(255,255,255,0.93)', backdropFilter: 'blur(2px)' }}><LoadingLogo compact /></div>}
        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 px-6 py-5 space-y-4">

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div><label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Fecha *</label><input type="date" value={form.fecha ?? ''} onChange={e => setForm(f => ({ ...f, fecha: e.target.value }))} className={cls} /></div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Planta *</label>
              <select
                value={plantaOtro ? 'OTRO' : (form.planta ?? '')}
                onChange={e => {
                  if (e.target.value === 'OTRO') { setPlantaOtro(true); setForm(f => ({ ...f, planta: undefined })); }
                  else { setPlantaOtro(false); setForm(f => ({ ...f, planta: e.target.value || undefined })); }
                }}
                className={cls}
              >
                <option value="">Seleccionar…</option>
                {PLANTAS.map(p => <option key={p} value={p}>{p}</option>)}
                <option value="OTRO">OTRO</option>
              </select>
              {plantaOtro && (
                <input
                  autoFocus
                  value={form.planta ?? ''}
                  onChange={e => setForm(f => ({ ...f, planta: e.target.value || undefined }))}
                  className={`${cls} mt-1.5`}
                  placeholder="Nombre de la planta…"
                />
              )}
            </div>
            <div><label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Malla *</label><select value={form.malla ?? ''} onChange={e => setForm(f => ({ ...f, malla: e.target.value || undefined }))} className={cls}><option value="">Seleccionar…</option>{['14','15','16','-14'].map(m => <option key={m} value={m}>{m}</option>)}</select></div>
            <div><label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Tipo Selección *</label><select value={form.tipoSeleccion ?? ''} onChange={e => setForm(f => ({ ...f, tipoSeleccion: e.target.value || undefined }))} className={cls}><option value="">Seleccionar…</option>{['MCM','MC','Selección manual','EP'].map(t => <option key={t} value={t}>{t}</option>)}</select></div>
          </div>
          <div><label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Encargado *</label><input value={form.encargado ?? ''} onChange={e => setForm(f => ({ ...f, encargado: e.target.value || undefined }))} className={cls} /></div>
          {/* Liquidación de trilla — select existente o nueva */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide"># Liquidación de trilla</label>
              <div className="flex rounded-lg border border-gray-200 overflow-hidden text-[0.65rem] font-semibold">
                {grupos.length > 0 && (
                  <button type="button" onClick={() => { setModoLiq('select'); setForm(f => ({ ...f, nroLiquidacion: undefined, existingBatchId: undefined })); }}
                    className={`px-2.5 py-1 transition-colors ${modoLiq === 'select' ? 'text-white' : 'text-gray-500 hover:bg-gray-50'}`}
                    style={modoLiq === 'select' ? { backgroundColor: '#1A2B23' } : {}}>
                    Existente
                  </button>
                )}
                <button type="button" onClick={() => { setModoLiq('nuevo'); setForm(f => ({ ...f, existingBatchId: undefined })); }}
                  className={`px-2.5 py-1 transition-colors ${modoLiq === 'nuevo' ? 'text-white' : 'text-gray-500 hover:bg-gray-50'}`}
                  style={modoLiq === 'nuevo' ? { backgroundColor: '#1A2B23' } : {}}>
                  Nueva
                </button>
              </div>
            </div>

            {modoLiq === 'select' && grupos.length > 0 ? (
              <select
                value={form.existingBatchId ?? ''}
                onChange={e => {
                  const g = grupos.find(x => x.batchId === e.target.value);
                  setForm(f => ({
                    ...f,
                    existingBatchId: g?.batchId,
                    nroLiquidacion:  g?.nroLiquidacion ?? undefined,
                  }));
                }}
                className={cls}
              >
                <option value="">— Sin liquidación —</option>
                {grupos.map(g => (
                  <option key={g.batchId} value={g.batchId}>
                    {g.nroLiquidacion ?? g.batchId.slice(0, 8)} · {g.fecha} · {g.lotesCount} lote{g.lotesCount !== 1 ? 's' : ''} · {g.pesoTotalKg.toFixed(1)} kg
                  </option>
                ))}
              </select>
            ) : (
              <input
                value={form.nroLiquidacion ?? ''}
                onChange={e => setForm(f => ({ ...f, nroLiquidacion: e.target.value || undefined }))}
                className={cls}
                placeholder="Ej: LIQ-2025-001"
              />
            )}
          </div>

          <div className={`border rounded-xl p-4 ${r4Ok ? 'border-green-100 bg-green-50' : 'border-red-100 bg-red-50'}`}>
            <p className={`text-xs font-bold uppercase tracking-wider mb-3 ${r4Ok ? 'text-green-700' : 'text-red-700'}`}>
              R4 — Cuatro salidas del trillado {r4Ok ? '✓' : `✗ diferencia ${diferencia.toFixed(2)} kg`}
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">PF — Producto Final (kg) *</label>
                <input type="number" min={0} step={0.01} value={form.pesoPfKg ?? ''} onChange={e => setForm(f => ({ ...f, pesoPfKg: e.target.value ? Number(e.target.value) : undefined }))} className={cls} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Peso/Quintal (kg) *</label>
                <input type="number" min={0.01} step={0.01} value={form.pesoPorQuintalKg ?? ''} onChange={e => setForm(f => ({ ...f, pesoPorQuintalKg: e.target.value ? Number(e.target.value) : undefined }))} className={cls} placeholder="Ej: 46, 55.2, 80" />
                <p className="text-[0.6rem] text-gray-400 mt-0.5">Varía por región — NO fijo</p>
              </div>
              <div><label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">LR — Merma Reutilizable (kg)</label><input type="number" min={0} step={0.01} value={form.mermaReutilizableKg ?? ''} onChange={e => setForm(f => ({ ...f, mermaReutilizableKg: e.target.value ? Number(e.target.value) : undefined }))} className={cls} placeholder="0" /></div>
              <div><label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">LD — Merma Desechable (kg)</label><input type="number" min={0} step={0.01} value={form.mermaDesechableKg ?? ''} onChange={e => setForm(f => ({ ...f, mermaDesechableKg: e.target.value ? Number(e.target.value) : undefined }))} className={cls} placeholder="0" /></div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide">LE — Sobrante Exportable (kg)</label>
                  <button
                    type="button"
                    onClick={() => {
                      const le = cantLf - Number(form.pesoPfKg ?? 0) - Number(form.mermaReutilizableKg ?? 0) - Number(form.mermaDesechableKg ?? 0);
                      setForm(f => ({ ...f, sobranteExportableKg: Math.max(0, parseFloat(le.toFixed(2))) }));
                    }}
                    className="text-[0.6rem] font-semibold text-blue-600 hover:text-blue-800 underline underline-offset-2"
                  >
                    Auto-completar
                  </button>
                </div>
                <input type="number" min={0} step={0.01} value={form.sobranteExportableKg ?? ''} onChange={e => setForm(f => ({ ...f, sobranteExportableKg: e.target.value ? Number(e.target.value) : undefined }))} className={cls} placeholder="0" />
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between text-sm">
              <span className="text-gray-600">Suma: <strong className={r4Ok ? 'text-green-700' : 'text-red-600'}>{suma.toFixed(2)} kg</strong></span>
              <span className="text-gray-400">vs LF: <strong>{cantLf.toFixed(2)} kg</strong></span>
              <span className={`text-xs font-semibold ${r4Ok ? 'text-green-600' : 'text-red-600'}`}>Δ {diferencia.toFixed(2)} kg {r4Ok ? '≤ 0.5 ✓' : '> 0.5 ✗'}</span>
            </div>
            {!r4Ok && (
              <p className="text-[0.65rem] text-red-600 mt-2">
                PF + LR + LD + LE debe sumar <strong>{cantLf.toFixed(2)} kg</strong>. Usa "Auto-completar" en LE para ajustar el sobrante.
              </p>
            )}
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
            <p className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-3">R5 — Resultado en Quintales (calculado automático)</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col items-center justify-center bg-white rounded-xl border border-blue-100 p-3 gap-0.5">
                <span className="text-[0.65rem] text-gray-400 uppercase tracking-wide">Quintales</span>
                <span className="text-3xl font-black text-blue-700">{quintales ?? '—'}</span>
                <span className="text-[0.6rem] text-gray-400">qq</span>
              </div>
              <div className="flex flex-col items-center justify-center bg-white rounded-xl border border-blue-100 p-3 gap-0.5">
                <span className="text-[0.65rem] text-gray-400 uppercase tracking-wide">kg sueltos</span>
                <span className="text-3xl font-black text-blue-700">{kgSueltos != null ? kgSueltos.toFixed(2) : '—'}</span>
                <span className="text-[0.6rem] text-gray-400">kg fuera de quintal</span>
              </div>
            </div>
            {quintales == null && (
              <p className="text-[0.65rem] text-blue-500 mt-2 text-center">Ingresa PF y Peso/Quintal para ver el cálculo</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">SKU (nombre comercial)</label>
            <select value={form.skuId ?? ''} onChange={e => {
              if (e.target.value === 'nuevo') { setCreatingNewSku(true); }
              else { setCreatingNewSku(false); setForm(f => ({ ...f, skuId: e.target.value ? Number(e.target.value) : undefined })); }
            }} className={cls}>
              <option value="">Sin SKU</option>
              {filteredSkus.map(s => <option key={s.id} value={s.id}>{s.codigo ? `${s.codigo} · ${s.nombre}` : s.nombre}</option>)}
              <option value="nuevo">+ Agregar nuevo SKU…</option>
            </select>
            {creatingNewSku && (
              <div className="mt-1.5 flex gap-2">
                <input
                  value={newSkuNombre}
                  onChange={e => setNewSkuNombre(e.target.value)}
                  placeholder="Nombre del nuevo SKU…"
                  className={`${cls} flex-1`}
                />
                <button
                  type="button"
                  disabled={!newSkuNombre.trim()}
                  onClick={async () => {
                    if (!newSkuNombre.trim()) return;
                    try {
                      const created = await skusService.create(newSkuNombre.trim());
                      setSkus(prev => [...prev, created]);
                      setForm(f => ({ ...f, skuId: created.id }));
                      setCreatingNewSku(false);
                      setNewSkuNombre('');
                    } catch { toast.error('Error al crear SKU'); }
                  }}
                  className="px-3 py-2 rounded-xl text-xs font-bold text-white disabled:opacity-40"
                  style={{ backgroundColor: '#1A2B23' }}
                >
                  Crear
                </button>
              </div>
            )}
          </div>

          <div><label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Observaciones</label><textarea value={form.observaciones ?? ''} onChange={e => setForm(f => ({ ...f, observaciones: e.target.value || undefined }))} rows={2} className={`${cls} resize-none`} /></div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50">Cancelar</button>
            <button type="submit" disabled={saving} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-50" style={{ backgroundColor: '#1A2B23' }}>Registrar trillado</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function CacaoAsignarSkuModal({ lf, onClose, onConfirm }: { lf: LoteFinal; onClose: () => void; onConfirm: (dto: TrillarDto) => Promise<void> }) {
  const [fecha, setFecha]       = useState(new Date().toISOString().slice(0, 10));
  const [skuId, setSkuId]       = useState<number | undefined>();
  const [skus,  setSkus]        = useState<Sku[]>([]);
  const [newSkuNombre, setNewSkuNombre] = useState('');
  const [creatingNewSku, setCreatingNewSku] = useState(false);
  const [saving, setSaving]     = useState(false);
  const [pesoPfKg,              setPesoPfKg]              = useState<number | undefined>();
  const [mermaReutilizableKg,   setMermaReutilizableKg]   = useState<number>(0);
  const [mermaDesechableKg,     setMermaDesechableKg]     = useState<number>(0);
  const [sobranteExportableKg,  setSobranteExportableKg]  = useState<number>(0);
  const toast = useToast();

  useEffect(() => { skusService.findAll().then(setSkus); }, []);

  const filteredSkus = skus.filter(s => !s.soloOtros && (s.codigo?.startsWith('CA') ?? false));
  const cls = 'w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500';

  const cantLf  = Number(lf.cantidadKg);
  const suma    = Number(pesoPfKg ?? 0) + mermaReutilizableKg + mermaDesechableKg + sobranteExportableKg;
  const dif     = Math.abs(suma - cantLf);
  const r4Ok    = dif <= 0.5;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!fecha) { toast.error('La fecha es requerida'); return; }
    if (pesoPfKg == null) { toast.error('El PF es requerido'); return; }
    if (!r4Ok) { toast.error(`R4 — Suma (${suma.toFixed(2)} kg) ≠ LF (${cantLf.toFixed(2)} kg). Δ ${dif.toFixed(2)} kg > 0.5`); return; }
    setSaving(true);
    try {
      await onConfirm({
        fecha,
        pesoPorQuintalKg: cantLf,
        pesoPfKg,
        mermaReutilizableKg,
        mermaDesechableKg,
        sobranteExportableKg,
        skuId,
      });
      onClose();
    } catch (err) { toast.error((err as Error).message); }
    finally { setSaving(false); }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4" style={{ backgroundColor: 'rgba(0,0,0,0.45)' }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-lg max-h-[95dvh] flex flex-col relative">
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100 shrink-0">
          <div>
            <h2 className="font-black text-gray-800 uppercase tracking-wide">Asignar SKU — Cacao</h2>
            <p className="text-xs text-gray-400 mt-0.5">{lf.codigo} · {cantLf.toFixed(2)} kg</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg></button>
        </div>
        {saving && <div className="absolute inset-0 z-20 flex items-center justify-center rounded-2xl" style={{ backgroundColor: 'rgba(255,255,255,0.93)' }}><LoadingLogo compact /></div>}
        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 px-6 py-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Fecha *</label>
              <input type="date" value={fecha} onChange={e => setFecha(e.target.value)} className={cls} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">SKU (nombre comercial)</label>
              <select value={skuId ?? ''} onChange={e => {
                if (e.target.value === 'nuevo') { setCreatingNewSku(true); }
                else { setCreatingNewSku(false); setSkuId(e.target.value ? Number(e.target.value) : undefined); }
              }} className={cls}>
                <option value="">Sin SKU</option>
                {filteredSkus.map(s => <option key={s.id} value={s.id}>{s.codigo ? `${s.codigo} · ${s.nombre}` : s.nombre}</option>)}
                <option value="nuevo">+ Agregar nuevo SKU…</option>
              </select>
              {creatingNewSku && (
                <div className="mt-1.5 flex gap-2">
                  <input value={newSkuNombre} onChange={e => setNewSkuNombre(e.target.value)} placeholder="Nombre del nuevo SKU…" className={`${cls} flex-1`} />
                  <button type="button" disabled={!newSkuNombre.trim()} onClick={async () => {
                    if (!newSkuNombre.trim()) return;
                    try {
                      const created = await skusService.create(newSkuNombre.trim());
                      setSkus(prev => [...prev, created]);
                      setSkuId(created.id);
                      setCreatingNewSku(false);
                      setNewSkuNombre('');
                    } catch { toast.error('Error al crear SKU'); }
                  }} className="px-3 py-2 rounded-xl text-xs font-bold text-white disabled:opacity-40" style={{ backgroundColor: '#1A2B23' }}>Crear</button>
                </div>
              )}
            </div>
          </div>

          <div className={`border rounded-xl p-4 ${r4Ok ? 'border-green-100 bg-green-50' : 'border-red-100 bg-red-50'}`}>
            <p className={`text-xs font-bold uppercase tracking-wider mb-3 ${r4Ok ? 'text-green-700' : 'text-red-700'}`}>
              R4 — Cuatro salidas {r4Ok ? '✓' : `✗ diferencia ${dif.toFixed(2)} kg`}
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">PF — Producto Final (kg) *</label>
                <input type="number" min={0} step={0.01} value={pesoPfKg ?? ''} onChange={e => setPesoPfKg(e.target.value ? Number(e.target.value) : undefined)} className={cls} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">LR — Merma Reutilizable (kg)</label>
                <input type="number" min={0} step={0.01} value={mermaReutilizableKg} onChange={e => setMermaReutilizableKg(e.target.value ? Number(e.target.value) : 0)} className={cls} placeholder="0" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">LD — Merma Desechable (kg)</label>
                <input type="number" min={0} step={0.01} value={mermaDesechableKg} onChange={e => setMermaDesechableKg(e.target.value ? Number(e.target.value) : 0)} className={cls} placeholder="0" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide">LE — Sobrante (kg)</label>
                  <button type="button" onClick={() => {
                    const le = cantLf - Number(pesoPfKg ?? 0) - mermaReutilizableKg - mermaDesechableKg;
                    setSobranteExportableKg(Math.max(0, parseFloat(le.toFixed(2))));
                  }} className="text-[0.6rem] font-semibold text-blue-600 hover:text-blue-800 underline underline-offset-2">Auto-completar</button>
                </div>
                <input type="number" min={0} step={0.01} value={sobranteExportableKg} onChange={e => setSobranteExportableKg(e.target.value ? Number(e.target.value) : 0)} className={cls} placeholder="0" />
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between text-sm">
              <span className="text-gray-600">Suma: <strong className={r4Ok ? 'text-green-700' : 'text-red-600'}>{suma.toFixed(2)} kg</strong></span>
              <span className="text-gray-400">vs LF: <strong>{cantLf.toFixed(2)} kg</strong></span>
              <span className={`text-xs font-semibold ${r4Ok ? 'text-green-600' : 'text-red-600'}`}>Δ {dif.toFixed(2)} kg {r4Ok ? '≤ 0.5 ✓' : '> 0.5 ✗'}</span>
            </div>
          </div>

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50">Cancelar</button>
            <button type="submit" disabled={saving} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-50" style={{ backgroundColor: '#1A2B23' }}>Registrar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function BatchCacaoModal({ lfs, onClose, onConfirm }: {
  lfs: LoteFinal[];
  onClose: () => void;
  onConfirm: (dto: BatchTrillarDto) => Promise<BatchTrillarResumen>;
}) {
  const PLANTAS = ['CB JAEN', 'CB LIMA', 'EXPOCAFÉ', 'KUSKA', 'MEGO', 'SELVA NORTE', 'AICASA', 'NORANDINO', 'NEGRISA'];

  // Modo: nueva liquidación o agregar a grupo existente
  const [modo,                setModo]                = useState<'nuevo' | 'existente'>('nuevo');
  const [grupos,              setGrupos]              = useState<GrupoTrilla[]>([]);
  const [grupoSeleccionado,   setGrupoSeleccionado]   = useState<GrupoTrilla | null>(null);

  // Campos del formulario
  const [fecha,               setFecha]               = useState(new Date().toISOString().slice(0, 10));
  const [planta,              setPlanta]              = useState('');
  const [pesoPorQuintalKg,    setPesoPorQuintalKg]    = useState('');
  const [mermaReutilizableKg, setMermaReutilizableKg] = useState('');
  const [mermaDesechableKg,   setMermaDesechableKg]   = useState('');
  const [sobranteExportableKg,setSobranteExportableKg]= useState('');
  const [nroLiquidacion,      setNroLiquidacion]      = useState('');
  const [skuId,               setSkuId]               = useState<number | undefined>();
  const [skus,                setSkus]                = useState<Sku[]>([]);
  const [resumen,             setResumen]             = useState<BatchTrillarResumen | null>(null);
  const [saving,              setSaving]              = useState(false);
  const [openLoteIds,         setOpenLoteIds]         = useState<Set<number>>(new Set());
  const [loteOverrides,       setLoteOverrides]       = useState<Map<number, { skuId?: number; lr: string; ld: string; le: string }>>(new Map());
  const toast = useToast();

  const pesoTotal = lfs.reduce((s, l) => s + Number(l.cantidadKg), 0);
  const lr  = Number(mermaReutilizableKg)  || 0;
  const ld  = Number(mermaDesechableKg)    || 0;
  const le  = Number(sobranteExportableKg) || 0;
  const pf  = pesoTotal - lr - ld - le;
  const rend = pesoTotal > 0 ? ((pf / pesoTotal) * 100) : 0;

  function getLoteMermaRaw(lf: LoteFinal) {
    const peso = Number(lf.cantidadKg);
    const prop = pesoTotal > 0 ? peso / pesoTotal : 0;
    const over = loteOverrides.get(lf.id);
    return {
      lrL: over?.lr ? Number(over.lr) : lr * prop,
      ldL: over?.ld ? Number(over.ld) : ld * prop,
      leL: over?.le ? Number(over.le) : le * prop,
    };
  }

  const pfTotal = lfs.reduce((sum, lf) => {
    const { lrL, ldL, leL } = getLoteMermaRaw(lf);
    return sum + Math.max(0, Number(lf.cantidadKg) - lrL - ldL - leL);
  }, 0);
  const rendGeneral = pesoTotal > 0 ? (pfTotal / pesoTotal) * 100 : 0;

  useEffect(() => {
    skusService.findAll().then(all => setSkus(all.filter(s => !s.soloOtros)));
    lotesFinalesService.getGruposTrilla().then(setGrupos);
  }, []);

  // Cuando se selecciona un grupo existente, pre-poblar planta y fecha
  useEffect(() => {
    if (modo === 'existente' && grupoSeleccionado) {
      setFecha(grupoSeleccionado.fecha);
      setPlanta(grupoSeleccionado.planta ?? '');
    }
  }, [grupoSeleccionado, modo]);

  const cls    = 'w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500';
  const numCls = `${cls} tabular-nums`;

  function validate(): string | null {
    if (!fecha)                                            return 'La fecha es requerida';
    if (!pesoPorQuintalKg || Number(pesoPorQuintalKg) <= 0) return 'Peso por quintal es requerido';
    if (lr < 0 || ld < 0 || le < 0)                       return 'Las mermas no pueden ser negativas';
    if (lr + ld + le >= pesoTotal)                         return `La merma total (${(lr+ld+le).toFixed(3)} kg) debe ser menor al peso total (${pesoTotal.toFixed(3)} kg)`;
    if (modo === 'existente' && !grupoSeleccionado)        return 'Seleccioná un grupo de trilla existente';
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const err = validate();
    if (err) { toast.error(err); return; }
    setSaving(true);
    try {
      const overridesPayload: LoteOverride[] = [];
      for (const [id, over] of loteOverrides) {
        if (over.skuId || over.lr || over.ld || over.le) {
          overridesPayload.push({
            id,
            skuId: over.skuId,
            mermaReutilizableKg: over.lr ? Number(over.lr) : undefined,
            mermaDesechableKg:   over.ld ? Number(over.ld) : undefined,
            sobranteExportableKg: over.le ? Number(over.le) : undefined,
          });
        }
      }
      const result = await onConfirm({
        ids:                  lfs.map(l => l.id),
        fecha,
        planta:               planta || undefined,
        pesoPorQuintalKg:     Number(pesoPorQuintalKg),
        mermaReutilizableKg:  lr,
        mermaDesechableKg:    ld,
        sobranteExportableKg: le,
        nroLiquidacion:       modo === 'nuevo' ? (nroLiquidacion || undefined) : undefined,
        existingBatchId:      modo === 'existente' ? grupoSeleccionado!.batchId : undefined,
        skuId,
        loteOverrides:        overridesPayload.length > 0 ? overridesPayload : undefined,
      });
      setResumen(result);
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  // ── Pantalla de resumen post-confirmación ──
  if (resumen) {
    const r = resumen.resumen;
    const nroLiq = grupoSeleccionado?.nroLiquidacion ?? (nroLiquidacion || null);
    return (
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4" style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}>
        <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-2xl max-h-[95dvh] flex flex-col">
          <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100 shrink-0">
            <div>
              <h2 className="font-black text-gray-800 uppercase tracking-wide">Trilla registrada</h2>
              <p className="text-xs text-gray-400 mt-0.5">
                {nroLiq && <span className="font-semibold text-gray-600 mr-2">{nroLiq}</span>}
                {r.lotesCount} lote{r.lotesCount !== 1 ? 's' : ''} · ID {resumen.batchId.slice(0, 8)}…
              </p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg></button>
          </div>
          <div className="overflow-y-auto flex-1 px-6 py-5 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Peso total entrada',    val: `${r.pesoTotalKg.toFixed(3)} kg` },
                { label: 'PF total (oro verde)',  val: `${r.pesoPfTotalKg.toFixed(3)} kg`, hi: true },
                { label: 'LR (reutilizable)',     val: `${r.mermaReutilizableTotalKg.toFixed(3)} kg` },
                { label: 'LD (desechable)',        val: `${r.mermaDesechableTotalKg.toFixed(3)} kg` },
                { label: 'LE (exportable)',        val: `${r.sobranteExportableTotalKg.toFixed(3)} kg` },
                { label: 'Rendimiento operación', val: `${r.rendimientoPct}%`, hi: true },
              ].map(({ label, val, hi }) => (
                <div key={label} className={`rounded-xl px-4 py-3 ${hi ? 'bg-green-50 border border-green-100' : 'bg-gray-50 border border-gray-100'}`}>
                  <p className="text-[0.65rem] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">{label}</p>
                  <p className={`font-black tabular-nums ${hi ? 'text-green-700' : 'text-gray-800'}`}>{val}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400">Mermas distribuidas por prorrateo proporcional al peso de cada lote.</p>
            <button onClick={onClose} className="w-full py-2.5 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor: '#1A2B23' }}>Cerrar</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4" style={{ backgroundColor: 'rgba(0,0,0,0.45)' }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-2xl max-h-[95dvh] flex flex-col relative">

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100 shrink-0">
          <div>
            <h2 className="font-black text-gray-800 uppercase tracking-wide">Trilla grupal</h2>
            <p className="text-xs text-gray-400 mt-0.5">{lfs.length} lote{lfs.length !== 1 ? 's' : ''} · <strong className="tabular-nums text-gray-600">{pesoTotal.toFixed(3)} kg</strong></p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg></button>
        </div>

        {saving && <div className="absolute inset-0 z-20 flex items-center justify-center rounded-2xl" style={{ backgroundColor: 'rgba(255,255,255,0.93)' }}><LoadingLogo compact /></div>}

        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 px-6 py-5 space-y-4">

          {/* Lotes seleccionados — acordeón con SKU + merma + rendimiento por lote */}
          <div className="rounded-xl border border-gray-100 overflow-hidden divide-y divide-gray-100">
            {lfs.map(lf => {
              const peso = Number(lf.cantidadKg);
              const isOpen = openLoteIds.has(lf.id);
              const over = loteOverrides.get(lf.id) ?? { lr: '', ld: '', le: '' };
              const { lrL, ldL, leL } = getLoteMermaRaw(lf);
              const pfLote = peso - lrL - ldL - leL;
              const rendLote = peso > 0 ? (pfLote / peso) * 100 : 0;
              const hasOverride = !!(over.skuId || over.lr || over.ld || over.le);
              const prop = pesoTotal > 0 ? peso / pesoTotal : 0;

              function setOver(partial: Partial<typeof over>) {
                setLoteOverrides(prev => {
                  const next = new Map(prev);
                  next.set(lf.id, { ...over, ...partial });
                  return next;
                });
              }

              return (
                <div key={lf.id}>
                  <button
                    type="button"
                    onClick={() => setOpenLoteIds(prev => { const n = new Set(prev); n.has(lf.id) ? n.delete(lf.id) : n.add(lf.id); return n; })}
                    className="w-full flex items-center justify-between px-3 py-2.5 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
                  >
                    <div className="flex items-center gap-2">
                      <svg className={`w-3.5 h-3.5 text-gray-400 transition-transform shrink-0 ${isOpen ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                      <span className="font-semibold text-gray-700 text-xs">{lf.codigo}</span>
                      {hasOverride && (
                        <span className="px-1.5 py-0.5 rounded-full text-[0.55rem] font-bold bg-blue-100 text-blue-600">Config. propia</span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-gray-400 tabular-nums text-xs">{peso.toFixed(3)} kg</span>
                      <span className={`text-xs font-black tabular-nums ${pfLote >= 0 ? 'text-green-700' : 'text-red-600'}`}>{rendLote.toFixed(1)}%</span>
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-3 py-3 bg-white space-y-3 border-t border-gray-100">
                      <div>
                        <label className="block text-[0.65rem] font-semibold text-gray-500 uppercase tracking-wider mb-1">SKU del lote</label>
                        <select value={over.skuId ?? ''} onChange={e => setOver({ skuId: e.target.value ? Number(e.target.value) : undefined })} className={cls}>
                          <option value="">— Heredar SKU global —</option>
                          {skus.map(s => <option key={s.id} value={s.id}>{s.codigo ? `${s.codigo} · ${s.nombre}` : s.nombre}</option>)}
                        </select>
                      </div>
                      <div>
                        <p className="text-[0.65rem] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                          Merma por lote <span className="normal-case font-normal text-gray-400">(vacío = prorrateo global)</span>
                        </p>
                        <div className="grid grid-cols-3 gap-2">
                          {(['lr', 'ld', 'le'] as const).map(key => {
                            const labels = { lr: 'LR (kg)', ld: 'LD (kg)', le: 'LE (kg)' };
                            const defaults = { lr: lr * prop, ld: ld * prop, le: le * prop };
                            return (
                              <div key={key}>
                                <label className="block text-[0.6rem] font-semibold text-gray-400 uppercase mb-0.5">{labels[key]}</label>
                                <input
                                  type="number" step="0.001" min="0"
                                  value={over[key]}
                                  onChange={e => setOver({ [key]: e.target.value })}
                                  className={numCls}
                                  placeholder={defaults[key].toFixed(3)}
                                />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      <div className={`rounded-lg px-3 py-2 text-xs flex justify-between items-center ${pfLote >= 0 ? 'bg-green-50 border border-green-100' : 'bg-red-50 border border-red-100'}`}>
                        <span className="text-gray-600">PF: <strong className="tabular-nums">{pfLote.toFixed(3)} kg</strong></span>
                        <span className={`font-black tabular-nums ${pfLote >= 0 ? 'text-green-700' : 'text-red-600'}`}>Rend. {rendLote.toFixed(2)}%</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Selector de modo */}
          <div className="flex rounded-xl border border-gray-200 overflow-hidden">
            {([['nuevo', 'Nueva liquidación'], ['existente', 'Agregar a grupo existente']] as const).map(([val, label]) => (
              <button
                key={val} type="button"
                onClick={() => { setModo(val); setGrupoSeleccionado(null); }}
                className={`flex-1 py-2 text-xs font-semibold transition-colors ${modo === val ? 'text-white' : 'text-gray-500 hover:bg-gray-50'}`}
                style={modo === val ? { backgroundColor: '#1A2B23' } : {}}
              >{label}</button>
            ))}
          </div>

          {/* ── MODO: agregar a grupo existente ── */}
          {modo === 'existente' && (
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide">Grupo de trilla *</label>
              {grupos.length === 0 ? (
                <p className="text-xs text-gray-400 italic">No hay grupos de trilla creados todavía.</p>
              ) : (
                <select
                  value={grupoSeleccionado?.batchId ?? ''}
                  onChange={e => setGrupoSeleccionado(grupos.find(g => g.batchId === e.target.value) ?? null)}
                  className={cls}
                >
                  <option value="">— Seleccioná un grupo —</option>
                  {grupos.map(g => (
                    <option key={g.batchId} value={g.batchId}>
                      {g.nroLiquidacion ?? g.batchId.slice(0, 8)} · {g.fecha} · {g.lotesCount} lote{g.lotesCount !== 1 ? 's' : ''} · {g.pesoTotalKg.toFixed(1)} kg
                    </option>
                  ))}
                </select>
              )}
              {grupoSeleccionado && (
                <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 text-xs text-blue-700 space-y-0.5">
                  <p><strong>Liquidación:</strong> {grupoSeleccionado.nroLiquidacion ?? '(sin número)'}</p>
                  <p><strong>Fecha:</strong> {grupoSeleccionado.fecha} · <strong>Planta:</strong> {grupoSeleccionado.planta ?? '—'}</p>
                  <p><strong>Lotes ya en el grupo:</strong> {grupoSeleccionado.lotesCount} · <strong>Peso acumulado:</strong> {grupoSeleccionado.pesoTotalKg.toFixed(3)} kg</p>
                  <p className="text-blue-500 mt-1">Los nuevos lotes heredarán el nro. de liquidación de este grupo.</p>
                </div>
              )}
            </div>
          )}

          {/* ── MODO: nueva liquidación ── */}
          {modo === 'nuevo' && (
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Nro. Liquidación</label>
              <input type="text" value={nroLiquidacion} onChange={e => setNroLiquidacion(e.target.value)} className={cls} placeholder="Ej: LIQ-2026-001" />
            </div>
          )}

          {/* Fecha y planta */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Fecha *</label>
              <input type="date" value={fecha} onChange={e => setFecha(e.target.value)} className={cls} required />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Planta</label>
              <select value={planta} onChange={e => setPlanta(e.target.value)} className={cls}>
                <option value="">— Planta —</option>
                {PLANTAS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Peso por quintal (kg) *</label>
            <input type="number" step="0.001" min="0.001" value={pesoPorQuintalKg} onChange={e => setPesoPorQuintalKg(e.target.value)} className={numCls} placeholder="ej. 46" required />
          </div>

          {/* Mermas */}
          <div className="border border-gray-100 rounded-xl p-4 space-y-3">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Mermas {modo === 'existente' ? 'de los nuevos lotes' : 'totales de la operación'}
            </p>
            <div className="grid grid-cols-3 gap-2">
              {[
                ['LR (kg)', mermaReutilizableKg, setMermaReutilizableKg],
                ['LD (kg)', mermaDesechableKg,   setMermaDesechableKg],
                ['LE (kg)', sobranteExportableKg, setSobranteExportableKg],
              ].map(([label, val, setter]) => (
                <div key={label as string}>
                  <label className="block text-[0.65rem] font-semibold text-gray-500 uppercase tracking-wider mb-1">{label as string}</label>
                  <input type="number" step="0.001" min="0" value={val as string}
                    onChange={e => (setter as React.Dispatch<React.SetStateAction<string>>)(e.target.value)}
                    className={numCls} placeholder="0" />
                </div>
              ))}
            </div>
          </div>

          {/* Resumen general de rendimiento */}
          <div className={`rounded-xl px-4 py-3 border ${pfTotal >= 0 ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-200'}`}>
            <p className="text-[0.6rem] font-bold text-gray-500 uppercase tracking-wider mb-2">Resumen general</p>
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-gray-600">PF total estimado</span>
              <span className={`font-black tabular-nums text-sm ${pfTotal >= 0 ? 'text-green-700' : 'text-red-600'}`}>{pfTotal.toFixed(3)} kg</span>
            </div>
            <div className="flex justify-between items-center mt-1">
              <span className="text-xs font-semibold text-gray-600">Rendimiento general</span>
              <span className={`font-black tabular-nums text-sm ${rendGeneral >= 0 ? 'text-green-700' : 'text-red-600'}`}>{rendGeneral.toFixed(2)}%</span>
            </div>
            <p className="text-[0.65rem] text-gray-400 mt-1.5">
              {loteOverrides.size > 0 ? 'Calculado con mermas propias por lote.' : 'Mermas distribuidas por prorrateo entre los lotes seleccionados.'}
            </p>
          </div>

          {/* SKU */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">SKU (opcional)</label>
            <select value={skuId ?? ''} onChange={e => setSkuId(e.target.value ? Number(e.target.value) : undefined)} className={cls}>
              <option value="">Sin SKU</option>
              {skus.map(s => <option key={s.id} value={s.id}>{s.codigo ? `${s.codigo} · ${s.nombre}` : s.nombre}</option>)}
            </select>
          </div>

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50">Cancelar</button>
            <button type="submit" disabled={saving || lfs.length === 0 || pf < 0} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-50" style={{ backgroundColor: '#1A2B23' }}>
              Trillar {lfs.length} lote{lfs.length !== 1 ? 's' : ''}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DetalleModal({ id, onClose }: { id: number; onClose: () => void }) {
  const [detalle, setDetalle] = useState<DetalleLoteFinal | null>(null);
  const [kardex, setKardex]   = useState<MovimientoKardex[]>([]);
  const [tab, setTab]         = useState<'origenes' | 'trillado' | 'kardex'>('origenes');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      lotesFinalesService.getDetalle(id),
      lotesFinalesService.getKardex(id),
    ])
      .then(([d, c]) => { setDetalle(d); setKardex(c); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}>
      <div className="bg-white rounded-2xl p-8"><LoadingLogo /></div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4" style={{ backgroundColor: 'rgba(0,0,0,0.45)' }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-2xl max-h-[90dvh] flex flex-col">
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100 shrink-0">
          <h2 className="font-bold text-gray-800">{detalle?.loteFinal.codigo}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg></button>
        </div>
        <div className="flex border-b border-gray-100 px-6 shrink-0">
          {(['origenes', 'trillado', 'kardex'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} className={`py-3 px-4 text-xs font-semibold border-b-2 transition-colors uppercase tracking-wide ${tab===t ? 'border-green-600 text-green-700' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>
              {t === 'origenes' ? 'Trazabilidad' : t === 'trillado' ? 'Trillado' : 'KARDEX'}
            </button>
          ))}
        </div>
        <div className="overflow-y-auto flex-1 px-6 py-5">
          {tab === 'origenes' && (
            detalle?.origenes.length === 0
              ? <p className="text-sm text-gray-400 italic">Sin orígenes registrados.</p>
              : <div className="overflow-x-auto rounded-xl border border-gray-100"><table className="w-full text-xs"><thead><tr className="bg-gray-50 border-b"><th className="px-3 py-2 text-left text-gray-500 font-semibold">Lote origen</th><th className="px-3 py-2 text-left text-gray-500 font-semibold">Productor</th><th className="px-3 py-2 text-right text-gray-500 font-semibold">Kg aportados</th></tr></thead>
                <tbody className="divide-y divide-gray-50">{detalle?.origenes.map(o => (
                  <tr key={o.id}><td className="px-3 py-2 font-semibold text-gray-700">{o.loteOrigen?.codigo ?? `#${o.loteOrigenId}`}</td><td className="px-3 py-2 text-gray-500">{o.loteOrigen?.productor ? `${o.loteOrigen.productor.nombre} ${o.loteOrigen.productor.apellido ?? ''}` : '—'}</td><td className="px-3 py-2 text-right font-semibold tabular-nums">{Number(o.cantidadAportadaKg).toFixed(2)} kg</td></tr>
                ))}</tbody></table></div>
          )}
          {tab === 'trillado' && (
            detalle?.trillado
              ? <div className="grid grid-cols-2 gap-3 text-sm">{Object.entries({
                  'Fecha': detalle.trillado.fecha, 'Planta': detalle.trillado.planta ?? '—',
                  'Malla': detalle.trillado.malla ?? '—', 'Tipo selección': detalle.trillado.tipoSeleccion ?? '—',
                  'Encargado': detalle.trillado.encargado ?? '—', 'Kg/Quintal': `${Number(detalle.trillado.pesoPorQuintalKg).toFixed(2)} kg`,
                  'PF (exportable)': `${Number(detalle.trillado.pesoPfKg).toFixed(2)} kg`,
                  'Quintales': String(detalle.trillado.cantidadQuintales),
                  'Kg sueltos': `${Number(detalle.trillado.kgSueltos).toFixed(2)} kg`,
                  'LR (reutilizable)': `${Number(detalle.trillado.mermaReutilizableKg).toFixed(2)} kg`,
                  'LD (desechable)': `${Number(detalle.trillado.mermaDesechableKg).toFixed(2)} kg`,
                  'LE (sobrante)': `${Number(detalle.trillado.sobranteExportableKg).toFixed(2)} kg`,
                }).map(([k, v]) => <div key={k} className="bg-gray-50 rounded-xl p-3"><span className="text-xs text-gray-400">{k}</span><p className="font-semibold text-gray-800 mt-0.5">{v}</p></div>)}</div>
              : <p className="text-sm text-gray-400 italic">Aún no trillado.</p>
          )}
          {tab === 'kardex' && (
            kardex.length === 0
              ? <p className="text-sm text-gray-400 italic">Sin movimientos registrados.</p>
              : <div className="overflow-x-auto rounded-xl border border-gray-100"><table className="w-full text-xs"><thead><tr className="bg-gray-50 border-b"><th className="px-3 py-2 text-left text-gray-500 font-semibold">Fecha</th><th className="px-3 py-2 text-left text-gray-500 font-semibold">Tipo</th><th className="px-3 py-2 text-right text-gray-500 font-semibold">Cantidad</th><th className="px-3 py-2 text-right text-gray-500 font-semibold">Saldo</th></tr></thead>
                <tbody className="divide-y divide-gray-50">{kardex.map(m => (
                  <tr key={m.id}>
                    <td className="px-3 py-2 text-gray-600">{m.fecha}</td>
                    <td className="px-3 py-2"><span className={`px-2 py-0.5 rounded-full text-[0.6rem] font-bold uppercase ${m.tipoMovimiento === 'INGRESO' ? 'bg-green-100 text-green-700' : m.tipoMovimiento === 'MERMA' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'}`}>{m.tipoMovimiento}</span></td>
                    <td className={`px-3 py-2 text-right tabular-nums font-semibold ${m.tipoMovimiento === 'INGRESO' ? 'text-green-600' : 'text-red-500'}`}>{m.tipoMovimiento === 'INGRESO' ? '+' : '-'}{Number(m.cantidadKg).toFixed(2)}</td>
                    <td className="px-3 py-2 text-right tabular-nums font-black text-gray-800">{Number(m.saldoKg).toFixed(2)}</td>
                  </tr>
                ))}</tbody></table></div>
          )}
        </div>
      </div>
    </div>
  );
}

export function LotesFinalesPage() {
  const navigate = useNavigate();
  const { isOffline } = useNetworkStatus();
  const [lfs, setLfs]     = useState<LoteFinal[]>([]);
  const [meta, setMeta]   = useState({ total: 0, page: 1, lastPage: 1, limit: 10 });
  const [loading, setLoading] = useState(true);
  const [page, setPage]   = useState(1);
  const [tiposProducto, setTiposProducto] = useState<TipoProducto[]>([]);
  const [filterEstado, setFilterEstado] = useState<LoteFinalEstado | ''>('');
  const [filterTipo,   setFilterTipo]   = useState('');
  const [modal, setModal] = useState<{ type: 'trillar' | 'trillar-cacao' | 'detalle'; lf: LoteFinal } | null>(null);
  const [success, setSuccess] = useState('');
  const [generandoKardex, setGenerandoKardex] = useState<number | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [batchModal, setBatchModal] = useState(false);

  useEffect(() => { tiposProductoService.getAll().then(setTiposProducto); }, []);

  const load = useCallback(async () => {
    setLoading(true);
    const result = await lotesFinalesService.getPage({
      page, limit: 10,
      ...(filterEstado && { estado: filterEstado }),
      ...(filterTipo   && { tipoProductoId: Number(filterTipo) }),
    });
    setLfs(result.data);
    setMeta(result.meta);
    setLoading(false);
  }, [page, filterEstado, filterTipo]);

  useEffect(() => { load(); }, [load]);

  async function handleKardexPdf(lf: LoteFinal) {
    setGenerandoKardex(lf.id);
    try {
      const { jsPDF } = await import('jspdf');
      const [detalle, kardex] = await Promise.all([
        lotesFinalesService.getDetalle(lf.id),
        lotesFinalesService.getKardex(lf.id),
      ]);

      const doc = new jsPDF('p', 'mm', 'a4');
      const W = 210, M = 15, CW = W - M * 2;
      let y = 0;

      const checkPage = (needed = 10) => {
        if (y + needed > 278) { doc.addPage(); y = 20; }
      };

      // Header
      doc.setFillColor(68, 93, 70);
      doc.rect(0, 0, W, 20, 'F');
      doc.setFont('helvetica', 'bold'); doc.setFontSize(11); doc.setTextColor(255, 255, 255);
      doc.text('COLLECTIVE BEAN', M, 9);
      doc.setFontSize(7.5); doc.setFont('helvetica', 'normal');
      doc.text('Kardex — Trazabilidad por Lote', M, 15);
      doc.setFontSize(7);
      doc.text(`Generado: ${new Date().toLocaleDateString('es-PE')}`, W - M, 9, { align: 'right' });
      doc.text(lf.codigo, W - M, 15, { align: 'right' });
      y = 28;

      // Info básica
      const infoItems: [string, string][] = [
        ['Código LF',     detalle.loteFinal.codigo],
        ['Tipo Producto', detalle.loteFinal.tipoProducto?.tipo ?? '—'],
        ['SKU',           detalle.loteFinal.sku?.nombre ?? '—'],
        ['Campaña',       detalle.loteFinal.campana?.nombre ?? '—'],
        ['Estado',        ESTADO_LABEL[detalle.loteFinal.estado]],
        ['Cantidad',      `${Number(detalle.loteFinal.cantidadKg).toFixed(2)} kg`],
        ['Tipo Origen',   ORIGEN_LABEL[detalle.loteFinal.tipoOrigen] ?? detalle.loteFinal.tipoOrigen],
        ['Fecha Creación', detalle.loteFinal.fechaCreacion ?? '—'],
      ];
      const cellW = CW / 4;
      const cellH = 10;
      for (let i = 0; i < infoItems.length; i++) {
        const col = i % 4;
        const row = Math.floor(i / 4);
        const x = M + col * cellW;
        const yy = y + row * cellH;
        doc.setFillColor(248, 252, 248); doc.rect(x, yy, cellW - 1, cellH, 'F');
        doc.setFont('helvetica', 'bold'); doc.setFontSize(6.5); doc.setTextColor(100, 100, 100);
        doc.text(infoItems[i][0].toUpperCase(), x + 2, yy + 3.5);
        doc.setFont('helvetica', 'normal'); doc.setFontSize(8); doc.setTextColor(44, 44, 44);
        doc.text(infoItems[i][1], x + 2, yy + 8);
      }
      y += Math.ceil(infoItems.length / 4) * cellH + 8;

      // Lotes Originarios
      checkPage(20);
      doc.setFont('helvetica', 'bold'); doc.setFontSize(8.5); doc.setTextColor(68, 93, 70);
      doc.text('LOTES ORIGINARIOS', M, y); y += 5;
      if (detalle.origenes.length === 0) {
        doc.setFont('helvetica', 'italic'); doc.setFontSize(8); doc.setTextColor(150, 150, 150);
        doc.text('Sin orígenes registrados.', M, y); y += 8;
      } else {
        const totalKg = detalle.origenes.reduce((s, o) => s + Number(o.cantidadAportadaKg), 0);
        const ocols: [string, number][] = [['Lote Origen', 36], ['Productor', 78], ['Parcela', 32], ['kg Aportados', 24], ['%', 14]];
        doc.setFillColor(232, 243, 232); doc.rect(M, y, CW, 6, 'F');
        doc.setFont('helvetica', 'bold'); doc.setFontSize(6.5); doc.setTextColor(68, 93, 70);
        let x = M; ocols.forEach(([h, w]) => { doc.text(h, x + 1.5, y + 4); x += w; }); y += 6;
        detalle.origenes.forEach((o, i) => {
          checkPage(6);
          if (i % 2 === 1) { doc.setFillColor(248, 252, 248); doc.rect(M, y, CW, 5.5, 'F'); }
          doc.setFont('helvetica', 'normal'); doc.setFontSize(7.5); doc.setTextColor(44, 44, 44);
          x = M;
          const pct = totalKg > 0 ? ((Number(o.cantidadAportadaKg) / totalKg) * 100).toFixed(1) + '%' : '—';
          const prod = o.loteOrigen?.productor ? `${o.loteOrigen.productor.nombre}${o.loteOrigen.productor.apellido ? ' ' + o.loteOrigen.productor.apellido : ''}` : '—';
          const vals = [o.loteOrigen?.codigo ?? `#${o.loteOrigenId}`, prod, o.loteOrigen?.parcela?.nombre ?? '—', `${Number(o.cantidadAportadaKg).toFixed(2)} kg`, pct];
          ocols.forEach(([, w], vi) => { doc.text(String(vals[vi]), x + 1.5, y + 4); x += w; }); y += 5.5;
        });
        doc.setFillColor(220, 236, 220); doc.rect(M, y, CW, 5.5, 'F');
        doc.setFont('helvetica', 'bold'); doc.setFontSize(7.5); doc.setTextColor(44, 93, 44);
        doc.text('TOTAL', M + 1.5, y + 4); doc.text(`${totalKg.toFixed(2)} kg`, M + 36 + 78 + 32 + 1.5, y + 4); y += 5.5;
      }
      y += 8;

      // Movimientos Kardex
      checkPage(20);
      doc.setFont('helvetica', 'bold'); doc.setFontSize(8.5); doc.setTextColor(68, 93, 70);
      doc.text('MOVIMIENTOS KARDEX', M, y); y += 5;
      if (kardex.length === 0) {
        doc.setFont('helvetica', 'italic'); doc.setFontSize(8); doc.setTextColor(150, 150, 150);
        doc.text('Sin movimientos registrados.', M, y); y += 8;
      } else {
        const kcols: [string, number][] = [['Fecha', 26], ['Tipo', 30], ['Referencia', 68], ['Cantidad (kg)', 30], ['Saldo (kg)', 30]];
        doc.setFillColor(232, 243, 232); doc.rect(M, y, CW, 6, 'F');
        doc.setFont('helvetica', 'bold'); doc.setFontSize(6.5); doc.setTextColor(68, 93, 70);
        let x = M; kcols.forEach(([h, w]) => { doc.text(h, x + 1.5, y + 4); x += w; }); y += 6;
        kardex.forEach((m, i) => {
          checkPage(6);
          if (i % 2 === 1) { doc.setFillColor(248, 252, 248); doc.rect(M, y, CW, 5.5, 'F'); }
          doc.setFont('helvetica', 'normal'); doc.setFontSize(7.5);
          x = M;
          const isIngreso = m.tipoMovimiento === 'INGRESO';
          const isMerma = m.tipoMovimiento === 'MERMA';
          const vals = [
            m.fecha,
            m.tipoMovimiento,
            `${m.referenciaTipo}${m.referenciaId ? ' #' + m.referenciaId : ''}`,
            (isIngreso ? '+' : '-') + Number(m.cantidadKg).toFixed(2),
            Number(m.saldoKg).toFixed(2),
          ];
          kcols.forEach(([, w], vi) => {
            if (vi === 3) doc.setTextColor(isIngreso ? 34 : 180, isIngreso ? 100 : 30, isIngreso ? 34 : 30);
            else if (vi === 1) doc.setTextColor(isMerma ? 180 : isIngreso ? 34 : 80, isMerma ? 40 : isIngreso ? 100 : 80, isMerma ? 40 : isIngreso ? 34 : 80);
            else doc.setTextColor(44, 44, 44);
            doc.text(String(vals[vi]), x + 1.5, y + 4); x += w;
          }); y += 5.5;
        });
      }
      y += 8;

      // Trillado
      if (detalle.trillado) {
        checkPage(60);
        doc.setFont('helvetica', 'bold'); doc.setFontSize(8.5); doc.setTextColor(68, 93, 70);
        doc.text('TRILLADO', M, y); y += 5;
        const t = detalle.trillado;
        const tFields: [string, string][] = [
          ['Fecha',           t.fecha],
          ['Planta',          t.planta ?? '—'],
          ['Malla',           t.malla ?? '—'],
          ['Tipo Selección',  t.tipoSeleccion ?? '—'],
          ['Encargado',       t.encargado ?? '—'],
          ['# Liquidación',   t.nroLiquidacion ?? '—'],
          ['Kg/Quintal',      `${Number(t.pesoPorQuintalKg).toFixed(2)} kg`],
          ['PF Exportable',   `${Number(t.pesoPfKg).toFixed(2)} kg`],
          ['Quintales',       String(t.cantidadQuintales)],
          ['kg Sueltos',      `${Number(t.kgSueltos).toFixed(2)} kg`],
          ['LR Reutilizable', `${Number(t.mermaReutilizableKg).toFixed(2)} kg`],
          ['LD Desechable',   `${Number(t.mermaDesechableKg).toFixed(2)} kg`],
          ['LE Sobrante',     `${Number(t.sobranteExportableKg).toFixed(2)} kg`],
        ];
        if (t.observaciones) tFields.push(['Observaciones', t.observaciones]);
        const tCellW = CW / 4; const tCellH = 11;
        for (let i = 0; i < tFields.length; i++) {
          const col = i % 4; const row = Math.floor(i / 4);
          const x = M + col * tCellW; const yy = y + row * tCellH;
          doc.setFillColor(248, 252, 248); doc.rect(x, yy, tCellW - 1, tCellH, 'F');
          doc.setFont('helvetica', 'bold'); doc.setFontSize(6.5); doc.setTextColor(100, 100, 100);
          doc.text(tFields[i][0].toUpperCase(), x + 2, yy + 4);
          doc.setFont('helvetica', 'normal'); doc.setFontSize(8.5); doc.setTextColor(44, 44, 44);
          doc.text(tFields[i][1], x + 2, yy + 9);
        }
        y += Math.ceil(tFields.length / 4) * tCellH + 5;
        // Rendimiento
        checkPage(12);
        const totalKgOrigen = detalle.origenes.reduce((s, o) => s + Number(o.cantidadAportadaKg), 0);
        if (totalKgOrigen > 0) {
          const rend = ((Number(t.pesoPfKg) / totalKgOrigen) * 100).toFixed(2);
          doc.setFillColor(232, 243, 232); doc.rect(M, y, CW, 10, 'F');
          doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.setTextColor(44, 93, 44);
          doc.text(`Rendimiento de trilla: ${rend}%`, W / 2, y + 6.5, { align: 'center' }); y += 10;
        }
      }

      // Footer en cada página
      const pageCount: number = (doc.internal as any).getNumberOfPages?.() ?? 1;
      for (let p = 1; p <= pageCount; p++) {
        doc.setPage(p);
        doc.setFont('helvetica', 'italic'); doc.setFontSize(6.5); doc.setTextColor(180, 180, 180);
        doc.text(`Collective Bean · ${new Date().toLocaleString('es-PE')} · Pág. ${p} de ${pageCount}`, W / 2, 292, { align: 'center' });
      }

      doc.save(`kardex_${lf.codigo}_${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (err) {
      console.error('Error generando kardex PDF:', err);
    } finally {
      setGenerandoKardex(null);
    }
  }

  async function handleTrillar(dto: TrillarDto) {
    if (!modal?.lf) return;
    await lotesFinalesService.trillar(modal.lf.id, dto);
    setSuccess(`Trillado registrado para ${modal.lf.codigo}`);
    await load();
    setTimeout(() => setSuccess(''), 4000);
  }

  async function handleBatchTrillar(dto: BatchTrillarDto): Promise<BatchTrillarResumen> {
    const result = await lotesFinalesService.trillarBatch(dto);
    setSuccess(`Trillado batch: ${result.resumen.lotesCount} lote${result.resumen.lotesCount !== 1 ? 's' : ''} · Rendimiento ${result.resumen.rendimientoPct}%`);
    setSelectedIds(new Set());
    await load();
    setTimeout(() => setSuccess(''), 5000);
    return result;
  }

  const cacaoPendienteIds = lfs.filter(lf => lf.estado === 'PENDIENTE_TRILLADO').map(lf => lf.id);
  const allCacaoSelected = cacaoPendienteIds.length > 0 && cacaoPendienteIds.every(id => selectedIds.has(id));

  return (
    <div className="min-h-full bg-white flex flex-col">
      <div className="px-4 md:px-8 pt-6 pb-3">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/dashboard/lotes')} className="p-2 rounded-xl hover:bg-gray-100 text-gray-500"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg></button>
          <div>
            <h1 className="font-headline text-2xl sm:text-3xl font-black uppercase tracking-wide text-gray-800">Lotes Finales</h1>
            <p className="text-xs text-gray-400 mt-0.5">Lotes listos para trillado → exportación</p>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-8 py-4" style={{ backgroundColor: '#eef3ec' }}>
        <div className="flex flex-wrap gap-2 items-center">
          {(['', 'PENDIENTE_TRILLADO', 'TRILLADO'] as const).map(e => (
            <button key={e} onClick={() => { setFilterEstado(e as LoteFinalEstado | ''); setPage(1); }} className={`px-2.5 py-1 rounded-full text-[0.65rem] font-semibold border transition-all ${filterEstado === e ? 'bg-gray-800 text-white border-gray-800' : 'bg-white text-gray-500 border-gray-300 hover:border-gray-500'}`}>
              {e === '' ? 'Todos' : ESTADO_LABEL[e as LoteFinalEstado]}
            </button>
          ))}
          <div className="w-px bg-gray-300 self-stretch mx-1" />
          {tiposProducto.map(t => (
            <button key={t.id} onClick={() => { setFilterTipo(filterTipo === String(t.id) ? '' : String(t.id)); setPage(1); }} className={`px-2.5 py-1 rounded-full text-[0.65rem] font-semibold border transition-all ${filterTipo === String(t.id) ? 'bg-gray-800 text-white border-gray-800' : 'bg-white text-gray-500 border-gray-300 hover:border-gray-500'}`}>
              {t.tipo}
            </button>
          ))}
          {selectedIds.size > 0 && (
            <>
              <div className="w-px bg-gray-300 self-stretch mx-1" />
              <button onClick={() => setBatchModal(true)} className="px-2.5 py-1 rounded-full text-[0.65rem] font-semibold border transition-all bg-green-700 text-white border-green-700 hover:bg-green-800">
                Trilla grupal ({selectedIds.size})
              </button>
              <button onClick={() => setSelectedIds(new Set())} className="px-2.5 py-1 rounded-full text-[0.65rem] font-semibold border transition-all bg-white text-gray-500 border-gray-300 hover:border-gray-500">
                Limpiar
              </button>
            </>
          )}
        </div>
      </div>

      <div className="relative flex-1 px-4 md:px-8 py-6">
        {isOffline && <div className="mb-4 text-xs text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-2 inline-flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"/>Modo offline</div>}
        {success && <div className="mb-4 text-sm text-green-700 bg-green-50 border border-green-200 rounded-xl px-4 py-3 flex items-center gap-2"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>{success}</div>}
        {loading && <div className="absolute inset-0 z-40 flex items-center justify-center" style={{ backgroundColor: 'rgba(249,250,251,0.9)', backdropFilter: 'blur(2px)' }}><LoadingLogo /></div>}

        {!loading && lfs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400">
            <svg className="w-14 h-14 mb-3 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 12l2 2 4-4"/></svg>
            <p className="text-sm font-semibold">Sin Lotes Finales</p>
            <p className="text-xs mt-1">Promové, dividí o mezclá lotes desde la sección Lotes</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[700px]">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="px-3 py-3 text-left w-8">
                      {cacaoPendienteIds.length > 0 && (
                        <input type="checkbox" checked={allCacaoSelected} onChange={e => setSelectedIds(e.target.checked ? new Set(cacaoPendienteIds) : new Set())} className="w-3.5 h-3.5 accent-green-700 cursor-pointer" title="Seleccionar todos los pendientes" />
                      )}
                    </th>
                    {['Código LF', 'Tipo', 'SKU', 'Variedad', 'Productor', 'Cantidad (kg)', 'Estado', 'Campaña', ''].map(h => (
                      <th key={h} className="text-left px-5 py-3 text-[0.68rem] font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {lfs.map(lf => (
                    <tr key={lf.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-3 py-4">
                        {lf.estado === 'PENDIENTE_TRILLADO' && (
                          <input type="checkbox" checked={selectedIds.has(lf.id)} onChange={e => setSelectedIds(prev => { const n = new Set(prev); e.target.checked ? n.add(lf.id) : n.delete(lf.id); return n; })} className="w-3.5 h-3.5 accent-green-700 cursor-pointer" />
                        )}
                      </td>
                      <td className="px-5 py-4 font-semibold text-gray-800">{lf.codigo}</td>
                      <td className="px-5 py-4 text-xs font-bold text-gray-600">{lf.tipoProducto?.tipo ?? `#${lf.tipoProductoId}`}</td>
                      <td className="px-5 py-4 text-xs text-gray-500">{lf.sku?.nombre ?? '—'}</td>
                      <td className="px-5 py-4 text-xs text-gray-500">{lf.variedad ?? '—'}</td>
                      <td className="px-5 py-4 text-xs text-gray-500">{lf.productor ? `${lf.productor.nombre}${lf.productor.apellido ? ' ' + lf.productor.apellido : ''}` : '—'}</td>
                      <td className="px-5 py-4 font-semibold text-gray-800 tabular-nums">{Number(lf.cantidadKg).toFixed(2)}</td>
                      <td className="px-5 py-4"><span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${ESTADO_COLOR[lf.estado]}`}>{ESTADO_LABEL[lf.estado]}</span></td>
                      <td className="px-5 py-4 text-xs text-gray-500">{lf.campana?.nombre ?? '—'}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleKardexPdf(lf)}
                            disabled={generandoKardex === lf.id}
                            title="Descargar Kardex PDF"
                            className="p-1.5 rounded-lg text-gray-400 hover:text-purple-600 hover:bg-purple-50 disabled:opacity-40"
                          >
                            {generandoKardex === lf.id
                              ? <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>
                              : <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                            }
                          </button>
                          <button onClick={() => setModal({ type: 'detalle', lf })} title="Ver detalle y KARDEX" className="p-1.5 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                          </button>
                          {lf.estado === 'PENDIENTE_TRILLADO' && (
                            <button
                              onClick={() => setModal({ type: lf.tipoProducto?.tipo === 'CACAO' ? 'trillar-cacao' : 'trillar', lf })}
                              title={lf.tipoProducto?.tipo === 'CACAO' ? 'Asignar SKU cacao' : 'Registrar trillado'}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <TablePagination total={meta.total} page={page} lastPage={meta.lastPage} limit={10} onPageChange={setPage} onLimitChange={() => {}} />
          </div>
        )}
      </div>

      {modal?.type === 'trillar' && <TrilladoModal lf={modal.lf} onClose={() => setModal(null)} onConfirm={handleTrillar} />}
      {modal?.type === 'trillar-cacao' && <CacaoAsignarSkuModal lf={modal.lf} onClose={() => setModal(null)} onConfirm={handleTrillar} />}
      {modal?.type === 'detalle' && <DetalleModal id={modal.lf.id} onClose={() => setModal(null)} />}
      {batchModal && selectedIds.size > 0 && <BatchCacaoModal lfs={lfs.filter(lf => selectedIds.has(lf.id))} onClose={() => setBatchModal(false)} onConfirm={handleBatchTrillar} />}
    </div>
  );
}
