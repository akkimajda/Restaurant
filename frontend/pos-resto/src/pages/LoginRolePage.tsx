import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

type Role = "manager" | "cashier" | "server";

export default function LoginRolePage() {
  const { role = "cashier" as Role } = useParams();
  const navigate = useNavigate();

  const [tab, setTab] = useState<"pin" | "qr">("pin");
  const [pin, setPin] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const keys = ["1","2","3","4","5","6","7","8","9","C","0","⌫"];

  const press = (k: string) => {
    setErr("");
    if (k === "C") setPin("");
    else if (k === "⌫") setPin((p) => p.slice(0, -1));
    else if (/\d/.test(k) && pin.length < 6) setPin((p) => p + k);
  };

  const submitPin = async () => {
  setErr("");
  if (pin.length < 4) { setErr("PIN trop court"); return; }
  setLoading(true);
  try {
    const { data, error } = await supabase.rpc("verify_staff_pin", {
      p_role: role,
      p_pin: pin,
    });

    if (error) { setErr(error.message); return; }
    if (!data || data.length === 0) { setErr("Code invalide pour ce rôle."); return; }

    // ✅ Mémoriser le rôle en session
    sessionStorage.setItem('pos_role', role!);

    // Redirection selon le rôle
    if (role === "manager") navigate("/manager");
    else if (role === "cashier") navigate("/cashier");
    else navigate("/server");
  } finally {
    setLoading(false);
  }
};

  const submitQR = () => {
    // On branchera l’auth QR ensuite
    alert(`Demo QR auth pour ${role}`);
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-[#214C43]">
      {/* Colonne image (optionnelle) */}
      <div className="hidden md:block bg-[url('/hero.jpg')] bg-cover bg-center relative">
        <div className="absolute inset-0 bg-[#214C43]/60" />
      </div>

      {/* Carte Login */}
      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-2xl shadow p-6">
          <Link to="/" className="text-gray-500 text-sm">← Back to Role Selection</Link>

          <div className="mt-4 text-center">
            <div className="mx-auto h-14 w-14 rounded-2xl bg-[#214C43]/10 grid place-items-center">
              <span className="font-semibold">ψq</span>
            </div>
            <h1 className="mt-4 text-2xl font-semibold">Welcome to POS System</h1>
            <p className="text-gray-500">Let's make today a great service day</p>
            <div className="mt-2 font-medium capitalize">{role} Login</div>
          </div>

          {/* Onglets */}
          <div className="mt-4 grid grid-cols-2 bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setTab("pin")}
              className={`py-2 rounded-lg ${tab === "pin" ? "bg-white shadow" : ""}`}
            >
              PIN Code
            </button>
            <button
              onClick={() => setTab("qr")}
              className={`py-2 rounded-lg ${tab === "qr" ? "bg-white shadow" : ""}`}
            >
              QR Code
            </button>
          </div>

          {/* Contenu PIN */}
          {tab === "pin" && (
            <div className="mt-6">
              <div className="flex justify-center gap-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <span
                    key={i}
                    className={`h-3 w-3 rounded-full ${i < pin.length ? "bg-gray-900" : "bg-gray-300"}`}
                  />
                ))}
              </div>

              <div className="mt-4 grid grid-cols-3 gap-3">
                {keys.map((k) => (
                  <button
                    key={k}
                    onClick={() => press(k)}
                    className="h-14 rounded-xl bg-gray-100 hover:bg-gray-200 text-lg font-semibold"
                  >
                    {k}
                  </button>
                ))}
              </div>

              <button
                onClick={submitPin}
                disabled={loading || pin.length < 4}
                className="mt-5 w-full rounded-xl bg-[#214C43] text-white py-3 disabled:opacity-60"
              >
                {loading ? "Checking..." : "Login"}
              </button>
              {err && <p className="mt-3 text-center text-red-600">{err}</p>}
            </div>
          )}

          {/* Contenu QR */}
          {tab === "qr" && (
            <div className="mt-6">
              <div className="h-52 rounded-xl border grid place-items-center text-gray-500">
                Position QR code within the frame to scan
              </div>
              <button onClick={submitQR} className="mt-5 w-full rounded-xl bg-[#214C43] text-white py-3">
                Authenticate
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
