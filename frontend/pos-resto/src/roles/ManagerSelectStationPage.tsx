// src/roles/ManagerSelectStationPage.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

export default function ManagerSelectStationPage() {
  const [stationId, setStationId] = useState<number>(1);
  const [code, setCode] = useState('');
  const [msg, setMsg] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const tester = async () => {
    setMsg('⏳ Vérification en cours...');
    setLoading(true);

    // Appel RPC -> doit correspondre exactement aux paramètres de la fonction SQL
    const { data, error } = await supabase.rpc('verify_station_code', {
      p_station_id: Number(stationId),
      p_code: code.trim(),
    });

    console.log('[verify_station_code]', { data, error });
    setLoading(false);

    if (error) {
      setMsg('❌ ERREUR: ' + error.message);
      return;
    }

    if (data === true) {
      // on mémorise la station sélectionnée pour la suite
      localStorage.setItem('current_station_id', String(stationId));
      setMsg('✅ Code correct — redirection vers la caisse…');
      navigate('/cashier'); // le manager peut accéder à la caisse
    } else {
      setMsg('❌ Code invalide');
    }
  };

  return (
    <div style={{ padding: 24, maxWidth: 520 }}>
      <h2>Test code d’accès POS</h2>

      <div style={{ marginTop: 16 }}>
        <label>
          Station ID :{' '}
          <input
            type="number"
            min={1}
            value={stationId}
            onChange={(e) => setStationId(Number(e.target.value))}
            style={{ width: 100 }}
          />
        </label>
      </div>

      <div style={{ marginTop: 12 }}>
        <label>
          Code :{' '}
          <input
            type="password"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="ex: 1234"
          />
        </label>
      </div>

      <button
        onClick={tester}
        style={{ marginTop: 16 }}
        disabled={loading || !code.trim()}
      >
        {loading ? 'Vérification…' : 'Tester le code'}
      </button>

      {msg && (
        <p style={{ marginTop: 12, whiteSpace: 'pre-wrap' }}>
          {msg}
        </p>
      )}
    </div>
  );
}
