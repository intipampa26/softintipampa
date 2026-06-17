import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, ArrowLeft, ClipboardList, FileDown, RotateCcw, Save } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import LoadingLogo from '@/components/LoadingLogo';
import { muestrasService, Muestra } from '@/services/muestras.service';
import {
  evaluacionCafeVerdeSchema,
  EvaluacionCafeVerdeForm,
  mockEvaluacionCafeVerde,
} from '@/types/evaluacion-cafe-verde';
import {
  calculateCoffeeGrade,
  calculateEstimatedScore,
  type DefectEntry,
} from '@/utils/sca-grading';

const COLOR_PRIMARY   = '#1A2B23';
const COLOR_SECONDARY = '#283F34';

const TH      = 'border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-semibold text-gray-700 uppercase tracking-wide text-center';
const TDLABEL = 'border border-gray-200 px-3 py-2 text-xs text-gray-700 font-medium bg-gray-50/70 whitespace-nowrap';
const TDCELL  = 'border border-gray-200 px-1 py-1 text-sm';
const TDCALC  = 'border border-gray-200 px-3 py-2 text-sm font-mono font-bold text-green-800 text-center bg-green-50/60 whitespace-nowrap';
const TDFACT  = 'border border-gray-200 px-2 py-2 text-xs text-center text-gray-400 font-mono bg-gray-50/40 whitespace-nowrap';
const TDTOTAL = 'border border-gray-200 px-3 py-2 text-sm font-black text-white text-center whitespace-nowrap';
const INPUT   = 'w-full text-center bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-green-500 rounded px-1 py-0.5';
const LABEL   = 'block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1';
const FIELD   = 'w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-shadow';
const ERR     = 'mt-1 text-xs text-red-500 flex items-center gap-1';

const CAT1_ROWS = [
  { key: 'negroCompleto'  as const, label: 'Negro completo',        factor: 1 },
  { key: 'agrioCompleto'  as const, label: 'Agrio completo',        factor: 1 },
  { key: 'cerezaSeca'     as const, label: 'Cereza seca / Capulín', factor: 1 },
  { key: 'danoHongos'     as const, label: 'Daño de hongos',        factor: 1 },
  { key: 'materiaExtrana' as const, label: 'Materia extraña',       factor: 1 },
  { key: 'brocaSevera'    as const, label: 'Broca severa',          factor: 1 },
];

const CAT2_ROWS = [
  { key: 'negroParcial'  as const, label: 'Negro parcial',               factor: 3  },
  { key: 'agrioPartial'  as const, label: 'Agrio parcial',               factor: 3  },
  { key: 'pergamino'     as const, label: 'Pergamino',                   factor: 5  },
  { key: 'flotador'      as const, label: 'Flotador',                    factor: 5  },
  { key: 'inmaduro'      as const, label: 'Inmaduro',                    factor: 5  },
  { key: 'averanado'     as const, label: 'Averanado / marchito',        factor: 5  },
  { key: 'conchas'       as const, label: 'Conchas',                     factor: 5  },
  { key: 'rotosPartidos' as const, label: 'Rotos / mordidos / partidos', factor: 5  },
  { key: 'cascaras'      as const, label: 'Cáscaras',                    factor: 5  },
  { key: 'brocaLeve'     as const, label: 'Broca leve',                  factor: 10 },
];

const GRADE_COLORS: Record<1 | 2 | 3 | 4 | 5, string> = {
  1: '#166534',
  2: '#1d4ed8',
  3: '#92400e',
  4: '#991b1b',
  5: '#111827',
};

function equivOf(granos: unknown, factor: number): number {
  const n = Number(granos ?? 0);
  if (!n || n <= 0) return 0;
  return Math.ceil(n / factor);
}

function fmtEquiv(granos: unknown, factor: number): string {
  const e = equivOf(granos, factor);
  return e > 0 ? String(e) : '—';
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
    >
      <div
        className="text-white text-xs font-bold uppercase tracking-widest px-4 py-2.5"
        style={{ backgroundColor: COLOR_PRIMARY }}
      >
        {title}
      </div>
      <div className="p-4">{children}</div>
    </motion.div>
  );
}

