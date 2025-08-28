import { Navigate } from "react-router-dom";
import { getActiveRole, type Role } from "../lib/session";
import type { ReactNode } from "react";

type GuardedProps = {
  role: Role;
  children: ReactNode;
};

export default function Guarded({ role, children }: GuardedProps) {
  const active = getActiveRole();
  if (active !== role) return <Navigate to="/" replace />;
  return <>{children}</>;
}
