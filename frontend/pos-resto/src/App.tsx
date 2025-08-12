import { useEffect, useState } from 'react';
import { supabase } from './lib/supabaseClient';
import './App.css';

type Role = 'manager' | 'cashier' | 'server';

export default function App() {
  const [session, setSession] = useState<any>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(true);

  // Champs du formulaire
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState<string>('');

  // Suivre la session
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
      console.log('Session initiale:', !!data.session);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

    // Charger le rôle depuis la table profiles (avec traces)
  useEffect(() => {
    const loadRole = async () => {
      if (!session?.user) { 
        setRole(null); 
        return; 
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .maybeSingle(); // <- évite l'erreur si 0 ligne

      console.log('profiles result =>', { data, error, userId: session.user.id });

      if (error) {
        // Si RLS bloque ou autre erreur, on l’affiche dans la console
        console.error('loadRole error:', error);
        setRole(null);
        return;
      }

      setRole((data?.role as Role) ?? null);
    };

    loadRole();
  }, [session]);


  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setMsg(error.message);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg('');
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) setMsg(error.message);
    else setMsg("Compte créé. Connecte-toi maintenant.");
  };

  if (loading) return <div style={{ padding: 24 }}>Chargement…</div>;

  // Pas connecté → formulaire simple
  if (!session) {
    return (
      <div style={{ maxWidth: 420, margin: '40px auto' }}>
        <h1>POS Resto — {mode === 'signin' ? 'Connexion' : 'Inscription'}</h1>

        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <button onClick={() => setMode('signin')} disabled={mode === 'signin'}>Se connecter</button>
          <button onClick={() => setMode('signup')} disabled={mode === 'signup'}>Créer un compte</button>
        </div>

        <form onSubmit={mode === 'signin' ? handleSignIn : handleSignUp}>
          <div style={{ display: 'grid', gap: 10 }}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <button type="submit">
              {mode === 'signin' ? 'Se connecter' : 'Créer'}
            </button>
          </div>
        </form>

        {msg && <p style={{ color: 'crimson', marginTop: 8 }}>{msg}</p>}
        <p style={{ fontSize: 12, opacity: 0.7, marginTop: 8 }}>
          Astuce: en local, tu peux désactiver la confirmation d’e-mail dans Supabase (Auth → Providers → Email).
        </p>
      </div>
    );
  }

  // Connecté → mini tableau de bord
    return (
    <div style={{ padding: 24 }}>
      <h2>Bienvenue 👋</h2>
      <p><b>Email :</b> {session.user?.email}</p>
      <p><b>Rôle :</b> {role ?? '…'}</p>

      {role === 'manager' && (
        <p style={{ marginTop: 8 }}>
          <a href="/manager">➡️ Accéder à l’espace Manager</a>
        </p>
      )}
      {role === 'cashier' && (
        <p style={{ marginTop: 8 }}>
          <a href="/cashier">➡️ Accéder à l’espace Caissier</a>
        </p>
      )}
      {role === 'server' && (
        <p style={{ marginTop: 8 }}>
          <a href="/server">➡️ Accéder à l’espace Serveur</a>
        </p>
      )}

      <button onClick={() => supabase.auth.signOut()}>Se déconnecter</button>
    </div>
  );
}