function Err({ msg }: { msg?: string }) {
  return (
    <AnimatePresence>
      {msg && (
        <motion.p
          initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
          className={ERR}
        >
          <AlertCircle size={12} /> {msg}
        </motion.p>
      )}
    </AnimatePresence>
  );
}

function SuccessModal({ onVolver }: { onVolver: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 flex flex-col items-center gap-4"
      >
        <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: '#D1FAE5' }}>
          <svg className="w-9 h-9" style={{ color: COLOR_PRIMARY }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div className="text-center">
          <h3 className="font-black text-gray-800 text-lg uppercase tracking-wide">Evaluación guardada</h3>
          <p className="text-sm text-gray-400 mt-1">La evaluación física de café verde fue registrada correctamente.</p>
        </div>
        <button
          onClick={onVolver}
          className="w-full py-3 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: COLOR_PRIMARY }}
        >
          Volver a Muestras
        </button>
      </motion.div>
    </div>
  );
}

function muestraToDefaults(m: Muestra): Partial<EvaluacionCafeVerdeForm> {
  return {
    muestraNo: m.codigo,
    fecha:     m.fecha ?? new Date().toISOString().slice(0, 10),
    nombre:    m.productor
      ? `${m.productor.nombre} ${m.productor.apellido ?? ''}`.trim()
      : '',
  };
}

