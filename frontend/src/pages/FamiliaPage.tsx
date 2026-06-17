import { useState, useEffect, useCallback, FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productoresService, Productor } from '@/services/productores.service';
import {
  familiaresService,
  FamiliarProductor,
  CreateFamiliarDto,
  Parentesco,
  PARENTESCO_LABEL,
  TIPO_DOCUMENTO_LABEL,
  SEXO_LABEL,
  TipoDocumento,
  Sexo,
} from '@/services/familiares.service';
import LoadingLogo from '@/components/LoadingLogo';

interface Hijo {
  nombre: string;
  edad: string;
  escolarizado: boolean | null;
  nivelEstudios: string;
}

interface FamiliaEditForm {
  familiarNombreProductor: string;
  familiarEdadProductor: string;
  familiarEstadoCivil: string;
  familiarGradoInstruccion: string;
  conyugeNombre: string;
  conyugeEdad: string;
  conyugeOcupacion: string;
  conyugeGradoInstruccion: string;
  hijos: Hijo[];
  tieneEnfermedadEspecial: boolean | null;
  enfermedadesPreexistentes: string;
  seguroMedico: string;
  tieneAgua: boolean | null;
  tieneDesague: boolean | null;
  tieneLuz: boolean | null;
  tieneInternet: boolean | null;
  tieneBanio: boolean | null;
}

const EMPTY_HIJO: Hijo = { nombre: '', edad: '', escolarizado: null, nivelEstudios: '' };

function parseHijos(raw: string | null): Hijo[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch { return []; }
}

function codigoProductor(p: Productor) {
  return `PR${String(p.id).padStart(3, '0')}`;
}
function nombreCompleto(p: Productor) {
  return p.apellido ? `${p.nombre} ${p.apellido}` : p.nombre;
}
function calcEdad(fechaNacimiento: string | null): string {
  if (!fechaNacimiento) return '—';
  const hoy = new Date();
  const nac = new Date(fechaNacimiento);
  let age = hoy.getFullYear() - nac.getFullYear();
  if (
    hoy.getMonth() - nac.getMonth() < 0 ||
    (hoy.getMonth() - nac.getMonth() === 0 && hoy.getDate() < nac.getDate())
  ) age--;
  return `${age} años`;
}

function productorToEditForm(p: Productor | null): FamiliaEditForm {
  return {
    
    familiarNombreProductor: p?.familiarNombreProductor ?? (p ? nombreCompleto(p) : ''),
    familiarEdadProductor:   p?.familiarEdadProductor != null ? String(p.familiarEdadProductor) : '',
    familiarEstadoCivil:     p?.familiarEstadoCivil ?? '',
    familiarGradoInstruccion: p?.familiarGradoInstruccion ?? '',
    conyugeNombre:           p?.conyugeNombre ?? '',
    conyugeEdad:             p?.conyugeEdad != null ? String(p.conyugeEdad) : '',
    conyugeOcupacion:        p?.conyugeOcupacion ?? '',
    conyugeGradoInstruccion: p?.conyugeGradoInstruccion ?? '',
    hijos:                   parseHijos(p?.hijosData ?? null),
    tieneEnfermedadEspecial: p?.tieneEnfermedadEspecial ?? null,
    enfermedadesPreexistentes: p?.enfermedadesPreexistentes ?? '',
    seguroMedico:            p?.seguroMedico ?? '',
    tieneAgua:               p?.tieneAgua ?? null,
    tieneDesague:            p?.tieneDesague ?? null,
    tieneLuz:                p?.tieneLuz ?? null,
    tieneInternet:           p?.tieneInternet ?? null,
    tieneBanio:              p?.tieneBanio ?? null,
  };
}

const ESTADO_CIVIL_LABEL: Record<string, string> = {
  soltero: 'Soltero/a', casado: 'Casado/a', conviviente: 'Conviviente',
  viudo: 'Viudo/a', divorciado: 'Divorciado/a',
};
const GRADO_INSTRUCCION_LABEL: Record<string, string> = {
  sin_estudios: 'Sin estudios', primaria: 'Primaria', secundaria: 'Secundaria',
  tecnico: 'Técnico', universitario: 'Universitario', posgrado: 'Posgrado',
};
const SEGURO_MEDICO_LABEL: Record<string, string> = {
  sis: 'SIS', essalud: 'EsSalud', privado: 'Privado', ninguno: 'Ninguno',
};
const NIVEL_ESTUDIOS_LABEL: Record<string, string> = {
  inicial: 'Inicial', primaria: 'Primaria', secundaria: 'Secundaria',
  superior: 'Superior', egresado: 'Egresado',
};

function label<T extends string>(map: Record<string, string>, v: T | null | undefined): string {
  if (!v) return '—';
  return map[v] ?? v;
}

const PARENTESCO_COLORS: Partial<Record<Parentesco, string>> = {
  conyugue: 'bg-purple-100 text-purple-700',
  hijo: 'bg-blue-100 text-blue-700', hija: 'bg-pink-100 text-pink-700',
  padre: 'bg-orange-100 text-orange-700', madre: 'bg-rose-100 text-rose-700',
  hermano: 'bg-cyan-100 text-cyan-700', hermana: 'bg-teal-100 text-teal-700',
};

const lbl = 'text-[0.65rem] font-bold text-gray-400 uppercase tracking-widest mb-0.5 block';
const val = 'text-sm font-semibold text-gray-800';
const valEmpty = 'text-sm text-gray-300 italic';

