 

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import { campanasService, Campana } from '@/services/campanas.service';

const STORAGE_KEY = 'collective_bean_campana_activa';

interface CampanaContextValue {
   
  campanas: Campana[];
   
  campanaActiva: Campana | null;
  setCampanaActiva: (c: Campana | null) => void;
  isLoading: boolean;
   
  refresh: () => Promise<void>;
}

const CampanaContext = createContext<CampanaContextValue | null>(null);

export function CampanaProvider({ children }: { children: ReactNode }) {
  const [campanas, setCampanas]             = useState<Campana[]>([]);
  const [campanaActiva, setCampanaActiva_]  = useState<Campana | null>(null);
  const [isLoading, setIsLoading]           = useState(true);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await campanasService.getPage(1, 100);
      const list = result.data;
      setCampanas(list);

      
      const savedId = localStorage.getItem(STORAGE_KEY);
      if (savedId) {
        const found = list.find((c) => c.id === Number(savedId));
        setCampanaActiva_(found ?? null);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const setCampanaActiva = useCallback((c: Campana | null) => {
    setCampanaActiva_(c);
    if (c) localStorage.setItem(STORAGE_KEY, String(c.id));
    else   localStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <CampanaContext.Provider value={{ campanas, campanaActiva, setCampanaActiva, isLoading, refresh }}>
      {children}
    </CampanaContext.Provider>
  );
}

export function useCampana(): CampanaContextValue {
  const ctx = useContext(CampanaContext);
  if (!ctx) throw new Error('useCampana debe usarse dentro de <CampanaProvider>');
  return ctx;
}