export function EvaluacionCafeVerdePage() {
  const [searchParams] = useSearchParams();
  const navigate       = useNavigate();
  const muestraId      = searchParams.get('muestraId');

  const [muestra,        setMuestra]        = useState<Muestra | null>(null);
  const [loadingMuestra, setLoadingMuestra] = useState(!!muestraId);
  const [saving,         setSaving]         = useState(false);
  const [showSuccess,    setShowSuccess]    = useState(false);

  const {
    register, handleSubmit, reset, watch,
    formState: { errors },
  } = useForm<EvaluacionCafeVerdeForm>({
    resolver:      zodResolver(evaluacionCafeVerdeSchema),
    defaultValues: mockEvaluacionCafeVerde,
  });

  useEffect(() => {
    if (!muestraId) return;
    setLoadingMuestra(true);
    muestrasService.getDetalle(Number(muestraId))
      .then(({ muestra: m }) => {
        setMuestra(m);
        reset({ ...mockEvaluacionCafeVerde, ...muestraToDefaults(m) });
      })
      .catch(() => {})
      .finally(() => setLoadingMuestra(false));
  }, [muestraId]); 

  const w = watch();

  const cat1Equivs = CAT1_ROWS.map(r => equivOf(w[r.key]?.granos, r.factor));
  const cat2Equivs = CAT2_ROWS.map(r => equivOf(w[r.key]?.granos, r.factor));

  const subtotalCat1  = cat1Equivs.reduce((a, b) => a + b, 0);
  const subtotalCat2  = cat2Equivs.reduce((a, b) => a + b, 0);
  const totalDefectos = subtotalCat1 + subtotalCat2;

  const defectEntries: DefectEntry[] = [
    ...CAT1_ROWS.map(r => ({
      key: r.key, name: r.label, category: 1 as const,
      equivalence: r.factor, quantity: Number(w[r.key]?.granos ?? 0),
    })),
    ...CAT2_ROWS.map(r => ({
      key: r.key, name: r.label, category: 2 as const,
      equivalence: r.factor, quantity: Number(w[r.key]?.granos ?? 0),
    })),
  ];
  const gradoResult = calculateCoffeeGrade(defectEntries);
  const scoreResult  = calculateEstimatedScore(totalDefectos);
  const gradoColor   = GRADE_COLORS[gradoResult.grade as 1 | 2 | 3 | 4 | 5];

  const regNum = (path: string) =>
    register(path as Parameters<typeof register>[0], {
      setValueAs: (v: unknown) => (v === '' || v == null ? 0 : isNaN(Number(v)) ? 0 : Number(v)),
    });

  const onSubmit = async (data: EvaluacionCafeVerdeForm) => {
    setSaving(true);
    try {
      if (muestraId) {
        const defectosDetalle = {
          cat1: Object.fromEntries(
            CAT1_ROWS.map((r, i) => [r.key, { granos: data[r.key]?.granos ?? 0, equiv: cat1Equivs[i] }])
          ),
          cat2: Object.fromEntries(
            CAT2_ROWS.map((r, i) => [r.key, { granos: data[r.key]?.granos ?? 0, equiv: cat2Equivs[i] }])
          ),
          subtotalCat1,
          subtotalCat2,
          totalDefectos,
          grado:          gradoResult.grade,
          gradoLabel:     gradoResult.label,
          specialty:      gradoResult.specialty,
          interpretation: gradoResult.interpretation,
          score:          scoreResult,
          tostado: {
            muestraNo: data.tostadoMuestraNo,
            color:     data.tostadoColor,
            olor:      data.tostadoOlor,
            quakers:   data.tostadoQuakers,
            grado:     data.tostadoGrado,
          },
          nombre:    data.nombre,
          evaluador: data.evaluador,
        };

        await muestrasService.upsertEvaluacionFisica(Number(muestraId), {
          cafeDefectosPrimarios:    subtotalCat1,
          cafeDefectosSecundarios:  subtotalCat2,
          cafeColorGrano:           data.tostadoColor,
          fechaEvaluacion:          data.fecha,
          observaciones:            data.observaciones,
          cafeVerdeDetalle:         JSON.stringify(defectosDetalle),
        } as any);

        await muestrasService.update(Number(muestraId), { estado: 'en_proceso' });
      }

      setShowSuccess(true);
    } finally {
      setSaving(false);
    }
  };

  if (loadingMuestra) {
    return (
      <div
        className="fixed inset-0 z-40 flex items-center justify-center"
        style={{ backgroundColor: 'rgba(249,250,251,0.95)', backdropFilter: 'blur(2px)' }}
      >
        <LoadingLogo />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-5 max-w-4xl mx-auto pb-12 relative">

      {saving && (
        <div
          className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-2"
          style={{ backgroundColor: 'rgba(249,250,251,0.95)', backdropFilter: 'blur(2px)' }}
        >
          <LoadingLogo compact />
          <p className="text-sm font-semibold text-gray-600">Guardando evaluación…</p>
        </div>
      )}

      {showSuccess && <SuccessModal onVolver={() => navigate('/dashboard/muestras')} />}

      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        {muestraId && (
          <button
            onClick={() => navigate('/dashboard/muestras')}
            className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-gray-600 mb-3 transition-colors"
          >
            <ArrowLeft size={14} /> Volver a Muestras
          </button>
        )}

        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl" style={{ backgroundColor: COLOR_PRIMARY }}>
              <ClipboardList size={22} className="text-white" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: COLOR_SECONDARY }}>
                Collective Bean
              </p>
              <h1 className="text-2xl font-black uppercase tracking-wide" style={{ color: '#172216' }}>
                Evaluación Física — Café Verde
              </h1>
            </div>
          </div>

          {muestra && (
            <div className="shrink-0 text-right">
              <p className="text-xs text-gray-400 font-medium">Muestra</p>
              <p className="font-black text-gray-800 text-sm font-mono">{muestra.codigo}</p>
              {muestra.campana && <p className="text-xs text-gray-400">{muestra.campana.nombre}</p>}
            </div>
          )}
        </div>
      </motion.div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

        <Section title="1. Datos Generales">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className={LABEL}>Nombre</label>
              <input {...register('nombre')} className={FIELD} placeholder="Productor / Finca" />
            </div>
            <div>
              <label className={LABEL}>Fecha <span className="text-red-400">*</span></label>
              <input type="date" {...register('fecha')} className={FIELD} />
              <Err msg={errors.fecha?.message} />
            </div>
            <div>
              <label className={LABEL}>Muestra No.</label>
              <input {...register('muestraNo')} className={FIELD} placeholder="M-2026-001" />
            </div>
            <div>
              <label className={LABEL}>Evaluador</label>
              <input {...register('evaluador')} className={FIELD} placeholder="Nombre del evaluador" />
            </div>
          </div>
        </Section>

        <Section title="2. Análisis Café Verde — Categoría 1 (Defectos Primarios)">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse" style={{ minWidth: 460 }}>
              <thead>
                <tr>
                  <th className={TH} style={{ textAlign: 'left', width: '45%' }}>Tipo de Defecto</th>
                  <th className={TH}>No. Granos<br/>Defectuosos</th>
                  <th className={TH}>Factor<br/>Equiv.</th>
                  <th className={TH}>Equivalencia</th>
                </tr>
              </thead>
              <tbody>
                {CAT1_ROWS.map((row, i) => (
                  <tr key={row.key}>
                    <td className={TDLABEL}>{row.label}</td>
                    <td className={TDCELL}>
                      <input
                        type="number" min="0" step="1"
                        {...regNum(`${row.key}.granos`)}
                        className={INPUT}
                        placeholder="0"
                      />
                    </td>
                    <td className={TDFACT}>1 : 1</td>
                    <td className={TDCALC}>{fmtEquiv(w[row.key]?.granos, row.factor)}</td>
                  </tr>
                ))}
                <tr>
                  <td colSpan={3} className="border border-gray-200 px-3 py-2 text-xs font-black uppercase tracking-wide text-right"
                    style={{ backgroundColor: COLOR_PRIMARY, color: '#fff' }}>
                    Subtotal Categoría 1
                  </td>
                  <td className={TDTOTAL} style={{ backgroundColor: subtotalCat1 > 0 ? '#991b1b' : COLOR_PRIMARY }}>
                    {subtotalCat1}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          {subtotalCat1 > 0 && (
            <div className="mt-3 flex items-center gap-2 px-3 py-2 rounded-xl border border-red-200 bg-red-50">
              <AlertCircle size={14} className="text-red-500 shrink-0" />
              <p className="text-xs text-red-700 font-semibold">
                Presencia de defectos primarios — descarta clasificación Specialty y Premium.
              </p>
            </div>
          )}
        </Section>

        <Section title="3. Análisis Café Verde — Categoría 2 (Defectos Secundarios)">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse" style={{ minWidth: 460 }}>
              <thead>
                <tr>
                  <th className={TH} style={{ textAlign: 'left', width: '45%' }}>Tipo de Defecto</th>
                  <th className={TH}>No. Granos<br/>Defectuosos</th>
                  <th className={TH}>Factor<br/>Equiv.</th>
                  <th className={TH}>Equivalencia</th>
                </tr>
              </thead>
              <tbody>
                {CAT2_ROWS.map((row) => (
                  <tr key={row.key}>
                    <td className={TDLABEL}>{row.label}</td>
                    <td className={TDCELL}>
                      <input
                        type="number" min="0" step="1"
                        {...regNum(`${row.key}.granos`)}
                        className={INPUT}
                        placeholder="0"
                      />
                    </td>
                    <td className={TDFACT}>{row.factor} : 1</td>
                    <td className={TDCALC}>{fmtEquiv(w[row.key]?.granos, row.factor)}</td>
                  </tr>
                ))}
                <tr>
                  <td colSpan={3} className="border border-gray-200 px-3 py-2 text-xs font-black uppercase tracking-wide text-right"
                    style={{ backgroundColor: COLOR_PRIMARY, color: '#fff' }}>
                    Subtotal Categoría 2
                  </td>
                  <td className={TDTOTAL} style={{ backgroundColor: COLOR_PRIMARY }}>
                    {subtotalCat2}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Section>

        <Section title="4. Resumen y Grado">
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            <div className="flex flex-col items-center justify-center p-4 rounded-xl border border-gray-200 bg-gray-50 gap-1">
              <p className="text-[0.6rem] font-bold uppercase tracking-widest text-gray-400">Cat. 1</p>
              <p className="text-3xl font-black font-mono" style={{ color: subtotalCat1 > 0 ? '#991b1b' : COLOR_PRIMARY }}>
                {subtotalCat1}
              </p>
              <p className="text-[0.58rem] text-gray-400 text-center">defectos primarios</p>
            </div>
            <div className="flex flex-col items-center justify-center p-4 rounded-xl border border-gray-200 bg-gray-50 gap-1">
              <p className="text-[0.6rem] font-bold uppercase tracking-widest text-gray-400">Cat. 2</p>
              <p className="text-3xl font-black font-mono" style={{ color: COLOR_SECONDARY }}>
                {subtotalCat2}
              </p>
              <p className="text-[0.58rem] text-gray-400 text-center">defectos secundarios</p>
            </div>
            <div className="flex flex-col items-center justify-center p-4 rounded-xl border-2 gap-1"
              style={{ borderColor: gradoColor, backgroundColor: `${gradoColor}10` }}>
              <p className="text-[0.6rem] font-bold uppercase tracking-widest text-gray-400">Total</p>
              <p className="text-3xl font-black font-mono" style={{ color: gradoColor }}>
                {totalDefectos}
              </p>
              <p className="text-[0.58rem] text-gray-400 text-center">equiv. totales</p>
            </div>
            <div className="flex flex-col items-center justify-center p-4 rounded-xl border-2 gap-1"
              style={{ borderColor: '#1d4ed8', backgroundColor: '#eff6ff' }}>
              <p className="text-[0.6rem] font-bold uppercase tracking-widest text-gray-400">Score</p>
              <p className="text-3xl font-black font-mono" style={{ color: '#1d4ed8' }}>
                {scoreResult.estimated}
              </p>
              <p className="text-[0.58rem] text-gray-400 text-center">{scoreResult.min}–{scoreResult.max} pts</p>
            </div>
          </div>

        </Section>

        <Section title="5. Café Tostado">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className={LABEL}>Muestra No.</label>
              <input {...register('tostadoMuestraNo')} className={FIELD} placeholder="TOS-2026-001" />
            </div>
            <div>
              <label className={LABEL}>Color</label>
              <select {...register('tostadoColor')} className={FIELD}>
                <option value="">— Seleccionar —</option>
                {['Blue', 'Blue-Green', 'Green', 'Greenish', 'Yellow-Green', 'Pale Yellow', 'Yellowish', 'Brownish'].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={LABEL}>Odor</label>
              <input {...register('tostadoOlor')} className={FIELD} placeholder="Ej: Aromático, notas frutales" />
            </div>
            <div>
              <label className={LABEL}>Quakers</label>
              <input
                type="number" min="0" step="1"
                {...regNum('tostadoQuakers')}
                className={FIELD}
                placeholder="0"
              />
            </div>
            <div>
              <label className={LABEL}>Grado</label>
              <input {...register('tostadoGrado')} className={FIELD} placeholder="Ej: 1, 2, 3…" />
            </div>
          </div>
        </Section>

        <Section title="6. Observaciones">
          <div>
            <label className={LABEL}>Notas del evaluador</label>
            <textarea
              {...register('observaciones')}
              rows={3}
              className={`${FIELD} resize-none`}
              placeholder="Observaciones generales sobre la muestra, condiciones de almacenamiento, notas de la evaluación…"
            />
          </div>
        </Section>

        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="flex flex-wrap gap-3 justify-end pb-2"
        >
          <button
            type="button"
            onClick={() => reset({ ...mockEvaluacionCafeVerde, ...(muestra ? muestraToDefaults(muestra) : {}) })}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-300 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <RotateCcw size={15} /> Limpiar
          </button>

          <button
            type="button"
            onClick={() => alert('Exportar PDF — próximamente')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border text-sm font-semibold transition-colors"
            style={{ borderColor: '#6EE7B7', backgroundColor: '#F0FDF4', color: COLOR_SECONDARY }}
          >
            <FileDown size={15} /> Exportar PDF
          </button>

          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
            style={{ backgroundColor: COLOR_PRIMARY }}
          >
            <Save size={15} /> Guardar evaluación
          </button>
        </motion.div>

      </form>
    </div>
  );
}
