import { useState, useEffect, useCallback, FormEvent, useRef, useMemo } from 'react';
import { DEPARTAMENTOS, getProvincias, getDistritos, getCodigoUbigeo } from '@/data/ubigeo-peru';
import { useNavigate } from 'react-router-dom';
import {
  productoresService,
  Productor,
  CreateProductorDto,
  PaginationMeta,
  ProductorTipoProducto,
  TIPO_PRODUCTO_LABEL,
  ProductorTipoProductor,
  TIPO_PRODUCTOR_LABEL,
  ImportReport,
} from '@/services/productores.service';
import { Campana } from '@/services/campanas.service';
import { useCampana } from '@/contexts/CampanaContext';
import { syncService } from '@/services/sync.service';
import { useSyncStatus } from '@/hooks/useSyncStatus';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { TablePagination } from '@/components/TablePagination';
import LoadingLogo from '@/components/LoadingLogo';
import { ProductorExportModal } from './ProductorExportModal';
import { bulkExportProductoresPDF, BulkExportProgress } from '@/utils/bulkExportPdf';
import { ParcelaCampanaForm } from '@/components/ParcelaCampanaForm';
import { parcelasService, Parcela } from '@/services/parcelas.service';
import { useToast } from '@/contexts/ToastContext';

const EMPTY_FORM: CreateProductorDto = {
  nombre:        '',
  apellido:      '',
  tipoProductor: undefined,
  nroDocumento:  '',
  fecha:         '',
  telefono:      '',
  fotoUrl:       '',
  email:         '',
  descripcion:   '',
  direccion:     '',
  departamento:  '',
  provincia:     '',
  distrito:      '',
  codigoUbigeo:  '',
  tipoProducto:  undefined,
  esApto:        true,
  activo:        true,
  campanaId:     0,
};

