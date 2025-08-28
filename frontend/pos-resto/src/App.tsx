// src/App.tsx
import { Routes, Route, Navigate } from "react-router-dom";

import RoleSelectPage from "./pages/RoleSelectPage";
import LoginRolePage from "./pages/LoginRolePage";
import ManagerHome from "./pages/ManagerHome";
import CashierHome from "./pages/CashierHome";
import ServerHome from "./pages/ServerHome";
import CashierPOSPage from "./pages/CashierPOSPage";
import Guarded from "./components/Guarded";

export default function App() {
  return (
    <Routes>
      {/* Accueil : choix du rôle */}
      <Route path="/" element={<RoleSelectPage />} />

      {/* Login par rôle (PIN / QR) */}
      <Route path="/login/:role" element={<LoginRolePage />} />

      {/* Pages protégées par rôle */}
      <Route
        path="/manager"
        element={
          <Guarded role="manager">
            <ManagerHome />
          </Guarded>
        }
      />

      <Route
        path="/cashier"
        element={
          <Guarded role="cashier">
            <CashierHome />
          </Guarded>
        }
      />

      <Route
        path="/cashier/pos"
        element={
          <Guarded role="cashier">
            <CashierPOSPage />
          </Guarded>
        }
      />

      <Route
        path="/server"
        element={
          <Guarded role="server">
            <ServerHome />
          </Guarded>
        }
      />

      {/* fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
