import LoadingLogo from '@/components/LoadingLogo';

interface Props {
  show: boolean;
  message?: string;
  className?: string;
}

export function ModalLoadingOverlay({ show, message = 'Cargando…', className = 'rounded-t-3xl sm:rounded-3xl' }: Props) {
  if (!show) return null;
  return (
    <div
      className={`absolute inset-0 z-20 flex flex-col items-center justify-center ${className}`}
      style={{ backgroundColor: 'rgba(255,255,255,0.93)', backdropFilter: 'blur(2px)' }}
      onClick={e => e.stopPropagation()}
    >
      <LoadingLogo compact />
      <p className="text-sm font-semibold text-gray-600 mt-3">{message}</p>
    </div>
  );
}
