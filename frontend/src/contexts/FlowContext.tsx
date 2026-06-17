import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

export type StepKey = 'envio_muestra' | 'envio_cotizacion' | 'compromiso_venta' | 'asignacion_lotes' | 'despacho';
export type StepStatus = 'pendiente' | 'en_proceso' | 'completo';

export interface StepState {
  estado: StepStatus;
  porcentaje: number;
  fecha: string;
}

export type FlowState = Record<StepKey, StepState>;

export const FULL_FLOW: StepKey[] = [
  'envio_muestra',
  'envio_cotizacion',
  'compromiso_venta',
  'asignacion_lotes',
  'despacho',
];

export const STEP_LABELS: Record<StepKey, string> = {
  envio_muestra:    'Envío de Muestra',
  envio_cotizacion: 'Envío Cotización',
  compromiso_venta: 'Compromiso de Venta',
  asignacion_lotes: 'Asignación de Lotes',
  despacho:         'Despacho',
};

export const STEP_ROUTES: Record<StepKey, string> = {
  envio_muestra:    '/dashboard/preventa/envio-muestras',
  envio_cotizacion: '/dashboard/preventa/envio-cotizacion',
  compromiso_venta: '/dashboard/alistado/compromiso-venta',
  asignacion_lotes: '/dashboard/alistado/asignacion-lotes',
  despacho:         '/dashboard/alistado/despacho',
};

const INITIAL_FLOW: FlowState = {
  envio_muestra:    { estado: 'completo',   porcentaje: 100, fecha: '05/02/2025' },
  envio_cotizacion: { estado: 'en_proceso', porcentaje: 60,  fecha: '06/02/2025' },
  compromiso_venta: { estado: 'completo',   porcentaje: 100, fecha: '07/02/2025' },
  asignacion_lotes: { estado: 'pendiente',  porcentaje: 0,   fecha: ''           },
  despacho:         { estado: 'en_proceso', porcentaje: 20,  fecha: '08/02/2025' },
};

interface FlowContextValue {
  flow:          FlowState;
  currentStep:   StepKey | null;
  setCurrentStep: (step: StepKey | null) => void;
  setStepStatus: (step: StepKey, estado: StepStatus, porcentaje?: number, fecha?: string) => void;
  isStepEnabled: (step: StepKey) => boolean;
  goToStep:      (step: StepKey) => void;
  saveAndNext:   (step: StepKey) => void;
  cancelToPrev:  (step: StepKey) => void;
}

const FlowContext = createContext<FlowContextValue | null>(null);

export function FlowProvider({ children }: { children: ReactNode }) {
  const [flow,        setFlow]        = useState<FlowState>(INITIAL_FLOW);
  const [currentStep, setCurrentStep] = useState<StepKey | null>(null);
  const navigate = useNavigate();

  const setStepStatus = useCallback((step: StepKey, estado: StepStatus, porcentaje?: number, fecha?: string) => {
    setFlow(prev => ({
      ...prev,
      [step]: {
        estado,
        porcentaje: porcentaje ?? (estado === 'completo' ? 100 : estado === 'en_proceso' ? 50 : 0),
        fecha: fecha ?? (prev[step].fecha || new Date().toLocaleDateString('es-PE')),
      },
    }));
  }, []);

  const isStepEnabled = useCallback((step: StepKey): boolean => {
    const s = flow[step];
    
    return s.estado === 'completo' || s.estado === 'en_proceso';
  }, [flow]);

  const goToStep = useCallback((step: StepKey) => {
    if (!isStepEnabled(step)) return;
    setCurrentStep(step);
    navigate(STEP_ROUTES[step]);
  }, [isStepEnabled, navigate]);

  
  const saveAndNext = useCallback((step: StepKey) => {
    setStepStatus(step, 'completo', 100);
    const idx = FULL_FLOW.indexOf(step);
    if (idx < FULL_FLOW.length - 1) {
      const next = FULL_FLOW[idx + 1];
      
      setFlow(prev => ({
        ...prev,
        [next]: prev[next].estado === 'pendiente'
          ? { estado: 'en_proceso', porcentaje: 10, fecha: '' }
          : prev[next],
      }));
      setCurrentStep(next);
      navigate(STEP_ROUTES[next]);
    }
  }, [setStepStatus, navigate]);

  
  const cancelToPrev = useCallback((step: StepKey) => {
    const idx = FULL_FLOW.indexOf(step);
    if (idx > 0) {
      const prev = FULL_FLOW[idx - 1];
      setCurrentStep(prev);
      navigate(STEP_ROUTES[prev]);
    }
  }, [navigate]);

  return (
    <FlowContext.Provider value={{ flow, currentStep, setCurrentStep, setStepStatus, isStepEnabled, goToStep, saveAndNext, cancelToPrev }}>
      {children}
    </FlowContext.Provider>
  );
}

export function useFlow() {
  const ctx = useContext(FlowContext);
  if (!ctx) throw new Error('useFlow debe usarse dentro de FlowProvider');
  return ctx;
}
