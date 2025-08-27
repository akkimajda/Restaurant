// src/App.tsx
import { Routes, Route } from "react-router-dom";

import RoleSelectPage from "./pages/RoleSelectPage";
import LoginRolePage from "./pages/LoginRolePage";
import ManagerHome from "./pages/ManagerHome";
import CashierHome from "./pages/CashierHome";
import ServerHome from "./pages/ServerHome";
import CashierPOSPage from "./pages/CashierPOSPage"; // la page POS de la caisse

export default function App() {
  return (
    <Routes>
      {/* Accueil : choix du rôle */}
      <Route path="/" element={<RoleSelectPage />} />

      {/* Login par rôle (PIN / QR) */}
      <Route path="/login/:role" element={<LoginRolePage />} />

      {/* Espaces par rôle */}
      <Route path="/manager" element={<ManagerHome />} />
      <Route path="/cashier" element={<CashierHome />} />
      <Route path="/cashier/pos" element={<CashierPOSPage />} />
      <Route path="/server" element={<ServerHome />} />

      {/* fallback */}
      <Route path="*" element={<RoleSelectPage />} />
    </Routes>
  );
}
