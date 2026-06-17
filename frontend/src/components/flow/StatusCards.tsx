import { CheckCheck, Clock, Circle } from 'lucide-react';
import { useFlow, StepKey, STEP_LABELS, StepStatus } from '@/contexts/FlowContext';

const CP = '#445D46';

interface StatusCardsProps {
  steps:        StepKey[];
  currentStep:  StepKey;
  onStepClick?: (step: StepKey) => void; 
}

interface CardVisual {
  bg:        string;
  text:      string;
  trackBg:   string;
}

function getVisual(status: StepStatus, isActive: boolean): CardVisual {
  if (isActive) return { bg: CP,        text: '#ffffff', trackBg: 'rgba(255,255,255,0.25)' };
  if (status === 'completo')   return { bg: '#D1FAE5', text: '#065F46', trackBg: 'rgba(0,0,0,0.08)' };
  if (status === 'en_proceso') return { bg: '#FEF3C7', text: '#92400E', trackBg: 'rgba(0,0,0,0.08)' };
  return { bg: '#F3F4F6', text: '#9CA3AF', trackBg: 'rgba(0,0,0,0.06)' };
}

const STATUS_ICON: Record<StepStatus, typeof CheckCheck> = {
  completo:   CheckCheck,
  en_proceso: Clock,
  pendiente:  Circle,
};

export function StatusCards({ steps, currentStep, onStepClick }: StatusCardsProps) {
  const { flow, goToStep, isStepEnabled } = useFlow();

  return (
    <div className="flex flex-wrap gap-4 pt-2 pb-1">
      {steps.map(step => {
        const state    = flow[step];
        const isActive = step === currentStep;
        const enabled  = isStepEnabled(step);
        const visual   = getVisual(state.estado, isActive);
        const Icon     = STATUS_ICON[state.estado];

        return (
          <div key={step} className="flex flex-col items-center">
            
            <div
              style={{
                width: 0, height: 0,
                borderLeft:  '10px solid transparent',
                borderRight: '10px solid transparent',
                borderBottom: `10px solid ${visual.bg}`,
              }}
            />
            <div
              onClick={() => {
                if (!enabled || isActive) return;
                if (onStepClick) onStepClick(step);
                else goToStep(step);
              }}
              className={[
                'rounded-xl px-5 py-4 min-w-[155px] transition-all duration-200 select-none',
                enabled && !isActive ? 'cursor-pointer hover:opacity-90 hover:-translate-y-0.5' : '',
                !enabled            ? 'cursor-not-allowed opacity-50'                           : '',
                isActive            ? 'shadow-lg'                                               : 'shadow-sm',
              ].join(' ')}
              style={{ backgroundColor: visual.bg }}
            >
              <div className="flex items-center gap-2 mb-1">
                <Icon size={11} style={{ color: visual.text }} />
                <p className="text-[0.6rem] font-black uppercase tracking-wider leading-tight" style={{ color: visual.text }}>
                  {STEP_LABELS[step]}
                </p>
              </div>
              <p className="text-xs font-semibold" style={{ color: visual.text }}>{state.fecha || '—'}</p>
              <p className="text-[0.6rem] mt-0.5 font-medium capitalize" style={{ color: visual.text, opacity: 0.75 }}>
                {state.estado.replace('_', ' ')}
              </p>
              <div className="mt-2 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: visual.trackBg }}>
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${state.porcentaje}%`, backgroundColor: visual.text, opacity: 0.7 }}
                />
              </div>
              <p className="text-[0.7rem] font-black mt-1" style={{ color: visual.text }}>{state.porcentaje}%</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
