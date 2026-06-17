import { useState, useEffect, useCallback, FormEvent } from 'react';
import { campanasService, Campana, CreateCampanaDto, CampanaTemporada, PaginationMeta } from '@/services/campanas.service';
import { syncService } from '@/services/sync.service';
import { useSyncStatus } from '@/hooks/useSyncStatus';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { TablePagination } from '@/components/TablePagination';
import LoadingLogo from '@/components/LoadingLogo';

const TEMPORADA_LABEL: Record<CampanaTemporada, string> = {
  cafe:       'Café',
  cacao:      'Cacao',
  cafe_cacao: 'Café / Cacao',
};

const TEMPORADA_COLOR: Record<CampanaTemporada, string> = {
  cafe:       'bg-amber-50  text-amber-700  border-amber-200',
  cacao:      'bg-orange-50 text-orange-700 border-orange-200',
  cafe_cacao: 'bg-lime-50   text-lime-700   border-lime-200',
};

const EMPTY_FORM: CreateCampanaDto = {
  nombre: '',
  descripcion: '',
  temporada: 'cafe',
  fechaInicio: null,
  fechaFin: null,
};

interface ModalProps {
  initial?: Campana | null;
  onClose: () => void;
  onSave: (data: CreateCampanaDto, id?: number) => Promise<void>;
}

function CampanaModal({ initial, onClose, onSave }: ModalProps) {
  const [form, setForm] = useState<CreateCampanaDto>(
    initial
      ? {
          nombre:      initial.nombre,
          descripcion: initial.descripcion ?? '',
          temporada:   initial.temporada,
          fechaInicio: initial.fechaInicio,
          fechaFin:    initial.fechaFin,
        }
      : { ...EMPTY_FORM },
  );
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = <K extends keyof CreateCampanaDto>(k: K, v: CreateCampanaDto[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!form.nombre.trim()) {
      errs.nombre = 'El nombre es requerido';
    }
    if (form.fechaInicio && form.fechaFin && form.fechaFin < form.fechaInicio) {
      errs.fechaFin = 'La fecha de cierre debe ser posterior a la fecha de inicio';
    }
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setSaving(true);
    setErrors({});
    try {
      await onSave(form, initial?.id);
      onClose();
    } catch {
      setErrors({ general: 'Error al guardar. Intenta de nuevo.' });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}
      onClick={(e) => !saving && e.target === e.currentTarget && onClose()}
    >
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">

        {saving && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-2 rounded-2xl"
            style={{ backgroundColor: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(2px)' }}
          >
            <LoadingLogo compact />
            <p className="text-sm font-semibold text-gray-600">
              {initial ? 'Actualizando campaña…' : 'Creando campaña…'}
            </p>
          </div>
        )}

        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-800 text-base">
            {initial ? 'Editar campaña' : 'Nueva campaña'}
          </h2>
          <button
            onClick={onClose}
            disabled={saving}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-30"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {errors.general && (
            <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{errors.general}</p>
          )}

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Nombre *</label>
            <input
              value={form.nombre}
              onChange={(e) => set('nombre', e.target.value)}
              className={`w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${errors.nombre ? 'border-red-400' : 'border-gray-200'}`}
              placeholder="Ej: Campaña Papa 2025-I"
            />
            {errors.nombre && <p className="text-xs text-red-500 mt-1">{errors.nombre}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Temporada (tipo de producto)</label>
            <div className="grid grid-cols-3 gap-2">
              {(Object.entries(TEMPORADA_LABEL) as [CampanaTemporada, string][]).map(([k, v]) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => set('temporada', k)}
                  className={`py-2 px-3 rounded-xl text-xs font-medium border transition-all ${
                    form.temporada === k
                      ? TEMPORADA_COLOR[k] + ' ring-2 ring-offset-1 ring-current'
                      : 'bg-gray-50 text-gray-500 border-gray-200 hover:border-gray-400'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Fecha inicio</label>
              <input
                type="date"
                value={form.fechaInicio ?? ''}
                onChange={(e) => set('fechaInicio', e.target.value || null)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Fecha Cierre</label>
              <input
                type="date"
                value={form.fechaFin ?? ''}
                min={form.fechaInicio ?? undefined}
                onChange={(e) => set('fechaFin', e.target.value || null)}
                className={`w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.fechaFin ? 'border-red-400' : 'border-gray-200'}`}
              />
              {errors.fechaFin && (
                <p className="text-xs text-red-500 mt-1 col-span-2">{errors.fechaFin}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Descripción</label>
            <textarea
              value={form.descripcion ?? ''}
              onChange={(e) => set('descripcion', e.target.value)}
              rows={3}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
              placeholder="Descripción opcional..."
            />
          </div>

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
              style={{ backgroundColor: saving ? '#9ca3af' : '#1A2B23' }}
            >
              {saving ? 'Guardando…' : initial ? 'Actualizar' : 'Crear campaña'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function CampanaDetail({ campana, onClose, onEdit }: { campana: Campana; onClose: () => void; onEdit: () => void }) {
  const fmt = (d: string | null) =>
    d ? new Date(d + 'T00:00:00').toLocaleDateString('es-PE', { day: '2-digit', month: 'long', year: 'numeric' }) : '—';

  const fmtDateTime = (d: string) =>
    new Date(d).toLocaleString('es-PE', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 text-xs font-bold text-gray-500">
              #{campana.id}
            </span>
            <h2 className="font-bold text-gray-800 text-base">Detalle de campaña</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          <div>
            <p className="text-[0.68rem] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Nombre</p>
            <p className="text-gray-800 font-semibold text-base">{campana.nombre}</p>
          </div>

          <div>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${TEMPORADA_COLOR[campana.temporada]}`}>
              {TEMPORADA_LABEL[campana.temporada]}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-3 pt-1">
            <div>
              <p className="text-[0.68rem] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">ID</p>
              <p className="text-gray-700 text-sm font-mono">#{campana.id}</p>
            </div>
            <div />
            <div>
              <p className="text-[0.68rem] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Fecha inicio</p>
              <p className="text-gray-700 text-sm">{fmt(campana.fechaInicio)}</p>
            </div>
            <div>
              <p className="text-[0.68rem] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Fecha Cierre</p>
              <p className="text-gray-700 text-sm">{fmt(campana.fechaFin)}</p>
            </div>
            <div>
              <p className="text-[0.68rem] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Creado</p>
              <p className="text-gray-500 text-xs">{fmtDateTime(campana.createdAt)}</p>
            </div>
            <div>
              <p className="text-[0.68rem] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Actualizado</p>
              <p className="text-gray-500 text-xs">{fmtDateTime(campana.updatedAt)}</p>
            </div>
          </div>

          {campana.descripcion && (
            <div className="pt-1">
              <p className="text-[0.68rem] font-semibold text-gray-400 uppercase tracking-wider mb-1">Descripción</p>
              <p className="text-gray-700 text-sm leading-relaxed bg-gray-50 rounded-xl px-3 py-2.5">
                {campana.descripcion}
              </p>
            </div>
          )}
        </div>

        <div className="flex gap-3 px-6 pb-6">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cerrar
          </button>
          <button
            onClick={onEdit}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition-all"
            style={{ backgroundColor: '#1A2B23' }}
          >
            Editar campaña
          </button>
        </div>
      </div>
    </div>
  );
}

