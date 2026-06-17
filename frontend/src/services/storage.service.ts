 

const SESSION_KEY = 'collective_bean:session';

export interface AuthUser {
  id: number;
  username: string;
  role: string;
}

export interface StoredSession {
   
  accessToken: string;
   
  user: AuthUser;
   
  lastLoginAt: string;
   
  offlineAccess: boolean;
   
  isOfflineSession: boolean;
}

export const storageService = {
  getSession(): StoredSession | null {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (!raw) return null;
      return JSON.parse(raw) as StoredSession;
    } catch {
      return null;
    }
  },

  saveOnlineSession(accessToken: string, user: AuthUser): void {
    const session: StoredSession = {
      accessToken,
      user,
      lastLoginAt: new Date().toISOString(),
      offlineAccess: true,      
      isOfflineSession: false,
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  },

  activateOfflineSession(): void {
    const session = this.getSession();
    if (!session) return;
    localStorage.setItem(
      SESSION_KEY,
      JSON.stringify({ ...session, isOfflineSession: true }),
    );
  },

  clearSession(): void {
    localStorage.removeItem(SESSION_KEY);
    
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  },

  hasOfflineAccess(): boolean {
    return this.getSession()?.offlineAccess === true;
  },

  getAccessToken(): string | null {
    return this.getSession()?.accessToken ?? null;
  },
};
