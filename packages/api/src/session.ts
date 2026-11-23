import { jwtDecode } from "jwt-decode";
import { publicApi } from "./transport";
import type { Role } from "@rexolute/types";

export interface Session {
  user: {
    id: string;
    email?: string;
    role: Role;
    permissions: string[];
    accessToken: string;
    refreshToken: string;
  };
  expiresAt: number;
}
interface Claims { sub: string; exp: number; role: Role; permissions?: string[]; email?: string }
interface Tokens { access_token: string; refresh_token: string }
const storageKey = "rexolute.session.v1";
const listeners = new Set<() => void>();
let current: Session | null = null;
let refreshPromise: Promise<Session | null> | null = null;
let revision = 0;

function fromTokens(tokens: Tokens): Session {
  const decoded = jwtDecode<Claims>(tokens.access_token);
  if (!decoded.sub || !decoded.exp || !decoded.role) throw new Error("Invalid authentication response");
  return { user: { id: decoded.sub, email: decoded.email, role: decoded.role,
    permissions: decoded.permissions ?? [], accessToken: tokens.access_token, refreshToken: tokens.refresh_token },
    expiresAt: decoded.exp * 1000 };
}

function persist(session: Session | null) {
  current = session;
  revision++;
  try {
    if (session) sessionStorage.setItem(storageKey, JSON.stringify({ access_token: session.user.accessToken, refresh_token: session.user.refreshToken }));
    else sessionStorage.removeItem(storageKey);
  } catch { /* Memory-only sessions still work when browser storage is disabled. */ }
  listeners.forEach((listener) => listener());
}

try {
  const stored = sessionStorage.getItem(storageKey);
  if (stored) current = fromTokens(JSON.parse(stored));
} catch { current = null; }

export const subscribeSession = (listener: () => void) => { listeners.add(listener); return () => { listeners.delete(listener); }; };
export const getSession = () => current;
export const clearSession = () => persist(null);

export async function verifyOtp(input: { code: string; identity: string; provider: string }, role: Role) {
  const response = await publicApi.post<{ data: Tokens }>("/auth/verify-otp?mode=token", {
    provider: input.provider, payload: { identity: input.identity, code: input.code },
  });
  const session = fromTokens(response.data.data);
  if (session.user.role !== role) throw new Error(`This account cannot access the ${role} app.`);
  session.user.email ??= input.identity;
  persist(session);
  return session;
}

export async function getValidSession(): Promise<Session | null> {
  const session = current;
  if (!session) return null;
  if (Date.now() < session.expiresAt - 60_000) return session;
  if (!refreshPromise) {
    const startedAt = revision;
    refreshPromise = publicApi.post<{ data: Tokens }>("/auth/refresh-token", {}, {
      headers: { Authorization: `Bearer ${session.user.refreshToken}` },
    }).then(({ data }) => {
      if (revision !== startedAt) return current;
      const updated = fromTokens({ ...data.data, refresh_token: data.data.refresh_token ?? session.user.refreshToken });
      persist(updated);
      return updated;
    }).catch(() => {
      if (revision === startedAt) clearSession();
      return current;
    }).finally(() => { refreshPromise = null; });
  }
  return refreshPromise;
}
