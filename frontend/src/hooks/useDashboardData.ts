import { useState, useEffect } from 'react';
import { api } from '@/api/axios';
import type { AcopioResumen, TrillaResumen, VentasResumen } from '@/types/dashboard.types';

interface DashboardData {
  acopio: AcopioResumen | null;
  trilla: TrillaResumen | null;
  ventas: VentasResumen | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useDashboardData(campanaId?: number): DashboardData {
  const [acopio, setAcopio] = useState<AcopioResumen | null>(null);
  const [trilla, setTrilla] = useState<TrillaResumen | null>(null);
  const [ventas, setVentas] = useState<VentasResumen | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    const params = campanaId ? { campanaId } : {};

    Promise.all([
      api.get<AcopioResumen>('/reportes/acopio/resumen', { params }),
      api.get<TrillaResumen>('/reportes/trilla/resumen', { params }),
      api.get<VentasResumen>('/reportes/ventas/resumen', { params }),
    ])
      .then(([a, t, v]) => {
        if (cancelled) return;
        setAcopio(a.data);
        setTrilla(t.data);
        setVentas(v.data);
      })
      .catch(() => {
        if (!cancelled) setError('Error al cargar los datos. Verifica la conexión.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [tick, campanaId]);

  return { acopio, trilla, ventas, loading, error, refetch: () => setTick(t => t + 1) };
}