function Field({ label: l, value }: { label: string; value: string | null | undefined }) {
  return (
    <div>
      <span className={lbl}>{l}</span>
      <span className={value ? val : valEmpty}>{value || '—'}</span>
    </div>
  );
}

function SectionCard({ icon, title, children, accent = false, action }: {
  icon: React.ReactNode; title: string; children: React.ReactNode; accent?: boolean; action?: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className={`flex items-center gap-3 px-5 py-3.5 border-b border-gray-100 ${accent ? 'bg-[#283F34]/5' : ''}`}>
        <div className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: '#283F34' }}>
          {icon}
        </div>
        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest flex-1">{title}</span>
        {action}
      </div>
      <div className="px-5 py-4">{children}</div>
    </div>
  );
}

function Dot({ cls }: { cls: string }) {
  return <span className={`w-1.5 h-1.5 rounded-full ${cls}`} />;
}

function TriBadge({ value }: { value: boolean | null }) {
  if (value === true)  return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700"><Dot cls="bg-green-500" />Sí</span>;
  if (value === false) return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-600"><Dot cls="bg-red-400" />No</span>;
  return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-gray-400"><Dot cls="bg-gray-300" />S/D</span>;
}

function TriToggle({ value, onChange }: { value: boolean | null; onChange: (v: boolean | null) => void }) {
  const btnBase = 'flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors';
  return (
    <div className="flex gap-1 bg-gray-50 rounded-xl p-1">
      <button type="button" onClick={() => onChange(true)}
        className={`${btnBase} ${value === true ? 'bg-green-500 text-white' : 'text-gray-500 hover:bg-gray-100'}`}>Sí</button>
      <button type="button" onClick={() => onChange(false)}
        className={`${btnBase} ${value === false ? 'bg-red-500 text-white' : 'text-gray-500 hover:bg-gray-100'}`}>No</button>
      <button type="button" onClick={() => onChange(null)}
        className={`${btnBase} ${value === null ? 'bg-gray-400 text-white' : 'text-gray-500 hover:bg-gray-100'}`}>S/D</button>
    </div>
  );
}

const IconUsers = () => (
  <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);
const IconPerson = () => (
  <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);
const IconHeart = () => (
  <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);
const IconChild = () => (
  <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);
const IconShield = () => (
  <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);
const IconHome = () => (
  <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);
const IconBack = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
);

const SERVICIOS = [
  {
    key: 'tieneAgua' as const, label: 'Agua',
    icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 2C6.48 2 2 9 2 13a10 10 0 0020 0c0-4-4.48-11-10-11z" /></svg>,
  },
  {
    key: 'tieneDesague' as const, label: 'Desagüe',
    icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>,
  },
  {
    key: 'tieneLuz' as const, label: 'Luz eléctrica',
    icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>,
  },
  {
    key: 'tieneInternet' as const, label: 'Internet',
    icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" /></svg>,
  },
  {
    key: 'tieneBanio' as const, label: 'Baño',
    icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 10V6a2 2 0 012-2h1m0 0V3m0 1h10m0 0V3m0 1a2 2 0 012 2v4M3 10v8a2 2 0 002 2h14a2 2 0 002-2v-8" /></svg>,
  },
] as const;

const EMPTY_FAM_FORM: CreateFamiliarDto = {
  nombres: '', apellidos: '', parentesco: 'otro',
};

