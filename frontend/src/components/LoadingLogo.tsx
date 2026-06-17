interface LoadingLogoProps {
   
  compact?: boolean;
   
  light?: boolean;
}

export default function LoadingLogo({ compact = false, light = false }: LoadingLogoProps) {
  return (
    <div className={`flex items-center justify-center ${compact ? '' : 'py-20'}`}>
      <img
        src="/logo.png"
        alt="Collective Bean"
        style={{
          width: compact ? '90px' : '140px',
          filter: light ? 'brightness(0) invert(1)' : 'none',
          animation: 'cb-pulse 1.6s ease-in-out infinite',
        }}
      />
      <style>{`
        @keyframes cb-pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.35; }
        }
      `}</style>
    </div>
  );
}
