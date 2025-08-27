import { Link } from "react-router-dom";
import React from "react";

/** Icônes inline pour éviter d’installer des libs (et les soucis d’antivirus) */
const UserIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" {...props}>
    <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8" />
    <path d="M4 20c1.8-3.5 5-5 8-5s6.2 1.5 8 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);
const CoffeeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" {...props}>
    <path d="M4 10h10v3a5 5 0 0 1-5 5h0a5 5 0 0 1-5-5v-3z" stroke="currentColor" strokeWidth="1.8"/>
    <path d="M14 10h3a3 3 0 0 1 0 6h-1" stroke="currentColor" strokeWidth="1.8"/>
    <path d="M7 3c0 1 .7 1.5.7 2.3S7 6 7 7M10 3c0 1 .7 1.5.7 2.3S10 6 10 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);
const CardIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" {...props}>
    <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.8"/>
    <path d="M3 10h18" stroke="currentColor" strokeWidth="1.8"/>
    <rect x="6" y="13" width="5" height="2" fill="currentColor" />
  </svg>
);

function RoleCard({
  to, title, desc, Icon
}: {
  to: string; title: string; desc: string; Icon: React.FC<React.SVGProps<SVGSVGElement>>
}) {
  return (
    <Link
      to={to}
      className="group rounded-2xl bg-white p-6 shadow-sm hover:shadow-md transition flex flex-col"
      style={{ textDecoration: 'none', color: 'inherit' }}
    >
      <div className="h-14 w-14 rounded-full bg-[#214C43] text-white grid place-items-center">
        <Icon className="h-7 w-7" />
      </div>
      <div className="mt-4 text-xl font-semibold text-gray-900"> {title} </div>
      <div className="mt-1 text-gray-500">{desc}</div>
      <div className="mt-6">
        <span className="inline-flex items-center gap-2 rounded-full bg-[#2F6A5D] text-white px-4 py-2 group-hover:translate-x-0.5 transition">
          Continue →
        </span>
      </div>
    </Link>
  );
}

export default function RoleSelectPage() {
  return (
    <div className="min-h-screen bg-[#214C43] text-white flex flex-col items-center">
      <header className="mt-12 flex flex-col items-center gap-4">
        <div className="h-14 w-14 rounded-2xl bg-white/10 grid place-items-center">
          {/* Remplace par un logo si tu veux */}
          <span className="text-2xl">ψq</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold">Welcome to POS System</h1>
        <p className="text-white/80">Select your role to continue</p>
      </header>

      <main className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-6 mt-10 px-6 pb-16">
        <RoleCard
          to="/login/manager"
          title="Manager"
          desc="Access to all features and reports"
          Icon={UserIcon}
        />
        <RoleCard
          to="/login/server"
          title="Server"
          desc="Take orders and manage tables"
          Icon={CoffeeIcon}
        />
        <RoleCard
          to="/login/cashier"
          title="Cashier"
          desc="Process payments and manage orders"
          Icon={CardIcon}
        />
      </main>
    </div>
  );
}