function DeleteConfirm({ campana, onClose, onConfirm }: { campana: Campana; onClose: () => void; onConfirm: () => Promise<void> }) {
  const [loading, setLoading] = useState(false);
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
        <h3 className="font-bold text-gray-800 text-base mb-2">Eliminar campaña</h3>
        <p className="text-sm text-gray-500 mb-5">
          ¿Eliminar <span className="font-semibold text-gray-700">"{campana.nombre}"</span>? Esta acción no se puede deshacer.
        </p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50">
            Cancelar
          </button>
          <button
            disabled={loading}
            onClick={async () => { setLoading(true); await onConfirm(); setLoading(false); }}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white"
            style={{ backgroundColor: '#dc2626' }}
          >
            {loading ? 'Eliminando…' : 'Eliminar'}
          </button>
        </div>
      </div>
    </div>
  );
}

export function CampanasPage() {
  const { isOffline, justReconnected } = useNetworkStatus();
  const [campanas, setCampanas] = useState<Campana[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({ total: 0, page: 1, lastPage: 1, limit: 10 });
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<'create' | 'edit' | 'delete' | 'detail' | null>(null);
  const [selected, setSelected] = useState<Campana | null>(null);
  const { pending: pendingSync } = useSyncStatus();
  const [syncDone, setSyncDone] = useState(false);

  const load = useCallback(async (p = page, l = limit) => {
    setLoading(true);
    const result = await campanasService.getPage(p, l);
    setCampanas(result.data);
    setMeta(result.meta);
    setLoading(false);
  }, [page, limit]);

  useEffect(() => { load(page, limit); }, [page, limit]); 

  useEffect(() => {
    if (!justReconnected) return;
    syncService.flush().then(({ ok }) => {
      if (ok > 0) { setSyncDone(true); load(page, limit); }
    });
  }, [justReconnected]); 

  async function handleSave(dto: CreateCampanaDto, id?: number) {
    if (id) await campanasService.update(id, dto);
    else { await campanasService.create(dto); setPage(1); }
    await load(id ? page : 1, limit);
  }

  async function handleDelete() {
    if (!selected) return;
    await campanasService.remove(selected.id);
    setModal(null);
    setSelected(null);
    
    const newPage = campanas.length === 1 && page > 1 ? page - 1 : page;
    setPage(newPage);
    await load(newPage, limit);
  }

  function goToPage(p: number) {
    if (p < 1 || p > meta.lastPage) return;
    setPage(p);
  }

  function changeLimit(l: number) {
    setLimit(l);
    setPage(1);
  }

  return (
    <div className="relative p-4 md:p-8 min-h-full bg-white">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="font-headline text-2xl sm:text-3xl font-black uppercase tracking-wide text-gray-800" style={{ letterSpacing: '0.05em' }}>
            Campañas
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">Gestión de campañas agrícolas</p>
        </div>
        <button
          onClick={() => { setSelected(null); setModal('create'); }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-[0.98] shrink-0 self-start sm:self-auto"
          style={{ backgroundColor: '#1A2B23' }}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
          </svg>
          Nueva campaña
        </button>
      </div>

      {isOffline && (
        <div className="mb-4 text-xs text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-2 inline-flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
          Modo offline — mostrando datos en caché. Los cambios se sincronizarán al reconectar.
        </div>
      )}
      {pendingSync > 0 && !isOffline && !syncDone && (
        <div className="mb-4 text-xs text-blue-700 bg-blue-50 border border-blue-200 rounded-lg px-4 py-2 inline-flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          {pendingSync} cambio{pendingSync > 1 ? 's' : ''} pendiente{pendingSync > 1 ? 's' : ''} por sincronizar…
        </div>
      )}
      {syncDone && (
        <div className="mb-4 text-xs text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-2 inline-flex items-center gap-2">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
          </svg>
          Datos sincronizados correctamente
        </div>
      )}

      {loading && (
        <div className="absolute inset-0 z-40 flex items-center justify-center" style={{ backgroundColor: 'rgba(249,250,251,0.9)', backdropFilter: 'blur(2px)' }}>
          <LoadingLogo />
        </div>
      )}

      {!loading && campanas.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <svg className="w-14 h-14 mb-3 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <rect x="3" y="4" width="18" height="18" rx="3"/><line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          <p className="text-sm font-medium">Sin campañas registradas</p>
          <p className="text-xs mt-1">Crea tu primera campaña agrícola</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[680px]">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-5 py-3 text-[0.68rem] font-semibold text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="text-left px-5 py-3 text-[0.68rem] font-semibold text-gray-500 uppercase tracking-wider">Campaña</th>
                  <th className="text-left px-5 py-3 text-[0.68rem] font-semibold text-gray-500 uppercase tracking-wider">Temporada</th>
                  <th className="text-left px-5 py-3 text-[0.68rem] font-semibold text-gray-500 uppercase tracking-wider">Fecha inicio</th>
                  <th className="text-left px-5 py-3 text-[0.68rem] font-semibold text-gray-500 uppercase tracking-wider">Fecha de cierre</th>
                  <th className="text-right px-5 py-3 text-[0.68rem] font-semibold text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {campanas.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center justify-center min-w-[2rem] px-2 py-0.5 rounded-lg bg-gray-100 text-xs font-mono font-semibold text-gray-500">
                        #{c.id}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-semibold text-gray-800">{c.nombre}</p>
                      {c.descripcion && (
                        <p className="text-xs text-gray-400 mt-0.5 truncate max-w-xs">{c.descripcion}</p>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${TEMPORADA_COLOR[c.temporada]}`}>
                        {TEMPORADA_LABEL[c.temporada]}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs text-gray-600">
                      {c.fechaInicio ?? <span className="text-gray-300">—</span>}
                    </td>
                    <td className="px-5 py-4 text-xs text-gray-600">
                      {c.fechaFin ?? <span className="text-gray-300">—</span>}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => { setSelected(c); setModal('detail'); }}
                          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-all"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                          </svg>
                          Detalles
                        </button>
                        <button
                          onClick={() => { setSelected(c); setModal('edit'); }}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all"
                          title="Editar"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-1.414.586H9v-2a2 2 0 01.586-1.414z"/>
                          </svg>
                        </button>
                        <button
                          onClick={() => { setSelected(c); setModal('delete'); }}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
                          title="Eliminar"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <TablePagination
            total={meta.total}
            page={page}
            lastPage={meta.lastPage}
            limit={limit}
            onPageChange={goToPage}
            onLimitChange={changeLimit}
          />
        </div>
      )}

      {modal === 'detail' && selected && (
        <CampanaDetail
          campana={selected}
          onClose={() => setModal(null)}
          onEdit={() => setModal('edit')}
        />
      )}
      {(modal === 'create' || modal === 'edit') && (
        <CampanaModal
          initial={modal === 'edit' ? selected : null}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}
      {modal === 'delete' && selected && (
        <DeleteConfirm
          campana={selected}
          onClose={() => setModal(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
