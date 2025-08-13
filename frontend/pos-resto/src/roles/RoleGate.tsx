// src/roles/RoleGate.tsx
// AVANT
// import { ReactNode, useEffect, useState } from 'react';

// APRÈS
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

type Role = 'manager' | 'cashier' | 'server';
type Allow = Role | Role[];

type Props = {
  allow: Allow;
  children: ReactNode;
};

export default function RoleGate({ allow, children }: Props) {
  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string>('');

  useEffect(() => {
    (async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setRole(null);
          setLoading(false);
          return;
        }
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (error) setErr(error.message);
        setRole((data?.role ?? null) as Role | null);
      } catch (e: any) {
        setErr(e?.message ?? 'Erreur inconnue');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div style={{ padding: 24 }}>Chargement…</div>;
  if (err) return <div style={{ padding: 24, color: 'crimson' }}>{err}</div>;

  const allowed: Role[] = Array.isArray(allow) ? allow : [allow];

  // 1) si pas connecté / pas de rôle
  if (!role) {
    return (
      <div style={{ padding: 24, color: 'crimson' }}>
        Accès refusé. Vous n’êtes pas connecté.
      </div>
    );
  }

  // 2) puis on vérifie l'appartenance, maintenant que 'role' est non-null
  if (!allowed.includes(role)) {
    return (
      <div style={{ padding: 24, color: 'crimson' }}>
        Accès refusé. Rôle requis : <b>{allowed.join(' ou ')}</b> — Votre rôle : {role}.
      </div>
    );
  }

  return <>{children}</>;
}
