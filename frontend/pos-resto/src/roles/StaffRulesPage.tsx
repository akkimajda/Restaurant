import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

type Role = 'manager' | 'cashier' | 'server';
type Row = { email: string; role: Role };

export default function StaffRulesPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<Role>('server');
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('staff_rules')
      .select('email, role')
      .order('email', { ascending: true });
    if (error) setMsg(error.message);
    else { setRows((data ?? []) as Row[]); setMsg(''); }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const addOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg('');
    const em = email.trim().toLowerCase();
    const { error } = await supabase
      .from('staff_rules')
      .upsert({ email: em, role }); // insert ou update selon l'email
    if (error) setMsg(error.message);
    else { setEmail(''); setRole('server'); load(); }
  };

  const remove = async (em: string) => {
    setMsg('');
    const { error } = await supabase.from('staff_rules').delete().eq('email', em);
    if (error) setMsg(error.message);
    else load();
  };

  return (
    <div style={{ padding: 24, maxWidth: 760, margin: '0 auto' }}>
      <h2>Gestion du personnel</h2>
      <p>Ajoute des emails et attribue leur rôle. Seuls les <b>managers</b> voient/modifient cette liste.</p>

      <form onSubmit={addOrUpdate} style={{ display: 'flex', gap: 8, margin: '12px 0' }}>
        <input
          type="email"
          placeholder="email@votredomaine.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ flex: 1 }}
        />
        <select value={role} onChange={(e) => setRole(e.target.value as Role)}>
          <option value="manager">manager</option>
          <option value="cashier">cashier</option>
          <option value="server">server</option>
        </select>
        <button type="submit">Enregistrer</button>
      </form>

      {msg && <p style={{ color: 'crimson' }}>{msg}</p>}
      {loading ? (
        <p>Chargement…</p>
      ) : (
        <table border={1} cellPadding={8} style={{ width: '100%' }}>
          <thead>
            <tr><th>Email</th><th>Rôle</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.email}>
                <td>{r.email}</td>
                <td>{r.role}</td>
                <td>
                  <button onClick={() => remove(r.email)}>Supprimer</button>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr><td colSpan={3}>Aucun enregistrement</td></tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
