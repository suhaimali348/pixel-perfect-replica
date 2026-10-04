import { createContext, useContext, useState, type ReactNode } from "react";
import { ROLE_PERMISSIONS, type Permission, type Role } from "./mock-data";

type Ctx = { role: Role; setRole: (r: Role) => void; can: (p: Permission) => boolean; name: string };
const AuthCtx = createContext<Ctx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>("Super Admin");
  const can = (p: Permission) => ROLE_PERMISSIONS[role].includes(p);
  return <AuthCtx.Provider value={{ role, setRole, can, name: "Dr. Kavita Rao" }}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  const c = useContext(AuthCtx);
  if (!c) throw new Error("useAuth outside provider");
  return c;
}
