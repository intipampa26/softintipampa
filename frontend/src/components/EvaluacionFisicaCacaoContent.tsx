import { useState, useEffect } from 'react';
import { muestrasService, Muestra } from '@/services/muestras.service';

const CP  = '#1A2B23';
const CS  = '#283F34';

type TwoCol = { a: string; b: string };

const n   = (v: string) => parseFloat(v) || 0;
const avg = (r: TwoCol) => { const s = n(r.a) + n(r.b); return s ? ((n(r.a) && n(r.b)) ? ((n(r.a) + n(r.b)) / 2).toFixed(2) : (n(r.a) || n(r.b)).toFixed(2)) : ''; };
const sum = (r: TwoCol) => { const s = n(r.a) + n(r.b); return s ? String(s) : ''; };
const sumN = (r: TwoCol) => n(r.a) + n(r.b);

const FIELD  = 'w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-shadow bg-white';
const LABEL  = 'block text-[0.65rem] font-semibold text-gray-500 uppercase tracking-wide mb-1';
const CI     = 'w-full bg-transparent text-center text-sm focus:outline-none focus:bg-green-50 rounded px-1 py-1.5 transition-colors';
const TH_CLS = 'border border-gray-200 px-3 py-2.5 text-[0.65rem] font-bold text-gray-600 uppercase tracking-wide text-center bg-gray-50';
const TD_LBL = 'border border-gray-200 px-3 py-2 text-xs text-gray-700 font-medium bg-white';
const TD_NUM = 'border border-gray-200 px-1 py-0.5 w-20';
const TD_AVG = 'border border-gray-200 px-3 py-2 text-sm font-bold text-center bg-green-50/70 w-24';

function SectionHeader({ title }: { title: string }) {
  return (
    <div
      className="text-white text-xs font-bold uppercase tracking-widest px-4 py-2.5"
      style={{ backgroundColor: CP }}
    >
      {title}
    </div>
  );
}

function SubHeader({ title }: { title: string }) {
  return (
    <p className="text-xs font-bold mb-2.5 mt-1" style={{ color: CS }}>
      {title}
    </p>
  );
}

interface Props {
  muestra:         Muestra;
  formId:          string;
  onSaved:         () => void;
  onSaveError?:    () => void;
  onSavingChange:  (v: boolean) => void;
  onLoadingChange: (v: boolean) => void;
}

