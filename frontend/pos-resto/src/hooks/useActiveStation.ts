// src/hooks/useActiveStation.ts
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export const ACTIVE_STATION_KEY = 'active_station_id';

export function getActiveStationId(): number | null {
  const s = localStorage.getItem(ACTIVE_STATION_KEY);
  return s ? Number(s) : null;
}
export function setActiveStationId(id: number) {
  localStorage.setItem(ACTIVE_STATION_KEY, String(id));
}
export function clearActiveStation() {
  localStorage.removeItem(ACTIVE_STATION_KEY);
}

export function useActiveStation() {
  const [station, setStation] = useState<{ id: number; name: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const id = getActiveStationId();
    if (!id) { setLoading(false); return; }
    supabase.from('pos_stations').select('id,name').eq('id', id).single()
      .then(({ data, error }) => {
        if (error) setError(error.message);
        setStation(data ?? null);
        setLoading(false);
      });
  }, []);

  return { station, loading, error };
}