function fmtDateTime(d: string) {
  return new Date(d).toLocaleString('es-PE', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function nombreCompleto(p: Productor) {
  return p.apellido ? `${p.apellido}, ${p.nombre}` : p.nombre;
}

interface ModalFormProps {
  initial?: Productor | null;
  campanas: Campana[];
  campanaActiva: number | null;
  onClose: () => void;
  onSave: (data: CreateProductorDto, id?: number) => Promise<void>;
}

function ProductorModal({ initial, campanas, campanaActiva, onClose, onSave }: ModalFormProps) {
  const defaultCampana =
    initial?.campanaId ??
    campanaActiva ??
    (campanas[0]?.id ?? 0);

  const [form, setForm] = useState<CreateProductorDto>(
    initial
      ? {
          nombre:        initial.nombre,
          apellido:      initial.apellido ?? '',
          tipoProductor: initial.tipoProductor ?? undefined,
          nroDocumento:  initial.nroDocumento ?? '',
          fecha:         initial.fecha ?? '',
          telefono:      initial.telefono ?? '',
          fotoUrl:       initial.fotoUrl ?? '',
          email:         initial.email ?? '',
          descripcion:   initial.descripcion ?? '',
          direccion:     initial.direccion ?? '',
          departamento:  initial.departamento ?? '',
          provincia:     initial.provincia ?? '',
          distrito:      initial.distrito ?? '',
          codigoUbigeo:  initial.codigoUbigeo ?? '',
          tipoProducto:  initial.tipoProducto ?? undefined,
          esApto:        initial.esApto,
          activo:        initial.activo,
          campanaId:     initial.campanaId,
        }
      : { ...EMPTY_FORM, campanaId: defaultCampana },
  );
  const [saving,    setSaving]    = useState(false);
  const [errors,    setErrors]    = useState<Record<string, string>>({});
  const [fotoPreview, setFotoPreview] = useState<string>(initial?.fotoUrl ?? '');
  const [uploading, setUploading] = useState(false);
  const [tipoDoc, setTipoDoc] = useState<'dni' | 'ruc'>(() =>
    (initial?.nroDocumento?.length ?? 0) === 11 ? 'ruc' : 'dni'
  );

  function handleTipoDocChange(tipo: 'dni' | 'ruc') {
    setTipoDoc(tipo);
    set('nroDocumento', '');
    if (tipo === 'ruc') {
      const full = [form.apellido?.trim(), form.nombre?.trim()].filter(Boolean).join(' ');
      set('nombre', full || form.nombre);
      set('apellido', '');
    }
  }

  const provincias = useMemo(() => form.departamento ? getProvincias(form.departamento) : [], [form.departamento]);
  const distritos  = useMemo(() => (form.departamento && form.provincia) ? getDistritos(form.departamento, form.provincia) : [], [form.departamento, form.provincia]);

  const set = <K extends keyof CreateProductorDto>(k: K, v: CreateProductorDto[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  async function handleFotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setFotoPreview(URL.createObjectURL(file));
    if (!navigator.onLine) return; 
    setUploading(true);
    try {
      const url = await productoresService.uploadFoto(file);
      set('fotoUrl', url);
      setFotoPreview(url);
    } catch {
      
    } finally {
      setUploading(false);
    }
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!form.nombre.trim()) e['nombre']   = 'El nombre / razón social es requerido';
    if (!form.campanaId)     e['campanaId'] = 'La campaña es requerida';
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
      const dto: CreateProductorDto = {
        ...form,
        apellido:     form.apellido?.trim()     || undefined,
        nroDocumento: form.nroDocumento?.trim() || undefined,
        fecha:        form.fecha?.trim()        || undefined,
        telefono:     form.telefono?.trim()     || undefined,
        email:        form.email?.trim()        || undefined,
        descripcion:  form.descripcion?.trim()  || undefined,
        direccion:    form.direccion?.trim()    || undefined,
        departamento: form.departamento?.trim() || undefined,
        provincia:    form.provincia?.trim()    || undefined,
        distrito:     form.distrito?.trim()     || undefined,
        codigoUbigeo: form.codigoUbigeo?.trim() || undefined,
        fotoUrl:      form.fotoUrl?.trim()      || undefined,
        tipoProducto: form.tipoProducto         || undefined,
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
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      onClick={(e) => !saving && e.target === e.currentTarget && onClose()}
    >
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden max-h-[92vh] flex flex-col">

        {saving && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-2 rounded-2xl"
            style={{ backgroundColor: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(2px)' }}
          >
            <LoadingLogo compact />
            <p className="text-sm font-semibold text-gray-600">
              {initial ? 'Actualizando productor…' : 'Registrando productor…'}
            </p>
          </div>
        )}

        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100 shrink-0">
          <div>
            <h2 className="font-bold text-gray-800 text-base">
              {initial ? 'Editar productor' : 'Nuevo productor'}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {initial ? `Editando #${initial.id}` : 'Completa los datos del productor'}
            </p>
          </div>
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

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4 overflow-y-auto">
          {errors['general'] && (
            <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {errors['general']}
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={labelCls} style={{ marginBottom: 0 }}>Tipo de documento</span>
                <div className="flex rounded-lg overflow-hidden border border-gray-200">
                  {(['dni', 'ruc'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => handleTipoDocChange(t)}
                      className={`px-3 py-0.5 text-xs font-bold uppercase transition-colors ${
                        tipoDoc === t
                          ? 'bg-green-600 text-white'
                          : 'bg-white text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {t.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
              <input
                value={form.nroDocumento ?? ''}
                onChange={(e) => set('nroDocumento', e.target.value.replace(/\D/g, '').slice(0, tipoDoc === 'dni' ? 8 : 11))}
                className={inputCls}
                placeholder={tipoDoc === 'dni' ? '8 dígitos' : '11 dígitos'}
                maxLength={tipoDoc === 'dni' ? 8 : 11}
              />
            </div>
            <div>
              <label className={labelCls}>Campaña *</label>
              <div className="relative">
                <select
                  value={form.campanaId ?? ''}
                  onChange={(e) => set('campanaId', Number(e.target.value))}
                  disabled={!!initial}
                  className={`${inputCls} appearance-none pr-8 disabled:bg-gray-50 disabled:text-gray-400`}
                >
                  <option value={0} disabled>Seleccionar campaña…</option>
                  {campanas.map((c) => (
                    <option key={c.id} value={c.id}>{c.nombre}</option>
                  ))}
                </select>
                <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
                </svg>
              </div>
              {errors['campanaId'] && <p className="text-xs text-red-500 mt-1">{errors['campanaId']}</p>}
              {initial && <p className="text-xs text-gray-400 mt-1">Usa "Clonar" para mover a otra campaña.</p>}
            </div>
          </div>

          {tipoDoc === 'dni' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Nombres *</label>
                <input
                  value={form.nombre}
                  onChange={(e) => set('nombre', e.target.value)}
                  className={inputCls}
                  placeholder="Nombres…"
                  maxLength={200}
                />
                {errors['nombre'] && <p className="text-xs text-red-500 mt-1">{errors['nombre']}</p>}
              </div>
              <div>
                <label className={labelCls}>Apellidos</label>
                <input
                  value={form.apellido ?? ''}
                  onChange={(e) => set('apellido', e.target.value)}
                  className={inputCls}
                  placeholder="Apellidos…"
                  maxLength={200}
                />
              </div>
            </div>
          ) : (
            <div>
              <label className={labelCls}>Razón Social *</label>
              <input
                value={form.nombre}
                onChange={(e) => set('nombre', e.target.value)}
                className={inputCls}
                placeholder="Razón social…"
                maxLength={200}
              />
              {errors['nombre'] && <p className="text-xs text-red-500 mt-1">{errors['nombre']}</p>}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Tipo de productor</label>
              <div className="relative">
                <select
                  value={form.tipoProductor ?? ''}
                  onChange={(e) =>
                    set('tipoProductor', (e.target.value as ProductorTipoProductor) || undefined)
                  }
                  className={`${inputCls} appearance-none pr-8`}
                >
                  <option value="">Sin especificar</option>
                  {(Object.keys(TIPO_PRODUCTOR_LABEL) as ProductorTipoProductor[]).map((k) => (
                    <option key={k} value={k}>{TIPO_PRODUCTOR_LABEL[k]}</option>
                  ))}
                </select>
                <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
                </svg>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className={labelCls}>Ubicación (Ubigeo)</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="relative">
                <select
                  value={form.departamento ?? ''}
                  onChange={(e) => { set('departamento', e.target.value); set('provincia', ''); set('distrito', ''); }}
                  className={`${inputCls} appearance-none pr-8`}
                >
                  <option value="">Departamento…</option>
                  {DEPARTAMENTOS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/></svg>
              </div>
              <div className="relative">
                <select
                  value={form.provincia ?? ''}
                  onChange={(e) => { set('provincia', e.target.value); set('distrito', ''); }}
                  disabled={!form.departamento}
                  className={`${inputCls} appearance-none pr-8 disabled:opacity-40`}
                >
                  <option value="">{form.departamento ? 'Provincia…' : '← Elige departamento'}</option>
                  {provincias.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
                <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/></svg>
              </div>
              <div className="relative">
                <select
                  value={form.distrito ?? ''}
                  onChange={(e) => {
                    const dist = e.target.value;
                    set('distrito', dist);
                    if (dist && form.departamento && form.provincia) {
                      const code = getCodigoUbigeo(form.departamento, form.provincia, dist);
                      if (code) set('codigoUbigeo', code);
                    }
                  }}
                  disabled={!form.provincia}
                  className={`${inputCls} appearance-none pr-8 disabled:opacity-40`}
                >
                  <option value="">{form.provincia ? 'Distrito…' : '← Elige provincia'}</option>
                  {distritos.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/></svg>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-36">
                <input
                  value={form.codigoUbigeo ?? ''}
                  onChange={(e) => set('codigoUbigeo', e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className={`${inputCls} font-mono text-center tracking-widest`}
                  placeholder="000000"
                  maxLength={6}
                />
              </div>
              <p className="text-xs text-gray-400 leading-tight">Código INEI de 6 dígitos<br/></p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Fecha de Registro</label>
              <input
                type="date"
                value={form.fecha ?? ''}
                onChange={(e) => set('fecha', e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Teléfono</label>
              <input
                value={form.telefono ?? ''}
                onChange={(e) => set('telefono', e.target.value)}
                className={inputCls}
                placeholder="+51 …"
                maxLength={20}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Correo electrónico</label>
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
            <div>
              <label className={labelCls}>Foto</label>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl border border-gray-200 bg-gray-50 overflow-hidden shrink-0 flex items-center justify-center">
                  {fotoPreview ? (
                    <img src={fotoPreview} alt="foto" className="w-full h-full object-cover" />
                  ) : (
                    <svg className="w-5 h-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0zM4.501 20.118a7.5 7.5 0 0 1 14.998 0"/>
                    </svg>
                  )}
                </div>
                <label className={`flex-1 flex items-center justify-center gap-1.5 border border-dashed border-gray-300 rounded-xl px-2 py-2 text-xs font-medium text-gray-500 hover:border-gray-400 hover:bg-gray-50 transition-colors cursor-pointer ${uploading ? 'opacity-60 pointer-events-none' : ''}`}>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"/>
                  </svg>
                  {uploading ? 'Subiendo…' : 'Seleccionar'}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    className="hidden"
                    onChange={handleFotoChange}
                    disabled={uploading}
                  />
                </label>
              </div>
              <p className="text-[0.65rem] text-gray-400 mt-1">JPG, PNG, WebP · máx. 5 MB</p>
            </div>
          </div>

          <div>
            <label className={labelCls}>Descripción</label>
            <textarea
              value={form.descripcion ?? ''}
              onChange={(e) => set('descripcion', e.target.value)}
              rows={2}
              className={`${inputCls} resize-none`}
              placeholder="Notas u observaciones del productor…"
            />
          </div>

          <div>
            <label className={labelCls}>Dirección</label>
            <textarea
              value={form.direccion ?? ''}
              onChange={(e) => set('direccion', e.target.value)}
              rows={2}
              className={`${inputCls} resize-none`}
              placeholder="Dirección o referencia…"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Producto principal</label>
              <div className="relative">
                <select
                  value={form.tipoProducto ?? ''}
                  onChange={(e) =>
                    set('tipoProducto', (e.target.value as ProductorTipoProducto) || undefined)
                  }
                  className={`${inputCls} appearance-none pr-8`}
                >
                  <option value="">Sin especificar</option>
                  {(Object.keys(TIPO_PRODUCTO_LABEL) as ProductorTipoProducto[]).map((k) => (
                    <option key={k} value={k}>{TIPO_PRODUCTO_LABEL[k]}</option>
                  ))}
                </select>
                <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
                </svg>
              </div>
            </div>
            <div>
              <label className={labelCls}>Condición</label>
              <div className="flex rounded-xl border border-gray-200 overflow-hidden text-sm font-semibold">
                <button
                  type="button"
                  onClick={() => set('esApto', true)}
                  className="flex-1 py-2 transition-colors"
                  style={form.esApto
                    ? { backgroundColor: '#1A2B23', color: '#fff' }
                    : { backgroundColor: '#fff', color: '#6b7280' }}
                >
                  ✓ APTO
                </button>
                <button
                  type="button"
                  onClick={() => set('esApto', false)}
                  className="flex-1 py-2 border-l border-gray-200 transition-colors"
                  style={!form.esApto
                    ? { backgroundColor: '#dc2626', color: '#fff' }
                    : { backgroundColor: '#fff', color: '#6b7280' }}
                >
                  ✗ NO APTO
                </button>
              </div>
            </div>
          </div>

          {initial && (
            <div className="flex items-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => set('activo', !form.activo)}
                className={`relative w-10 h-5 rounded-full transition-colors ${form.activo ? 'bg-green-500' : 'bg-gray-300'}`}
              >
                <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${form.activo ? 'left-5' : 'left-0.5'}`} />
              </button>
              <span className="text-sm text-gray-600">{form.activo ? 'Activo' : 'Inactivo'}</span>
            </div>
          )}

          <div className="flex gap-3 pt-2">
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
              {saving ? 'Guardando…' : initial ? 'Actualizar' : 'Registrar productor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ProductorDetail({
  productor,
  onClose,
  onEdit,
  onClone,
}: {
  productor: Productor;
  onClose: () => void;
  onEdit: () => void;
  onClone: () => void;
}) {
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
              #{productor.id}
            </span>
            <h2 className="font-bold text-gray-800 text-base">Detalle de productor</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        <div className="px-6 py-5 space-y-4 overflow-y-auto max-h-[60vh]">

          <div className="flex items-center gap-4">
            {productor.fotoUrl ? (
              <img
                src={productor.fotoUrl}
                alt="foto"
                className="w-16 h-16 rounded-2xl object-cover border border-gray-200 shrink-0"
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-black text-xl shrink-0"
                style={{ backgroundColor: '#1A2B23' }}>
                {productor.nombre.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <p className="text-gray-800 font-bold text-lg leading-tight">{nombreCompleto(productor)}</p>
              <p className="text-xs text-gray-500 mt-0.5">
                {productor.campana ? productor.campana.nombre : 'Sin campaña asociada'}
              </p>
              <div className="flex items-center gap-2 mt-1.5">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${
                  productor.esApto
                    ? 'bg-green-50 text-green-700 border-green-200'
                    : 'bg-red-50 text-red-600 border-red-200'
                }`}>
                  {productor.esApto ? '✓ APTO' : '✗ NO APTO'}
                </span>
                {productor.tipoProducto && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                    {TIPO_PRODUCTO_LABEL[productor.tipoProducto]}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-3 pt-1">
            {productor.nroDocumento && (
              <div>
                <p className="text-[0.68rem] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Documento</p>
                <p className="text-gray-700 text-sm font-mono">{productor.nroDocumento}</p>
              </div>
            )}
            {productor.fecha && (
              <div>
                <p className="text-[0.68rem] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Fecha</p>
                <p className="text-gray-700 text-sm">{productor.fecha}</p>
              </div>
            )}
            {productor.telefono && (
              <div>
                <p className="text-[0.68rem] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Teléfono</p>
                <p className="text-gray-700 text-sm">{productor.telefono}</p>
              </div>
            )}
            {productor.email && (
              <div className="col-span-2">
                <p className="text-[0.68rem] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Email</p>
                <p className="text-gray-700 text-sm">{productor.email}</p>
              </div>
            )}
            {productor.descripcion && (
              <div className="col-span-2">
                <p className="text-[0.68rem] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Descripción</p>
                <p className="text-gray-700 text-sm leading-relaxed bg-gray-50 rounded-xl px-3 py-2.5">
                  {productor.descripcion}
                </p>
              </div>
            )}
            {(productor.departamento || productor.provincia || productor.distrito || productor.codigoUbigeo) && (
              <div className="col-span-2">
                <p className="text-[0.68rem] font-semibold text-gray-400 uppercase tracking-wider mb-1">Ubicación (Ubigeo)</p>
                <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                  {productor.departamento && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0z"/></svg>
                      {productor.departamento}
                    </span>
                  )}
                  {productor.provincia && (
                    <>
                      <svg className="w-3 h-3 text-gray-300 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5"/></svg>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">{productor.provincia}</span>
                    </>
                  )}
                  {productor.distrito && (
                    <>
                      <svg className="w-3 h-3 text-gray-300 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5"/></svg>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-violet-50 text-violet-700 border border-violet-200">{productor.distrito}</span>
                    </>
                  )}
                </div>
                {productor.codigoUbigeo && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-gray-900 text-white text-xs font-mono font-bold tracking-widest">
                    <svg className="w-3 h-3 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5"/></svg>
                    {productor.codigoUbigeo}
                  </span>
                )}
              </div>
            )}
            {productor.direccion && (
              <div className="col-span-2">
                <p className="text-[0.68rem] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Dirección</p>
                <p className="text-gray-700 text-sm leading-relaxed bg-gray-50 rounded-xl px-3 py-2.5">
                  {productor.direccion}
                </p>
              </div>
            )}
            <div>
              <p className="text-[0.68rem] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Estado</p>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${productor.activo ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-600 border border-red-200'}`}>
                {productor.activo ? 'Activo' : 'Inactivo'}
              </span>
            </div>
            <div>
              <p className="text-[0.68rem] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Registrado</p>
              <p className="text-gray-500 text-xs">{fmtDateTime(productor.createdAt)}</p>
            </div>
          </div>

        </div>

        <div className="flex gap-2 px-6 pb-6">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cerrar
          </button>
          <button
            onClick={onClone}
            className="flex-1 py-2.5 rounded-xl border text-sm font-semibold transition-all hover:opacity-90"
            style={{ borderColor: '#1A2B23', color: '#1A2B23' }}
          >
            Clonar
          </button>
          <button
            onClick={onEdit}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition-all"
            style={{ backgroundColor: '#1A2B23' }}
          >
            Editar
          </button>
        </div>
      </div>
    </div>
  );
}

function DeleteConfirm({
  productor,
  onClose,
  onConfirm,
}: {
  productor: Productor;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}) {
  const [loading, setLoading] = useState(false);
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/>
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-gray-800 text-base">Inactivar productor</h3>
            <p className="text-xs text-gray-400">El productor quedará inactivo y no aparecerá en listados</p>
          </div>
        </div>
        <p className="text-sm text-gray-500 mb-5">
          ¿Inactivar a <span className="font-semibold text-gray-700">"{nombreCompleto(productor)}"</span>?
          Podrás reactivarlo desde la edición si lo necesitas.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            disabled={loading}
            onClick={async () => { setLoading(true); await onConfirm(); setLoading(false); }}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white"
            style={{ backgroundColor: '#dc2626' }}
          >
            {loading ? 'Inactivando…' : 'Inactivar'}
          </button>
        </div>
      </div>
    </div>
  );
}

function CloneModal({
  productor,
  campanas,
  onClose,
  onConfirm,
  onViewCloned,
}: {
  productor: Productor;
  campanas: Campana[];
  onClose: () => void;
  onConfirm: (campanaDestinoId: number) => Promise<Productor | null>;
  onViewCloned: (p: Productor) => void;
}) {
  
  const yaEnCampanas = new Set(
    productor.campanasActivas
      ? productor.campanasActivas.map((c) => c.id)
      : [productor.campanaId],
  );
  const disponibles = campanas.filter((c) => !yaEnCampanas.has(c.id));
  const [destino, setDestino] = useState<number>(disponibles[0]?.id ?? 0);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const [clonado, setClonado] = useState<Productor | null>(null);
  const [step, setStep] = useState<'select' | 'success' | 'parcelas'>('select');
  const [parcelas, setParcelas] = useState<Parcela[]>([]);
  const [loadingParcelas, setLoadingParcelas] = useState(false);
  const [openParcelaId, setOpenParcelaId] = useState<number | null>(null);

  async function handleConfirm() {
    if (!destino) { toast.error('Selecciona una campaña destino'); return; }
    setLoading(true);
    try {
      const result = await onConfirm(destino);
      setClonado(result);
      if (result) setStep('success');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message;
      toast.error(typeof msg === 'string' ? msg : 'Error al clonar. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  }

  const campanaNombre = campanas.find((c) => c.id === destino)?.nombre ?? '—';

  
  if (step === 'parcelas' && clonado) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}
        onClick={e => e.target === e.currentTarget && onClose()}>
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col" style={{ maxHeight: 'calc(100vh - 48px)' }}>
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
            <div>
              <h3 className="font-bold text-gray-800 text-base">Parcelas en {clonado.campana?.nombre ?? campanaNombre}</h3>
              <p className="text-xs text-gray-400 mt-0.5">{nombreCompleto(clonado)} — edita los datos de cada parcela para esta campaña</p>
            </div>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-500">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-5">
            {loadingParcelas ? (
              <p className="text-sm text-gray-400 text-center py-8 animate-pulse">Cargando parcelas…</p>
            ) : parcelas.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-sm text-gray-500">Este productor no tiene parcelas registradas.</p>
                <p className="text-xs text-gray-400 mt-1">Puedes registrarlas desde GeoMaps después.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {parcelas.filter(p => p.activo).map(parcela => (
                  <div key={parcela.id} className="border border-gray-200 rounded-2xl overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setOpenParcelaId(openParcelaId === parcela.id ? null : parcela.id)}
                      className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: '#bef264' }}>
                          <svg className="w-3.5 h-3.5" style={{ color: '#365314' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c-.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z"/>
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-800">{parcela.nombre}</p>
                          <p className="text-[0.65rem] text-gray-400 font-mono">{parcela.codigo}</p>
                        </div>
                      </div>
                      <svg className={`w-4 h-4 text-gray-400 transition-transform ${openParcelaId === parcela.id ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
                      </svg>
                    </button>

                    {openParcelaId === parcela.id && (
                      <div className="px-4 pb-4 border-t border-gray-100">
                        <ParcelaCampanaForm
                          parcelaId={parcela.id}
                          campanaId={destino}
                          campanaNombre={clonado.campana?.nombre ?? campanaNombre}
                          parcelaBase={parcela}
                          compact
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="px-6 py-4 border-t border-gray-100 shrink-0 flex gap-3">
            <button onClick={() => setStep('success')}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50">
              ← Volver
            </button>
            <button onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white"
              style={{ backgroundColor: '#1A2B23' }}>
              Finalizar
            </button>
          </div>
        </div>
      </div>
    );
  }

  
  if (step === 'success' && clonado) {
    async function goToParcelas() {
      setLoadingParcelas(true);
      setStep('parcelas');
      const result = await parcelasService.getPage(1, 100, productor.id).then(r => r.data);
      setParcelas(result);
      setLoadingParcelas(false);
      if (result.filter(p => p.activo).length > 0) {
        setOpenParcelaId(result.filter(p => p.activo)[0].id);
      }
    }

    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}
      >
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 flex flex-col items-center text-center">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
            style={{ backgroundColor: 'rgba(34,197,94,0.12)' }}
          >
            <svg className="w-7 h-7 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
            </svg>
          </div>

          <h3 className="font-headline font-bold text-gray-800 text-lg mb-1">Productor clonado</h3>
          <p className="text-sm text-gray-500 mb-5">Se ha creado una copia con los datos base del productor original.</p>

          <div className="w-full rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-left space-y-2 mb-5">
            <div className="flex justify-between items-center">
              <span className="text-[0.68rem] font-semibold text-gray-400 uppercase tracking-wider">Código</span>
              <span className="font-headline text-sm font-bold text-gray-700">{prCode(clonado.id)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[0.68rem] font-semibold text-gray-400 uppercase tracking-wider">Nombre</span>
              <span className="text-sm font-semibold text-gray-700 text-right max-w-[60%] truncate">{nombreCompleto(clonado)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[0.68rem] font-semibold text-gray-400 uppercase tracking-wider">Campaña</span>
              <span className="text-sm font-semibold text-gray-700 text-right max-w-[60%] truncate">
                {clonado.campana?.nombre ?? campanaNombre}
              </span>
            </div>
            {clonado.nroDocumento && (
              <div className="flex justify-between items-center">
                <span className="text-[0.68rem] font-semibold text-gray-400 uppercase tracking-wider">Documento</span>
                <span className="text-sm text-gray-600">{clonado.nroDocumento}</span>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2 w-full">
            <button
              onClick={goToParcelas}
              className="w-full py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all hover:opacity-90"
              style={{ backgroundColor: '#1A2B23', color: '#bef264' }}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c-.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z"/>
              </svg>
              Editar parcelas de esta campaña
            </button>
            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="flex-1 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                Cerrar
              </button>
              <button
                onClick={() => { onClose(); onViewCloned(clonado); }}
                className="flex-1 py-2 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-1.5"
                style={{ backgroundColor: '#1A2B23' }}
              >
                Ver productor
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}
      onClick={(e) => !loading && e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
        <h3 className="font-bold text-gray-800 text-base mb-1">Clonar productor</h3>
        <p className="text-sm text-gray-500 mb-4">
          Copiar a <span className="font-semibold text-gray-700">"{nombreCompleto(productor)}"</span> a otra campaña.
          Se crearán los mismos datos en la campaña seleccionada.
        </p>

        {disponibles.length === 0 ? (
          <p className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 mb-4">
            No hay otras campañas disponibles. Crea al menos una campaña adicional.
          </p>
        ) : (
          <div className="mb-4">
            <label className="block text-xs font-medium text-gray-600 mb-1">Campaña destino *</label>
            <select
              value={destino}
              onChange={(e) => setDestino(Number(e.target.value))}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {disponibles.map((c) => (
                <option key={c.id} value={c.id}>{c.nombre}</option>
              ))}
            </select>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            disabled={loading || disponibles.length === 0}
            onClick={handleConfirm}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-50"
            style={{ backgroundColor: '#1A2B23' }}
          >
            {loading ? 'Clonando…' : 'Clonar productor'}
          </button>
        </div>
      </div>
    </div>
  );
}

 
function prCode(id: number) {
  return `PR${String(id).padStart(3, '0')}`;
}

 
function syncStatus(p: Productor): 'pendiente' | 'sincronizado' {
  return p.id > 1_000_000_000 ? 'pendiente' : 'sincronizado';
}

const SYNC_BADGE = {
  pendiente:    { label: 'PENDIENTE',    cls: 'bg-yellow-400 text-yellow-900' },
  sincronizado: { label: 'SINCRONIZADO', cls: 'bg-green-400  text-green-900'  },
};

export function ProductoresPage() {
  const navigate = useNavigate();
  const { isOffline, justReconnected } = useNetworkStatus();
  const { campanas, campanaActiva, setCampanaActiva, refresh: refreshCampanas } = useCampana();

  useEffect(() => { refreshCampanas(); }, [refreshCampanas]);

  const [productores, setProductores] = useState<Productor[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({ total: 0, page: 1, lastPage: 1, limit: 10 });
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [dniInput, setDniInput]       = useState('');
  const [nombreInput, setNombreInput] = useState('');
  const [dniActivo, setDniActivo]     = useState('');
  const [nombreActivo, setNombreActivo] = useState('');
  const [tipoProductorFiltro, setTipoProductorFiltro] = useState<string>('');
  const [filtroDepartamento, setFiltroDepartamento]   = useState('');
  const [filtroTipoProducto, setFiltroTipoProducto]   = useState('');

  const [loading, setLoading]   = useState(true);
  const [modal, setModal]       = useState<'create' | 'edit' | 'delete' | 'detail' | 'clone' | null>(null);
  const [selected, setSelected] = useState<Productor | null>(null);
  const [exportProductor, setExportProductor] = useState<Productor | null>(null);

  
  const [selectedMap, setSelectedMap] = useState<Map<number, Productor>>(new Map());
  const [bulkExporting, setBulkExporting]   = useState(false);
  const [bulkProgress, setBulkProgress]     = useState<BulkExportProgress | null>(null);

  function toggleSelect(p: Productor) {
    setSelectedMap(prev => {
      const next = new Map(prev);
      if (next.has(p.id)) next.delete(p.id); else next.set(p.id, p);
      return next;
    });
  }
  function clearSelection() { setSelectedMap(new Map()); }

  async function selectAllFiltered() {
    const all = await productoresService.getAllFiltered(campanaId, nombreActivo || undefined, dniActivo || undefined, filtroDepartamento || undefined, filtroTipoProducto || undefined);
    setSelectedMap(new Map(all.map(p => [p.id, p])));
  }

  async function handleBulkExport() {
    if (selectedMap.size === 0) return;
    setBulkExporting(true);
    setBulkProgress(null);
    try {
      await bulkExportProductoresPDF(
        Array.from(selectedMap.values()),
        (progress) => setBulkProgress(progress),
      );
    } finally {
      setBulkExporting(false);
      setBulkProgress(null);
      clearSelection();
    }
  }
  const { pending: pendingSync } = useSyncStatus();
  const [syncDone, setSyncDone] = useState(false);

  
  const [importing, setImporting]       = useState(false);
  const [importReport, setImportReport] = useState<ImportReport | null>(null);
  const [importError, setImportError]   = useState<string | null>(null);
  const importInputRef = useRef<HTMLInputElement>(null);

  async function handleImportFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    setImportReport(null);
    setImportError(null);
    try {
      const report = await productoresService.importarExcel(file);
      setImportReport(report);
      load(); 
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Error al importar el archivo.';
      setImportError(msg);
    } finally {
      setImporting(false);
      if (importInputRef.current) importInputRef.current.value = '';
    }
  }

  const campanaId = campanaActiva?.id;

  const load = useCallback(
    async (p = page, l = limit, dni = dniActivo, nom = nombreActivo, tipo = tipoProductorFiltro, dep = filtroDepartamento, tp = filtroTipoProducto) => {
      setLoading(true);
      const result = await productoresService.getPage(
        p, l,
        campanaId,
        nom || undefined,
        dni || undefined,
        tipo || undefined,
        dep || undefined,
        tp || undefined,
      );
      setProductores(result.data);
      setMeta(result.meta);
      setLoading(false);
    },
    [page, limit, campanaId, dniActivo, nombreActivo, tipoProductorFiltro, filtroDepartamento, filtroTipoProducto],
  );

  
  useEffect(() => {
    setPage(1);
    load(1, limit, dniActivo, nombreActivo, tipoProductorFiltro, filtroDepartamento, filtroTipoProducto);
  }, [campanaId]);

  useEffect(() => {
    load(page, limit, dniActivo, nombreActivo, tipoProductorFiltro, filtroDepartamento, filtroTipoProducto);
  }, [page, limit, dniActivo, nombreActivo, tipoProductorFiltro, filtroDepartamento, filtroTipoProducto]);

  useEffect(() => {
    if (!justReconnected) return;
    syncService.flush().then(({ ok }) => {
      if (ok > 0) { setSyncDone(true); load(); }
    });
  }, [justReconnected]); 

  function handleBuscar() {
    setDniActivo(dniInput);
    setNombreActivo(nombreInput);
    setPage(1);
  }

  function handleLimpiarFiltros() {
    setDniInput(''); setNombreInput('');
    setDniActivo(''); setNombreActivo('');
    setTipoProductorFiltro('');
    setFiltroDepartamento('');
    setFiltroTipoProducto('');
    setPage(1);
  }

  async function handleSave(dto: CreateProductorDto, id?: number) {
    if (id) {
      const { campanaId: _camp, ...updateDto } = dto;
      await productoresService.update(id, updateDto);
    }
    else { await productoresService.create(dto); setPage(1); }
    await load(id ? page : 1, limit, dniActivo, nombreActivo);
  }

  async function handleDelete() {
    if (!selected) return;
    await productoresService.remove(selected.id);
    setModal(null);
    setSelected(null);
    const newPage = productores.length === 1 && page > 1 ? page - 1 : page;
    setPage(newPage);
    await load(newPage, limit, dniActivo, nombreActivo);
  }

  async function handleClone(campanaDestinoId: number): Promise<Productor | null> {
    if (!selected) return null;
    const clonado = await productoresService.clone(selected.id, { campanaDestinoId });
    await load(page, limit, dniActivo, nombreActivo);
    return clonado;
  }

  function handleViewCloned(p: Productor) {
    setSelected(p);
    setModal('detail');
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
            Productores
          </h1>
          <p className="text-xs text-gray-400 mt-0.5 uppercase tracking-widest">Responsive · Para offline</p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <input
            ref={importInputRef}
            type="file"
            accept=".xlsx,.xls"
            className="hidden"
            onChange={handleImportFile}
          />
          <button
            onClick={() => importInputRef.current?.click()}
            disabled={importing || isOffline}
            title={isOffline ? 'No disponible offline' : 'Importar productores desde Excel'}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: '#4b5563' }}
          >
            {importing ? (
              <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin inline-block" />
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"/>
              </svg>
            )}
            {importing ? 'Importando…' : 'Importar Excel'}
          </button>
          <button
            onClick={() => { setSelected(null); setModal('create'); }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-[0.98]"
            style={{ backgroundColor: '#1A2B23' }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
            </svg>
            Agregar productor
          </button>
        </div>
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

      <div className="mb-6 space-y-3">

        <div className="sm:max-w-xs">
          <label className="block text-[0.68rem] font-semibold text-gray-500 uppercase tracking-wider mb-1">
            Campaña
          </label>
          <div className="relative">
            <select
              value={campanaActiva?.id ?? ''}
              onChange={(e) => {
                const val = e.target.value;
                if (!val) { setCampanaActiva(null); return; }
                const found = campanas.find((c) => c.id === Number(val));
                setCampanaActiva(found ?? null);
              }}
              className="w-full appearance-none border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500 pr-9"
            >
              <option value="">Todas las campañas</option>
              {campanas.map((c) => (
                <option key={c.id} value={c.id}>{c.nombre}</option>
              ))}
            </select>
            <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
            </svg>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:items-end">
          <div className="flex-1 min-w-0">
            <label className="block text-[0.68rem] font-semibold text-gray-500 uppercase tracking-wider mb-1">
              DNI / RUC
            </label>
            <div className="relative">
              <input
                value={dniInput}
                onChange={(e) => setDniInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleBuscar()}
                placeholder="Número de documento…"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          <div className="flex-[2] min-w-0">
            <label className="block text-[0.68rem] font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Nombre del productor / Razón social
            </label>
            <div className="relative">
              <input
                value={nombreInput}
                onChange={(e) => setNombreInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleBuscar()}
                placeholder="Nombre o apellido…"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          <button
            onClick={handleBuscar}
            className="flex items-center justify-center w-10 h-10 rounded-xl text-white transition-all hover:opacity-90 active:scale-95 shrink-0"
            style={{ backgroundColor: '#1A2B23' }}
            title="Buscar"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1 0 6.5 6.5a7.5 7.5 0 0 0 10.65 10.65z"/>
            </svg>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:items-end flex-wrap">
          <div className="sm:w-52">
            <label className="block text-[0.68rem] font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Tipo de productor
            </label>
            <div className="relative">
              <select
                value={tipoProductorFiltro}
                onChange={(e) => { setTipoProductorFiltro(e.target.value); setPage(1); }}
                className="w-full appearance-none border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500 pr-9"
              >
                <option value="">Todos</option>
                <option value="individual">Productor Individual</option>
                <option value="acopiador">Acopiador</option>
              </select>
              <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
              </svg>
            </div>
          </div>
          <div className="sm:w-52">
            <label className="block text-[0.68rem] font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Departamento
            </label>
            <div className="relative">
              <select
                value={filtroDepartamento}
                onChange={(e) => { setFiltroDepartamento(e.target.value); setPage(1); }}
                className="w-full appearance-none border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500 pr-9"
              >
                <option value="">Todos</option>
                {DEPARTAMENTOS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
              <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
              </svg>
            </div>
          </div>
          <div className="sm:w-48">
            <label className="block text-[0.68rem] font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Tipo de producto
            </label>
            <div className="relative">
              <select
                value={filtroTipoProducto}
                onChange={(e) => { setFiltroTipoProducto(e.target.value); setPage(1); }}
                className="w-full appearance-none border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500 pr-9"
              >
                <option value="">Todos</option>
                {(Object.keys(TIPO_PRODUCTO_LABEL) as ProductorTipoProducto[]).map((k) => (
                  <option key={k} value={k}>{TIPO_PRODUCTO_LABEL[k]}</option>
                ))}
              </select>
              <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
              </svg>
            </div>
          </div>
          {(dniActivo || nombreActivo || tipoProductorFiltro || filtroDepartamento || filtroTipoProducto) && (
            <button
              onClick={handleLimpiarFiltros}
              className="text-xs text-gray-500 underline hover:text-gray-700 self-end pb-2.5"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      </div>

      {loading && (
        <div className="absolute inset-0 z-40 flex items-center justify-center" style={{ backgroundColor: 'rgba(249,250,251,0.9)', backdropFilter: 'blur(2px)' }}>
          <LoadingLogo />
        </div>
      )}

      {!loading && productores.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <svg className="w-14 h-14 mb-3 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0zM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632z"/>
          </svg>
          <p className="text-sm font-medium">Sin productores registrados</p>
          <p className="text-xs mt-1">
            {campanaActiva ? `No hay productores en "${campanaActiva.nombre}".` : 'Registra tu primer productor agrícola.'}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-4">
            {productores.map((p) => {
              const status = syncStatus(p);
              const badge  = SYNC_BADGE[status];
              return (
                <div
                  key={p.id}
                  className={`bg-white border rounded-2xl shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow ${selectedMap.has(p.id) ? 'border-green-400 ring-2 ring-green-200' : 'border-gray-200'}`}
                >
                  <div className="px-4 pt-4 pb-3 flex items-start justify-between">
                    {p.fotoUrl ? (
                      <img
                        src={p.fotoUrl}
                        alt="foto"
                        className="w-11 h-11 rounded-full object-cover border border-gray-200 shrink-0"
                      />
                    ) : (
                      <div
                        className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-black text-white shrink-0"
                        style={{ backgroundColor: '#1A2B23' }}
                      >
                        {(p.apellido ?? p.nombre)[0]?.toUpperCase()}
                        {p.nombre[0]?.toUpperCase()}
                      </div>
                    )}
                    <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => toggleSelect(p)}
                      title={selectedMap.has(p.id) ? 'Deseleccionar' : 'Seleccionar para exportar'}
                      className={`w-5 h-5 rounded flex items-center justify-center border-2 transition-colors shrink-0 ${selectedMap.has(p.id) ? 'bg-green-500 border-green-500' : 'bg-white border-gray-300 hover:border-green-400'}`}
                    >
                      {selectedMap.has(p.id) && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                        </svg>
                      )}
                    </button>
                    <span className={`text-[0.6rem] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${badge.cls}`}>
                      {badge.label}
                    </span>
                    </div>
                  </div>

                  <div className="px-4 pb-3 flex-1 space-y-0.5">
                    <p className="text-[0.68rem] font-bold text-gray-400 uppercase tracking-wider">
                      {prCode(p.id)}
                    </p>
                    <p className="font-black text-gray-800 text-sm uppercase leading-tight">
                      {nombreCompleto(p)}
                    </p>
                    {p.nroDocumento && (
                      <p className="text-xs text-gray-500 font-mono">{p.nroDocumento}</p>
                    )}
                    {p.telefono && (
                      <p className="text-xs text-gray-500">{p.telefono}</p>
                    )}
                    {p.email && (
                      <p className="text-xs text-gray-400 truncate">{p.email}</p>
                    )}
                    {(p.departamento || p.provincia || p.distrito || p.codigoUbigeo) && (
                      <p className="text-xs text-gray-400 flex items-center gap-1 truncate">
                        <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0z"/></svg>
                        <span className="truncate">{[p.departamento, p.provincia, p.distrito].filter(Boolean).join(' › ')}</span>
                        {p.codigoUbigeo && <span className="font-mono font-bold text-gray-600 shrink-0">[{p.codigoUbigeo}]</span>}
                      </p>
                    )}
                    <div className="flex items-center flex-wrap gap-1.5 pt-1">
                      <span className={`text-[0.6rem] font-bold px-1.5 py-0.5 rounded-md ${p.esApto ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                        {p.esApto ? 'APTO' : 'NO APTO'}
                      </span>
                      {p.tipoProducto && (
                        <span className="text-[0.6rem] font-semibold px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-700">
                          {TIPO_PRODUCTO_LABEL[p.tipoProducto]}
                        </span>
                      )}
                    </div>
                    {p.campanasActivas && p.campanasActivas.length > 0 ? (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {p.campanasActivas.slice(0, 3).map((c) => (
                          <span key={c.id} className="text-[0.58rem] font-semibold px-1.5 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-100 truncate max-w-[100px]">
                            {c.nombre}
                          </span>
                        ))}
                        {p.campanasActivas.length > 3 && (
                          <span className="text-[0.58rem] font-semibold px-1.5 py-0.5 rounded-md bg-gray-100 text-gray-500">
                            +{p.campanasActivas.length - 3}
                          </span>
                        )}
                      </div>
                    ) : (
                      <p className="text-[0.68rem] font-semibold text-gray-400 uppercase tracking-wider pt-0.5">
                        {p.campana?.nombre ?? (p.campanaId ? `Campaña #${p.campanaId}` : 'Sin campaña asociada')}
                      </p>
                    )}
                  </div>

                  <div className="border-t border-gray-100" />

                  <div className="px-3 py-2 flex items-center justify-end gap-1.5">
                    <div className="flex flex-col items-center gap-0.5">
                      <button
                        onClick={() => { setSelected(p); setModal('clone'); }}
                        title="Clonar"
                        className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:opacity-80 active:scale-95"
                        style={{ backgroundColor: '#facc15' }}
                      >
                        <svg className="w-4 h-4 text-yellow-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75"/>
                        </svg>
                      </button>
                      <span className="text-[0.55rem] text-gray-400 font-medium">clonar</span>
                    </div>
                    <div className="flex flex-col items-center gap-0.5">
                      <button
                        onClick={() => { setSelected(p); setModal('edit'); }}
                        title="Editar"
                        className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:opacity-80 active:scale-95"
                        style={{ backgroundColor: '#a3e635' }}
                      >
                        <svg className="w-4 h-4 text-lime-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931z"/>
                        </svg>
                      </button>
                      <span className="text-[0.55rem] text-gray-400 font-medium">editar</span>
                    </div>
                    <div className="flex flex-col items-center gap-0.5">
                      <button
                        onClick={() => { setSelected(p); setModal('delete'); }}
                        title="Inactivar"
                        className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:opacity-80 active:scale-95"
                        style={{ backgroundColor: '#f87171' }}
                      >
                        <svg className="w-4 h-4 text-red-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"/>
                        </svg>
                      </button>
                      <span className="text-[0.55rem] text-gray-400 font-medium">eliminar</span>
                    </div>
                  </div>

                  <div className="border-t border-gray-100" />

                  <div className="px-3 py-2 flex items-center gap-1.5">
                    <div className="flex flex-col items-center gap-0.5">
                      <button
                        onClick={() => navigate(`/dashboard/productores/${p.id}/geomaps`)}
                        title="Ver parcelas en GeoMaps"
                        className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:opacity-80 active:scale-95"
                        style={{ backgroundColor: '#bef264' }}
                      >
                        <svg className="w-4 h-4 text-lime-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z"/>
                        </svg>
                      </button>
                      <span className="text-[0.55rem] text-gray-400 font-medium">parcelas</span>
                    </div>
                    <div className="flex flex-col items-center gap-0.5">
                      <button
                        onClick={() => navigate(`/dashboard/productores/${p.id}/evidencias`)}
                        title="Ver evidencias"
                        className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:opacity-80 active:scale-95"
                        style={{ backgroundColor: '#fb923c' }}
                      >
                        <svg className="w-4 h-4 text-orange-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44z"/>
                        </svg>
                      </button>
                      <span className="text-[0.55rem] text-gray-400 font-medium">evidencias</span>
                    </div>
                    {p.nroDocumento?.length === 11 ? (
                      <div className="flex flex-col items-center gap-0.5">
                        <button
                          onClick={() => navigate(`/dashboard/productores/${p.id}/empresa-info`)}
                          title="Información de empresa"
                          className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:opacity-80 active:scale-95"
                          style={{ backgroundColor: '#818cf8' }}
                        >
                          <svg className="w-4 h-4 text-indigo-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21"/>
                          </svg>
                        </button>
                        <span className="text-[0.55rem] text-gray-400 font-medium">empresa</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-0.5">
                        <button
                          onClick={() => navigate(`/dashboard/productores/${p.id}/familia`)}
                          title="Evidencias de familiares"
                          className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:opacity-80 active:scale-95"
                          style={{ backgroundColor: '#c084fc' }}
                        >
                          <svg className="w-4 h-4 text-purple-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0z"/>
                          </svg>
                        </button>
                        <span className="text-[0.55rem] text-gray-400 font-medium">familiares</span>
                      </div>
                    )}
                    <div className="flex flex-col items-center gap-0.5">
                      <button
                        onClick={() => setExportProductor(p)}
                        title="Exportar ficha PDF"
                        className="w-8 h-8 rounded-lg flex items-center justify-center transition-opacity hover:opacity-80 active:scale-95"
                        style={{ backgroundColor: '#f472b6' }}
                      >
                        <svg className="w-4 h-4 text-pink-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"/>
                        </svg>
                      </button>
                      <span className="text-[0.55rem] text-gray-400 font-medium">exportar</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {selectedMap.size > 0 && (
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 px-5 py-3 rounded-2xl shadow-2xl border border-green-200"
              style={{ backgroundColor: '#1A2B23', minWidth: '340px' }}>
              <div className="flex items-center gap-2 flex-1">
                <div className="w-6 h-6 rounded-lg bg-green-400 flex items-center justify-center shrink-0">
                  <svg className="w-3.5 h-3.5 text-green-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                  </svg>
                </div>
                <span className="text-sm font-bold text-white">
                  {selectedMap.size} {selectedMap.size === 1 ? 'productor' : 'productores'} seleccionado{selectedMap.size !== 1 ? 's' : ''}
                </span>
              </div>

              {selectedMap.size < meta.total && (
                <button
                  onClick={selectAllFiltered}
                  disabled={bulkExporting}
                  className="text-[0.7rem] font-semibold text-green-300 hover:text-green-100 transition-colors underline underline-offset-2 shrink-0 disabled:opacity-40"
                >
                  Sel. todos ({meta.total})
                </button>
              )}

              <button
                onClick={handleBulkExport}
                disabled={bulkExporting}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-sm font-bold transition-all hover:opacity-90 active:scale-95 disabled:opacity-50 shrink-0"
                style={{ backgroundColor: '#bef264', color: '#1a3a00' }}
              >
                {bulkExporting ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin inline-block" />
                    {bulkProgress ? `${bulkProgress.current}/${bulkProgress.total}` : 'Generando…'}
                  </>
                ) : (
                  <>
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"/>
                    </svg>
                    Exportar ZIP
                  </>
                )}
              </button>

              <button
                onClick={clearSelection}
                disabled={bulkExporting}
                className="w-6 h-6 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors shrink-0 disabled:opacity-40"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          )}

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <TablePagination
              total={meta.total}
              page={page}
              lastPage={meta.lastPage}
              limit={limit}
              onPageChange={goToPage}
              onLimitChange={changeLimit}
              limitOptions={[10, 20, 50]}
            />
          </div>
        </>
      )}

      {(modal === 'create' || modal === 'edit') && (
        <ProductorModal
          initial={modal === 'edit' ? selected : null}
          campanas={campanas}
          campanaActiva={campanaActiva?.id ?? null}
          onClose={() => { setModal(null); setSelected(null); }}
          onSave={handleSave}
        />
      )}

      {modal === 'detail' && selected && (
        <ProductorDetail
          productor={selected}
          onClose={() => { setModal(null); setSelected(null); }}
          onEdit={() => setModal('edit')}
          onClone={() => setModal('clone')}
        />
      )}

      {modal === 'delete' && selected && (
        <DeleteConfirm
          productor={selected}
          onClose={() => { setModal(null); setSelected(null); }}
          onConfirm={handleDelete}
        />
      )}

      {modal === 'clone' && selected && (
        <CloneModal
          productor={selected}
          campanas={campanas}
          onClose={() => { setModal(null); setSelected(null); }}
          onConfirm={handleClone}
          onViewCloned={handleViewCloned}
        />
      )}

      {exportProductor && (
        <ProductorExportModal
          productor={exportProductor}
          onClose={() => setExportProductor(null)}
        />
      )}

      {(importReport || importError) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-800 text-lg">
                {importError ? 'Error de importación' : 'Resultado de importación'}
              </h2>
              <button
                onClick={() => { setImportReport(null); setImportError(null); }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <div className="px-6 py-4 overflow-y-auto flex-1">
              {importError ? (
                <p className="text-red-600 text-sm">{importError}</p>
              ) : importReport && (
                <>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {[
                      { label: 'Productores creados',    value: importReport.productoresCreados,    color: 'green' },
                      { label: 'Productores actualizados', value: importReport.productoresActualizados, color: 'blue' },
                      { label: 'Parcelas creadas',       value: importReport.parcelasCreadas,       color: 'green' },
                      { label: 'Parcelas actualizadas',  value: importReport.parcelasActualizadas,  color: 'blue' },
                      { label: 'Filas fusionadas (fam.)', value: importReport.filasFusionadasFamiliar, color: 'gray' },
                      { label: 'Filas vacías omitidas',  value: importReport.filasVaciasOmitidas,   color: 'gray' },
                      { label: 'Filas con alertas',      value: importReport.filasObservadas,       color: 'yellow' },
                    ].map(({ label, value, color }) => (
                      <div key={label} className={`rounded-xl p-3 bg-${color}-50 border border-${color}-100`}>
                        <p className="text-xs text-gray-500 mb-0.5">{label}</p>
                        <p className={`text-2xl font-bold text-${color}-700`}>{value}</p>
                      </div>
                    ))}
                  </div>
                  {importReport.logs.length > 0 && (
                    <details className="mt-2">
                      <summary className="text-xs font-semibold text-gray-500 cursor-pointer select-none mb-1">
                        Ver logs ({importReport.logs.length})
                      </summary>
                      <div className="bg-gray-50 rounded-lg p-3 max-h-40 overflow-y-auto font-mono text-xs text-gray-600 space-y-0.5">
                        {importReport.logs.map((log, i) => (
                          <div key={i} className={
                            log.startsWith('[WARNING') ? 'text-yellow-700' :
                            log.startsWith('[CREATED') ? 'text-green-700' :
                            log.startsWith('[UPDATED') ? 'text-blue-700' :
                            log.startsWith('[MERGED')  ? 'text-purple-700' :
                            'text-gray-500'
                          }>{log}</div>
                        ))}
                      </div>
                    </details>
                  )}
                </>
              )}
            </div>

            <div className="px-6 py-4 border-t border-gray-100">
              <button
                onClick={() => { setImportReport(null); setImportError(null); }}
                className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
                style={{ backgroundColor: '#1A2B23' }}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