export function EvaluacionFisicaCacaoContent({
  muestra, formId, onSaved, onSaveError, onSavingChange, onLoadingChange,
}: Props) {

  
  const [distrito,     setDistrito]     = useState('');
  const [variedad,     setVariedad]     = useState(muestra.variedad ?? '');
  const [fechaCosecha, setFechaCosecha] = useState('');

  
  const [peso100g,      setPeso100g]      = useState<TwoCol>({ a: '', b: '' });
  const [granosBlancosRow, setGranosBlancosRow] = useState<TwoCol>({ a: '', b: '' });
  const [indiceGrano,   setIndiceGrano]   = useState<TwoCol>({ a: '', b: '' });

  
  const [bienFerment, setBienFerment] = useState<TwoCol>({ a: '', b: '' });
  const [medFerment,  setMedFerment]  = useState<TwoCol>({ a: '', b: '' });
  const [violetas,    setVioletas]    = useState<TwoCol>({ a: '', b: '' });
  const [pizarrosos,  setPizarrosos]  = useState<TwoCol>({ a: '', b: '' });

  
  const [danadosIns,  setDanadosIns]  = useState<TwoCol>({ a: '', b: '' });
  const [germinados,  setGerminados]  = useState<TwoCol>({ a: '', b: '' });
  const [mohosos,     setMohosos]     = useState<TwoCol>({ a: '', b: '' });
  const [calificacion, setCalificacion] = useState('');

  
  const [granosBlancosAtrib, setGranosBlancosAtrib] = useState<TwoCol>({ a: '', b: '' });

  
  const [aroma,     setAroma]     = useState('');
  const [fechaEval, setFechaEval] = useState(new Date().toISOString().slice(0, 10));
  const [evaluador, setEvaluador] = useState('');

  
  const pctFerment = sumN(bienFerment);

  

  useEffect(() => {
    onLoadingChange(true);
    muestrasService.getDetalle(muestra.id)
      .then(({ evaluacionFisica: ef }) => {
        if (!ef) return;
        const c = ((ef as any)?.camposJson ?? {}) as any;
        if (c.cacaoDistrito)        setDistrito(c.cacaoDistrito);
        if (c.cacaoVariedad)        setVariedad(c.cacaoVariedad);
        else if (muestra.variedad)  setVariedad(muestra.variedad);
        if (c.cacaoFechaCosecha)    setFechaCosecha(c.cacaoFechaCosecha);
        if (c.cacaoAromaApariencia) setAroma(c.cacaoAromaApariencia);
        if (c.cacaoCalificacion)    setCalificacion(c.cacaoCalificacion);
        if (c.cacaoEvaluador)       setEvaluador(c.cacaoEvaluador);
        if (c.cacaoFechaEval)       setFechaEval(c.cacaoFechaEval);
        const th = c.cacaoTablaHumedad;
        if (th) {
          if (th.peso100g)         setPeso100g(th.peso100g);
          if (th.granosBlancosRow) setGranosBlancosRow(th.granosBlancosRow);
          if (th.indiceGrano)      setIndiceGrano(th.indiceGrano);
        }
        const tf = c.cacaoTablaFerment;
        if (tf) {
          if (tf.bienFerment) setBienFerment(tf.bienFerment);
          if (tf.medFerment)  setMedFerment(tf.medFerment);
          if (tf.violetas)    setVioletas(tf.violetas);
          if (tf.pizarrosos)  setPizarrosos(tf.pizarrosos);
        }
        const td = c.cacaoTablaDefectos;
        if (td) {
          if (td.danadosIns) setDanadosIns(td.danadosIns);
          if (td.germinados) setGerminados(td.germinados);
          if (td.mohosos)    setMohosos(td.mohosos);
        }
        const ta = c.cacaoTablaAtributos;
        if (ta?.granosBlancosAtrib) setGranosBlancosAtrib(ta.granosBlancosAtrib);
      })
      .catch(() => {})
      .finally(() => onLoadingChange(false));
  }, [muestra.id]); 

  
  useEffect(() => {
    const calcCol = (v: string) => {
      const n = parseFloat(v);
      return isNaN(n) ? '' : String(+(n / 100).toFixed(4));
    };
    setIndiceGrano({ a: calcCol(peso100g.a), b: calcCol(peso100g.b) });
  }, [peso100g]);

  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    onSavingChange(true);
    try {
      await muestrasService.upsertEvaluacionFisica(muestra.id, {
        cacaoFermentacionPct:  pctFerment,
        cacaoPesoCienGranos:   parseFloat(avg(peso100g))         || 0,
        cacaoGranosBlancosAvg: parseFloat(avg(granosBlancosRow)) || 0,
        cacaoDistrito:         distrito,
        cacaoVariedad:         variedad,
        cacaoFechaCosecha:     fechaCosecha,
        cacaoCalificacion:     calificacion,
        cacaoAromaApariencia:  aroma,
        cacaoEvaluador:        evaluador,
        cacaoFechaEval:        fechaEval,
        cacaoTablaHumedad:     { peso100g, granosBlancosRow, indiceGrano },
        cacaoTablaFerment:     { bienFerment, medFerment, violetas, pizarrosos },
        cacaoTablaDefectos:    { danadosIns, germinados, mohosos },
        cacaoTablaAtributos:   { granosBlancosAtrib },
        fechaEvaluacion:       fechaEval,
        observaciones:         aroma,
      } as any);
      await muestrasService.actualizarEstadoPorEvaluaciones(muestra.id);
      onSaved();
    } catch {
      onSaveError?.();
    } finally {
      onSavingChange(false);
    }
  };

  

  const productor = muestra.productor
    ? `${muestra.productor.nombre} ${muestra.productor.apellido ?? ''}`.trim()
    : '';

  return (
    <form id={formId} onSubmit={handleSubmit} className="space-y-4 text-sm">

      
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <SectionHeader title="Datos Generales" />
        <div className="p-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div>
            <label className={LABEL}>Productor</label>
            <input
              defaultValue={productor}
              readOnly
              className={`${FIELD} bg-gray-50 text-gray-500 cursor-default`}
            />
          </div>
          <div>
            <label className={LABEL}>Distrito</label>
            <input value={distrito} onChange={e => setDistrito(e.target.value)} className={FIELD} placeholder="Ej: Quillabamba" />
          </div>
          <div>
            <label className={LABEL}>Variedad</label>
            <input value={variedad} onChange={e => setVariedad(e.target.value)} className={FIELD} placeholder="CCN51, Chuncho…" />
          </div>
          <div>
            <label className={LABEL}>Fecha cosecha</label>
            <input type="date" value={fechaCosecha} onChange={e => setFechaCosecha(e.target.value)} className={FIELD} />
          </div>
        </div>
      </div>

      
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <SectionHeader title="Evaluación de Muestra" />
        <div className="p-4 space-y-5">

          
          <div>
            <SubHeader title="Humedad e Índice de grano" />
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-200" style={{ minWidth: 420 }}>
                <thead>
                  <tr>
                    <th className={`${TH_CLS} text-left`} style={{ width: '44%' }}>Descripción</th>
                    <th className={TH_CLS}>1</th>
                    <th className={TH_CLS}>2</th>
                    <th className={`${TH_CLS} bg-green-50 text-green-800`}>Promedio</th>
                  </tr>
                </thead>
                <tbody>
                  {([
                    { label: 'Peso en gramos de 100 granos', val: peso100g,         set: setPeso100g         },
                    { label: 'Granos Blancos',               val: granosBlancosRow, set: setGranosBlancosRow },
                  ] as const).map(({ label, val, set }) => (
                    <tr key={label}>
                      <td className={TD_LBL}>{label}</td>
                      <td className={TD_NUM}>
                        <input type="number" min="0" step="0.01" value={val.a}
                          onChange={e => set(p => ({ ...p, a: e.target.value }))}
                          className={CI} placeholder="—" />
                      </td>
                      <td className={TD_NUM}>
                        <input type="number" min="0" step="0.01" value={val.b}
                          onChange={e => set(p => ({ ...p, b: e.target.value }))}
                          className={CI} placeholder="—" />
                      </td>
                      <td className={TD_AVG}>{avg(val) || '—'}</td>
                    </tr>
                  ))}
                  <tr>
                    <td className={TD_LBL}>Índice de grano</td>
                    <td className={TD_NUM}>
                      <input type="number" readOnly value={indiceGrano.a}
                        className={`${CI} bg-gray-50 text-gray-500 cursor-default`} placeholder="—" />
                    </td>
                    <td className={TD_NUM}>
                      <input type="number" readOnly value={indiceGrano.b}
                        className={`${CI} bg-gray-50 text-gray-500 cursor-default`} placeholder="—" />
                    </td>
                    <td className={TD_AVG}>{avg(indiceGrano) || '—'}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          
          <div>
            <SubHeader title="Evaluación de fermentación" />
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-200" style={{ minWidth: 420 }}>
                <thead>
                  <tr>
                    <th className={`${TH_CLS} text-left`} style={{ width: '44%' }}>Prueba de corte de 50 granos</th>
                    <th className={TH_CLS}>1</th>
                    <th className={TH_CLS}>2</th>
                    <th className={`${TH_CLS} bg-green-50 text-green-800`}>Suma</th>
                  </tr>
                </thead>
                <tbody>
                  {([
                    { label: 'Granos bien fermentados',         val: bienFerment, set: setBienFerment },
                    { label: 'Granos medianamente fermentados', val: medFerment,  set: setMedFerment  },
                    { label: 'Granos violetas',                 val: violetas,    set: setVioletas    },
                    { label: 'Granos pizarrosos 3%',            val: pizarrosos,  set: setPizarrosos  },
                  ] as const).map(({ label, val, set }) => (
                    <tr key={label}>
                      <td className={TD_LBL}>{label}</td>
                      <td className={TD_NUM}>
                        <input type="number" min="0" step="1" value={val.a}
                          onChange={e => set(p => ({ ...p, a: e.target.value }))}
                          className={CI} placeholder="—" />
                      </td>
                      <td className={TD_NUM}>
                        <input type="number" min="0" step="1" value={val.b}
                          onChange={e => set(p => ({ ...p, b: e.target.value }))}
                          className={CI} placeholder="—" />
                      </td>
                      <td className={TD_AVG}>{sum(val) || '—'}</td>
                    </tr>
                  ))}
                  
                  <tr style={{ backgroundColor: `${CP}10` }}>
                    <td className="border border-gray-200 px-3 py-2.5 text-xs font-black uppercase tracking-wide" style={{ color: CP }}>
                      % Fermentación
                    </td>
                    <td colSpan={3}
                      className="border border-gray-200 text-center font-black text-lg"
                      style={{ color: pctFerment >= 65 ? '#166534' : pctFerment > 0 ? CP : '#9CA3AF' }}
                    >
                      {pctFerment > 0 ? `${pctFerment.toFixed(1)} %` : '—'}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          
          <div>
            <SubHeader title="Evaluación de Defectos" />
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-200" style={{ minWidth: 420 }}>
                <thead>
                  <tr>
                    <th className={`${TH_CLS} text-left`} style={{ width: '44%' }}>Evaluación en 100 gr</th>
                    <th className={TH_CLS}>1</th>
                    <th className={TH_CLS}>2</th>
                    <th className={`${TH_CLS} bg-green-50 text-green-800`}>%</th>
                  </tr>
                </thead>
                <tbody>
                  {([
                    { label: 'Granos dañados por insectos 3%', val: danadosIns, set: setDanadosIns },
                    { label: 'Granos germinados 3%',           val: germinados, set: setGerminados },
                    { label: 'Granos mohosos 3%',              val: mohosos,    set: setMohosos    },
                  ] as const).map(({ label, val, set }) => (
                    <tr key={label}>
                      <td className={TD_LBL}>{label}</td>
                      <td className={TD_NUM}>
                        <input type="number" min="0" step="1" value={val.a}
                          onChange={e => set(p => ({ ...p, a: e.target.value }))}
                          className={CI} placeholder="—" />
                      </td>
                      <td className={TD_NUM}>
                        <input type="number" min="0" step="1" value={val.b}
                          onChange={e => set(p => ({ ...p, b: e.target.value }))}
                          className={CI} placeholder="—" />
                      </td>
                      <td className={TD_AVG}>{sumN(val) > 0 ? `${sumN(val)}%` : '—'}</td>
                    </tr>
                  ))}
                  
                  <tr style={{ backgroundColor: `${CP}08` }}>
                    <td className="border border-gray-200 px-3 py-2 text-xs font-bold" style={{ color: CP }}>
                      Calificación de la muestra
                    </td>
                    <td colSpan={3} className="border border-gray-200 px-2 py-1">
                      <input
                        type="text"
                        value={calificacion}
                        onChange={e => setCalificacion(e.target.value)}
                        placeholder="Ej: Primera, Exportable, Descarte…"
                        className="w-full bg-transparent text-sm focus:outline-none focus:bg-green-50 rounded px-2 py-1 transition-colors"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          
          <div>
            <SubHeader title="Atributos" />
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-200" style={{ minWidth: 420 }}>
                <thead>
                  <tr>
                    <th className={`${TH_CLS} text-left`} style={{ width: '44%' }}>Descripción</th>
                    <th className={TH_CLS}>1</th>
                    <th className={TH_CLS}>2</th>
                    <th className={`${TH_CLS} bg-green-50 text-green-800`}>Promedio</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className={TD_LBL}>Granos blancos</td>
                    <td className={TD_NUM}>
                      <input type="number" min="0" step="1" value={granosBlancosAtrib.a}
                        onChange={e => setGranosBlancosAtrib(p => ({ ...p, a: e.target.value }))}
                        className={CI} placeholder="—" />
                    </td>
                    <td className={TD_NUM}>
                      <input type="number" min="0" step="1" value={granosBlancosAtrib.b}
                        onChange={e => setGranosBlancosAtrib(p => ({ ...p, b: e.target.value }))}
                        className={CI} placeholder="—" />
                    </td>
                    <td className={TD_AVG}>{avg(granosBlancosAtrib) || '—'}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <SectionHeader title="Observaciones" />
        <div className="p-4 space-y-4">
          <div>
            <label className={LABEL}>Aroma y apariencia</label>
            <textarea
              value={aroma}
              onChange={e => setAroma(e.target.value)}
              rows={3}
              placeholder="Observaciones sobre aroma y apariencia de la muestra…"
              className={`${FIELD} resize-none`}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={LABEL}>Fecha evaluación</label>
              <input type="date" value={fechaEval} onChange={e => setFechaEval(e.target.value)} className={FIELD} />
            </div>
            <div>
              <label className={LABEL}>Evaluador</label>
              <input
                value={evaluador}
                onChange={e => setEvaluador(e.target.value)}
                placeholder="Nombre del evaluador"
                className={FIELD}
              />
            </div>
          </div>
        </div>
      </div>

    </form>
  );
}
