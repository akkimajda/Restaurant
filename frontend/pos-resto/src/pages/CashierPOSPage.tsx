import { Link } from "react-router-dom";

export default function CashierPOSPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="h-14 flex items-center justify-between px-4 border-b bg-white">
        <Link to="/cashier" className="text-sm text-neutral-600 hover:underline">
          ← Retour
        </Link>
        <h1 className="font-semibold">POS - Caisse</h1>
        <div />
      </header>

      <main className="p-4">
        <p className="text-neutral-600">
          Squelette prêt. À l’étape suivante on posera le vrai layout (order line,
          produits, panier, paiement) pour coller au design.
        </p>
      </main>
    </div>
  );
}
