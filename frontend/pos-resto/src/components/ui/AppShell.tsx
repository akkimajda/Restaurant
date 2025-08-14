import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon, LogOut } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

export type NavItem = { label: string; to: string; icon?: React.ElementType };

export default function AppShell({
  children,
  email,
  role,
  nav = [],
  title,
  subtitle,
}: {
  children: React.ReactNode;
  email?: string;
  role?: string;
  nav?: NavItem[];
  title?: string;
  subtitle?: string;
}) {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(
    (localStorage.getItem('theme') as 'light' | 'dark') || 'light'
  );
  const location = useLocation();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const signOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      {/* Topbar */}
      <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
              onClick={() => setOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </button>
            <Link to="/" className="flex items-center gap-2 font-semibold">
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900">
                POS
              </span>
              <span>Dashboard</span>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <button
              className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              title="Basculer le thème"
            >
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>

            <div className="hidden text-sm md:block">
              <div className="font-medium">{email || '—'}</div>
              <div className="text-slate-500 dark:text-slate-400">rôle : {role || '—'}</div>
            </div>

            <button
              onClick={signOut}
              className="ml-2 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
              title="Se déconnecter"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:block">Quitter</span>
            </button>
          </div>
        </div>
      </header>

      {/* Layout */}
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-6 md:grid-cols-[240px_1fr]">
        {/* Sidebar */}
        <aside
          className={`${
            open ? 'fixed inset-0 z-50 bg-black/40 md:static md:bg-transparent' : ''
          }`}
          onClick={() => setOpen(false)}
        >
          <div
            className={`${
              open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
            } h-full w-64 max-w-[80%] bg-white p-4 shadow-lg transition md:h-auto md:w-auto md:bg-transparent md:p-0 md:shadow-none dark:bg-slate-900`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between md:hidden">
              <div className="font-semibold">Navigation</div>
              <button
                className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
                onClick={() => setOpen(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="space-y-1 md:sticky md:top-24">
              {nav.map((n) => {
                const active = location.pathname === n.to;
                const Icon = n.icon;
                return (
                  <Link
                    key={n.to}
                    to={n.to}
                    className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm ring-1 transition ${
                      active
                        ? 'bg-slate-900 text-white ring-slate-900 dark:bg-white dark:text-slate-900 dark:ring-white'
                        : 'bg-white ring-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:ring-slate-800 dark:hover:bg-slate-800'
                    }`}
                  >
                    {Icon ? <Icon className="h-4 w-4" /> : null}
                    {n.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Content */}
        <main className="pb-16">
          {(title || subtitle) && (
            <div className="mb-4">
              <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
              {subtitle && <p className="mt-1 text-slate-600 dark:text-slate-400">{subtitle}</p>}
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}
