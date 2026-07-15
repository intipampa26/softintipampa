import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productoresService, Productor } from '@/services/productores.service';
import { useToast } from '@/contexts/ToastContext';
import LoadingLogo from '@/components/LoadingLogo';

const CP = '#1A2B23';

const TIPOS_EMPRESA = ['Persona natural con negocio', 'EIRL', 'SAC', 'Cooperativa', 'Asociación'];
const CERTIFICACIONES = ['Ninguna', 'Orgánica', 'Fair Trade', 'Rainforest Alliance', 'Otras'];
const REGISTROS_GESTION = [
  'No cuenta con formatos',
  'Formatos manuales',
  'Formatos digitalizados',
  'Software de gestión',
];

const INP = 'w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 bg-white transition-shadow';
const TA  = `${INP} resize-none`;

/* ─── Toggle de 3 opciones: Sí / No / Sin datos ─── */
function BoolToggle({ value, onChange }: { value: boolean | null; onChange: (v: boolean | null) => void }) {
  const opts: { label: string; v: boolean | null }[] = [
    { label: 'Sí',  v: true  },
    { label: 'No',  v: false },
    { label: '—',   v: null  },
  ];
  return (
    <div className="inline-flex rounded-xl border border-gray-200 overflow-hidden text-xs font-semibold">
      {opts.map(({ label, v }) => {
        const active = value === v;
        let bg = active ? (v === true ? 'bg-green-600 text-white border-green-600' : v === false ? 'bg-red-500 text-white border-red-500' : 'bg-gray-400 text-white') : 'bg-white text-gray-500 hover:bg-gray-50';
        return (
          <button
            key={label}
            type="button"
            onClick={() => onChange(v)}
            className={`px-3.5 py-2 transition-colors border-r last:border-r-0 border-gray-200 ${bg}`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

/* ─── Indicador visual de booleano ─── */
function BoolBadge({ value }: { value: boolean | null }) {
  if (value === null || value === undefined)
    return <span className="text-xs text-gray-300 font-medium">Sin datos</span>;
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${value ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
        {value
          ? <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5"/>
          : <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
        }
      </svg>
      {value ? 'Sí' : 'No'}
    </span>
  );
}

/* ─── Fila de sección ─── */
function Row({
  label, editing, boolValue, onBoolChange, textValue, children, indent,
}: {
  label: string;
  editing: boolean;
  boolValue?: boolean | null;
  onBoolChange?: (v: boolean | null) => void;
  textValue?: string;
  children?: React.ReactNode;
  indent?: boolean;
}) {
  const isBoolean = boolValue !== undefined;
  return (
    <div className={`flex items-start justify-between gap-4 py-3 border-b border-gray-50 last:border-0 ${indent ? 'pl-5 border-l-2 border-l-green-100 ml-1' : ''}`}>
      <span className={`text-sm ${indent ? 'text-gray-500 italic' : 'text-gray-700 font-medium'} leading-snug max-w-[55%]`}>{label}</span>
      <div className="shrink-0">
        {editing && isBoolean && onBoolChange ? (
          <BoolToggle value={boolValue ?? null} onChange={onBoolChange} />
        ) : editing && children ? (
          <div className="min-w-[180px]">{children}</div>
        ) : isBoolean ? (
          <BoolBadge value={boolValue ?? null} />
        ) : (
          <span className={`text-sm font-medium text-right ${textValue ? 'text-gray-800' : 'text-gray-300 italic'}`}>
            {textValue || 'Sin datos'}
          </span>
        )}
      </div>
    </div>
  );
}

/* ─── Card de sección ─── */
function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-gray-100" style={{ backgroundColor: `${CP}07` }}>
        <span className="w-5 h-5 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: CP }}>
          {icon}
        </span>
        <p className="text-[0.68rem] font-black uppercase tracking-widest" style={{ color: CP }}>{title}</p>
      </div>
      <div className="px-5 py-1">{children}</div>
    </div>
  );
}

/* ─── Textarea condicional en edit ─── */
function ConditionalTA({ show, value, onChange, placeholder }: { show: boolean; value: string; onChange: (v: string) => void; placeholder: string }) {
  if (!show) return null;
  return (
    <div className="px-5 pb-3 -mt-1">
      <textarea rows={2} value={value} onChange={e => onChange(e.target.value)} className={`${TA} text-sm`} placeholder={placeholder} />
    </div>
  );
}

/* ─── Texto condicional en view ─── */
function ConditionalText({ show, value }: { show: boolean; value: string | null }) {
  if (!show || !value) return null;
  return (
    <div className="px-5 pb-3 -mt-1 ml-1 pl-5 border-l-2 border-l-green-100">
      <p className="text-xs text-gray-500 italic whitespace-pre-wrap leading-relaxed">{value}</p>
    </div>
  );
}

/* ══════════════════════════ TIPOS ══════════════════════════ */
type FormState = {
  empresaTipo:              string;
  empresaNombreComercial:   string;
  empresaGerenteGeneral:    string;
  empresaAcopiador:         string;
  empresaAnioInicio:        string;
  empresaCantTrabajadores:  string;
  registradoSunat:          boolean | null;
  activoSunat:              boolean | null;
  declaroImpuestosPrevios:  boolean | null;
  certificaciones:          string;
  cuentaConPoliticas:       boolean | null;
  cualesPoliticas:          string;
  registrosGestionDatos:    string;
  trabajadoresReglaSunafil: boolean | null;
  denunciasUsurpacion:      boolean | null;
  cualesUsurpacion:         string;
  denunciasCorrupcion:      boolean | null;
  cualesCorrupcion:         string;
  incidenciasVisita:        boolean | null;
  cualesIncidencias:        string;
};

function toForm(p: Productor): FormState {
  return {
    empresaTipo:              p.empresaTipo              ?? '',
    empresaNombreComercial:   p.empresaNombreComercial   ?? '',
    empresaGerenteGeneral:    p.empresaGerenteGeneral    ?? '',
    empresaAcopiador:         p.empresaAcopiador         ?? '',
    empresaAnioInicio:        p.empresaAnioInicio        ?? '',
    empresaCantTrabajadores:  p.empresaCantTrabajadores  != null ? String(p.empresaCantTrabajadores)  : '',
    registradoSunat:          p.registradoSunat          ?? null,
    activoSunat:              p.activoSunat              ?? null,
    declaroImpuestosPrevios:  p.declaroImpuestosPrevios  ?? null,
    certificaciones:          p.certificaciones          ?? '',
    cuentaConPoliticas:       p.cuentaConPoliticas       ?? null,
    cualesPoliticas:          p.cualesPoliticas          ?? '',
    registrosGestionDatos:    p.registrosGestionDatos    ?? '',
    trabajadoresReglaSunafil: p.trabajadoresReglaSunafil ?? null,
    denunciasUsurpacion:      p.denunciasUsurpacion      ?? null,
    cualesUsurpacion:         p.cualesUsurpacion         ?? '',
    denunciasCorrupcion:      p.denunciasCorrupcion      ?? null,
    cualesCorrupcion:         p.cualesCorrupcion         ?? '',
    incidenciasVisita:        p.incidenciasVisita        ?? null,
    cualesIncidencias:        p.cualesIncidencias        ?? '',
  };
}

/* ══════════════════════════ PÁGINA ══════════════════════════ */
export default function EmpresaInfoPage() {
  const { id }   = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast    = useToast();

  const [productor, setProductor] = useState<Productor | null>(null);
  const [loading,   setLoading]   = useState(true);
  const [editing,   setEditing]   = useState(false);
  const [saving,    setSaving]    = useState(false);
  const [loadError, setLoadError] = useState('');

  const [form, setForm] = useState<FormState>({
    empresaTipo: '', empresaNombreComercial: '', empresaGerenteGeneral: '',
    empresaAcopiador: '', empresaAnioInicio: '', empresaCantTrabajadores: '',
    registradoSunat: null, activoSunat: null,
    declaroImpuestosPrevios: null, certificaciones: '', cuentaConPoliticas: null,
    cualesPoliticas: '', registrosGestionDatos: '', trabajadoresReglaSunafil: null,
    denunciasUsurpacion: null, cualesUsurpacion: '', denunciasCorrupcion: null,
    cualesCorrupcion: '', incidenciasVisita: null, cualesIncidencias: '',
  });

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    productoresService.getEmpresaInfo(Number(id))
      .then(p => { setProductor(p); setForm(toForm(p)); })
      .catch(() => setLoadError('Error al cargar la información'))
      .finally(() => setLoading(false));
  }, [id]);

  function set<K extends keyof FormState>(k: K, v: FormState[K]) {
    setForm(f => ({ ...f, [k]: v }));
  }

  async function handleGuardar() {
    if (!id) return;
    setSaving(true);
    try {
      const updated = await productoresService.updateEmpresaInfo(Number(id), {
        empresaTipo:              form.empresaTipo              || null,
        empresaNombreComercial:   form.empresaNombreComercial   || null,
        empresaGerenteGeneral:    form.empresaGerenteGeneral    || null,
        empresaAcopiador:         form.empresaAcopiador         || null,
        empresaAnioInicio:        form.empresaAnioInicio        || null,
        empresaCantTrabajadores:  form.empresaCantTrabajadores  ? Number(form.empresaCantTrabajadores) : null,
        registradoSunat:          form.registradoSunat,
        activoSunat:              form.activoSunat,
        declaroImpuestosPrevios:  form.declaroImpuestosPrevios,
        certificaciones:          form.certificaciones          || null,
        cuentaConPoliticas:       form.cuentaConPoliticas,
        cualesPoliticas:          form.cualesPoliticas          || null,
        registrosGestionDatos:    form.registrosGestionDatos    || null,
        trabajadoresReglaSunafil: form.trabajadoresReglaSunafil,
        denunciasUsurpacion:      form.denunciasUsurpacion,
        cualesUsurpacion:         form.cualesUsurpacion         || null,
        denunciasCorrupcion:      form.denunciasCorrupcion,
        cualesCorrupcion:         form.cualesCorrupcion         || null,
        incidenciasVisita:        form.incidenciasVisita,
        cualesIncidencias:        form.cualesIncidencias        || null,
      });
      setProductor(updated);
      setForm(toForm(updated));
      setEditing(false);
      toast.success('Información actualizada correctamente');
    } catch {
      toast.error('Error al guardar. Intenta de nuevo.');
    } finally {
      setSaving(false);
    }
  }

  function handleCancelar() {
    if (productor) setForm(toForm(productor));
    setEditing(false);
  }

  if (loading) return <div className="min-h-full flex items-center justify-center bg-gray-50"><LoadingLogo /></div>;
  if (loadError && !productor) return (
    <div className="min-h-full flex flex-col items-center justify-center gap-3 bg-gray-50">
      <p className="text-sm text-red-500">{loadError}</p>
      <button onClick={() => navigate(-1)} className="text-xs text-gray-400 underline">← Volver</button>
    </div>
  );

  const nombre = productor ? `${productor.nombre} ${productor.apellido ?? ''}`.trim() : '';
  const e = editing;
  const p = productor;

  return (
    <div className="min-h-full bg-gray-50 flex flex-col">

      {/* ── Header oscuro ── */}
      <div style={{ backgroundColor: CP }} className="relative">
        <div className="px-4 md:px-8 pt-4 pb-5">
          <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-[0.7rem] font-semibold text-white/50 hover:text-white/90 transition-colors mb-4">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"/></svg>
            Volver
          </button>

          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}>
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21"/></svg>
              </div>
              <div className="min-w-0">
                <p className="text-white font-black text-base leading-tight truncate">{p?.empresaNombreComercial || nombre}</p>
                <p className="text-white/40 text-xs mt-0.5">
                  Información de empresa
                  {p?.nroDocumento && <span className="ml-1.5 font-mono">· RUC {p.nroDocumento}</span>}
                </p>
              </div>
            </div>

            {!editing ? (
              <button onClick={() => setEditing(true)} className="shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border border-white/20 text-white hover:bg-white/10 transition-colors">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z"/></svg>
                Editar
              </button>
            ) : (
              <span className="shrink-0 text-xs text-amber-300 font-semibold bg-amber-400/20 px-3 py-1.5 rounded-lg">Editando</span>
            )}
          </div>
        </div>
      </div>

      {/* ── Cuerpo ── */}
      <div className="flex-1 px-4 md:px-8 py-5 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 items-start">

          {/* Columna izquierda */}
          <div className="space-y-3">

            {/* 1 · Identificación */}
            <Section title="Identificación" icon={
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z"/></svg>
            }>
              <Row label="Tipo de empresa" editing={e} textValue={p?.empresaTipo ?? ''}>
                {e && (
                  <select value={form.empresaTipo} onChange={ev => set('empresaTipo', ev.target.value)} className={INP}>
                    <option value="">Sin especificar</option>
                    {TIPOS_EMPRESA.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                )}
              </Row>
              <Row label="Nombre comercial" editing={e} textValue={p?.empresaNombreComercial ?? ''}>
                {e && <input value={form.empresaNombreComercial} onChange={ev => set('empresaNombreComercial', ev.target.value)} className={INP} placeholder="Nombre comercial…" />}
              </Row>
              <Row label="Gerente General" editing={e} textValue={p?.empresaGerenteGeneral ?? ''}>
                {e && <input value={form.empresaGerenteGeneral} onChange={ev => set('empresaGerenteGeneral', ev.target.value)} className={INP} placeholder="Nombre del gerente…" />}
              </Row>
              <Row label="Acopiador responsable" editing={e} textValue={p?.empresaAcopiador ?? ''}>
                {e && <input value={form.empresaAcopiador} onChange={ev => set('empresaAcopiador', ev.target.value)} className={INP} placeholder="Nombre del acopiador…" />}
              </Row>
              <Row label="Año de inicio" editing={e} textValue={p?.empresaAnioInicio ? new Date(p.empresaAnioInicio + 'T00:00:00').toLocaleDateString('es-PE') : ''}>
                {e && <input type="date" value={form.empresaAnioInicio} onChange={ev => set('empresaAnioInicio', ev.target.value)} className={INP} />}
              </Row>
              <Row label="Cantidad de trabajadores" editing={e} textValue={p?.empresaCantTrabajadores != null ? String(p.empresaCantTrabajadores) : ''}>
                {e && <input type="number" min={0} value={form.empresaCantTrabajadores} onChange={ev => set('empresaCantTrabajadores', ev.target.value)} className={INP} placeholder="0" />}
              </Row>
            </Section>

            {/* 2 · Situación SUNAT */}
            <Section title="Situación SUNAT" icon={
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75"/></svg>
            }>
              <Row label="Registrado en SUNAT"         editing={e} boolValue={e ? form.registradoSunat        : p?.registradoSunat        ?? null} onBoolChange={v => set('registradoSunat', v)} />
              <Row label="Activo en SUNAT"              editing={e} boolValue={e ? form.activoSunat            : p?.activoSunat             ?? null} onBoolChange={v => set('activoSunat', v)} />
              <Row label="Declaró impuestos año previo" editing={e} boolValue={e ? form.declaroImpuestosPrevios: p?.declaroImpuestosPrevios ?? null} onBoolChange={v => set('declaroImpuestosPrevios', v)} />
            </Section>

          </div>

          {/* Columna derecha */}
          <div className="space-y-3">

            {/* 3 · Gestión interna */}
            <Section title="Gestión interna" icon={
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"/></svg>
            }>
              <Row label="Posee certificaciones" editing={e} textValue={e ? undefined : (p?.certificaciones || '')}>
                {e && (
                  <select value={form.certificaciones} onChange={ev => set('certificaciones', ev.target.value)} className={INP}>
                    <option value="">Sin especificar</option>
                    {CERTIFICACIONES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                )}
              </Row>
              <Row label="Cuenta con políticas internas" editing={e} boolValue={e ? form.cuentaConPoliticas : p?.cuentaConPoliticas ?? null} onBoolChange={v => set('cuentaConPoliticas', v)} />
              <ConditionalTA   show={e  && form.cuentaConPoliticas === true} value={form.cualesPoliticas} onChange={v => set('cualesPoliticas', v)} placeholder="Describir las políticas internas…" />
              <ConditionalText show={!e && !!(p?.cuentaConPoliticas)}        value={p?.cualesPoliticas ?? null} />
              <Row label="Registros y gestión de datos" editing={e} textValue={e ? undefined : (p?.registrosGestionDatos || '')}>
                {e && (
                  <select value={form.registrosGestionDatos} onChange={ev => set('registrosGestionDatos', ev.target.value)} className={INP}>
                    <option value="">Sin especificar</option>
                    {REGISTROS_GESTION.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                )}
              </Row>
            </Section>

            {/* 4 · Cumplimiento y riesgos */}
            <Section title="Cumplimiento y riesgos" icon={
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/></svg>
            }>
              <Row label="Trabajadores en regla con SUNAFIL"   editing={e} boolValue={e ? form.trabajadoresReglaSunafil : p?.trabajadoresReglaSunafil ?? null} onBoolChange={v => set('trabajadoresReglaSunafil', v)} />
              <Row label="Denuncias de usurpación de suelo"    editing={e} boolValue={e ? form.denunciasUsurpacion      : p?.denunciasUsurpacion      ?? null} onBoolChange={v => set('denunciasUsurpacion', v)} />
              <ConditionalTA   show={e  && form.denunciasUsurpacion === true} value={form.cualesUsurpacion}  onChange={v => set('cualesUsurpacion', v)}  placeholder="Detallar denuncias de usurpación…" />
              <ConditionalText show={!e && !!(p?.denunciasUsurpacion)}        value={p?.cualesUsurpacion ?? null} />
              <Row label="Denuncias de corrupción"             editing={e} boolValue={e ? form.denunciasCorrupcion      : p?.denunciasCorrupcion      ?? null} onBoolChange={v => set('denunciasCorrupcion', v)} />
              <ConditionalTA   show={e  && form.denunciasCorrupcion === true} value={form.cualesCorrupcion}  onChange={v => set('cualesCorrupcion', v)}  placeholder="Detallar denuncias de corrupción…" />
              <ConditionalText show={!e && !!(p?.denunciasCorrupcion)}        value={p?.cualesCorrupcion ?? null} />
              <Row label="Incidencias identificadas en visita" editing={e} boolValue={e ? form.incidenciasVisita        : p?.incidenciasVisita        ?? null} onBoolChange={v => set('incidenciasVisita', v)} />
              <ConditionalTA   show={e  && form.incidenciasVisita === true}   value={form.cualesIncidencias} onChange={v => set('cualesIncidencias', v)} placeholder="Detallar incidencias encontradas…" />
              <ConditionalText show={!e && !!(p?.incidenciasVisita)}          value={p?.cualesIncidencias ?? null} />
            </Section>

          </div>
        </div>

        {/* ── Botones ── */}
        {editing && (
          <div className="flex gap-3 pt-4 pb-6 max-w-sm">
            <button onClick={handleCancelar} className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
              Cancelar
            </button>
            <button onClick={handleGuardar} disabled={saving} className="flex-1 py-3 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 disabled:opacity-60" style={{ backgroundColor: CP }}>
              {saving
                ? <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Guardando…</>
                : <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>Guardar cambios</>
              }
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
