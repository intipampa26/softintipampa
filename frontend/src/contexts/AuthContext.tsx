 

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import { authService } from '@/services/auth.service';
import { storageService, type AuthUser } from '@/services/storage.service';

interface LoginCredentials {
  username: string;
  password: string;
}

 
export type LoginError =
  | 'INVALID_CREDENTIALS'
  | 'OFFLINE_NO_PRIOR_SESSION'
  | 'NETWORK_ERROR'
  | 'UNKNOWN';

export class AuthLoginError extends Error {
  constructor(public readonly reason: LoginError, message: string) {
    super(message);
    this.name = 'AuthLoginError';
  }
}

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
   
  isInitializing: boolean;
   
  isOfflineSession: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]                     = useState<AuthUser | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isOfflineSession, setIsOfflineSession] = useState(false);

  
  useEffect(() => {
    const session = storageService.getSession();
    if (session) {
      setUser(session.user);
      setIsOfflineSession(session.isOfflineSession);
    }
    setIsInitializing(false);
  }, []);

  
  useEffect(() => {
    const handleForcedLogout = () => logout();
    window.addEventListener('auth:logout', handleForcedLogout);
    return () => window.removeEventListener('auth:logout', handleForcedLogout);
  }, []);

  
  const login = useCallback(async (credentials: LoginCredentials): Promise<void> => {
    const online = navigator.onLine;

    
    if (!online) {
      if (storageService.hasOfflineAccess()) {
        
        storageService.activateOfflineSession();
        const session = storageService.getSession()!;
        setUser(session.user);
        setIsOfflineSession(true);
        return;
      }
      
      throw new AuthLoginError(
        'OFFLINE_NO_PRIOR_SESSION',
        'Necesitas conexión a internet para iniciar sesión por primera vez.',
      );
    }

    
    try {
      const data = await authService.login(credentials);
      storageService.saveOnlineSession(data.access_token, data.user);
      setUser(data.user);
      setIsOfflineSession(false);
    } catch (err: unknown) {
      
      const status = (err as { response?: { status?: number } }).response?.status;
      if (status === 401) {
        throw new AuthLoginError('INVALID_CREDENTIALS', 'Usuario o contraseña incorrectos.');
      }
      if (!(err as { response?: unknown }).response) {
        throw new AuthLoginError('NETWORK_ERROR', 'No se pudo conectar al servidor.');
      }
      throw new AuthLoginError('UNKNOWN', 'Error inesperado. Intenta nuevamente.');
    }
  }, []);

  
  const logout = useCallback(() => {
    storageService.clearSession();
    setUser(null);
    setIsOfflineSession(false);
    
    import('@/services/sync.service').then(({ syncService }) => syncService.clearAll()).catch(() => {});
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isInitializing,
        isOfflineSession,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return ctx;
}
