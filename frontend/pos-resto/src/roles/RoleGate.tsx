import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

type Role = 'manager' | 'cashier' | 'server';
type Props = { allow: Role; children: React.ReactNode };

export default function RoleGate({ allow, children }: Props) {
  const [ok, setOk] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setOk(false); return; }

      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle();

      if (error) { console.error(error); setOk(false); return; }
      setOk(data?.role === allow);
    })();
  }, [allow]);

  if (ok === null) return <div style={{ padding: 24 }}>Vérification des droits…</div>;
  if (!ok) return <div style={{ padding: 24 }}>⛔ Accès refusé — rôle requis : {allow}</div>;
  return <>{children}</>;
}
