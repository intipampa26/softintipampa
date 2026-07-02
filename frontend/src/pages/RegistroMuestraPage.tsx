import { useCallback, useEffect, useState } from 'react';

const VARIEDADES_CACAO = ['Cacao','Macambo','Cupui','Copuazu','Manteca de cacao','Polvo de cacao','Nibs de cacao','Pasta de cacao'];
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, ArrowLeft, ClipboardList, FileDown, RotateCcw, Save } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import LoadingLogo from '@/components/LoadingLogo';
import { useToast } from '@/contexts/ToastContext';
import { muestrasService, Muestra, EvaluacionFisica } from '@/services/muestras.service';
import { mockRegistroMuestra, registroMuestraSchema, RegistroMuestraForm } from '@/types/registro-muestra';

function avgOf(a: unknown, b: unknown): string {
  const na = Number(a), nb = Number(b);
  if (!a && !b) return '—';
  return ((na + nb) / 2).toFixed(2);
}

function sumOf(a: unknown, b: unknown): string {
  const na = Number(a), nb = Number(b);
  if (!a && !b) return '—';
  return (na + nb).toFixed(0);
}

const COLOR_PRIMARY   = '#1A2B23';
const COLOR_SECONDARY = '#283F34';

const TH      = 'border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-semibold text-gray-700 uppercase tracking-wide text-center';
const TDLABEL = 'border border-gray-200 px-3 py-2 text-xs text-gray-700 font-medium bg-gray-50/70 whitespace-nowrap';
const TDCELL  = 'border border-gray-200 px-1 py-1 text-sm';
const TDCALC  = 'border border-gray-200 px-3 py-2 text-sm font-mono font-bold text-green-800 text-center bg-green-50/60 whitespace-nowrap';
const INPUT   = 'w-full text-center bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-green-500 rounded px-1 py-0.5';
const LABEL   = 'block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1';
const FIELD   = 'w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-shadow';
const ERR     = 'mt-1 text-xs text-red-500 flex items-center gap-1';

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
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center"
          style={{ backgroundColor: '#D1FAE5' }}
        >
          <svg className="w-9 h-9" style={{ color: COLOR_PRIMARY }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <div className="text-center">
          <h3 className="font-black text-gray-800 text-lg uppercase tracking-wide">
            Evaluación guardada
          </h3>
          <p className="text-sm text-gray-400 mt-1">
            La evaluación física fue registrada correctamente.
          </p>
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

function muestraToDefaults(m: Muestra, ef: EvaluacionFisica | null): Partial<RegistroMuestraForm> {
  const productor = m.productor
    ? `${m.productor.nombre} ${m.productor.apellido ?? ''}`.trim()
    : '';
  return {
    idMuestra:    m.codigo,
    fechaIngreso: m.fecha ?? new Date().toISOString().slice(0, 10),
    productor,
    variedad:     m.variedad ?? '',
    humedad: {
      valor1: ef?.cacaoHumedadPct ?? (m.humedad ? Number(m.humedad) : undefined),
      valor2: undefined,
    },
  };
}

export function RegistroMuestraPage() {
  const [searchParams]  = useSearchParams();
  const navigate        = useNavigate();
  const toast = useToast();
  const muestraId       = searchParams.get('muestraId');

  const [muestra,        setMuestra]        = useState<Muestra | null>(null);
  const [loadingMuestra, setLoadingMuestra] = useState(!!muestraId);
  const [saving,         setSaving]         = useState(false);
  const [showSuccess,    setShowSuccess]    = useState(false);

  const {
    register, control, handleSubmit, reset,
    formState: { errors },
  } = useForm<RegistroMuestraForm>({
    resolver: zodResolver(registroMuestraSchema),
    defaultValues: mockRegistroMuestra,
  });

  
  useEffect(() => {
    if (!muestraId) return;
    setLoadingMuestra(true);
    muestrasService.getDetalle(Number(muestraId))
      .then(({ muestra: m, evaluacionFisica: ef }) => {
        setMuestra(m);
        reset({ ...mockRegistroMuestra, ...muestraToDefaults(m, ef) });
      })
      .catch(() => {})
      .finally(() => setLoadingMuestra(false));
  }, [muestraId]); 

  

  const w = useWatch({ control });

  const p100Avg = avgOf(w.peso100Granos?.valor1, w.peso100Granos?.valor2);
  const humAvg  = avgOf(w.humedad?.valor1,        w.humedad?.valor2);
  const indAvg  = avgOf(w.indiceGrano?.valor1,    w.indiceGrano?.valor2);

  const bfSum = sumOf(w.bienFermentados?.valor1,         w.bienFermentados?.valor2);
  const mfSum = sumOf(w.medianamenteFermentados?.valor1, w.medianamenteFermentados?.valor2);
  const gvSum = sumOf(w.granosVioletas?.valor1,          w.granosVioletas?.valor2);
  const gpSum = sumOf(w.granosPizarrosos?.valor1,        w.granosPizarrosos?.valor2);

  const fermentPct = useCallback(() => {
    const bf = (Number(w.bienFermentados?.valor1  ?? 0) + Number(w.bienFermentados?.valor2  ?? 0)) / 2;
    const mf = (Number(w.medianamenteFermentados?.valor1 ?? 0) + Number(w.medianamenteFermentados?.valor2 ?? 0)) / 2;
    return ((bf + mf) / 50 * 100).toFixed(1);
  }, [w.bienFermentados, w.medianamenteFermentados]);

  const diSum = sumOf(w.danadosPorInsectos?.valor1, w.danadosPorInsectos?.valor2);
  const ggSum = sumOf(w.granosGerminados?.valor1,   w.granosGerminados?.valor2);
  const gmSum = sumOf(w.granosMohosos?.valor1,      w.granosMohosos?.valor2);

  

  const onSubmit = async (_data: RegistroMuestraForm) => {
    setSaving(true);
    try {
      
      await new Promise(r => setTimeout(r, 900));
      setShowSuccess(true);
    } finally {
      setSaving(false);
    }
  };

  
  const regNum = (path: string) => register(path as any, { valueAsNumber: true });

  

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

      {showSuccess && (
        <SuccessModal onVolver={() => navigate('/dashboard/muestras')} />
      )}

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
                Evaluación Física — Cacao
              </h1>
            </div>
          </div>

          {muestra && (
            <div className="shrink-0 text-right">
              <p className="text-xs text-gray-400 font-medium">Muestra</p>
              <p className="font-black text-gray-800 text-sm font-mono">{muestra.codigo}</p>
              {muestra.campana && (
                <p className="text-xs text-gray-400">{muestra.campana.nombre}</p>
              )}
            </div>
          )}
        </div>
      </motion.div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

        <Section title="1. Datos Generales">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className={LABEL}>ID Muestra</label>
              <input {...register('idMuestra')} className={FIELD} placeholder="MU-2026-001" />
              <Err msg={errors.idMuestra?.message} />
            </div>
            <div>
              <label className={LABEL}>Fecha Ingreso</label>
              <input type="date" {...register('fechaIngreso')} className={FIELD} />
              <Err msg={errors.fechaIngreso?.message} />
            </div>
            <div>
              <label className={LABEL}>Productor</label>
              <input {...register('productor')} className={FIELD} placeholder="Nombre completo" />
              <Err msg={errors.productor?.message} />
            </div>
            <div>
              <label className={LABEL}>Distrito</label>
              <input {...register('distrito')} className={FIELD} placeholder="Distrito de origen" />
              <Err msg={errors.distrito?.message} />
            </div>
            <div>
              <label className={LABEL}>Variedad</label>
              <select {...register('variedad')} className={FIELD}>
                <option value="">Seleccionar…</option>
                {VARIEDADES_CACAO.map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className={LABEL}>Fecha Cosecha</label>
              <input type="date" {...register('fechaCosecha')} className={FIELD} />
            </div>
          </div>
        </Section>

        <Section title="2. Humedad e Índice de Grano">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse" style={{ minWidth: 400 }}>
              <thead>
                <tr>
                  <th className={TH} style={{ width: '40%', textAlign: 'left' }}>Concepto</th>
                  <th className={TH}>Valor 1</th>
                  <th className={TH}>Valor 2</th>
                  <th className={TH}>Promedio</th>
                </tr>
              </thead>
              <tbody>
                {([
                  { label: 'Peso en gramos de 100 granos', f1: 'peso100Granos.valor1', f2: 'peso100Granos.valor2', calc: p100Avg, step: '0.01' },
                  { label: 'Humedad %',                    f1: 'humedad.valor1',       f2: 'humedad.valor2',       calc: humAvg,  step: '0.1'  },
                  { label: 'Índice de grano',              f1: 'indiceGrano.valor1',   f2: 'indiceGrano.valor2',   calc: indAvg,  step: '0.01' },
                ] as const).map(({ label, f1, f2, calc, step }) => (
                  <tr key={f1}>
                    <td className={TDLABEL}>{label}</td>
                    <td className={TDCELL}><input type="number" step={step} {...regNum(f1)} className={INPUT} placeholder="—" /></td>
                    <td className={TDCELL}><input type="number" step={step} {...regNum(f2)} className={INPUT} placeholder="—" /></td>
                    <td className={TDCALC}>{calc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section title="3. Evaluación de Fermentación">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse" style={{ minWidth: 400 }}>
              <thead>
                <tr>
                  <th className={TH} style={{ width: '40%', textAlign: 'left' }}>Concepto</th>
                  <th className={TH}>Valor 1</th>
                  <th className={TH}>Valor 2</th>
                  <th className={TH}>Suma</th>
                </tr>
              </thead>
              <tbody>
                {([
                  { label: 'Granos bien fermentados',         f1: 'bienFermentados.valor1',        f2: 'bienFermentados.valor2',        calc: bfSum },
                  { label: 'Granos medianamente fermentados', f1: 'medianamenteFermentados.valor1', f2: 'medianamenteFermentados.valor2', calc: mfSum },
                  { label: 'Granos violetas',                 f1: 'granosVioletas.valor1',          f2: 'granosVioletas.valor2',          calc: gvSum },
                  { label: 'Granos pizarrosos 3%',            f1: 'granosPizarrosos.valor1',        f2: 'granosPizarrosos.valor2',        calc: gpSum },
                ] as const).map(({ label, f1, f2, calc }) => (
                  <tr key={f1}>
                    <td className={TDLABEL}>{label}</td>
                    <td className={TDCELL}><input type="number" step="1" min="0" {...regNum(f1)} className={INPUT} placeholder="0" /></td>
                    <td className={TDCELL}><input type="number" step="1" min="0" {...regNum(f2)} className={INPUT} placeholder="0" /></td>
                    <td className={TDCALC}>{calc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div
            className="mt-4 flex flex-wrap items-center gap-3 p-3 rounded-xl border"
            style={{ backgroundColor: '#F0FDF4', borderColor: '#BBF7D0' }}
          >
            <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: COLOR_SECONDARY }}>
              % Fermentación:
            </span>
            <span className="text-xl font-black font-mono" style={{ color: COLOR_PRIMARY }}>
              {fermentPct()}%
            </span>
            <span className="text-xs text-gray-400 ml-auto hidden sm:inline">
              (bien + medianamente fermentados ÷ 50 granos × 100)
            </span>
          </div>
        </Section>

        <Section title="4. Evaluación de Defectos">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse" style={{ minWidth: 400 }}>
              <thead>
                <tr>
                  <th className={TH} style={{ width: '40%', textAlign: 'left' }}>Concepto</th>
                  <th className={TH}>Valor 1</th>
                  <th className={TH}>Valor 2</th>
                  <th className={TH}>Suma</th>
                </tr>
              </thead>
              <tbody>
                {([
                  { label: 'Granos dañados por insectos 3%', f1: 'danadosPorInsectos.valor1', f2: 'danadosPorInsectos.valor2', calc: diSum },
                  { label: 'Granos germinados 3%',           f1: 'granosGerminados.valor1',   f2: 'granosGerminados.valor2',   calc: ggSum },
                  { label: 'Granos mohosos 3%',              f1: 'granosMohosos.valor1',       f2: 'granosMohosos.valor2',       calc: gmSum },
                ] as const).map(({ label, f1, f2, calc }) => (
                  <tr key={f1}>
                    <td className={TDLABEL}>{label}</td>
                    <td className={TDCELL}><input type="number" step="1" min="0" {...regNum(f1)} className={INPUT} placeholder="0" /></td>
                    <td className={TDCELL}><input type="number" step="1" min="0" {...regNum(f2)} className={INPUT} placeholder="0" /></td>
                    <td className={TDCALC}>{calc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4">
            <label className={LABEL}>Calificación de la Muestra</label>
            <select
              {...register('calificacionMuestra')}
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white w-full sm:w-auto sm:min-w-[180px]"
            >
              <option value="">— Seleccionar —</option>
              <option value="excelente">Excelente</option>
              <option value="buena">Buena</option>
              <option value="regular">Regular</option>
              <option value="defectuosa">Defectuosa</option>
            </select>
          </div>
        </Section>

        <Section title="5. Observaciones">
          <div className="space-y-4">
            <div>
              <label className={LABEL}>Aroma y Apariencia</label>
              <textarea
                {...register('aromaApariencia')}
                rows={3}
                className={`${FIELD} resize-none`}
                placeholder="Descripción del aroma y apariencia general de la muestra…"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={LABEL}>Fecha de Evaluación</label>
                <input type="date" {...register('fechaEvaluacion')} className={FIELD} />
              </div>
              <div>
                <label className={LABEL}>Evaluador</label>
                <input {...register('evaluador')} className={FIELD} placeholder="Nombre del evaluador" />
              </div>
            </div>
          </div>
        </Section>

        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="flex flex-wrap gap-3 justify-end pb-2"
        >
          <button
            type="button"
            onClick={() => reset({ ...mockRegistroMuestra, ...(muestra ? muestraToDefaults(muestra, null) : {}) })}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-300 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <RotateCcw size={15} /> Limpiar
          </button>

          <button
            type="button"
            onClick={() => toast.info('Exportar PDF — próximamente')}
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
