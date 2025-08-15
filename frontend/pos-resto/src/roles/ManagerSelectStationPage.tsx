import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import Numpad from '../components/Numpad';

type Station = {
  id: number;
  is_active: boolean | null;
};

export default function ManagerSelectStationPage() {
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  const [showPad, setShowPad] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [msg, setMsg] = useState<string>('');

  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('pos_stations')
        .select('id, is_active')
        .order('id', { ascending: true });

      if (error) setError(error.message);
      else setStations(data ?? []);
      setLoading(false);
    })();
  }, []);

  const openPad = (id: number) => {
    setSelectedId(id);
    setMsg('');
    setShowPad(true);
  };

  const submitCode = async (code: string) => {
    if (!selectedId) return;
    setMsg('⏳ Vérification…');

    const { data, error } = await supabase.rpc('verify_station_code', {
      p_station_id: selectedId,
      p_code: code,
    });

    if (error) {
      setMsg(`❌ ${error.message}`);
      return;
    }

    if (data === true) {
      localStorage.setItem('current_station_id', String(selectedId));
      setMsg('✅ Code correct. Ouverture de la caisse…');
      setShowPad(false);
      navigate('/cashier');
    } else {
      setMsg('❌ Code invalide');
    }
  };

  if (loading) return <div style={{padding:24}}>Chargement des stations…</div>;
  if (error)   return <div style={{padding:24, color:'crimson'}}>Erreur: {error}</div>;

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{marginBottom:8}}>Select your POS station</h2>
      <p style={{marginTop:0, color:'#666'}}>Clique sur une carte pour entrer le code manager.</p>

      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(220px, 1fr))', gap:16, marginTop:16}}>
        {stations.map(st => (
          <button
            key={st.id}
            onClick={() => openPad(st.id)}
            style={{
              textAlign:'left', padding:16, border:'1px solid #e5e7eb', borderRadius:16,
              background:'#111827', color:'#e5e7eb', cursor:'pointer'
            }}
          >
            <div style={{fontSize:18, fontWeight:700}}>POS {st.id}</div>
            <div style={{marginTop:6, fontSize:13, opacity:.8}}>
              {st.is_active ? '• Ouvert' : '• Fermé'}
            </div>
            <div style={{marginTop:10, fontSize:12, opacity:.6}}>
              Printer {st.is_active ? 'Connected' : 'Offline'}
            </div>
          </button>
        ))}
      </div>

      {showPad && (
        <div style={{
          position:'fixed', inset:0, background:'rgba(0,0,0,.45)',
          display:'grid', placeItems:'center', zIndex:50
        }}>
          <div>
            <Numpad
              length={4}
              title={`POS ${selectedId} • Manager code`}
              onSubmit={submitCode}
              onCancel={() => setShowPad(false)}
            />
            {msg && <div style={{marginTop:8, textAlign:'center'}}>{msg}</div>}
          </div>
        </div>
      )}
    </div>
  );
}
  