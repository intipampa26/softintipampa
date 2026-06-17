import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productoresService, Productor } from '@/services/productores.service';
import LoadingLogo from '@/components/LoadingLogo';

const CP = '#1A2B23';
const CS = '#283F34';

const TIPOS_EMPRESA = ['SAC', 'SRL', 'SA', 'EIRL', 'Cooperativa', 'Asociación', 'Otro'];

const TIPO_COLOR: Record<string, string> = {
  SAC:         'bg-blue-100   text-blue-800   border-blue-200',
  SRL:         'bg-indigo-100 text-indigo-800 border-indigo-200',
  SA:          'bg-violet-100 text-violet-800 border-violet-200',
  EIRL:        'bg-amber-100  text-amber-800  border-amber-200',
  Cooperativa: 'bg-green-100  text-green-800  border-green-200',
  Asociación:  'bg-teal-100   text-teal-800   border-teal-200',
  Otro:        'bg-gray-100   text-gray-700   border-gray-200',
};

const INP = 'w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white transition-shadow';
const TA  = `${INP} resize-none`;

function SectionBlock({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center gap-2.5 px-5 py-3 border-b border-gray-100" style={{ backgroundColor: `${CP}08` }}>
        <div className="w-6 h-6 rounded-md flex items-center justify-center shrink-0" style={{ backgroundColor: CP }}>
          {icon}
        </div>
        <p className="text-xs font-black uppercase tracking-widest" style={{ color: CP }}>{title}</p>
      </div>
      <div className="px-5 py-4">{children}</div>
    </div>
  );
}

function FieldView({ label, value }: { label: string; value: string | number | null | undefined }) {
  const empty = value == null || value === '';
  return (
    <div>
      <p className="text-[0.65rem] font-bold text-gray-400 uppercase tracking-wider mb-1">{label}</p>
      <p className={`text-sm font-medium ${empty ? 'text-gray-300 italic' : 'text-gray-800'}`}>
        {empty ? 'Sin datos' : String(value)}
      </p>
    </div>
  );
}

function FieldEdit({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[0.65rem] font-bold text-gray-500 uppercase tracking-wider mb-1.5">{label}</label>
      {children}
    </div>
  );
}

function StatChip({ label, value, icon }: { label: string; value: string | number | null | undefined; icon: React.ReactNode }) {
  const empty = value == null || value === '';
  return (
    <div className="flex flex-col items-center justify-center gap-1 px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 text-center min-w-[90px]">
      <div className="text-gray-400">{icon}</div>
      <p className={`text-base font-black leading-none ${empty ? 'text-gray-300' : ''}`} style={empty ? {} : { color: CP }}>
        {empty ? '—' : String(value)}
      </p>
      <p className="text-[0.58rem] font-semibold text-gray-400 uppercase tracking-wide leading-tight">{label}</p>
    </div>
  );
}

