// src/lib/session.ts
export type Role = "manager" | "cashier" | "server";

const SESSION_ROLE_KEY = "pos_role"; // <- LA constante manquante

export function setActiveRole(role: Role) {
  sessionStorage.setItem(SESSION_ROLE_KEY, role);
}

export function getActiveRole(): Role | null {
  const r = sessionStorage.getItem(SESSION_ROLE_KEY);
  return r === "manager" || r === "cashier" || r === "server" ? (r as Role) : null;
}

export function clearActiveRole() {
  try { sessionStorage.removeItem(SESSION_ROLE_KEY); } catch {}
}

/** Efface la session et, en option, quelques caches locaux utilisés par la caisse */
export function clearSession() {
  try { sessionStorage.removeItem(SESSION_ROLE_KEY); } catch {}
  try { localStorage.removeItem("pos.cart.v1"); } catch {}
  try { localStorage.removeItem("pos.orderType.v1"); } catch {}
  // Si tu veux aussi vider l’historique des commandes local:
  // try { localStorage.removeItem("pos.orders.v1"); } catch {}
}
