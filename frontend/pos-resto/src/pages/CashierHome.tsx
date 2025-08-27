import { Link } from "react-router-dom";

export default function CashierHome() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="px-6 py-4 bg-[#214C43] text-white">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-semibold">Espace Caissier</h1>
          <Link to="/" className="underline">← Retour</Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-6 grid gap-4">
        <p className="text-slate-600">Connexion réussie (rôle : <b>cashier</b>).</p>
        <div className="rounded-xl border bg-white p-4">🧾 Panier / Encaissement</div>
      </main>
    </div>
  );
}
