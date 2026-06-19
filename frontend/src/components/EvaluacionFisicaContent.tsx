import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
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

const CP = '#1A2B23';
const CS = '#283F34';

const VARIEDADES_CAFE = ['Caturra','Borbón Rojo','Borbon naranja','Gesha','Pacamara','Tabi','Sidra','Papayo','Blend','Pache','Costa Rica 95','Tipica','Catimor','Maragogipe','SL34','Villa Sarchí','Marsellesa','Limani'];

const TH      = 'border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-semibold text-gray-700 uppercase tracking-wide text-center';
const TDLABEL = 'border border-gray-200 px-3 py-2 text-xs text-gray-700 font-medium bg-gray-50/70 whitespace-nowrap';
const TDCELL  = 'border border-gray-200 px-1 py-1 text-sm';
const TDCALC  = 'border border-gray-200 px-3 py-2 text-sm font-mono font-bold text-green-800 text-center bg-green-50/60 whitespace-nowrap';
const TDFACT  = 'border border-gray-200 px-2 py-2 text-xs text-center text-gray-400 font-mono bg-gray-50/40 whitespace-nowrap';
const TDTOTAL = 'border border-gray-200 px-3 py-2 text-sm font-black text-white text-center whitespace-nowrap';
const INPUT   = 'w-full text-center bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-green-500 rounded px-1 py-0.5';
const LABEL   = 'block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1';
const FIELD   = 'w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-shadow';

export const GRADE_COLORS: Record<1 | 2 | 3 | 4 | 5, string> = {
  1: '#166534', 2: '#1d4ed8', 3: '#92400e', 4: '#991b1b', 5: '#111827',
};

export const CAT1_ROWS = [
  { key: 'negroCompleto'  as const, label: 'Negro completo',        factor: 1 },
  { key: 'agrioCompleto'  as const, label: 'Agrio completo',        factor: 1 },
  { key: 'cerezaSeca'     as const, label: 'Cereza seca / Capulín', factor: 1 },
  { key: 'danoHongos'     as const, label: 'Daño de hongos',        factor: 1 },
  { key: 'materiaExtrana' as const, label: 'Materia extraña',       factor: 1 },
  { key: 'brocaSevera'    as const, label: 'Broca severa',          factor: 1 },
];

