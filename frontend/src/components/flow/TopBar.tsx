import { ReactNode } from 'react';

const CP = '#445D46';
const TX = '#2C2C2C';

interface TopBarProps {
  icon:       ReactNode;
  titulo:     string;
  subtitulo?: string;
  onGuardar:  () => void;
  onCancelar: () => void;
}

export function TopBar({ icon, titulo, subtitulo, onGuardar, onCancelar }: TopBarProps) {
  return (
    <div
      className="flex items-center justify-between px-5 py-4 border-b shrink-0 bg-white"
      style={{ borderColor: 'rgba(0,0,0,0.06)' }}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: CP }}>
          {icon}
        </div>
        <div className="min-w-0">
          <p className="font-black text-sm uppercase tracking-wide" style={{ color: TX }}>{titulo}</p>
          {subtitulo && <p className="text-[0.62rem] text-gray-400 truncate">{subtitulo}</p>}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={onGuardar}
          className="text-[0.65rem] font-bold px-4 py-2 rounded-xl transition-colors hover:bg-green-400"
          style={{ backgroundColor: '#86efac', color: '#14532d' }}
        >
          GUARDAR
        </button>
        <button
          onClick={onCancelar}
          className="text-[0.65rem] font-bold px-4 py-2 rounded-xl text-white bg-pink-500 hover:bg-pink-600 transition-colors"
        >
          CANCELAR
        </button>
      </div>
    </div>
  );
}
