import { useState, useEffect, useCallback } from 'react';
import { usuariosService, Usuario, CreateUsuarioDto, UpdateUsuarioDto, UserRole } from '@/services/usuarios.service';
import { configuracionService, Configuracion, UpdateConfiguracionDto } from '@/services/configuracion.service';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import LoadingLogo from '@/components/LoadingLogo';

const ROLE_LABEL: Record<UserRole, string> = {
  admin:    'Administrador',
  manager:  'Manager',
  operator: 'Operador',
};

const ROLE_COLOR: Record<UserRole, string> = {
  admin:    'bg-purple-50 text-purple-700 border-purple-200',
  manager:  'bg-blue-50   text-blue-700   border-blue-200',
  operator: 'bg-gray-50   text-gray-600   border-gray-200',
};

interface UsuarioModalProps {
  initial?: Usuario | null;
  onClose: () => void;
  onSave: (data: CreateUsuarioDto | UpdateUsuarioDto, id?: number) => Promise<void>;
}

function UsuarioModal({ initial, onClose, onSave }: UsuarioModalProps) {
  const [form, setForm] = useState(
    initial
      ? { username: initial.username, password: '', role: initial.role }
      : { username: '', password: '', role: 'operator' as UserRole },
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const set = (k: keyof typeof form, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.username.trim()) { setError('El nombre de usuario es requerido'); return; }
    if (!initial && form.password.length < 6) { setError('La contraseña debe tener al menos 6 caracteres'); return; }

    setSaving(true);
    setError('');
    try {
      const payload: CreateUsuarioDto | UpdateUsuarioDto = {
        username: form.username,
        role: form.role,
        ...(form.password ? { password: form.password } : {}),
      };
      await onSave(payload, initial?.id);
      onClose();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(typeof msg === 'string' ? msg : 'Error al guardar. Intenta de nuevo.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative overflow-hidden bg-white rounded-2xl shadow-xl w-full max-w-md">
        {saving && (
          <div
            className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-2 rounded-2xl"
            style={{ backgroundColor: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(2px)' }}
          >
            <LoadingLogo compact />
            <p className="text-sm font-semibold text-gray-600">
              {initial ? 'Actualizando usuario…' : 'Creando usuario…'}
            </p>
          </div>
        )}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-800 text-base">
            {initial ? 'Editar usuario' : 'Nuevo usuario'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {error && (
            <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
          )}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Usuario *</label>
            <input
              value={form.username}
              onChange={(e) => set('username', e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="nombre de usuario"
              autoComplete="off"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Contraseña {initial && <span className="text-gray-400">(dejar vacío para no cambiar)</span>}
            </label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => set('password', e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder={initial ? '••••••' : 'mínimo 6 caracteres'}
              autoComplete="new-password"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Rol</label>
            <select
              value={form.role}
              onChange={(e) => set('role', e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {(Object.entries(ROLE_LABEL) as [UserRole, string][]).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50">
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white"
              style={{ backgroundColor: saving ? '#9ca3af' : '#1A2B23' }}
            >
              {saving ? 'Guardando…' : initial ? 'Actualizar' : 'Crear usuario'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DeleteConfirm({ user, onClose, onConfirm }: { user: Usuario; onClose: () => void; onConfirm: () => Promise<void> }) {
  const [loading, setLoading] = useState(false);
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative overflow-hidden bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
        {loading && (
          <div
            className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-2 rounded-2xl"
            style={{ backgroundColor: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(2px)' }}
          >
            <LoadingLogo compact />
            <p className="text-sm font-semibold text-gray-600">Desactivando usuario…</p>
          </div>
        )}
        <h3 className="font-bold text-gray-800 text-base mb-2">Desactivar usuario</h3>
        <p className="text-sm text-gray-500 mb-5">
          ¿Desactivar el usuario <span className="font-semibold text-gray-700">"{user.username}"</span>? No podrá iniciar sesión.
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
            {loading ? 'Desactivando…' : 'Desactivar'}
          </button>
        </div>
      </div>
    </div>
  );
}

function parseVars(raw: string | null | undefined): string[] {
  try { return JSON.parse(raw ?? '[]') ?? []; } catch { return []; }
}

function TabEmpresa({ isOffline }: { isOffline: boolean }) {
  const [config, setConfig]   = useState<Configuracion | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [saved,   setSaved]   = useState(false);
  const [error,   setError]   = useState('');
  const [form,    setForm]    = useState<UpdateConfiguracionDto>({});

  const [variedades,    setVariedades]    = useState<string[]>([]);
  const [nuevaVariedad, setNuevaVariedad] = useState('');
  const [savingVar,     setSavingVar]     = useState(false);

  useEffect(() => {
    configuracionService.get().then((c) => {
      setConfig(c);
      if (c) {
        setForm({
          nombreEmpresa: c.nombreEmpresa ?? '',
          ruc:           c.ruc           ?? '',
          direccion:     c.direccion     ?? '',
          telefono:      c.telefono      ?? '',
          email:         c.email         ?? '',
          logoUrl:       c.logoUrl       ?? '',
          pais:          c.pais          ?? '',
          moneda:        c.moneda        ?? 'PEN',
        });
        setVariedades(parseVars(c.variedades));
      }
      setLoading(false);
    });
  }, []);

  async function saveVariedades(list: string[]) {
    setSavingVar(true);
    try {
      const updated = await configuracionService.update({ variedades: JSON.stringify(list) });
      if (updated) setVariedades(parseVars(updated.variedades));
    } finally {
      setSavingVar(false);
    }
  }

  function handleAddVariedad() {
    const trimmed = nuevaVariedad.trim();
    if (!trimmed || variedades.includes(trimmed)) return;
    const next = [...variedades, trimmed];
    setVariedades(next);
    setNuevaVariedad('');
    saveVariedades(next);
  }

  function handleRemoveVariedad(v: string) {
    const next = variedades.filter((x) => x !== v);
    setVariedades(next);
    saveVariedades(next);
  }

  const set = (k: keyof UpdateConfiguracionDto, v: string) =>
    setForm((f) => ({ ...f, [k]: v || null }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSaved(false);
    try {
      const updated = await configuracionService.update(form);
      setConfig(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError('Error al guardar la configuración.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="py-12 flex justify-center"><LoadingLogo compact /></div>;

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
      {error && (
        <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
      )}
      {saved && (
        <p className="text-xs text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2 flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
          </svg>
          Configuración guardada correctamente
        </p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-gray-600 mb-1">Nombre de la empresa</label>
          <input
            value={form.nombreEmpresa ?? ''}
            onChange={(e) => set('nombreEmpresa', e.target.value)}
            placeholder="Ej: Collective Bean S.A.C."
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            disabled={isOffline}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">RUC</label>
          <input
            value={form.ruc ?? ''}
            onChange={(e) => set('ruc', e.target.value)}
            placeholder="Ej: 20123456789"
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            disabled={isOffline}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Teléfono</label>
          <input
            value={form.telefono ?? ''}
            onChange={(e) => set('telefono', e.target.value)}
            placeholder="Ej: +51 999 999 999"
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            disabled={isOffline}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
          <input
            type="email"
            value={form.email ?? ''}
            onChange={(e) => set('email', e.target.value)}
            placeholder="Ej: contacto@collectivebean.com"
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            disabled={isOffline}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">País</label>
          <input
            value={form.pais ?? ''}
            onChange={(e) => set('pais', e.target.value)}
            placeholder="Ej: Peru"
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            disabled={isOffline}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Moneda</label>
          <select
            value={form.moneda ?? 'PEN'}
            onChange={(e) => set('moneda', e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            disabled={isOffline}
          >
            <option value="PEN">PEN — Sol peruano</option>
            <option value="USD">USD — Dólar americano</option>
            <option value="EUR">EUR — Euro</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-gray-600 mb-1">Dirección</label>
          <textarea
            value={form.direccion ?? ''}
            onChange={(e) => set('direccion', e.target.value)}
            rows={2}
            placeholder="Ej: Av. La Molina 123, Lima, Peru"
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
            disabled={isOffline}
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-gray-600 mb-1">URL del logo</label>
          <input
            value={form.logoUrl ?? ''}
            onChange={(e) => set('logoUrl', e.target.value)}
            placeholder="https://..."
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            disabled={isOffline}
          />
          {form.logoUrl && (
            <img
              src={form.logoUrl}
              alt="Logo preview"
              className="mt-2 h-12 object-contain rounded-lg border border-gray-200"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          )}
        </div>
      </div>
      {!isOffline && (
        <div className="pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all active:scale-[0.98]"
            style={{ backgroundColor: saving ? '#9ca3af' : '#1A2B23' }}
          >
            {saving ? 'Guardando…' : 'Guardar configuración'}
          </button>
        </div>
      )}
      {isOffline && (
        <p className="text-xs text-yellow-600">Modo offline — no se puede editar la configuración.</p>
      )}

    </form>
  );
}

type Tab = 'empresa' | 'usuarios';

export function ConfiguracionPage() {
  const { isOffline }   = useNetworkStatus();
  const [tab, setTab]   = useState<Tab>('empresa');
  const [usuarios,  setUsuarios]  = useState<Usuario[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [modal,     setModal]     = useState<'create' | 'edit' | 'delete' | null>(null);
  const [selected,  setSelected]  = useState<Usuario | null>(null);

  const loadUsuarios = useCallback(async () => {
    setLoading(true);
    setUsuarios(await usuariosService.getAll());
    setLoading(false);
  }, []);

  useEffect(() => {
    if (tab === 'usuarios') loadUsuarios();
  }, [tab, loadUsuarios]);

  async function handleSave(dto: CreateUsuarioDto | UpdateUsuarioDto, id?: number) {
    if (id) await usuariosService.update(id, dto as UpdateUsuarioDto);
    else await usuariosService.create(dto as CreateUsuarioDto);
    await loadUsuarios();
  }

  async function handleDeactivate() {
    if (!selected) return;
    await usuariosService.deactivate(selected.id);
    setModal(null);
    setSelected(null);
    await loadUsuarios();
  }

  return (
    <div className="relative p-4 md:p-8 min-h-full bg-white">
      {loading && tab === 'usuarios' && (
        <div
          className="absolute inset-0 z-40 flex items-center justify-center"
          style={{ backgroundColor: 'rgba(249,250,251,0.9)', backdropFilter: 'blur(2px)' }}
        >
          <LoadingLogo />
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-headline text-2xl sm:text-3xl font-black uppercase tracking-wide text-gray-800" style={{ letterSpacing: '0.05em' }}>
            Configuración
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">Ajustes generales del sistema</p>
        </div>
        {tab === 'usuarios' && !isOffline && (
          <button
            onClick={() => { setSelected(null); setModal('create'); }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white hover:opacity-90 active:scale-[0.98] transition-all"
            style={{ backgroundColor: '#1A2B23' }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
            </svg>
            Nuevo usuario
          </button>
        )}
      </div>

      {isOffline && (
        <div className="mb-4 text-xs text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-2 inline-flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
          Modo offline — solo lectura. Datos en caché.
        </div>
      )}

      <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-xl w-fit">
        {([['empresa', 'Empresa'], ['usuarios', 'Usuarios']] as [Tab, string][]).map(([t, label]) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
              tab === t ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'empresa' && <TabEmpresa isOffline={isOffline} />}

      {tab === 'usuarios' && !loading && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[520px]">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-5 py-3 text-[0.68rem] font-semibold text-gray-500 uppercase tracking-wider">Usuario</th>
                  <th className="text-left px-5 py-3 text-[0.68rem] font-semibold text-gray-500 uppercase tracking-wider">Rol</th>
                  <th className="text-left px-5 py-3 text-[0.68rem] font-semibold text-gray-500 uppercase tracking-wider">Estado</th>
                  <th className="text-left px-5 py-3 text-[0.68rem] font-semibold text-gray-500 uppercase tracking-wider">Creado</th>
                  {!isOffline && <th className="px-5 py-3" />}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {usuarios.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
                          style={{ backgroundColor: '#1A2B23' }}
                        >
                          {u.username.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-semibold text-gray-800">{u.username}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${ROLE_COLOR[u.role]}`}>
                        {ROLE_LABEL[u.role]}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${u.isActive ? 'text-green-600' : 'text-gray-400'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${u.isActive ? 'bg-green-500' : 'bg-gray-300'}`} />
                        {u.isActive ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs text-gray-400">
                      {new Date(u.createdAt).toLocaleDateString('es-PE', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                    {!isOffline && (
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => { setSelected(u); setModal('edit'); }}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all"
                            title="Editar"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-1.414.586H9v-2a2 2 0 01.586-1.414z"/>
                            </svg>
                          </button>
                          {u.isActive && (
                            <button
                              onClick={() => { setSelected(u); setModal('delete'); }}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
                              title="Desactivar"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/>
                              </svg>
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {(modal === 'create' || modal === 'edit') && (
        <UsuarioModal
          initial={modal === 'edit' ? selected : null}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}
      {modal === 'delete' && selected && (
        <DeleteConfirm
          user={selected}
          onClose={() => setModal(null)}
          onConfirm={handleDeactivate}
        />
      )}
    </div>
  );
}
