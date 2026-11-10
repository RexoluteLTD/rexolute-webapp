import { beforeEach, describe, expect, it, vi } from "vitest";
import { publicApi } from "./transport";
import { clearSession, getSession, getValidSession, verifyOtp } from "./session";

function token(role: string, seconds = 3600) {
  const encode = (data: object) => btoa(JSON.stringify(data)).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
  return `${encode({ alg: "none" })}.${encode({ sub: "user-1", role, exp: Math.floor(Date.now() / 1000) + seconds, permissions: ["read"] })}.test`;
}
const credentials = { identity: "admin@example.com", provider: "email", code: "123456" };
const response = (accessToken: string) => ({ data: { data: { access_token: accessToken, refresh_token: "refresh-token" } } });

beforeEach(() => { clearSession(); vi.restoreAllMocks(); });

describe("backend authentication", () => {
  it("verifies OTP with the existing backend payload and stores its claims", async () => {
    const post = vi.spyOn(publicApi, "post").mockResolvedValue(response(token("admin")));
    const session = await verifyOtp(credentials, "admin");
    expect(post).toHaveBeenCalledWith("/auth/verify-otp?mode=token", { provider: "email", payload: { identity: credentials.identity, code: credentials.code } });
    expect(session.user.role).toBe("admin");
    expect(getSession()?.user.id).toBe("user-1");
    expect(sessionStorage.getItem("rexolute.session.v1")).toContain("refresh-token");
  });

  it("rejects a client account at the admin login", async () => {
    vi.spyOn(publicApi, "post").mockResolvedValue(response(token("client")));
    await expect(verifyOtp(credentials, "admin")).rejects.toThrow("cannot access");
    expect(getSession()).toBeNull();
  });

  it("shares one refresh across simultaneous requests", async () => {
    const post = vi.spyOn(publicApi, "post").mockResolvedValueOnce(response(token("admin", -1))).mockResolvedValueOnce(response(token("admin")));
    await verifyOtp(credentials, "admin");
    const [first, second] = await Promise.all([getValidSession(), getValidSession()]);
    expect(post).toHaveBeenCalledTimes(2);
    expect(first).toEqual(second);
    expect(first?.expiresAt).toBeGreaterThan(Date.now());
    expect(post.mock.calls[1]?.[2]).toEqual({ headers: { Authorization: "Bearer refresh-token" } });
  });

  it("clears an invalid session when refresh fails", async () => {
    vi.spyOn(publicApi, "post").mockResolvedValueOnce(response(token("admin", -1))).mockRejectedValueOnce(new Error("Unauthorized"));
    await verifyOtp(credentials, "admin");
    expect(await getValidSession()).toBeNull();
    expect(sessionStorage.getItem("rexolute.session.v1")).toBeNull();
  });

  it("does not restore a session if logout occurs during refresh", async () => {
    let complete!: (value: ReturnType<typeof response>) => void;
    vi.spyOn(publicApi, "post").mockResolvedValueOnce(response(token("admin", -1))).mockImplementationOnce(() => new Promise((resolve) => { complete = resolve; }));
    await verifyOtp(credentials, "admin");
    const pending = getValidSession();
    clearSession();
    complete(response(token("admin")));
    expect(await pending).toBeNull();
    expect(getSession()).toBeNull();
  });
});
