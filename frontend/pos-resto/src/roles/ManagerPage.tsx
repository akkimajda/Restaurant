import { Users, Monitor, LayoutDashboard } from 'lucide-react';
import AppShell from '../components/ui/AppShell';
import type { NavItem } from '../components/ui/AppShell';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function ManagerPage() {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('manager');

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setEmail(user.email ?? '');
    })();
  }, []);

  const nav: NavItem[] = [
    { label: 'Espace Manager', to: '/manager', icon: LayoutDashboard },
    { label: 'Personnel', to: '/manager/staff', icon: Users },
    { label: 'Sélection POS', to: '/manager/select-station', icon: Monitor },
  ];

  const Card = ({
    to,
    title,
    desc,
    icon: Icon,
    className = '',
  }: {
    to: string;
    title: string;
    desc: string;
    icon: any;
    className?: string;
  }) => (
    <Link
      to={to}
      className={`group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 ${className}`}
    >
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <div className="text-base font-semibold">{title}</div>
          <div className="text-sm text-slate-600 dark:text-slate-400">{desc}</div>
        </div>
      </div>
    </Link>
  );

  return (
    <AppShell
      email={email}
      role={role}
      nav={nav}
      title="Espace Manager"
      subtitle="Gère le personnel, les stations POS et accède à la caisse."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card
          to="/manager/staff"
          title="Gérer le personnel"
          desc="Ajoute des emails et assigne les rôles."
          icon={Users}
        />
        <Card
          to="/manager/select-station"
          title="Accéder à une station POS"
          desc="Saisis le code manager pour activer la station."
          icon={Monitor}
        />
        <Card
          to="/cashier"
          title="Aller à la caisse"
          desc="Les managers peuvent aussi encaisser."
          icon={LayoutDashboard}
        />
      </div>
    </AppShell>
  );
}