export const CAT2_ROWS = [
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

function equivOf(granos: unknown, factor: number): number {
  const n = Number(granos ?? 0);
  if (!n || n <= 0) return 0;
  return Math.ceil(n / factor);
}

function fmtEquiv(granos: unknown, factor: number): string {
  const e = equivOf(granos, factor);
  return e > 0 ? String(e) : '—';
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

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="text-white text-xs font-bold uppercase tracking-widest px-4 py-2.5" style={{ backgroundColor: CP }}>
        {title}
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

function Err({ msg }: { msg?: string }) {
  return (
    <AnimatePresence>
      {msg && (
        <motion.p
          initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
          className="mt-1 text-xs text-red-500 flex items-center gap-1"
        >
          <AlertCircle size={12} /> {msg}
        </motion.p>
      )}
    </AnimatePresence>
  );
}

export interface EvaluacionFisicaContentRef {
  reset: () => void;
}

interface Props {
  muestra:          Muestra;
  formId:           string;
  onSaved:          () => void;
  onSaveError?:     () => void;
  onSavingChange:   (v: boolean) => void;
  onLoadingChange:  (v: boolean) => void;
}

export function EvaluacionFisicaContent({ muestra, formId, onSaved, onSaveError, onSavingChange, onLoadingChange }: Props) {
  const {
    register, handleSubmit, reset, watch,
    formState: { errors },
  } = useForm<EvaluacionCafeVerdeForm>({
    resolver:      zodResolver(evaluacionCafeVerdeSchema),
    defaultValues: { ...mockEvaluacionCafeVerde, ...muestraToDefaults(muestra) },
  });

  const [humedadGrano,   setHumedadGrano]   = useState('');
  const [actividadGrano, setActividadGrano] = useState('');
  const [variedad,       setVariedad]       = useState(muestra.variedad ?? '');

  useEffect(() => {
    onLoadingChange(true);
    muestrasService.getDetalle(muestra.id)
      .then(({ muestra: m, evaluacionFisica: ef }) => {
        reset({ ...mockEvaluacionCafeVerde, ...muestraToDefaults(m) });
        if (m.variedad) setVariedad(m.variedad);
        if (ef) {
          const c = ((ef as any)?.camposJson ?? {}) as any;
          if (c.cafeHumedadGrano   != null) setHumedadGrano(String(c.cafeHumedadGrano));
          if (c.cafeActividadGrano != null) setActividadGrano(String(c.cafeActividadGrano));
        }
      })
      .catch(() => {})
      .finally(() => onLoadingChange(false));
  }, [muestra.id]); 

  const w = watch();

  const cat1Equivs   = CAT1_ROWS.map(r => equivOf(w[r.key]?.granos, r.factor));
  const cat2Equivs   = CAT2_ROWS.map(r => equivOf(w[r.key]?.granos, r.factor));
  const subtotalCat1 = cat1Equivs.reduce((a, b) => a + b, 0);
  const subtotalCat2 = cat2Equivs.reduce((a, b) => a + b, 0);
  const totalDefectos = subtotalCat1 + subtotalCat2;

  const defectEntries: DefectEntry[] = [
    ...CAT1_ROWS.map(r => ({ key: r.key, name: r.label, category: 1 as const, equivalence: r.factor, quantity: Number(w[r.key]?.granos ?? 0) })),
    ...CAT2_ROWS.map(r => ({ key: r.key, name: r.label, category: 2 as const, equivalence: r.factor, quantity: Number(w[r.key]?.granos ?? 0) })),
  ];
  const gradoResult = calculateCoffeeGrade(defectEntries);
  const scoreResult = calculateEstimatedScore(totalDefectos);
  const gradoColor  = GRADE_COLORS[gradoResult.grade as 1 | 2 | 3 | 4 | 5];

  const regNum = (path: string) =>
    register(path as Parameters<typeof register>[0], {
      setValueAs: (v: unknown) => (v === '' || v == null ? 0 : isNaN(Number(v)) ? 0 : Number(v)),
    });

  const onSubmit = async (data: EvaluacionCafeVerdeForm) => {
    onSavingChange(true);
    try {
      const defectosDetalle = {
        cat1: Object.fromEntries(CAT1_ROWS.map((r, i) => [r.key, { granos: data[r.key]?.granos ?? 0, equiv: cat1Equivs[i] }])),
        cat2: Object.fromEntries(CAT2_ROWS.map((r, i) => [r.key, { granos: data[r.key]?.granos ?? 0, equiv: cat2Equivs[i] }])),
        subtotalCat1, subtotalCat2, totalDefectos,
        grado: gradoResult.grade, gradoLabel: gradoResult.label,
        specialty: gradoResult.specialty, interpretation: gradoResult.interpretation,
        score: scoreResult,
        tostado: { muestraNo: data.tostadoMuestraNo, color: data.tostadoColor, olor: data.tostadoOlor, quakers: data.tostadoQuakers, grado: data.tostadoGrado },
        nombre: data.nombre, evaluador: data.evaluador,
      };
      await muestrasService.upsertEvaluacionFisica(muestra.id, {
        cafeDefectosPrimarios:   subtotalCat1,
        cafeDefectosSecundarios: subtotalCat2,
        cafeColorGrano:          data.tostadoColor,
        fechaEvaluacion:         data.fecha,
        observaciones:           data.observaciones,
        cafeVerdeDetalle:        JSON.stringify(defectosDetalle),
        cafeHumedadGrano:        humedadGrano   ? parseFloat(humedadGrano)   : null,
        cafeActividadGrano:      actividadGrano ? parseFloat(actividadGrano) : null,
        puntajeTotal:            scoreResult.estimated,
      } as any);
      await muestrasService.actualizarEstadoPorEvaluaciones(muestra.id);
      onSaved();
    } catch {
      onSaveError?.();
    } finally {
      onSavingChange(false);
    }
  };

  return (
    <form id={formId} onSubmit={handleSubmit(onSubmit)} className="space-y-4">

      <Section title="1. Datos Generales">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
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
            <input {...register('evaluador')} className={FIELD} placeholder="Nombre" />
          </div>
          <div>
            <label className={LABEL}>Variedad</label>
            <select value={variedad} onChange={e => setVariedad(e.target.value)} className={FIELD}>
              <option value="">Seleccionar…</option>
              {VARIEDADES_CAFE.map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>
          <div>
            <label className={LABEL}>Humedad de Grano</label>
            <input
              type="number" step="0.01" min="0"
              value={humedadGrano}
              onChange={e => setHumedadGrano(e.target.value)}
              className={FIELD} placeholder="0.00"
            />
          </div>
          <div>
            <label className={LABEL}>Actividad de Agua</label>
            <input
              type="number" step="0.01" min="0"
              value={actividadGrano}
              onChange={e => setActividadGrano(e.target.value)}
              className={FIELD} placeholder="0.00"
            />
          </div>
        </div>
      </Section>

      <Section title="2. Categoría 1 — Defectos Primarios">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse" style={{ minWidth: 380 }}>
            <thead>
              <tr>
                <th className={TH} style={{ textAlign: 'left', width: '45%' }}>Defecto</th>
                <th className={TH}>Granos</th>
                <th className={TH}>Factor</th>
                <th className={TH}>Equiv.</th>
              </tr>
            </thead>
            <tbody>
              {CAT1_ROWS.map((row) => (
                <tr key={row.key}>
                  <td className={TDLABEL}>{row.label}</td>
                  <td className={TDCELL}>
                    <input type="number" min="0" step="1" {...regNum(`${row.key}.granos`)} className={INPUT} placeholder="0" />
                  </td>
                  <td className={TDFACT}>1 : 1</td>
                  <td className={TDCALC}>{fmtEquiv(w[row.key]?.granos, row.factor)}</td>
                </tr>
              ))}
              <tr>
                <td colSpan={3} className="border border-gray-200 px-3 py-2 text-xs font-black uppercase tracking-wide text-right"
                  style={{ backgroundColor: CP, color: '#fff' }}>Subtotal Cat. 1</td>
                <td className={TDTOTAL} style={{ backgroundColor: subtotalCat1 > 0 ? '#991b1b' : CP }}>{subtotalCat1}</td>
              </tr>
            </tbody>
          </table>
        </div>
        {subtotalCat1 > 0 && (
          <div className="mt-3 flex items-center gap-2 px-3 py-2 rounded-xl border border-red-200 bg-red-50">
            <AlertCircle size={13} className="text-red-500 shrink-0" />
            <p className="text-xs text-red-700 font-semibold">Defectos primarios presentes — descarta Specialty y Premium.</p>
          </div>
        )}
      </Section>

      <Section title="3. Categoría 2 — Defectos Secundarios">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse" style={{ minWidth: 380 }}>
            <thead>
              <tr>
                <th className={TH} style={{ textAlign: 'left', width: '45%' }}>Defecto</th>
                <th className={TH}>Granos</th>
                <th className={TH}>Factor</th>
                <th className={TH}>Equiv.</th>
              </tr>
            </thead>
            <tbody>
              {CAT2_ROWS.map((row) => (
                <tr key={row.key}>
                  <td className={TDLABEL}>{row.label}</td>
                  <td className={TDCELL}>
                    <input type="number" min="0" step="1" {...regNum(`${row.key}.granos`)} className={INPUT} placeholder="0" />
                  </td>
                  <td className={TDFACT}>{row.factor} : 1</td>
                  <td className={TDCALC}>{fmtEquiv(w[row.key]?.granos, row.factor)}</td>
                </tr>
              ))}
              <tr>
                <td colSpan={3} className="border border-gray-200 px-3 py-2 text-xs font-black uppercase tracking-wide text-right"
                  style={{ backgroundColor: CP, color: '#fff' }}>Subtotal Cat. 2</td>
                <td className={TDTOTAL} style={{ backgroundColor: CP }}>{subtotalCat2}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="4. Café Tostado">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
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
            <input {...register('tostadoOlor')} className={FIELD} placeholder="Aromático, frutales…" />
          </div>
          <div>
            <label className={LABEL}>Quakers</label>
            <input type="number" min="0" step="1" {...regNum('tostadoQuakers')} className={FIELD} placeholder="0" />
          </div>
          <div>
            <label className={LABEL}>Grado</label>
            <input {...register('tostadoGrado')} className={FIELD} placeholder="1, 2, 3…" />
          </div>
        </div>
      </Section>

      <Section title="5. Observaciones">
        <textarea
          {...register('observaciones')}
          rows={3}
          className={`${FIELD} resize-none`}
          placeholder="Notas del evaluador…"
        />
      </Section>

    </form>
  );
}
