import { useState, useEffect, useCallback, FormEvent } from 'react';
import {
  clientesService,
  Cliente,
  CreateClienteDto,
  PaginationMeta,
} from '@/services/clientes.service';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { TablePagination } from '@/components/TablePagination';
import LoadingLogo from '@/components/LoadingLogo';
import { COUNTRY_OPTIONS, getDocLabel } from '@/utils/countries';

const EMPTY_FORM: CreateClienteDto = {
  nombre:       '',
  nroDocumento: '',
  telefono:     '',
  direccion:    '',
  pais:         '',
  email:        '',
  activo:       true,
};

interface ModalFormProps {
  initial?: Cliente | null;
  onClose: () => void;
  onSave: (dto: CreateClienteDto, id?: number) => Promise<void>;
}

function ClienteModal({ initial, onClose, onSave }: ModalFormProps) {
  const [form, setForm] = useState<CreateClienteDto>(
    initial
      ? {
          nombre:       initial.nombre,
          nroDocumento: initial.nroDocumento ?? '',
          telefono:     initial.telefono     ?? '',
          direccion:    initial.direccion    ?? '',
          pais:         initial.pais         ?? '',
          email:        initial.email        ?? '',
          activo:       initial.activo,
        }
      : { ...EMPTY_FORM },
  );
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = <K extends keyof CreateClienteDto>(k: K, v: CreateClienteDto[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  function validate() {
    const e: Record<string, string> = {};
    if (!form.nombre.trim()) e['nombre'] = 'El nombre / razón social es requerido';
    if (form.email?.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e['email'] = 'Email no válido';
    }
    return e;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    setErrors({});
    try {
      const dto: CreateClienteDto = {
        nombre:       form.nombre.trim(),
        nroDocumento: form.nroDocumento?.trim() || null,
        telefono:     form.telefono?.trim()     || null,
        direccion:    form.direccion?.trim()    || null,
        pais:         form.pais?.trim()         || null,
        email:        form.email?.trim()        || null,
        activo:       form.activo,
      };
      await onSave(dto, initial?.id);
      onClose();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message;
      setErrors({ general: typeof msg === 'string' ? msg : 'Error al guardar. Intenta de nuevo.' });
    } finally {
      setSaving(false);
    }
  }

  const inputCls = 'w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500';
  const labelCls = 'block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}
      onClick={(e) => !saving && e.target === e.currentTarget && onClose()}
    >
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden max-h-[92vh] flex flex-col">

        {saving && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-2 rounded-2xl"
            style={{ backgroundColor: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(2px)' }}>
            <LoadingLogo compact />
            <p className="text-sm font-semibold text-gray-600">
              {initial ? 'Actualizando cliente…' : 'Registrando cliente…'}
            </p>
          </div>
        )}

        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100 shrink-0">
          <div>
            <h2 className="font-bold text-gray-800 text-base">
              {initial ? 'Editar cliente' : 'Nuevo cliente'}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {initial ? `Editando ${initial.codigo}` : 'Completa los datos del cliente'}
            </p>
          </div>
          <button onClick={onClose} disabled={saving} className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-30">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4 overflow-y-auto">
          {errors['general'] && (
            <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {errors['general']}
            </p>
          )}

          {initial && (
            <div>
              <label className={labelCls}>Código</label>
              <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl">
                <span className="text-xs font-black tracking-widest text-gray-500">{initial.codigo}</span>
                <span className="text-[0.6rem] text-gray-400 ml-auto">generado automáticamente</span>
              </div>
            </div>
          )}

          <div>
            <label className={labelCls}>Nombre / Razón Social *</label>
            <input
              value={form.nombre}
              onChange={(e) => set('nombre', e.target.value)}
              className={inputCls}
              placeholder="Nombre o razón social del cliente…"
              maxLength={200}
            />
            {errors['nombre'] && <p className="text-xs text-red-500 mt-1">{errors['nombre']}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>País</label>
              <div className="relative">
                <select
                  value={form.pais ?? ''}
                  onChange={(e) => set('pais', e.target.value)}
                  className={`${inputCls} appearance-none pr-8`}
                >
                  <option value="">Seleccionar país…</option>
                  {COUNTRY_OPTIONS.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
                <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-gray-400">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </div>
            </div>
            <div>
              <label className={labelCls}>Email</label>
              <input
                type="email"
                value={form.email ?? ''}
                onChange={(e) => set('email', e.target.value)}
                className={inputCls}
                placeholder="correo@ejemplo.com"
                maxLength={200}
              />
              {errors['email'] && <p className="text-xs text-red-500 mt-1">{errors['email']}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>{getDocLabel(form.pais)}</label>
              <input
                value={form.nroDocumento ?? ''}
                onChange={(e) => set('nroDocumento', e.target.value)}
                className={inputCls}
                placeholder="Número de documento…"
                maxLength={50}
              />
            </div>
            <div>
              <label className={labelCls}>Teléfono</label>
              <input
                value={form.telefono ?? ''}
                onChange={(e) => set('telefono', e.target.value.replace(/\D/g, ''))}
                className={inputCls}
                placeholder="Número de contacto…"
                inputMode="numeric"
                maxLength={20}
              />
            </div>
          </div>

          <div>
            <label className={labelCls}>Dirección</label>
            <textarea
              value={form.direccion ?? ''}
              onChange={(e) => set('direccion', e.target.value)}
              className={`${inputCls} resize-none`}
              rows={2}
              placeholder="Dirección del cliente…"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-5 py-2 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 text-sm font-semibold text-white rounded-xl transition-all hover:opacity-90 active:scale-95 disabled:opacity-50"
              style={{ backgroundColor: '#1A2B23' }}
            >
              {initial ? 'Guardar cambios' : 'Registrar cliente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ClienteDetail({
  cliente,
  onClose,
  onEdit,
}: { cliente: Cliente; onClose: () => void; onEdit: () => void }) {
  const labelCls = 'text-[0.65rem] font-bold text-gray-400 uppercase tracking-wider';
  const valueCls = 'text-sm font-semibold text-gray-800 mt-0.5';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">

        <div
          className="px-6 pt-5 pb-4 flex items-center justify-between"
          style={{ backgroundColor: '#1A2B23' }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-black text-sm"
              style={{ backgroundColor: 'rgba(255,255,255,0.12)', color: '#bef264' }}
            >
              {cliente.nombre.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-headline font-black text-white text-base leading-tight truncate max-w-[220px]">
                {cliente.nombre}
              </p>
              <span
                className="text-[0.65rem] font-bold tracking-widest px-2 py-0.5 rounded-md mt-0.5 inline-block"
                style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: '#bef264' }}
              >
                {cliente.codigo}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div className="px-6 py-5 grid grid-cols-2 gap-x-6 gap-y-4">
          <div>
            <p className={labelCls}>DNI / RUC</p>
            <p className={`${valueCls} font-mono`}>{cliente.nroDocumento || '—'}</p>
          </div>
          <div>
            <p className={labelCls}>País</p>
            <p className={valueCls}>
              {cliente.pais
                ? <span className="px-2 py-0.5 rounded-lg bg-blue-50 text-blue-700 text-xs font-semibold">{cliente.pais}</span>
                : '—'}
            </p>
          </div>
          <div>
            <p className={labelCls}>Teléfono</p>
            <p className={valueCls}>{cliente.telefono || '—'}</p>
          </div>
          <div>
            <p className={labelCls}>Email</p>
            <p className={`${valueCls} truncate`}>{cliente.email || '—'}</p>
          </div>
          <div className="col-span-2">
            <p className={labelCls}>Dirección</p>
            <p className={valueCls}>{cliente.direccion || '—'}</p>
          </div>
          <div>
            <p className={labelCls}>Estado</p>
            <span className={`inline-flex items-center gap-1.5 text-xs font-semibold mt-0.5 ${cliente.activo ? 'text-green-600' : 'text-gray-400'}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${cliente.activo ? 'bg-green-500' : 'bg-gray-300'}`} />
              {cliente.activo ? 'Activo' : 'Inactivo'}
            </span>
          </div>
          <div>
            <p className={labelCls}>Registrado</p>
            <p className={valueCls}>
              {new Date(cliente.createdAt).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' })}
            </p>
          </div>
        </div>

        <div className="px-6 pb-5 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cerrar
          </button>
          <button
            onClick={onEdit}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
            style={{ backgroundColor: '#1A2B23' }}
          >
            Editar cliente
          </button>
        </div>
      </div>
    </div>
  );
}

function DeleteModal({
  cliente, onClose, onConfirm,
}: { cliente: Cliente; onClose: () => void; onConfirm: () => Promise<void> }) {
  const [loading, setLoading] = useState(false);
  async function handle() {
    setLoading(true);
    try { await onConfirm(); onClose(); }
    finally { setLoading(false); }
  }
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      onClick={(e) => !loading && e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z"/>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15.75h.007v.008H12v-.008z"/>
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-gray-800">Inactivar cliente</h3>
            <p className="text-xs text-gray-500 mt-0.5">Esta acción desactiva el cliente</p>
          </div>
        </div>
        <p className="text-sm text-gray-600 mb-5">
          ¿Deseas inactivar a <span className="font-semibold">{cliente.nombre}</span> ({cliente.codigo})?
        </p>
        <div className="flex gap-3">
          <button onClick={onClose} disabled={loading} className="flex-1 py-2 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">Cancelar</button>
          <button onClick={handle} disabled={loading} className="flex-1 py-2 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-xl transition-colors disabled:opacity-50">
            {loading ? 'Inactivando…' : 'Inactivar'}
          </button>
        </div>
      </div>
    </div>
  );
}

export function ClientesPage() {
  const [rows, setRows]         = useState<Cliente[]>([]);
  const [meta, setMeta]         = useState<PaginationMeta>({ total: 0, page: 1, lastPage: 1, limit: 10 });
  const [page, setPage]         = useState(1);
  const [limit, setLimit]       = useState(10);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [searchVal, setSearchVal] = useState('');
  const [modal, setModal]       = useState<'create' | 'edit' | 'delete' | 'detail' | null>(null);
  const [selected, setSelected] = useState<Cliente | null>(null);

  const { isOnline, justReconnected } = useNetworkStatus();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await clientesService.getPage(page, limit, search);
      setRows(res.data);
      setMeta(res.meta);
    } finally {
      setLoading(false);
    }
  }, [page, limit, search]);

  useEffect(() => { load(); }, [load]);

  async function handleSave(dto: CreateClienteDto, id?: number) {
    if (id) await clientesService.update(id, dto);
    else    { await clientesService.create(dto); setPage(1); }
    await load();
  }

  async function handleDelete() {
    if (!selected) return;
    await clientesService.remove(selected.id);
    const newPage = rows.length === 1 && page > 1 ? page - 1 : page;
    setPage(newPage);
    await load();
  }

  function handleBuscar() { setSearch(searchVal); setPage(1); }

  return (
    <div className="relative p-4 md:p-8 min-h-full space-y-4 sm:space-y-6">

      {!isOnline && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700 flex items-center gap-2">
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z"/>
          </svg>
          Modo sin conexión — mostrando datos en caché
        </div>
      )}
      {isOnline && justReconnected && (
        <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700 flex items-center gap-2">
          <svg className="w-4 h-4 shrink-0 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"/>
          </svg>
          Sincronizando cambios pendientes…
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight uppercase" style={{ color: '#1A2B23' }}>
            Clientes
          </h1>
          <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mt-0.5">
            Gestión de clientes
          </p>
        </div>
        <button
          onClick={() => setModal('create')}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-white rounded-xl transition-all hover:opacity-90 active:scale-95 self-start sm:self-auto"
          style={{ backgroundColor: '#1A2B23' }}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
          </svg>
          Agregar cliente
        </button>
      </div>

      <div className="flex gap-2 sm:items-end">
        <div className="flex-1">
          <label className="block text-[0.68rem] font-semibold text-gray-500 uppercase tracking-wider mb-1">
            Buscar cliente
          </label>
          <input
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleBuscar()}
            placeholder="Nombre, DNI/RUC o código…"
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <button
          onClick={handleBuscar}
          className="flex items-center justify-center w-10 h-10 rounded-xl text-white transition-all hover:opacity-90 active:scale-95 shrink-0"
          style={{ backgroundColor: '#1A2B23' }}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607z"/>
          </svg>
        </button>
      </div>

      {loading && (
        <div className="absolute inset-0 z-40 flex items-center justify-center" style={{ backgroundColor: 'rgba(249,250,251,0.9)', backdropFilter: 'blur(2px)' }}>
          <LoadingLogo />
        </div>
      )}

      {!loading && rows.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm px-6 py-16 flex flex-col items-center gap-3 text-center">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ backgroundColor: '#bef264' }}>
            <svg className="w-7 h-7 text-lime-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0z"/>
            </svg>
          </div>
          <p className="font-bold text-gray-700">Sin clientes registrados</p>
          <p className="text-sm text-gray-400">
            {search ? 'No se encontraron clientes con ese criterio.' : 'Agrega el primer cliente al sistema.'}
          </p>
          {!search && (
            <button
              onClick={() => setModal('create')}
              className="mt-2 px-5 py-2 text-sm font-bold text-white rounded-xl hover:opacity-90 transition-all"
              style={{ backgroundColor: '#1A2B23' }}
            >
              + Agregar cliente
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="hidden sm:block bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider w-32">Código</th>
                    <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider w-40">DNI / RUC</th>
                    <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Nombre / Razón Social</th>
                    <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider w-36">Teléfono</th>
                    <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider w-44">Dirección</th>
                    <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider w-28">País</th>
                    <th className="text-right px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider w-28">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((c, i) => (
                    <tr
                      key={c.id}
                      className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${i % 2 === 0 ? '' : 'bg-gray-50/40'}`}
                    >
                      <td className="px-5 py-3.5">
                        <span className="text-xs font-bold px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 tracking-wide whitespace-nowrap">
                          {c.codigo}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 font-mono text-sm text-gray-600">{c.nroDocumento || '—'}</td>
                      <td className="px-5 py-3.5 font-semibold text-gray-800">{c.nombre}</td>
                      <td className="px-5 py-3.5 text-gray-600">{c.telefono || '—'}</td>
                      <td className="px-5 py-3.5 text-gray-500 max-w-[176px]">
                        <span className="line-clamp-1">{c.direccion || '—'}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        {c.pais ? (
                          <span className="text-xs font-semibold px-2 py-1 rounded-lg bg-blue-50 text-blue-700 whitespace-nowrap">{c.pais}</span>
                        ) : (
                          <span className="text-gray-400 text-xs">—</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => { setSelected(c); setModal('detail'); }}
                            title="Ver detalle"
                            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:opacity-80 active:scale-95"
                            style={{ backgroundColor: '#dcfce7' }}
                          >
                            <svg className="w-4 h-4 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"/>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                            </svg>
                          </button>
                          <button
                            onClick={() => { setSelected(c); setModal('edit'); }}
                            title="Editar cliente"
                            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:opacity-80 active:scale-95"
                            style={{ backgroundColor: '#e0f2fe' }}
                          >
                            <svg className="w-4 h-4 text-sky-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931zm0 0L19.5 7.125"/>
                            </svg>
                          </button>
                          <button
                            onClick={() => { setSelected(c); setModal('delete'); }}
                            title="Inactivar cliente"
                            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:opacity-80 active:scale-95"
                            style={{ backgroundColor: '#fee2e2' }}
                          >
                            <svg className="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"/>
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="sm:hidden space-y-3">
            {rows.map((c) => (
              <div key={c.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-4 pt-4 pb-3 flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: '#bef264' }}>
                    <svg className="w-5 h-5 text-lime-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0z"/>
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-lg bg-gray-100 text-gray-700">{c.codigo}</span>
                      {c.pais && (
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-lg bg-blue-50 text-blue-700">{c.pais}</span>
                      )}
                    </div>
                    <p className="font-bold text-gray-800 mt-1 truncate">{c.nombre}</p>
                    {c.nroDocumento && <p className="text-xs font-mono text-gray-500 mt-0.5">{c.nroDocumento}</p>}
                    <div className="flex items-center gap-3 mt-1">
                      {c.telefono && <p className="text-xs text-gray-400">{c.telefono}</p>}
                      {c.direccion && <p className="text-xs text-gray-400 truncate">{c.direccion}</p>}
                    </div>
                  </div>
                </div>
                <div className="border-t border-gray-100 px-4 py-2.5 flex items-center gap-2">
                  <button
                    onClick={() => { setSelected(c); setModal('detail'); }}
                    title="Ver detalle"
                    className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:opacity-80 active:scale-95"
                    style={{ backgroundColor: '#dcfce7' }}
                  >
                    <svg className="w-4 h-4 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"/>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                    </svg>
                  </button>
                  <button
                    onClick={() => { setSelected(c); setModal('edit'); }}
                    className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:opacity-80 active:scale-95"
                    style={{ backgroundColor: '#e0f2fe' }}
                  >
                    <svg className="w-4 h-4 text-sky-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931zm0 0L19.5 7.125"/>
                    </svg>
                  </button>
                  <button
                    onClick={() => { setSelected(c); setModal('delete'); }}
                    className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:opacity-80 active:scale-95"
                    style={{ backgroundColor: '#fee2e2' }}
                  >
                    <svg className="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"/>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <TablePagination
              total={meta.total}
              page={page}
              lastPage={meta.lastPage}
              limit={limit}
              onPageChange={(p) => setPage(p)}
              onLimitChange={(l) => { setLimit(l); setPage(1); }}
              limitOptions={[10, 20, 50]}
            />
          </div>
        </>
      )}

      {modal === 'detail' && selected && (
        <ClienteDetail
          cliente={selected}
          onClose={() => { setModal(null); setSelected(null); }}
          onEdit={() => setModal('edit')}
        />
      )}
      {(modal === 'create' || modal === 'edit') && (
        <ClienteModal
          initial={modal === 'edit' ? selected : null}
          onClose={() => { setModal(null); setSelected(null); }}
          onSave={handleSave}
        />
      )}
      {modal === 'delete' && selected && (
        <DeleteModal
          cliente={selected}
          onClose={() => { setModal(null); setSelected(null); }}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
