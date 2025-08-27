import { Link } from "react-router-dom";

export default function ManagerHome() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="px-6 py-4 bg-[#214C43] text-white">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-semibold">Dashboard Manager</h1>
          <Link to="/" className="underline">← Retour</Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-6 grid gap-4">
        <p className="text-slate-600">Connexion réussie (rôle : <b>manager</b>).</p>
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="rounded-xl border bg-white p-4">👥 Gérer le personnel</div>
          <div className="rounded-xl border bg-white p-4">🖥️ Sélection POS</div>
          <div className="rounded-xl border bg-white p-4">💳 Aller à la caisse</div>
        </div>
      </main>
    </div>
  );
}
