import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  lotesFinalesService,
  LoteFinal, LoteFinalEstado, DetalleLoteFinal,
  TrillarDto, MovimientoKardex,
} from '@/services/lotes-finales.service';
import { tiposProductoService, TipoProducto } from '@/services/tipos-producto.service';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { TablePagination } from '@/components/TablePagination';
import LoadingLogo from '@/components/LoadingLogo';

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
  const [form, setForm] = useState<Partial<TrillarDto>>({
    fecha: new Date().toISOString().slice(0, 10),
    pesoPorQuintalKg: undefined,
    pesoPfKg: undefined,
    mermaReutilizableKg: 0,
    mermaDesechableKg: 0,
    sobranteExportableKg: 0,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

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
      setError('Fecha, peso por quintal y PF son requeridos');
      return;
    }
    if (!form.planta?.trim() || !form.malla?.trim() || !form.tipoSeleccion?.trim() || !form.encargado?.trim()) {
      setError('Planta, malla, tipo de selección y encargado son requeridos');
      return;
    }
    if (!r4Ok) { setError(`R4 — Suma (${suma.toFixed(2)} kg) ≠ LF (${cantLf.toFixed(2)} kg). Diferencia ${diferencia.toFixed(2)} kg > 0.5 kg`); return; }
    setSaving(true); setError('');
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
        observaciones: form.observaciones,
      });
      onClose();
    } catch (err) { setError((err as Error).message); }
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
          {error && <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">{error}</p>}

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div><label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Fecha *</label><input type="date" value={form.fecha ?? ''} onChange={e => setForm(f => ({ ...f, fecha: e.target.value }))} className={cls} /></div>
            <div><label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Planta *</label><input value={form.planta ?? ''} onChange={e => setForm(f => ({ ...f, planta: e.target.value || undefined }))} className={cls} /></div>
            <div><label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Malla *</label><input value={form.malla ?? ''} onChange={e => setForm(f => ({ ...f, malla: e.target.value || undefined }))} className={cls} /></div>
            <div><label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Tipo Selección *</label><input value={form.tipoSeleccion ?? ''} onChange={e => setForm(f => ({ ...f, tipoSeleccion: e.target.value || undefined }))} className={cls} /></div>
          </div>
          <div><label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Encargado *</label><input value={form.encargado ?? ''} onChange={e => setForm(f => ({ ...f, encargado: e.target.value || undefined }))} className={cls} /></div>

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

function DetalleModal({ id, onClose }: { id: number; onClose: () => void }) {
  const [detalle, setDetalle] = useState<DetalleLoteFinal | null>(null);
  const [kardex, setKardex]   = useState<MovimientoKardex[]>([]);
  const [tab, setTab]         = useState<'origenes' | 'trillado' | 'kardex'>('origenes');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      lotesFinalesService.getDetalle(id),
      lotesFinalesService.getKardex(id),
    ]).then(([d, c]) => { setDetalle(d); setKardex(c); setLoading(false); });
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
  const [modal, setModal] = useState<{ type: 'trillar' | 'detalle'; lf: LoteFinal } | null>(null);
  const [success, setSuccess] = useState('');

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

  async function handleTrillar(dto: TrillarDto) {
    if (!modal?.lf) return;
    await lotesFinalesService.trillar(modal.lf.id, dto);
    setSuccess(`Trillado registrado para ${modal.lf.codigo}`);
    await load();
    setTimeout(() => setSuccess(''), 4000);
  }

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
                    {['Código LF', 'Origen', 'Tipo', 'Cantidad (kg)', 'Estado', 'Campaña', ''].map(h => (
                      <th key={h} className="text-left px-5 py-3 text-[0.68rem] font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {lfs.map(lf => (
                    <tr key={lf.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4 font-semibold text-gray-800">{lf.codigo}</td>
                      <td className="px-5 py-4 text-xs text-gray-500">{ORIGEN_LABEL[lf.tipoOrigen]}</td>
                      <td className="px-5 py-4 text-xs font-bold text-gray-600">{lf.tipoProducto?.tipo ?? `#${lf.tipoProductoId}`}</td>
                      <td className="px-5 py-4 font-semibold text-gray-800 tabular-nums">{Number(lf.cantidadKg).toFixed(2)}</td>
                      <td className="px-5 py-4"><span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${ESTADO_COLOR[lf.estado]}`}>{ESTADO_LABEL[lf.estado]}</span></td>
                      <td className="px-5 py-4 text-xs text-gray-500">{lf.campana?.nombre ?? '—'}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => setModal({ type: 'detalle', lf })} title="Ver detalle y KARDEX" className="p-1.5 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                          </button>
                          {lf.estado === 'PENDIENTE_TRILLADO' && (
                            <button onClick={() => setModal({ type: 'trillar', lf })} title="Registrar trillado" className="p-1.5 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50">
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
      {modal?.type === 'detalle' && <DetalleModal id={modal.lf.id} onClose={() => setModal(null)} />}
    </div>
  );
}
