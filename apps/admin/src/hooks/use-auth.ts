import { useContext, useState } from "react";
import { ApiClient } from "@rexolute/api";
import { AuthContext } from "@rexolute/auth/provider";

export function useAuth() {
  const auth = useContext(AuthContext);
  const [isSigningOut, setIsSigningOut] = useState(false);
  if (!auth) throw new Error("useAuth must be used inside AuthProvider");
  const { session, signOut: clearLocalSession } = auth;

  async function signOut() {
    if (isSigningOut) return;
    setIsSigningOut(true);
    try {
      await ApiClient.post("/auth/signout");
    } catch {
      // End the local session even when the server cannot be reached.
    } finally {
      clearLocalSession();
      setIsSigningOut(false);
    }
  }

  return { session, signOut, isSigningOut };
}
