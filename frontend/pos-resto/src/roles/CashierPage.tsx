import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function CashierPage() {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<string | null>(null);
  const [allowed, setAllowed] = useState<boolean>(false);
  const [checking, setChecking] = useState(true);
  const [msg, setMsg] = useState<string>('');

  const stationId = Number(localStorage.getItem('current_station_id') ?? 0);

  useEffect(() => {
    (async () => {
      setChecking(true);
      setMsg('');

      // 1) user + email
      const { data: { user } = {} } = await supabase.auth.getUser();
      if (!user) {
        setMsg('Non connecté.');
        setAllowed(false);
        setChecking(false);
        return;
      }
      setEmail(user.email ?? '');

      // 2) rôle
      const { data: prof } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle();

      const r = prof?.role ?? null;
      setRole(r);

      // Manager = accès total
      if (r === 'manager') {
        setAllowed(true);
        setChecking(false);
        return;
      }

      if (!stationId) {
        setMsg('Aucune station courante (code non validé).');
        setAllowed(false);
        setChecking(false);
        return;
      }

      // 3) Vérifier l’affectation pour cette station
      const { data: assign, error } = await supabase
        .from('staff_assignments')
        .select('id')
        .eq('user_id', user.id)
        .eq('station_id', stationId)
        .maybeSingle();

      if (error) setMsg(`Erreur: ${error.message}`);

      setAllowed(!!assign);
      if (!assign) setMsg('Accès refusé : vous n’êtes pas affecté à cette station.');
      setChecking(false);
    })();
  }, [stationId]);

  if (checking) {
    return <div style={{ padding: 24 }}>⏳ Vérification des droits…</div>;
  }

  if (!allowed) {
    return (
      <div style={{ padding: 24 }}>
        <h2>💳 Espace Caissier</h2>
        <p>Station courante : <b>{stationId || '—'}</b></p>
        <p>Connecté comme : <b>{email || '—'}</b> {role ? `(rôle: ${role})` : ''}</p>
        <hr />
        <p style={{ color: 'crimson' }}>{msg || 'Accès refusé.'}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <h2>💳 Espace Caissier</h2>
      <p>Station courante : <b>{stationId || '—'}</b></p>
      <p>Connecté comme : <b>{email || '—'}</b> {role ? `(rôle: ${role})` : ''}</p>

      <hr />
      <p>👉 Ici on mettra l’UI de caisse (panier, paiement, etc.).</p>
    </div>
  );
}
