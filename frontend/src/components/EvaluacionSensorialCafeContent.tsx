import { useState, useEffect } from 'react';
import { muestrasService, type Muestra } from '@/services/muestras.service';

const VARIEDADES_CAFE = ['Caturra','Borbón Rojo','Borbon naranja','Gesha','Pacamara','Tabi','Sidra','Papayo','Blend','Pache','Costa Rica 95','Tipica','Catimor','Maragogipe','SL34','Villa Sarchí','Marsellesa','Limani'];

interface SampleState {
  numero:           string;
  nivelTueste:      number;
  fragTotal:        number;
  fragSeco:         string;
  fragEspuma:       string;
  fragCualidades:   string;
  sabor:            number;
  saborResidual:    number;
  acidez:           number;
  acidezIntensidad: 'alto' | 'bajo' | '';
  cuerpo:           number;
  cuerpoNivel:      'alto' | 'bajo' | '';
  uniformidad:      boolean[];
  balance:          number;
  tazaLimpia:       boolean[];
  dulzor:           boolean[];
  puntosCatador:    number;
  defectoTipo:      'ligero' | 'rechazo';
  defectoTazas:     number;
  notaSabor:         string;
  notaSaborResidual: string;
  notaAcidez:        string;
  notas:            string;
}

interface FormState {
  header: { nombre: string; fecha: string; mesa: string; session: string };
  sample: SampleState;
}

interface Props {
  muestra:             Muestra;
  formId:              string;
  onSaved:             () => void;
  onSaveError?:        () => void;
  onSavingChange:      (v: boolean) => void;
  onLoadingChange:     (v: boolean) => void;
  initialState?:       FormState;
  onFormStateChange?:  (state: FormState) => void;
}

const ROAST = ['#D4B07A', '#B8783A', '#8C5120', '#5E2F0A', '#2D1200'];

const LS  = (id: number) => `intipampa_cafe_cupping_${id}`;
const snp = (v: number)  => Math.round(v / 0.25) * 0.25;
const cl  = (v: number)  => Math.min(10, Math.max(6, v));

function ck(arr: boolean[]) { return arr.filter(Boolean).length * 2; }

function calcSuma(s: SampleState) {
  return s.fragTotal + s.sabor + s.saborResidual + s.acidez + s.cuerpo
    + ck(s.uniformidad) + s.balance + ck(s.tazaLimpia) + ck(s.dulzor)
    + s.puntosCatador;
}

function calcDef(s: SampleState) {
  return s.defectoTazas * (s.defectoTipo === 'ligero' ? 2 : 4);
}

function getClasif(score: number) {
  if (score >= 90) return { label: 'Extraordinario', bg: '#d1fae5', color: '#064e3b' };
  if (score >= 85) return { label: 'Excelente',       bg: '#dcfce7', color: '#14532d' };
  if (score >= 80) return { label: 'Muy Bueno',        bg: '#fef9c3', color: '#713f12' };
  return               { label: 'No especialidad',  bg: '#f3f4f6', color: '#374151' };
}

function defSample(): SampleState {
  return {
    numero: '', nivelTueste: 2,
    fragTotal: 6, fragSeco: '', fragEspuma: '', fragCualidades: '',
    sabor: 6, saborResidual: 6,
    acidez: 6, acidezIntensidad: '',
    cuerpo: 6, cuerpoNivel: '',
    uniformidad: [true, true, true, true, true],
    balance: 6,
    tazaLimpia: [true, true, true, true, true],
    dulzor: [true, true, true, true, true],
    puntosCatador: 6,
    defectoTipo: 'ligero', defectoTazas: 0,
    notaSabor: '', notaSaborResidual: '', notaAcidez: '',
    notas: '',
  };
}

function defForm(fecha: string): FormState {
  return { header: { nombre: '', fecha, mesa: '', session: '' }, sample: defSample() };
}

