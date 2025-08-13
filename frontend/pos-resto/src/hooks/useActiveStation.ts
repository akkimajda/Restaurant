import { useEffect, useState } from 'react';

export default function useActiveStation() {
  const [stationId, setStationId] = useState<number | null>(null);

  useEffect(() => {
    const v = localStorage.getItem('current_station_id');
    setStationId(v ? Number(v) : null);
  }, []);

  return { stationId, setStationId };
}
