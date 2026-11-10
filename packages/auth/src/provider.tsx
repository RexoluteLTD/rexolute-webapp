import { createContext, useEffect, useSyncExternalStore, type ReactNode } from "react";
import { clearSession, getSession, getValidSession, subscribeSession, type Session } from "@rexolute/api/session";

export const AuthContext = createContext<{ session: Session | null; signOut: () => void } | undefined>(undefined);
export function AuthProvider({ children }: { children: ReactNode }) {
  const session = useSyncExternalStore(subscribeSession, getSession, () => null);
  useEffect(() => {
    const refresh = () => { if (document.visibilityState === "visible") void getValidSession(); };
    const timer = window.setInterval(refresh, 30000);
    window.addEventListener("focus", refresh);
    return () => { window.clearInterval(timer); window.removeEventListener("focus", refresh); };
  }, []);
  return <AuthContext.Provider value={{ session, signOut: clearSession }}>{children}</AuthContext.Provider>;
}