export default function EmpresaInfoPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [productor, setProductor] = useState<Productor | null>(null);
  const [loading,   setLoading]   = useState(true);
  const [editing,   setEditing]   = useState(false);
  const [saving,    setSaving]    = useState(false);
  const [error,     setError]     = useState('');
  const [saved,     setSaved]     = useState(false);

  const [form, setForm] = useState({
    empresaTipo:            '',
    empresaNombreComercial: '',
    empresaGerenteGeneral:  '',
    empresaAcopiador:       '',
    empresaAnioInicio:      '',
    empresaCantTrabajadores:'',
    empresaInfoLegal:       '',
    empresaInfoSunat:       '',
  });

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    productoresService.getOne(Number(id))
      .then((p) => {
        if (!p) { setError('Productor no encontrado'); return; }
        setProductor(p);
        setForm({
          empresaTipo:            p.empresaTipo            ?? '',
          empresaNombreComercial: p.empresaNombreComercial ?? '',
          empresaGerenteGeneral:  p.empresaGerenteGeneral  ?? '',
          empresaAcopiador:       p.empresaAcopiador       ?? '',
          empresaAnioInicio:      p.empresaAnioInicio       != null ? String(p.empresaAnioInicio)        : '',
          empresaCantTrabajadores:p.empresaCantTrabajadores != null ? String(p.empresaCantTrabajadores) : '',
          empresaInfoLegal:       p.empresaInfoLegal       ?? '',
          empresaInfoSunat:       p.empresaInfoSunat       ?? '',
        });
      })
      .catch(() => setError('Error al cargar productor'))
      .finally(() => setLoading(false));
  }, [id]);

  const set = <K extends keyof typeof form>(k: K, v: string) =>
    setForm(f => ({ ...f, [k]: v }));

  async function handleGuardar() {
    if (!id) return;
    setSaving(true); setError('');
    try {
      await productoresService.update(Number(id), {
        empresaTipo:             form.empresaTipo             || null,
        empresaNombreComercial:  form.empresaNombreComercial  || null,
        empresaGerenteGeneral:   form.empresaGerenteGeneral   || null,
        empresaAcopiador:        form.empresaAcopiador        || null,
        empresaAnioInicio:       form.empresaAnioInicio       ? Number(form.empresaAnioInicio)        : null,
        empresaCantTrabajadores: form.empresaCantTrabajadores ? Number(form.empresaCantTrabajadores) : null,
        empresaInfoLegal:        form.empresaInfoLegal        || null,
        empresaInfoSunat:        form.empresaInfoSunat        || null,
      });
      const updated = await productoresService.getOne(Number(id));
      if (updated) setProductor(updated);
      setEditing(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError('Error al guardar. Intenta de nuevo.');
    } finally {
      setSaving(false);
    }
  }

  
  if (loading) {
    return (
      <div className="min-h-full flex items-center justify-center bg-gray-50">
        <LoadingLogo />
      </div>
    );
  }

  if (error && !productor) {
    return (
      <div className="min-h-full flex flex-col items-center justify-center gap-4 bg-gray-50">
        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
          <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/>
          </svg>
        </div>
        <p className="text-sm text-red-600 font-medium">{error}</p>
        <button onClick={() => navigate(-1)} className="text-sm text-gray-500 underline hover:text-gray-700">← Volver</button>
      </div>
    );
  }

  const nombre  = productor ? `${productor.nombre} ${productor.apellido ?? ''}`.trim() : '';
  const ruc     = productor?.nroDocumento ?? '';
  const tipoBadge = productor?.empresaTipo ? (TIPO_COLOR[productor.empresaTipo] ?? TIPO_COLOR['Otro']) : null;

  return (
    <div className="min-h-full bg-gray-50 flex flex-col">

      
      <div style={{ backgroundColor: CP }}>
        
        <div className="px-4 md:px-8 pt-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-xs font-semibold text-white/60 hover:text-white transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"/>
            </svg>
            Volver
          </button>
        </div>

        
        <div className="px-4 md:px-8 pt-4 pb-6 flex flex-col sm:flex-row sm:items-end gap-4">
          
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border-2 border-white/20"
            style={{ backgroundColor: CS }}
          >
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21"/>
            </svg>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h1 className="font-headline text-xl sm:text-2xl font-black uppercase tracking-wide text-white leading-tight">
                {productor?.empresaNombreComercial || nombre}
              </h1>
              {tipoBadge && (
                <span className={`text-[0.6rem] font-black px-2 py-0.5 rounded-full border uppercase tracking-wide ${tipoBadge}`}>
                  {productor?.empresaTipo}
                </span>
              )}
            </div>
            <p className="text-xs text-white/50 font-medium">
              {nombre}
              {ruc && <span className="ml-2 font-mono text-white/40">RUC {ruc}</span>}
            </p>
          </div>

          
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border border-white/20 text-white hover:bg-white/10 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z"/>
              </svg>
              Editar
            </button>
          )}
        </div>

        
        {!editing && (
          <div className="px-4 md:px-8 pb-0 flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
            <StatChip
              label="Año inicio"
              value={productor?.empresaAnioInicio}
              icon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"/>
                </svg>
              }
            />
            <StatChip
              label="Trabajadores"
              value={productor?.empresaCantTrabajadores}
              icon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"/>
                </svg>
              }
            />
            <StatChip
              label="Tipo"
              value={productor?.empresaTipo}
              icon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"/>
                </svg>
              }
            />
          </div>
        )}
      </div>

      
      <div className="flex-1 px-4 md:px-8 py-6 w-full">

        
        {saved && (
          <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm font-semibold mb-4">
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            Información actualizada correctamente
          </div>
        )}
        {error && (
          <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-semibold mb-4">
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"/>
            </svg>
            {error}
          </div>
        )}

        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">

          
          <div className="space-y-4">

            
            <SectionBlock
              title="Identificación de la Empresa"
              icon={
                <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z"/>
                </svg>
              }
            >
              {editing ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FieldEdit label="Tipo de empresa">
                    <select value={form.empresaTipo} onChange={e => set('empresaTipo', e.target.value)} className={INP}>
                      <option value="">Sin especificar</option>
                      {TIPOS_EMPRESA.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </FieldEdit>
                  <FieldEdit label="Razón social / Nombre comercial">
                    <input type="text" value={form.empresaNombreComercial}
                      onChange={e => set('empresaNombreComercial', e.target.value)}
                      className={INP} placeholder="Nombre comercial…" />
                  </FieldEdit>
                  <FieldEdit label="Año de inicio de funciones">
                    <input type="number" min={1900} max={2100} value={form.empresaAnioInicio}
                      onChange={e => set('empresaAnioInicio', e.target.value)}
                      className={INP} placeholder="Ej: 2015" />
                  </FieldEdit>
                  <FieldEdit label="Cantidad de trabajadores">
                    <input type="number" min={0} value={form.empresaCantTrabajadores}
                      onChange={e => set('empresaCantTrabajadores', e.target.value)}
                      className={INP} placeholder="0" />
                  </FieldEdit>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                  <FieldView label="Tipo de empresa"                  value={productor?.empresaTipo} />
                  <FieldView label="Razón social / Nombre comercial"  value={productor?.empresaNombreComercial} />
                  <FieldView label="Año de inicio de funciones"       value={productor?.empresaAnioInicio} />
                  <FieldView label="Cantidad de trabajadores"         value={productor?.empresaCantTrabajadores} />
                </div>
              )}
            </SectionBlock>

            
            <SectionBlock
              title="Equipo de Gestión"
              icon={
                <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"/>
                </svg>
              }
            >
              {editing ? (
                <div className="space-y-4">
                  <FieldEdit label="Gerente General">
                    <input type="text" value={form.empresaGerenteGeneral}
                      onChange={e => set('empresaGerenteGeneral', e.target.value)}
                      className={INP} placeholder="Nombre del gerente…" />
                  </FieldEdit>
                  <FieldEdit label="Acopiador responsable">
                    <input type="text" value={form.empresaAcopiador}
                      onChange={e => set('empresaAcopiador', e.target.value)}
                      className={INP} placeholder="Nombre del acopiador…" />
                  </FieldEdit>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <p className="text-[0.65rem] font-bold text-gray-400 uppercase tracking-wider mb-2">Gerente General</p>
                    {productor?.empresaGerenteGeneral ? (
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-white text-sm font-black" style={{ backgroundColor: CP }}>
                          {productor.empresaGerenteGeneral.charAt(0).toUpperCase()}
                        </div>
                        <p className="text-sm font-semibold text-gray-800">{productor.empresaGerenteGeneral}</p>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-300 italic">Sin datos</p>
                    )}
                  </div>
                  <div className="border-t border-gray-50 pt-4">
                    <p className="text-[0.65rem] font-bold text-gray-400 uppercase tracking-wider mb-2">Acopiador responsable</p>
                    {productor?.empresaAcopiador ? (
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-white text-sm font-black" style={{ backgroundColor: CS }}>
                          {productor.empresaAcopiador.charAt(0).toUpperCase()}
                        </div>
                        <p className="text-sm font-semibold text-gray-800">{productor.empresaAcopiador}</p>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-300 italic">Sin datos</p>
                    )}
                  </div>
                </div>
              )}
            </SectionBlock>

          </div>

          
          <div className="space-y-4">

            
            <SectionBlock
              title="Información Legal — SUNARP"
              icon={
                <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"/>
                </svg>
              }
            >
              {editing ? (
                <FieldEdit label="Partida registral, escritura pública, etc.">
                  <textarea rows={5} value={form.empresaInfoLegal}
                    onChange={e => set('empresaInfoLegal', e.target.value)}
                    className={TA} placeholder="Partida registral, RUC, escritura pública…" />
                </FieldEdit>
              ) : (
                productor?.empresaInfoLegal ? (
                  <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{productor.empresaInfoLegal}</p>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <svg className="w-9 h-9 text-gray-200 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"/>
                    </svg>
                    <p className="text-xs text-gray-300 font-medium">Sin información legal registrada</p>
                  </div>
                )
              )}
            </SectionBlock>

            
            <SectionBlock
              title="Información SUNAT — Régimen Tributario"
              icon={
                <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z"/>
                </svg>
              }
            >
              {editing ? (
                <FieldEdit label="Régimen tributario, obligaciones, estado SUNAT…">
                  <textarea rows={5} value={form.empresaInfoSunat}
                    onChange={e => set('empresaInfoSunat', e.target.value)}
                    className={TA} placeholder="Régimen tributario, obligaciones, estado…" />
                </FieldEdit>
              ) : (
                productor?.empresaInfoSunat ? (
                  <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{productor.empresaInfoSunat}</p>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <svg className="w-9 h-9 text-gray-200 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z"/>
                    </svg>
                    <p className="text-xs text-gray-300 font-medium">Sin información SUNAT registrada</p>
                  </div>
                )
              )}
            </SectionBlock>

          </div>

        </div>

        
        {editing && (
          <div className="flex gap-3 pt-4 pb-6 max-w-sm">
            <button
              type="button"
              onClick={() => { setEditing(false); setError(''); }}
              className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleGuardar}
              disabled={saving}
              className="flex-1 py-3 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-opacity hover:opacity-90 disabled:opacity-60"
              style={{ backgroundColor: CP }}
            >
              {saving ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Guardando…
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  Guardar cambios
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
