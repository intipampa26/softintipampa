import { useState, useEffect, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, AuthLoginError } from '@/contexts/AuthContext';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { storageService } from '@/services/storage.service';
import LoadingLogo from '@/components/LoadingLogo';

 
function LoadingModal() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative z-10 flex flex-col items-center gap-6 rounded-2xl px-12 py-10 shadow-2xl"
        style={{ backgroundColor: '#1A2B23', border: '1px solid rgba(255,255,255,0.08)' }}
      >
        <LoadingLogo light compact />
        <div className="text-center">
          <p className="text-white font-semibold text-base tracking-wide">Iniciando sesión</p>
          <p className="text-gray-400 text-sm mt-1">Verificando credenciales...</p>
        </div>
        <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-brand-400 rounded-full" style={{ animation: 'progress 4s linear forwards' }} />
        </div>
      </div>
      <style>{`@keyframes progress { from { width: 0% } to { width: 100% } }`}</style>
    </div>
  );
}

 
function OfflineAccessModal() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative z-10 flex flex-col items-center gap-5 rounded-2xl px-12 py-10 shadow-2xl"
        style={{ backgroundColor: '#1A2B23', border: '1px solid rgba(255,255,255,0.08)' }}
      >
        <div className="w-14 h-14 rounded-full flex items-center justify-center"
          style={{ backgroundColor: 'rgba(250,204,21,0.15)', border: '1px solid rgba(250,204,21,0.3)' }}>
          <svg className="w-7 h-7 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.14 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
          </svg>
        </div>
        <div className="text-center">
          <p className="text-yellow-300 font-semibold text-sm uppercase tracking-widest mb-1">Modo Offline</p>
          <p className="text-white font-semibold text-base">Accediendo con sesión previa</p>
          <p className="text-gray-400 text-sm mt-1">Sin conexión a internet detectada</p>
        </div>
        <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-yellow-400 rounded-full" style={{ animation: 'progress 2s linear forwards' }} />
        </div>
      </div>
      <style>{`@keyframes progress { from { width: 0% } to { width: 100% } }`}</style>
    </div>
  );
}

 
function NoSessionOfflineBanner() {
  return (
    <div className="flex flex-col items-center gap-5 py-4 animate-fade-in">
      <div className="w-16 h-16 rounded-full flex items-center justify-center"
        style={{ backgroundColor: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)' }}>
        <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M18.364 5.636a9 9 0 010 12.728M15.536 8.464a5 5 0 010 7.072M12 12h.01M8.464 15.536a5 5 0 010-7.072M5.636 18.364a9 9 0 010-12.728" />
        </svg>
      </div>
      <div className="text-center">
        <p className="text-white font-semibold text-base leading-snug">Sin conexión a internet</p>
        <p className="text-gray-400 text-sm mt-2 leading-relaxed max-w-xs">
          Necesitas conectarte a internet para iniciar sesión por primera vez en este dispositivo.
        </p>
      </div>
      <div
        className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-medium"
        style={{ backgroundColor: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)' }}
      >
        <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse shrink-0" />
        <span className="text-red-300 uppercase tracking-wider">Dispositivo sin sesión previa</span>
      </div>
    </div>
  );
}

export function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const { isOnline, isOffline }    = useNetworkStatus();
  const navigate = useNavigate();

  const [username, setUsername]         = useState('');
  const [password, setPassword]         = useState('');
  const [error, setError]               = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [modalState, setModalState]     = useState<'none' | 'loading' | 'offline-access'>('none');

  
  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard', { replace: true });
  }, [isAuthenticated, navigate]);

  
  useEffect(() => {
    if (isOffline && storageService.hasOfflineAccess() && modalState === 'none') {
      setModalState('offline-access');
      setTimeout(() => navigate('/dashboard', { replace: true }), 2200);
    }
  }, [isOffline, navigate, modalState]);

  const showOfflineNoSession = isOffline && !storageService.hasOfflineAccess();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setModalState('loading');

    const [loginResult] = await Promise.allSettled([
      login({ username: username.trim(), password }),
      new Promise((resolve) => setTimeout(resolve, 4000)),
    ]);

    setModalState('none');

    if (loginResult.status === 'fulfilled') {
      navigate('/dashboard', { replace: true });
    } else {
      const err = loginResult.reason;
      if (err instanceof AuthLoginError) {
        setError(err.message);
      } else {
        setError('Error inesperado. Intenta nuevamente.');
      }
    }
  };

  return (
    <div className="min-h-screen flex">

      {modalState === 'loading'         && <LoadingModal />}
      {modalState === 'offline-access'  && <OfflineAccessModal />}

      <div
        className="flex flex-col justify-center px-6 sm:px-14 lg:px-20 w-full lg:w-[46%] shrink-0"
        style={{ backgroundColor: '#1A2B23' }}
      >
        <div className="w-full max-w-[360px] mx-auto">

          <div className="mb-14">
            <img
              src="/logo.png"
              alt="Collective Bean"
              className="w-full max-w-[260px] sm:max-w-[300px]"
              style={{ filter: 'brightness(0) invert(1)' }}
            />
            <p className="text-brand-300 text-sm font-light tracking-wide mt-4">
              Sistema de Gestión Agrícola
            </p>
          </div>

          {showOfflineNoSession ? (
            <NoSessionOfflineBanner />
          ) : (

           
          <form onSubmit={handleSubmit} noValidate className="space-y-5">

            {isOffline && storageService.hasOfflineAccess() && (
              <div className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-xs"
                style={{ backgroundColor: 'rgba(250,204,21,0.1)', border: '1px solid rgba(250,204,21,0.25)' }}>
                <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse shrink-0" />
                <span className="text-yellow-300">Sin internet — se usará sesión previa</span>
              </div>
            )}

            <div>
              <label htmlFor="username" className="block text-xs font-semibold text-brand-200 uppercase tracking-wider mb-2">
                Usuario
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </span>
                <input
                  id="username"
                  type="text"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => { setUsername(e.target.value); setError(''); }}
                  placeholder="Ingresa tu usuario"
                  disabled={modalState !== 'none'}
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-brand-200 uppercase tracking-wider mb-2">
                Contraseña
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </span>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  placeholder="Ingresa tu contraseña"
                  disabled={modalState !== 'none'}
                  required
                  className="w-full pl-10 pr-11 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-white transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div role="alert" className="flex items-center gap-2 bg-red-500/20 border border-red-400/40 rounded-lg px-4 py-3 animate-fade-in">
                <svg className="w-4 h-4 text-red-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={modalState !== 'none' || !username || !password}
              className="w-full py-3 px-6 mt-2 rounded-lg font-semibold text-forest-dark bg-brand-400 hover:bg-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-300 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 active:scale-[0.98]"
            >
              Ingresar
            </button>

          </form>
          )}

          <p className="mt-10 text-xs text-gray-600 text-center">
            © {new Date().getFullYear()} Collective Bean · v1.0.0
          </p>
        </div>
      </div>

      <div
        className="hidden lg:block flex-1"
        style={{
          backgroundImage: "url('/imagenLogin.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundColor: '#2d5a27',
        }}
      />
    </div>
  );
}
