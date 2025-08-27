import { BrowserRouter, Routes, Route } from "react-router-dom";
import RoleSelectPage from "./pages/RoleSelectPage";
import LoginRolePage from "./pages/LoginRolePage";
import ManagerHome from "./pages/ManagerHome";
import CashierHome from "./pages/CashierHome";
import ServerHome from "./pages/ServerHome";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Accueil : choix du rôle */}
        <Route path="/" element={<RoleSelectPage />} />
        {/* Login par rôle (PIN / QR) */}
        <Route path="/login/:role" element={<LoginRolePage />} />
        {/* Pages après authentification */}
        <Route path="/manager" element={<ManagerHome />} />
        <Route path="/cashier" element={<CashierHome />} />
        <Route path="/server" element={<ServerHome />} />
        {/* fallback */}
        <Route path="*" element={<RoleSelectPage />} />
      </Routes>
    </BrowserRouter>
  );
}
