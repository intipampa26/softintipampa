import { useState } from 'react';
import { ClipboardList, FileDown, RotateCcw, Save } from 'lucide-react';
import LoadingLogo from '@/components/LoadingLogo';
import { Muestra } from '@/services/muestras.service';
import { EvaluacionFisicaContent } from '@/components/EvaluacionFisicaContent';

const CP = '#1A2B23';
const CS = '#283F34';

interface Props {
  muestra:    Muestra;
  onClose:    () => void;
  onGuardado: () => void;
}

export function EvaluacionFisicaModal({ muestra, onClose, onGuardado }: Props) {
  const [loading, setLoading] = useState(false);
  const [saving,  setSaving]  = useState(false);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative bg-gray-50 rounded-none sm:rounded-2xl shadow-2xl w-full sm:max-w-4xl flex flex-col"
        style={{ height: '100dvh', maxHeight: '100dvh' }}
      >
        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-gray-200 shrink-0 bg-white sm:rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded-lg" style={{ backgroundColor: CP }}>
              <ClipboardList size={16} className="text-white" />
            </div>
            <div>
              <p className="text-[0.6rem] font-semibold uppercase tracking-widest" style={{ color: CS }}>
                Evaluación Física — Café Verde
              </p>
              <p className="font-black text-gray-800 text-sm font-mono leading-tight">{muestra.codigo}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {(loading || saving) && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-2 sm:rounded-2xl"
            style={{ backgroundColor: 'rgba(255,255,255,0.93)', backdropFilter: 'blur(2px)' }}>
            <LoadingLogo compact />
            <p className="text-sm font-semibold text-gray-600">{loading ? 'Cargando…' : 'Guardando…'}</p>
          </div>
        )}

        <div className="overflow-y-auto flex-1 px-4 py-4">
          <EvaluacionFisicaContent
            muestra={muestra}
            formId="fisica-standalone-form"
            onSaved={() => { onGuardado(); onClose(); }}
            onSavingChange={setSaving}
            onLoadingChange={setLoading}
          />
        </div>

        <div className="px-5 py-4 border-t border-gray-100 bg-white shrink-0 sm:rounded-b-2xl flex flex-wrap gap-3 justify-between items-center">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => alert('Exportar PDF — próximamente')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl border text-xs font-semibold transition-colors"
              style={{ borderColor: '#6EE7B7', backgroundColor: '#F0FDF4', color: CS }}
            >
              <FileDown size={13} /> PDF
            </button>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={onClose}
              className="px-5 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
              Cancelar
            </button>
            <button
              type="submit"
              form="fisica-standalone-form"
              disabled={saving || loading}
              className="flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: CP }}
            >
              <Save size={14} /> Guardar evaluación
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