function FamiliarModal({
  productorId,
  initial,
  onClose,
  onSaved,
}: {
  productorId: number;
  initial: FamiliarProductor | null;
  onClose: () => void;
  onSaved: (f: FamiliarProductor) => void;
}) {
  const [form, setForm] = useState<CreateFamiliarDto>(
    initial
      ? {
          nombres:        initial.nombres,
          apellidos:      initial.apellidos,
          parentesco:     initial.parentesco,
          sexo:           initial.sexo ?? undefined,
          fechaNacimiento: initial.fechaNacimiento ?? undefined,
          tipoDocumento:  initial.tipoDocumento ?? undefined,
          nroDocumento:   initial.nroDocumento ?? undefined,
          telefono:       initial.telefono ?? undefined,
          correo:         initial.correo ?? undefined,
          direccion:      initial.direccion ?? undefined,
          observaciones:  initial.observaciones ?? undefined,
          activo:         initial.activo,
        }
      : EMPTY_FAM_FORM,
  );
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState('');

  const set = <K extends keyof CreateFamiliarDto>(k: K, v: CreateFamiliarDto[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.nombres.trim() || !form.apellidos.trim()) {
      setError('Nombres y apellidos son requeridos');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const dto: CreateFamiliarDto = {
        ...form,
        nombres:        form.nombres.trim(),
        apellidos:      form.apellidos.trim(),
        nroDocumento:   form.nroDocumento?.trim() || undefined,
        telefono:       form.telefono?.trim()     || undefined,
        correo:         form.correo?.trim()       || undefined,
        direccion:      form.direccion?.trim()    || undefined,
        observaciones:  form.observaciones?.trim()|| undefined,
        fechaNacimiento:form.fechaNacimiento      || undefined,
      };
      let saved: FamiliarProductor;
      if (initial) {
        saved = await familiaresService.update(productorId, initial.id, dto);
      } else {
        saved = await familiaresService.create(productorId, dto);
      }
      onSaved(saved);
      onClose();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(typeof msg === 'string' ? msg : 'Error al guardar');
    } finally {
      setSaving(false);
    }
  }

  const inp = 'w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500';
  const llbl = 'block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      onClick={(e) => !saving && e.target === e.currentTarget && onClose()}
    >
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden max-h-[92vh] flex flex-col">

        {saving && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-2 rounded-2xl"
            style={{ backgroundColor: 'rgba(255,255,255,0.92)' }}>
            <LoadingLogo compact />
            <p className="text-sm font-semibold text-gray-600">Guardando familiar…</p>
          </div>
        )}

        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100 shrink-0">
          <div>
            <h2 className="font-bold text-gray-800 text-base">
              {initial ? 'Editar familiar' : 'Agregar familiar'}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">Datos del integrante del núcleo familiar</p>
          </div>
          <button onClick={onClose} disabled={saving} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4 overflow-y-auto">
          {error && (
            <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={llbl}>Nombres *</label>
              <input value={form.nombres} onChange={(e) => set('nombres', e.target.value)}
                className={inp} placeholder="Nombres…" maxLength={200} />
            </div>
            <div>
              <label className={llbl}>Apellidos *</label>
              <input value={form.apellidos} onChange={(e) => set('apellidos', e.target.value)}
                className={inp} placeholder="Apellidos…" maxLength={200} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={llbl}>Parentesco *</label>
              <div className="relative">
                <select value={form.parentesco} onChange={(e) => set('parentesco', e.target.value as Parentesco)}
                  className={`${inp} appearance-none pr-8`}>
                  {(Object.keys(PARENTESCO_LABEL) as Parentesco[]).map((k) => (
                    <option key={k} value={k}>{PARENTESCO_LABEL[k]}</option>
                  ))}
                </select>
                <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
                </svg>
              </div>
            </div>
            <div>
              <label className={llbl}>Sexo</label>
              <div className="relative">
                <select value={form.sexo ?? ''} onChange={(e) => set('sexo', (e.target.value as Sexo) || undefined)}
                  className={`${inp} appearance-none pr-8`}>
                  <option value="">Sin especificar</option>
                  {(Object.keys(SEXO_LABEL) as Sexo[]).map((k) => (
                    <option key={k} value={k}>{SEXO_LABEL[k]}</option>
                  ))}
                </select>
                <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
                </svg>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className={llbl}>Fecha de nacimiento</label>
              <input type="date" value={form.fechaNacimiento ?? ''}
                onChange={(e) => set('fechaNacimiento', e.target.value || undefined)}
                className={inp} />
            </div>
            <div>
              <label className={llbl}>Tipo documento</label>
              <div className="relative">
                <select value={form.tipoDocumento ?? ''} onChange={(e) => set('tipoDocumento', (e.target.value as TipoDocumento) || undefined)}
                  className={`${inp} appearance-none pr-8`}>
                  <option value="">—</option>
                  {(Object.keys(TIPO_DOCUMENTO_LABEL) as TipoDocumento[]).map((k) => (
                    <option key={k} value={k}>{TIPO_DOCUMENTO_LABEL[k]}</option>
                  ))}
                </select>
                <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
                </svg>
              </div>
            </div>
            <div>
              <label className={llbl}>Nro. documento</label>
              <input value={form.nroDocumento ?? ''} onChange={(e) => set('nroDocumento', e.target.value || undefined)}
                className={inp} placeholder="Número…" maxLength={50} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={llbl}>Teléfono</label>
              <input value={form.telefono ?? ''} onChange={(e) => set('telefono', e.target.value || undefined)}
                className={inp} placeholder="+51 …" maxLength={20} />
            </div>
            <div>
              <label className={llbl}>Correo electrónico</label>
              <input type="email" value={form.correo ?? ''} onChange={(e) => set('correo', e.target.value || undefined)}
                className={inp} placeholder="correo@…" maxLength={200} />
            </div>
          </div>

          <div>
            <label className={llbl}>Dirección</label>
            <textarea value={form.direccion ?? ''} onChange={(e) => set('direccion', e.target.value || undefined)}
              rows={2} className={`${inp} resize-none`} placeholder="Dirección o referencia…" />
          </div>

          <div>
            <label className={llbl}>Observaciones</label>
            <textarea value={form.observaciones ?? ''} onChange={(e) => set('observaciones', e.target.value || undefined)}
              rows={2} className={`${inp} resize-none`} placeholder="Notas adicionales…" />
          </div>

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} disabled={saving}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
              Cancelar
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
              style={{ backgroundColor: saving ? '#9ca3af' : '#1A2B23' }}>
              {saving ? 'Guardando…' : initial ? 'Actualizar' : 'Agregar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DeleteFamiliarConfirm({
  familiar,
  productorId,
  onClose,
  onDeleted,
}: {
  familiar: FamiliarProductor;
  productorId: number;
  onClose: () => void;
  onDeleted: (id: number) => void;
}) {
  const [loading, setLoading] = useState(false);

  async function handleConfirm() {
    setLoading(true);
    try {
      await familiaresService.remove(productorId, familiar.id);
      onDeleted(familiar.id);
      onClose();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/>
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-gray-800 text-base">Eliminar familiar</h3>
            <p className="text-xs text-gray-400">Esta acción no se puede deshacer</p>
          </div>
        </div>
        <p className="text-sm text-gray-500 mb-5">
          ¿Eliminar a <span className="font-semibold text-gray-700">"{familiar.nombres} {familiar.apellidos}"</span>?
        </p>
        <div className="flex gap-3">
          <button onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50">
            Cancelar
          </button>
          <button disabled={loading} onClick={handleConfirm}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white"
            style={{ backgroundColor: '#dc2626' }}>
            {loading ? 'Eliminando…' : 'Eliminar'}
          </button>
        </div>
      </div>
    </div>
  );
}

export function FamiliaPage() {
  const { productorId } = useParams<{ productorId: string }>();
  const navigate = useNavigate();
  const pid = Number(productorId);

  const [productor,   setProductor]   = useState<Productor | null>(null);
  const [familiares,  setFamiliares]  = useState<FamiliarProductor[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [editMode,    setEditMode]    = useState(false);
  const [editForm,    setEditForm]    = useState<FamiliaEditForm>(productorToEditForm(null));
  const [saving,      setSaving]      = useState(false);
  const [saveError,   setSaveError]   = useState('');
  const [saveOk,      setSaveOk]      = useState(false);

  
  const [familiarModal,    setFamiliarModal]    = useState<'create' | 'edit' | 'delete' | null>(null);
  const [selectedFamiliar, setSelectedFamiliar] = useState<FamiliarProductor | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const [p, fams] = await Promise.all([
      productoresService.getOne(pid),
      familiaresService.getAll(pid).catch(() => []),
    ]);
    if (p) {
      setProductor(p);
      setEditForm(productorToEditForm(p));
    }
    setFamiliares(fams);
    setLoading(false);
  }, [pid]);

  useEffect(() => { load(); }, [load]);

  

  function setField<K extends keyof FamiliaEditForm>(k: K, v: FamiliaEditForm[K]) {
    setEditForm((f) => ({ ...f, [k]: v }));
  }

  function handleCancelEdit() {
    setEditForm(productorToEditForm(productor));
    setEditMode(false);
    setSaveError('');
  }

  async function handleSave() {
    if (!productor) return;
    setSaving(true);
    setSaveError('');
    setSaveOk(false);
    try {
      const dto = {
        familiarNombreProductor:   editForm.familiarNombreProductor.trim()   || undefined,
        familiarEdadProductor:     editForm.familiarEdadProductor ? Number(editForm.familiarEdadProductor) : undefined,
        familiarEstadoCivil:       editForm.familiarEstadoCivil               || undefined,
        familiarGradoInstruccion:  editForm.familiarGradoInstruccion          || undefined,
        conyugeNombre:             editForm.conyugeNombre.trim()              || undefined,
        conyugeEdad:               editForm.conyugeEdad ? Number(editForm.conyugeEdad) : undefined,
        conyugeOcupacion:          editForm.conyugeOcupacion.trim()          || undefined,
        conyugeGradoInstruccion:   editForm.conyugeGradoInstruccion          || undefined,
        hijosData:                 editForm.hijos.length > 0 ? JSON.stringify(editForm.hijos) : undefined,
        tieneEnfermedadEspecial:   editForm.tieneEnfermedadEspecial,
        enfermedadesPreexistentes: editForm.tieneEnfermedadEspecial ? (editForm.enfermedadesPreexistentes.trim() || undefined) : undefined,
        seguroMedico:              editForm.seguroMedico                      || undefined,
        tieneAgua:                 editForm.tieneAgua,
        tieneDesague:              editForm.tieneDesague,
        tieneLuz:                  editForm.tieneLuz,
        tieneInternet:             editForm.tieneInternet,
        tieneBanio:                editForm.tieneBanio,
      };
      const updated = await productoresService.update(productor.id, dto);
      if (updated) {
        setProductor(updated);
        setEditForm(productorToEditForm(updated));
      }
      setEditMode(false);
      setSaveOk(true);
      setTimeout(() => setSaveOk(false), 3000);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setSaveError(typeof msg === 'string' ? msg : 'Error al guardar. Intenta de nuevo.');
    } finally {
      setSaving(false);
    }
  }

  

  function addHijo() {
    setField('hijos', [...editForm.hijos, { ...EMPTY_HIJO }]);
  }

  function updateHijo(i: number, field: keyof Hijo, value: string | boolean | null) {
    const updated = editForm.hijos.map((h, idx) => idx === i ? { ...h, [field]: value } : h);
    setField('hijos', updated);
  }

  function removeHijo(i: number) {
    setField('hijos', editForm.hijos.filter((_, idx) => idx !== i));
  }

  

  function onFamiliarSaved(f: FamiliarProductor) {
    setFamiliares((prev) => {
      const exists = prev.find((x) => x.id === f.id);
      return exists ? prev.map((x) => x.id === f.id ? f : x) : [f, ...prev];
    });
  }

  function onFamiliarDeleted(id: number) {
    setFamiliares((prev) => prev.filter((f) => f.id !== id));
  }

  

  if (loading) {
    return <div className="flex items-center justify-center min-h-full"><LoadingLogo /></div>;
  }

  const activos = familiares.filter((f) => f.activo).length;

  const inp = 'w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500';
  const llbl = 'block text-[0.65rem] font-bold text-gray-400 uppercase tracking-widest mb-1';

  const selectOpts = (map: Record<string, string>, placeholder = 'Sin especificar') => [
    <option key="" value="">{placeholder}</option>,
    ...Object.entries(map).map(([k, v]) => <option key={k} value={k}>{v}</option>),
  ];

  return (
    <div className="min-h-full bg-[#F5F5F7] p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-5">

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            aria-label="Volver"
            className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all shrink-0 cursor-pointer"
          >
            <IconBack />
          </button>
          <div className="flex-1 min-w-0">
            <h1
              className="font-headline text-xl md:text-2xl font-black uppercase tracking-wide text-gray-900 truncate"
              style={{ letterSpacing: '0.04em' }}
            >
              {productor ? nombreCompleto(productor) : 'Cargando…'}
            </h1>
            <p className="text-[0.65rem] font-bold text-[#283F34] uppercase tracking-widest mt-0.5">
              {productor ? codigoProductor(productor) : '—'} · Ficha familiar
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            {familiares.length > 0 && (
              <div className="flex items-center gap-1.5 bg-white border border-gray-100 shadow-sm rounded-xl px-3 py-1.5">
                <span className="w-2 h-2 rounded-full bg-[#283F34]" />
                <span className="text-xs font-bold text-gray-600">{activos} activo{activos !== 1 ? 's' : ''}</span>
              </div>
            )}
            {!editMode ? (
              <button
                onClick={() => { setEditMode(true); setSaveOk(false); }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white transition-all hover:opacity-90"
                style={{ backgroundColor: '#1A2B23' }}
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931z"/>
                </svg>
                Editar ficha
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button onClick={handleCancelEdit} disabled={saving}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
                  Cancelar
                </button>
                <button onClick={handleSave} disabled={saving}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white transition-all"
                  style={{ backgroundColor: saving ? '#9ca3af' : '#1A2B23' }}>
                  {saving ? 'Guardando…' : 'Guardar cambios'}
                </button>
              </div>
            )}
          </div>
        </div>

        {saveOk && (
          <div className="flex items-center gap-2 text-xs text-green-700 bg-green-50 border border-green-200 rounded-xl px-4 py-2.5">
            <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
            </svg>
            Ficha familiar actualizada correctamente
          </div>
        )}
        {saveError && (
          <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">
            {saveError}
          </div>
        )}
        {editMode && (
          <div className="flex items-center gap-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5">
            <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
            </svg>
            Modo edición — modifica los datos y presiona "Guardar cambios"
          </div>
        )}

        {productor && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-3.5 border-b border-gray-100">
              <div className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: '#283F34' }}>
                <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                </svg>
              </div>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Datos del productor</span>
            </div>
            <div className="px-5 py-4 grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-3">
              <div className="col-span-2 sm:col-span-3">
                <span className={lbl}>Nombre completo</span>
                <span className={val}>{nombreCompleto(productor)}</span>
              </div>
              {productor.nroDocumento && (
                <div>
                  <span className={lbl}>DNI / RUC</span>
                  <span className="text-sm font-semibold text-gray-800 font-mono">{productor.nroDocumento}</span>
                </div>
              )}
              {productor.fecha && (
                <div>
                  <span className={lbl}>Fecha de registro</span>
                  <span className={val}>{productor.fecha}</span>
                </div>
              )}
              {productor.telefono && (
                <div>
                  <span className={lbl}>Teléfono</span>
                  <span className={val}>{productor.telefono}</span>
                </div>
              )}
              {productor.email && (
                <div className="col-span-2">
                  <span className={lbl}>Correo electrónico</span>
                  <span className={val}>{productor.email}</span>
                </div>
              )}
              {productor.direccion && (
                <div className="col-span-2 sm:col-span-3">
                  <span className={lbl}>Dirección</span>
                  <span className="text-sm text-gray-700 leading-relaxed">{productor.direccion}</span>
                </div>
              )}
              <div>
                <span className={lbl}>Condición</span>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold border ${
                  productor.esApto
                    ? 'bg-green-50 text-green-700 border-green-200'
                    : 'bg-red-50 text-red-600 border-red-200'
                }`}>
                  {productor.esApto ? '✓ APTO' : '✗ NO APTO'}
                </span>
              </div>
              {(productor.campanasActivas && productor.campanasActivas.length > 0) ? (
                <div className="col-span-2 sm:col-span-3">
                  <span className={lbl}>Campañas</span>
                  <div className="flex flex-wrap gap-1.5 mt-0.5">
                    {productor.campanasActivas.map((c) => (
                      <span key={c.id} className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                        {c.nombre}
                      </span>
                    ))}
                  </div>
                </div>
              ) : productor.campana ? (
                <div>
                  <span className={lbl}>Campaña</span>
                  <span className={val}>{productor.campana.nombre}</span>
                </div>
              ) : null}
            </div>
          </div>
        )}

        <SectionCard
          icon={<IconUsers />}
          title="Familiares registrados"
          accent
          action={
            <button
              onClick={() => { setSelectedFamiliar(null); setFamiliarModal('create'); }}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[0.65rem] font-bold text-white transition-all hover:opacity-90"
              style={{ backgroundColor: '#1A2B23' }}
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
              </svg>
              Agregar
            </button>
          }
        >
          {familiares.length === 0 ? (
            <div className="py-8 flex flex-col items-center gap-2 text-center">
              <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <p className="text-sm font-semibold text-gray-400">Sin familiares registrados</p>
              <p className="text-xs text-gray-300">Usa el botón "Agregar" para añadir integrantes</p>
            </div>
          ) : (
            <div className="overflow-x-auto -mx-1">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    {['Nombre', 'Parentesco', 'Documento', 'Edad', 'Estado', ''].map((h) => (
                      <th key={h} className="text-left py-2 px-2 text-[0.63rem] font-bold text-gray-400 uppercase tracking-widest first:pl-1">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {familiares.map((f) => {
                    const color = PARENTESCO_COLORS[f.parentesco] ?? 'bg-gray-100 text-gray-600';
                    return (
                      <tr key={f.id} className="group">
                        <td className="py-2.5 px-2 pl-1">
                          <span className="font-semibold text-gray-800">{f.nombres} {f.apellidos}</span>
                          {f.sexo && (
                            <span className="ml-1.5 text-[0.6rem] text-gray-400 font-medium">
                              {SEXO_LABEL[f.sexo]}
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-2">
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-[0.65rem] font-bold ${color}`}>
                            {PARENTESCO_LABEL[f.parentesco]}
                          </span>
                        </td>
                        <td className="py-2.5 px-2">
                          {f.nroDocumento ? (
                            <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded-lg text-gray-600">
                              {f.tipoDocumento ? TIPO_DOCUMENTO_LABEL[f.tipoDocumento] + ' ' : ''}
                              {f.nroDocumento}
                            </span>
                          ) : <span className="text-gray-300 text-xs">—</span>}
                        </td>
                        <td className="py-2.5 px-2 text-sm text-gray-500 whitespace-nowrap">
                          {calcEdad(f.fechaNacimiento)}
                        </td>
                        <td className="py-2.5 px-2">
                          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[0.65rem] font-bold ${f.activo ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                            <Dot cls={f.activo ? 'bg-green-500' : 'bg-gray-400'} />
                            {f.activo ? 'Activo' : 'Inactivo'}
                          </span>
                        </td>
                        <td className="py-2.5 px-2">
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => { setSelectedFamiliar(f); setFamiliarModal('edit'); }}
                              className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-lime-100 text-lime-700 transition-colors"
                              title="Editar"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931z"/>
                              </svg>
                            </button>
                            <button
                              onClick={() => { setSelectedFamiliar(f); setFamiliarModal('delete'); }}
                              className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-red-100 text-red-500 transition-colors"
                              title="Eliminar"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"/>
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </SectionCard>

        {productor?.tipoProductor === 'acopiador' && (
          <div className="flex items-center gap-2 text-xs text-blue-700 bg-blue-50 border border-blue-200 rounded-xl px-4 py-2.5">
            <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            Productor registrado como <strong className="ml-1">Acopiador</strong> — las secciones de cónyuge e hijos no aplican.
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          <SectionCard icon={<IconPerson />} title="Perfil del productor">
            {editMode ? (
              <div className="space-y-4">
                <div>
                  <label className={llbl}>Nombre completo</label>
                  <input value={editForm.familiarNombreProductor} onChange={(e) => setField('familiarNombreProductor', e.target.value)}
                    className={inp} placeholder="Nombre completo del productor…" maxLength={200} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={llbl}>Edad</label>
                    <input type="number" min={0} max={120} value={editForm.familiarEdadProductor}
                      onChange={(e) => setField('familiarEdadProductor', e.target.value)}
                      className={inp} placeholder="Años…" />
                  </div>
                  <div>
                    <label className={llbl}>Estado civil</label>
                    <div className="relative">
                      <select value={editForm.familiarEstadoCivil} onChange={(e) => setField('familiarEstadoCivil', e.target.value)}
                        className={`${inp} appearance-none pr-8`}>
                        {selectOpts(ESTADO_CIVIL_LABEL)}
                      </select>
                      <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/></svg>
                    </div>
                  </div>
                </div>
                <div>
                  <label className={llbl}>Grado de instrucción</label>
                  <div className="relative">
                    <select value={editForm.familiarGradoInstruccion} onChange={(e) => setField('familiarGradoInstruccion', e.target.value)}
                      className={`${inp} appearance-none pr-8`}>
                      {selectOpts(GRADO_INSTRUCCION_LABEL)}
                    </select>
                    <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/></svg>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                <div className="col-span-2">
                  <Field label="Nombre completo"
                    value={productor?.familiarNombreProductor || (productor ? nombreCompleto(productor) : null)} />
                </div>
                <Field label="Edad" value={productor?.familiarEdadProductor != null ? `${productor.familiarEdadProductor} años` : null} />
                <Field label="Estado civil" value={label(ESTADO_CIVIL_LABEL, productor?.familiarEstadoCivil)} />
                <div className="col-span-2">
                  <Field label="Grado de instrucción" value={label(GRADO_INSTRUCCION_LABEL, productor?.familiarGradoInstruccion)} />
                </div>
              </div>
            )}
          </SectionCard>

          {productor?.tipoProductor !== 'acopiador' && <SectionCard icon={<IconHeart />} title="Cónyuge / Pareja">
            {editMode ? (
              <div className="space-y-4">
                <div>
                  <label className={llbl}>Nombre completo</label>
                  <input value={editForm.conyugeNombre} onChange={(e) => setField('conyugeNombre', e.target.value)}
                    className={inp} placeholder="Nombre del cónyuge…" maxLength={200} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={llbl}>Edad</label>
                    <input type="number" min={0} max={120} value={editForm.conyugeEdad}
                      onChange={(e) => setField('conyugeEdad', e.target.value)}
                      className={inp} placeholder="Años…" />
                  </div>
                  <div>
                    <label className={llbl}>Ocupación</label>
                    <input value={editForm.conyugeOcupacion} onChange={(e) => setField('conyugeOcupacion', e.target.value)}
                      className={inp} placeholder="Ocupación…" maxLength={200} />
                  </div>
                </div>
                <div>
                  <label className={llbl}>Grado de instrucción</label>
                  <div className="relative">
                    <select value={editForm.conyugeGradoInstruccion} onChange={(e) => setField('conyugeGradoInstruccion', e.target.value)}
                      className={`${inp} appearance-none pr-8`}>
                      {selectOpts(GRADO_INSTRUCCION_LABEL)}
                    </select>
                    <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/></svg>
                  </div>
                </div>
              </div>
            ) : (
              !productor?.conyugeNombre ? (
                <p className={`${valEmpty} py-4 text-center`}>Sin datos de cónyuge</p>
              ) : (
                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                  <div className="col-span-2">
                    <Field label="Nombre completo" value={productor?.conyugeNombre} />
                  </div>
                  <Field label="Edad" value={productor?.conyugeEdad != null ? `${productor.conyugeEdad} años` : null} />
                  <Field label="Ocupación" value={productor?.conyugeOcupacion} />
                  <div className="col-span-2">
                    <Field label="Grado de instrucción" value={label(GRADO_INSTRUCCION_LABEL, productor?.conyugeGradoInstruccion)} />
                  </div>
                </div>
              )
            )}
          </SectionCard>}
        </div>

        {productor?.tipoProductor !== 'acopiador' && <SectionCard
          icon={<IconChild />}
          title={editMode ? 'Hijos' : `Hijos${editForm.hijos.length ? ` · ${editForm.hijos.length}` : ''}`}
          action={editMode ? (
            <button onClick={addHijo}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[0.65rem] font-bold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
              </svg>
              Agregar hijo
            </button>
          ) : undefined}
        >
          {editMode ? (
            editForm.hijos.length === 0 ? (
              <p className={`${valEmpty} py-4 text-center`}>Sin hijos — usa "Agregar hijo" para añadir</p>
            ) : (
              <div className="space-y-3">
                {editForm.hijos.map((hijo, i) => (
                  <div key={i} className="bg-[#F5F5F7] rounded-xl p-3.5 border border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Hijo {i + 1}</span>
                      <button onClick={() => removeHijo(i)}
                        className="w-6 h-6 rounded-lg flex items-center justify-center hover:bg-red-100 text-red-400 transition-colors">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="col-span-2 sm:col-span-1">
                        <label className={llbl}>Nombre</label>
                        <input value={hijo.nombre} onChange={(e) => updateHijo(i, 'nombre', e.target.value)}
                          className={inp} placeholder="Nombre del hijo…" maxLength={200} />
                      </div>
                      <div>
                        <label className={llbl}>Edad</label>
                        <input value={hijo.edad} onChange={(e) => updateHijo(i, 'edad', e.target.value)}
                          className={inp} placeholder="Años…" />
                      </div>
                      <div>
                        <label className={llbl}>Nivel de estudios</label>
                        <div className="relative">
                          <select value={hijo.nivelEstudios} onChange={(e) => updateHijo(i, 'nivelEstudios', e.target.value)}
                            className={`${inp} appearance-none pr-8`}>
                            {selectOpts(NIVEL_ESTUDIOS_LABEL)}
                          </select>
                          <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/></svg>
                        </div>
                      </div>
                      <div className="col-span-2">
                        <label className={llbl}>Escolarizado</label>
                        <div className="flex gap-2">
                          {[{ v: true, label: 'Sí' }, { v: false, label: 'No' }, { v: null, label: 'S/D' }].map(({ v, label: l }) => (
                            <button key={String(v)} type="button"
                              onClick={() => updateHijo(i, 'escolarizado', v)}
                              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                                hijo.escolarizado === v
                                  ? v === true ? 'bg-blue-500 text-white'
                                  : v === false ? 'bg-gray-400 text-white'
                                  : 'bg-gray-300 text-gray-700'
                                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                              }`}>
                              {l}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            editForm.hijos.length === 0 ? (
              <p className={`${valEmpty} py-4 text-center`}>Sin hijos registrados</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {editForm.hijos.map((hijo, i) => (
                  <div key={i} className="bg-[#F5F5F7] rounded-xl p-3.5 border border-gray-100">
                    <div className="flex items-start justify-between mb-2.5">
                      <div>
                        <p className={hijo.nombre ? val : valEmpty}>{hijo.nombre || 'Sin nombre'}</p>
                        {hijo.edad && <p className="text-xs text-gray-400 mt-0.5">{hijo.edad} años</p>}
                      </div>
                      {hijo.escolarizado !== null && (
                        <span className={`shrink-0 text-[0.6rem] font-bold px-2 py-0.5 rounded-full ${
                          hijo.escolarizado ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'
                        }`}>
                          {hijo.escolarizado ? 'Escolarizado' : 'No escolar.'}
                        </span>
                      )}
                    </div>
                    {hijo.nivelEstudios && (
                      <div>
                        <span className={lbl}>Nivel</span>
                        <span className={val}>{label(NIVEL_ESTUDIOS_LABEL, hijo.nivelEstudios)}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )
          )}
        </SectionCard>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          <SectionCard icon={<IconShield />} title="Salud">
            {editMode ? (
              <div className="space-y-4">
                <div>
                  <label className={llbl}>Seguro médico</label>
                  <div className="relative">
                    <select value={editForm.seguroMedico} onChange={(e) => setField('seguroMedico', e.target.value)}
                      className={`${inp} appearance-none pr-8`}>
                      {selectOpts(SEGURO_MEDICO_LABEL)}
                    </select>
                    <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/></svg>
                  </div>
                </div>
                <div>
                  <label className={llbl}>¿Tiene enfermedad que requiere cuidados especiales?</label>
                  <div className="flex gap-3 mt-1">
                    {([['true', 'Sí'], ['false', 'No'], ['null', 'Sin dato']] as const).map(([val, txt]) => (
                      <label key={val} className="flex items-center gap-1.5 text-sm cursor-pointer">
                        <input type="radio" name="tieneEnfermedadEspecial"
                          checked={editForm.tieneEnfermedadEspecial === (val === 'null' ? null : val === 'true')}
                          onChange={() => setField('tieneEnfermedadEspecial', val === 'null' ? null : val === 'true')}
                          className="accent-green-700" />
                        {txt}
                      </label>
                    ))}
                  </div>
                </div>
                {editForm.tieneEnfermedadEspecial === true && (
                  <div>
                    <label className={llbl}>Descripción de enfermedades</label>
                    <textarea value={editForm.enfermedadesPreexistentes}
                      onChange={(e) => setField('enfermedadesPreexistentes', e.target.value)}
                      rows={3} className={`${inp} resize-none`} placeholder="Describe la enfermedad o condición especial…" />
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <Field label="Seguro médico" value={label(SEGURO_MEDICO_LABEL, productor?.seguroMedico)} />
                <div>
                  <span className={lbl}>Enfermedad especial</span>
                  {productor?.tieneEnfermedadEspecial === true ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-700 mt-0.5">Sí</span>
                  ) : productor?.tieneEnfermedadEspecial === false ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-green-50 text-green-700 mt-0.5">No</span>
                  ) : (
                    <span className={valEmpty}>—</span>
                  )}
                </div>
                {productor?.tieneEnfermedadEspecial && (
                  <div>
                    <span className={lbl}>Detalle</span>
                    {productor?.enfermedadesPreexistentes ? (
                      <p className="text-sm text-gray-700 leading-relaxed mt-0.5">{productor.enfermedadesPreexistentes}</p>
                    ) : (
                      <span className={valEmpty}>—</span>
                    )}
                  </div>
                )}
                <div>
                  <span className={lbl}>Enfermedades preexistentes (registro anterior)</span>
                  {!productor?.tieneEnfermedadEspecial && productor?.enfermedadesPreexistentes ? (
                    <p className="text-sm text-gray-700 leading-relaxed mt-0.5">{productor.enfermedadesPreexistentes}</p>
                  ) : productor?.tieneEnfermedadEspecial ? null : (
                    <span className={valEmpty}>—</span>
                  )}
                </div>
              </div>
            )}
          </SectionCard>

          <SectionCard icon={<IconHome />} title="Servicios básicos">
            <div className="space-y-3">
              {SERVICIOS.map(({ key, label: lbTxt, icon }) => (
                <div key={key} className="flex items-center justify-between py-1 border-b border-gray-50 last:border-0">
                  <div className="flex items-center gap-2.5">
                    <span className="text-gray-400">{icon}</span>
                    <span className="text-sm font-medium text-gray-700">{lbTxt}</span>
                  </div>
                  {editMode ? (
                    <TriToggle value={editForm[key]} onChange={(v) => setField(key, v)} />
                  ) : (
                    <TriBadge value={productor?.[key] ?? null} />
                  )}
                </div>
              ))}
            </div>
          </SectionCard>
        </div>

        {productor && !editMode && (
          <p className="text-center text-[0.62rem] text-gray-300 pb-4">
            Última actualización · {new Date(productor.updatedAt).toLocaleDateString('es-PE', { day: '2-digit', month: 'long', year: 'numeric' })}
          </p>
        )}

        {editMode && (
          <div className="flex gap-3 pb-4">
            <button onClick={handleCancelEdit} disabled={saving}
              className="flex-1 py-3 rounded-2xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
              Cancelar
            </button>
            <button onClick={handleSave} disabled={saving}
              className="flex-1 py-3 rounded-2xl text-sm font-semibold text-white transition-all"
              style={{ backgroundColor: saving ? '#9ca3af' : '#1A2B23' }}>
              {saving ? 'Guardando…' : 'Guardar cambios'}
            </button>
          </div>
        )}

      </div>

      {(familiarModal === 'create' || familiarModal === 'edit') && (
        <FamiliarModal
          productorId={pid}
          initial={familiarModal === 'edit' ? selectedFamiliar : null}
          onClose={() => { setFamiliarModal(null); setSelectedFamiliar(null); }}
          onSaved={onFamiliarSaved}
        />
      )}

      {familiarModal === 'delete' && selectedFamiliar && (
        <DeleteFamiliarConfirm
          familiar={selectedFamiliar}
          productorId={pid}
          onClose={() => { setFamiliarModal(null); setSelectedFamiliar(null); }}
          onDeleted={onFamiliarDeleted}
        />
      )}
    </div>
  );
}