function ScaSlider({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="w-full space-y-[1px]">
      <div className="flex items-center gap-1 mb-0.5">
        <span className="text-[0.55rem] font-bold text-gray-700 whitespace-nowrap">Total:</span>
        <input
          type="number" min={6} max={10} step={0.25}
          value={value.toFixed(2)}
          onChange={e => onChange(snp(cl(parseFloat(e.target.value) || 6)))}
          className="w-12 text-[0.65rem] border border-gray-700 text-center font-bold py-0 leading-tight bg-white"
        />
      </div>
      <input
        type="range" min={6} max={10} step={0.25} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full cursor-pointer sca-slider"
        style={{ height: '14px', accentColor: '#1A2B23', minWidth: '85px' }}
      />
      <div className="flex justify-between" style={{ paddingLeft: '7px', paddingRight: '7px', marginTop: '1px' }}>
        {[6, 7, 8, 9, 10].map(n => (
          <div key={n} className="flex flex-col items-center">
            <div className="w-px bg-gray-500" style={{ height: '4px' }} />
            <span className="text-[0.42rem] text-gray-500 leading-none font-mono">{n}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Checks5({ values, onChange }: { values: boolean[]; onChange: (v: boolean[]) => void }) {
  const total = values.filter(Boolean).length * 2;
  return (
    <div className="w-full space-y-0.5">
      <div className="flex items-center gap-1 mb-0.5">
        <span className="text-[0.55rem] font-bold text-gray-700 whitespace-nowrap">Total:</span>
        <span className="w-8 text-[0.65rem] border border-gray-700 text-center font-bold py-0 bg-gray-50 inline-block">{total}</span>
      </div>
      <div className="flex gap-[3px] flex-wrap">
        {values.map((v, i) => (
          <button key={i} type="button"
            onClick={() => { const n = [...values]; n[i] = !n[i]; onChange(n); }}
            className="border-2 border-black flex items-center justify-center shrink-0 transition-colors"
            style={{ width: 17, height: 17, backgroundColor: v ? '#000' : '#fff' }}
          >
            {v && (
              <svg width={10} height={10} viewBox="0 0 10 10" fill="none">
                <path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

function IntensidadToggle({
  label, value, onChange,
}: { label: string; value: 'alto' | 'bajo' | ''; onChange: (v: 'alto' | 'bajo' | '') => void }) {
  return (
    <div className="flex flex-col gap-0.5 mt-1">
      <span className="text-[0.5rem] font-bold text-gray-500 uppercase tracking-wider">{label}:</span>
      <div className="flex gap-0.5">
        {(['alto', 'bajo'] as const).map(opt => (
          <button key={opt} type="button"
            onClick={() => onChange(value === opt ? '' : opt)}
            className="flex-1 text-[0.5rem] font-bold uppercase border border-gray-700 py-0.5 transition-colors"
            style={{ backgroundColor: value === opt ? '#1A2B23' : '#fff', color: value === opt ? '#fff' : '#374151' }}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

export function EvaluacionSensorialCafeContent({ muestra, formId, onSaved, onSaveError, onSavingChange, onLoadingChange, initialState, onFormStateChange }: Props) {
  const [form, setForm] = useState<FormState>(() => initialState ?? defForm(new Date().toISOString().slice(0, 10)));
  const [error, setError] = useState('');
  const [variedad, setVariedad] = useState(muestra.variedad ?? '');
  const [apiLoaded, setApiLoaded] = useState(!!initialState);

  const s = form.sample;

  function setH(k: keyof FormState['header'], v: string) {
    setForm(p => ({ ...p, header: { ...p.header, [k]: v } }));
  }

  function setS(partial: Partial<SampleState>) {
    setForm(p => ({ ...p, sample: { ...p.sample, ...partial } }));
  }

  useEffect(() => {
    if (initialState) {
      // Data injected externally — skip API call and signal ready immediately
      onLoadingChange(false);
      return;
    }
    onLoadingChange(true);
    muestrasService.getDetalle(muestra.id).then(d => {
      if (d.muestra?.variedad) setVariedad(d.muestra.variedad);
      const cj = (d.evaluacionSensorial as any)?.camposJson;
      if (cj?.cafeSca) {
        setForm(cj.cafeSca);
      } else {
        const draft = localStorage.getItem(LS(muestra.id));
        if (draft) { try { setForm(JSON.parse(draft)); } catch {} }
      }
    }).finally(() => setApiLoaded(true));
  }, [muestra.id]);

  // Fire onLoadingChange(false) AFTER React re-renders with the new form data
  useEffect(() => {
    if (apiLoaded && !initialState) onLoadingChange(false);
  }, [apiLoaded]);

  // Save to localStorage and notify parent of current state — never for injected instances
  useEffect(() => {
    if (apiLoaded && !initialState) {
      localStorage.setItem(LS(muestra.id), JSON.stringify(form));
      onFormStateChange?.(form);
    }
  }, [form, muestra.id, apiLoaded]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    onSavingChange(true);
    try {
      const finalScore = calcSuma(s) - calcDef(s);
      await muestrasService.upsertEvaluacionSensorial(muestra.id, {
        cafePuntajeTotal: finalScore,
        fechaEvaluacion: form.header.fecha || new Date().toISOString().slice(0, 10),
        cafeSca: form,
      } as any);
      await muestrasService.actualizarEstadoPorEvaluaciones(muestra.id);
      localStorage.removeItem(LS(muestra.id));
      onSaved();
    } catch {
      setError('Error al guardar. Intenta de nuevo.');
      onSaveError?.();
    } finally {
      onSavingChange(false);
    }
  }

  const suma    = calcSuma(s);
  const def     = calcDef(s);
  const final   = suma - def;
  const cl_     = getClasif(final);

  const td  = 'border border-black px-1.5 py-1.5 align-top text-[0.65rem]';
  const th  = 'border border-black px-1.5 py-1 text-center font-bold text-[0.6rem] bg-gray-100 whitespace-nowrap';
  const inp = 'border border-gray-600 text-[0.65rem] px-1 py-0.5 w-full bg-white';

  return (
    <form id={formId} onSubmit={handleSubmit}>
      {error && (
        <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2 mb-3">{error}</p>
      )}

      
      <div className="flex items-start justify-between gap-4 mb-3 no-print-break">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <div>
              <p className="font-black text-[0.75rem] leading-tight uppercase tracking-wide text-gray-900">
                Formulario de Catación
              </p>
              <p className="text-[0.6rem] text-gray-600 leading-tight">
                Asociación de Cafés Especiales de América
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 items-end">
            {([
              { k: 'nombre',  label: 'Nombre' },
              { k: 'fecha',   label: 'Fecha',   type: 'date' },
              { k: 'mesa',    label: 'Mesa' },
              { k: 'session', label: 'Sesión' },
            ] as Array<{ k: keyof FormState['header']; label: string; type?: string }>).map(({ k, label, type }) => (
              <label key={k} className="flex items-center gap-1">
                <span className="text-[0.6rem] font-bold text-gray-700 whitespace-nowrap">{label}:</span>
                <input
                  type={type ?? 'text'}
                  value={form.header[k]}
                  onChange={e => setH(k, e.target.value)}
                  className="border-b border-gray-600 text-[0.65rem] bg-transparent focus:outline-none px-0.5 min-w-[80px]"
                />
              </label>
            ))}
            <label className="flex items-center gap-1">
              <span className="text-[0.6rem] font-bold text-gray-700 whitespace-nowrap">Variedad:</span>
              <select
                value={variedad}
                onChange={e => setVariedad(e.target.value)}
                className="border-b border-gray-600 text-[0.65rem] bg-transparent focus:outline-none px-0.5 min-w-[80px]"
              >
                <option value="">—</option>
                {VARIEDADES_CAFE.map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </label>
          </div>
        </div>

        
        <table className="border-collapse shrink-0 text-[0.5rem] font-mono">
          <thead>
            <tr>
              {['6.00  Bueno', '7.00  Muy Bueno', '8.00  Excelente', '9.00  Extraordinario'].map(h => (
                <th key={h} className="border border-black px-1.5 py-0.5 font-bold text-center whitespace-nowrap bg-gray-50">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[['6.25', '7.25', '8.25', '9.25'], ['6.50', '7.50', '8.50', '9.50'], ['6.75', '7.75', '8.75', '9.75']].map((row, ri) => (
              <tr key={ri}>
                {row.map(v => (
                  <td key={v} className="border border-black px-1.5 py-0.5 text-center">{v}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      
      <div className="overflow-x-auto border border-black">
        <table className="border-collapse w-full" style={{ minWidth: '1320px' }}>
          <colgroup>
            <col style={{ width: '88px'  }} /> 
            <col style={{ width: '140px' }} /> 
            <col style={{ width: '110px' }} /> 
            <col style={{ width: '110px' }} /> 
            <col style={{ width: '115px' }} /> 
            <col style={{ width: '115px' }} /> 
            <col style={{ width: '110px' }} /> 
            <col style={{ width: '110px' }} /> 
            <col style={{ width: '110px' }} /> 
            <col style={{ width: '110px' }} /> 
            <col style={{ width: '115px' }} /> 
            <col style={{ width: '130px' }} /> 
            <col style={{ width: '68px'  }} /> 
          </colgroup>
          <thead>
            <tr>
              <th className={th}>Muestra #<br/>Nivel de tueste</th>
              <th className={th}>Fragancia<br/>/ Aroma</th>
              <th className={th}>Sabor</th>
              <th className={th}>Sabor<br/>Residual</th>
              <th className={th}>Acidez</th>
              <th className={th}>Cuerpo</th>
              <th className={th}>Uniformidad</th>
              <th className={th}>Balance</th>
              <th className={th}>Taza<br/>Limpia</th>
              <th className={th}>Dulzor</th>
              <th className={th}>Puntaje<br/>Catador</th>
              <th className={th}>Defectos<br/>(sustraer)</th>
              <th className={th}>Suma</th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-white">

              
              <td className={td}>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1">
                    <span className="text-[0.55rem] font-bold text-gray-600 whitespace-nowrap">#</span>
                    <input
                      value={s.numero}
                      onChange={e => setS({ numero: e.target.value })}
                      className={`${inp} w-10 text-center font-bold`}
                      placeholder="01"
                    />
                  </div>
                  <div className="flex gap-0.5" title="Nivel de tueste">
                    {ROAST.map((color, i) => (
                      <button key={i} type="button"
                        onClick={() => setS({ nivelTueste: i })}
                        className="transition-all"
                        style={{
                          width: 14, height: 14, backgroundColor: color,
                          border: s.nivelTueste === i ? '2px solid #000' : '1px solid #888',
                          transform: s.nivelTueste === i ? 'scale(1.2)' : 'scale(1)',
                        }}
                        title={['Muy Claro', 'Claro', 'Medio', 'Oscuro', 'Muy Oscuro'][i]}
                      />
                    ))}
                  </div>
                </div>
              </td>

              
              <td className={td}>
                <ScaSlider value={s.fragTotal} onChange={v => setS({ fragTotal: v })} />
                <div className="mt-1.5 space-y-1">
                  <div className="flex items-center gap-1">
                    <span className="text-[0.5rem] font-bold text-gray-500 w-8 shrink-0">Seco:</span>
                    <input value={s.fragSeco} onChange={e => setS({ fragSeco: e.target.value })}
                      className={`${inp} text-[0.6rem]`} placeholder="—" />
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-[0.5rem] font-bold text-gray-500 w-8 shrink-0">Cualid.</span>
                    <input value={s.fragCualidades} onChange={e => setS({ fragCualidades: e.target.value })}
                      className={`${inp} text-[0.6rem]`} placeholder="—" />
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-[0.5rem] font-bold text-gray-500 w-8 shrink-0">Espuma:</span>
                    <input value={s.fragEspuma} onChange={e => setS({ fragEspuma: e.target.value })}
                      className={`${inp} text-[0.6rem]`} placeholder="—" />
                  </div>
                </div>
              </td>

              
              <td className={td}>
                <ScaSlider value={s.sabor} onChange={v => setS({ sabor: v })} />
              </td>

              
              <td className={td}>
                <ScaSlider value={s.saborResidual} onChange={v => setS({ saborResidual: v })} />
              </td>

              
              <td className={td}>
                <ScaSlider value={s.acidez} onChange={v => setS({ acidez: v })} />
                <IntensidadToggle label="Intensidad"
                  value={s.acidezIntensidad}
                  onChange={v => setS({ acidezIntensidad: v })} />
              </td>

              
              <td className={td}>
                <ScaSlider value={s.cuerpo} onChange={v => setS({ cuerpo: v })} />
                <IntensidadToggle label="Nivel"
                  value={s.cuerpoNivel}
                  onChange={v => setS({ cuerpoNivel: v })} />
              </td>

              
              <td className={td}>
                <Checks5 values={s.uniformidad} onChange={v => setS({ uniformidad: v })} />
              </td>

              
              <td className={td}>
                <ScaSlider value={s.balance} onChange={v => setS({ balance: v })} />
              </td>

              
              <td className={td}>
                <Checks5 values={s.tazaLimpia} onChange={v => setS({ tazaLimpia: v })} />
              </td>

              
              <td className={td}>
                <Checks5 values={s.dulzor} onChange={v => setS({ dulzor: v })} />
              </td>

              
              <td className={td}>
                <ScaSlider value={s.puntosCatador} onChange={v => setS({ puntosCatador: v })} />
              </td>

              
              <td className={td}>
                <div className="space-y-1">
                  {(['ligero', 'rechazo'] as const).map(tipo => (
                    <label key={tipo} className="flex items-center gap-1 cursor-pointer">
                      <input type="radio" name={`defTipo-${muestra.id}`}
                        value={tipo}
                        checked={s.defectoTipo === tipo}
                        onChange={() => setS({ defectoTipo: tipo })}
                        className="w-2.5 h-2.5 cursor-pointer accent-black"
                      />
                      <span className="text-[0.55rem] font-medium">
                        {tipo === 'ligero' ? 'Ligero = 2' : 'Rechazo = 4'}
                      </span>
                    </label>
                  ))}
                  <div className="flex items-center gap-1 pt-0.5">
                    <div className="flex flex-col">
                      <span className="text-[0.48rem] text-gray-500"># Tazas</span>
                      <input type="number" min={0} max={5} value={s.defectoTazas}
                        onChange={e => setS({ defectoTazas: Math.min(5, Math.max(0, parseInt(e.target.value) || 0)) })}
                        className="w-9 border border-gray-600 text-[0.65rem] text-center font-bold py-0.5 bg-white"
                      />
                    </div>
                    <span className="text-[0.6rem] font-bold text-gray-500 pt-3">×</span>
                    <div className="flex flex-col">
                      <span className="text-[0.48rem] text-gray-500">Intensidad</span>
                      <span className="w-9 border border-gray-300 text-[0.65rem] text-center font-bold py-0.5 bg-gray-50 inline-block">
                        {s.defectoTipo === 'ligero' ? 2 : 4}
                      </span>
                    </div>
                    <span className="text-[0.6rem] font-bold text-gray-500 pt-3">=</span>
                    <div className="flex flex-col">
                      <span className="text-[0.48rem] text-gray-500">Total</span>
                      <span className="w-9 border border-gray-700 text-[0.65rem] text-center font-black py-0.5 bg-gray-50 inline-block text-red-700">
                        {def}
                      </span>
                    </div>
                  </div>
                </div>
              </td>

              
              <td className="border border-black px-1.5 py-1.5 align-middle text-center">
                <span className="text-2xl font-black tabular-nums leading-none text-gray-900">
                  {suma.toFixed(2)}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      
      <div className="border border-black border-t-0 flex">
        <div className="flex-1 border-r border-black p-1.5 space-y-1.5">
          <div className="space-y-1">
            {([
              { k: 'notaSabor'         as const, label: 'Nota Sabor' },
              { k: 'notaSaborResidual' as const, label: 'Nota Sabor Residual' },
              { k: 'notaAcidez'        as const, label: 'Nota Acidez' },
            ]).map(({ k, label }) => (
              <div key={k} className="flex items-center gap-1">
                <span className="text-[0.55rem] font-bold text-gray-700 w-28 shrink-0">{label}:</span>
                <input
                  value={s[k]}
                  onChange={e => setS({ [k]: e.target.value })}
                  className="flex-1 border border-gray-400 text-[0.65rem] px-1.5 py-0.5 bg-white focus:outline-none"
                  placeholder="—"
                />
              </div>
            ))}
          </div>
          <div>
            <span className="text-[0.55rem] font-bold text-gray-700">Notas:</span>
            <textarea
              value={s.notas}
              onChange={e => setS({ notas: e.target.value })}
              rows={2}
              className="w-full mt-0.5 border border-gray-400 text-[0.65rem] px-1.5 py-1 resize-none bg-white focus:outline-none"
              placeholder="Notas y observaciones de catación…"
            />
          </div>
        </div>
        <div className="shrink-0 p-2 flex flex-col items-center justify-center gap-1 min-w-[140px]">
          <span className="text-[0.55rem] font-bold text-gray-700 uppercase tracking-wider">Puntaje Final</span>
          <span className="text-4xl font-black tabular-nums leading-none text-gray-900">
            {final.toFixed(2)}
          </span>
          {def > 0 && (
            <span className="text-[0.55rem] text-gray-500 font-mono">
              {suma.toFixed(2)} − {def} def.
            </span>
          )}
          <span
            className="mt-2 px-2 py-0.5 text-[0.6rem] font-black uppercase tracking-wide border border-current rounded-sm"
            style={{ backgroundColor: cl_.bg, color: cl_.color }}
          >
            {cl_.label}
          </span>
        </div>
      </div>

      
      <div className="flex gap-2 mt-3 no-print">
        <button type="button"
          onClick={() => setForm(defForm(new Date().toISOString().slice(0, 10)))}
          className="px-3 py-1.5 text-xs font-semibold border border-gray-400 text-gray-600 hover:bg-gray-50 rounded transition-colors cursor-pointer">
          Limpiar formulario
        </button>
      </div>

      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { margin: 0; background: white; }
          table { font-size: 8pt !important; }
          input[type=range] { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `}</style>
    </form>
  );
}
