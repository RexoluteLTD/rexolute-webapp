import { beforeEach, describe, expect, it, vi } from "vitest";
import { publicApi } from "./transport";
import { clearSession, getLoginChallenge, getSession, getValidSession, resendLoginChallenge, verifyAdminLoginChallenge, verifyOtp } from "./session";

function token(role: string, seconds = 3600) {
  const encode = (data: object) => btoa(JSON.stringify(data)).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
  return `${encode({ alg: "none" })}.${encode({ sub: "user-1", role, exp: Math.floor(Date.now() / 1000) + seconds, permissions: ["read"] })}.test`;
}
const credentials = { identity: "admin@example.com", provider: "email", code: "123456" };
const response = (accessToken: string) => ({ data: { data: { access_token: accessToken, refresh_token: "refresh-token" } } });

beforeEach(() => { clearSession(); vi.restoreAllMocks(); });

describe("admin login challenge", () => {
  const id = "10019107-ce18-458c-af79-acb163346878";
  const path = `/auth/login-challenges/${id}`;

  it("verifies the code against the challenge and persists the admin session", async () => {
    const post = vi.spyOn(publicApi, "post").mockResolvedValue(response(token("admin")));
    const { signal } = new AbortController();
    const session = await verifyAdminLoginChallenge(id, "123456", signal);
    expect(post).toHaveBeenCalledWith(`${path}/verify`, { code: "123456" }, { signal });
    expect(getSession()).toBe(session);
    expect(sessionStorage.getItem("rexolute.session.v1")).not.toBeNull();
  });

  it("rejects a non-admin verification response", async () => {
    vi.spyOn(publicApi, "post").mockResolvedValue(response(token("client")));
    await expect(verifyAdminLoginChallenge(id, "123456", new AbortController().signal)).rejects.toThrow("cannot access the admin app");
    expect(getSession()).toBeNull();
  });

  it("ignores a verification response after cancellation", async () => {
    const controller = new AbortController();
    vi.spyOn(publicApi, "post").mockImplementation(async () => {
      controller.abort();
      return response(token("admin"));
    });
    await expect(verifyAdminLoginChallenge(id, "123456", controller.signal)).rejects.toMatchObject({ name: "AbortError" });
    expect(getSession()).toBeNull();
  });

  it("reads delivery status and resends with an empty request body", async () => {
    const challenge = { challenge_id: id, delivery_status: "accepted", expires_at: "2026-11-24T11:13:05Z", resend_after_seconds: 0 };
    const get = vi.spyOn(publicApi, "get").mockResolvedValue({ data: { data: challenge } });
    const post = vi.spyOn(publicApi, "post").mockResolvedValue({ data: "" });
    const { signal } = new AbortController();
    expect(await getLoginChallenge(id, signal)).toEqual(challenge);
    expect(get).toHaveBeenCalledWith(path, { signal });
    expect(await resendLoginChallenge(id, signal)).toBeUndefined();
    expect(post).toHaveBeenCalledWith(`${path}/resend`, undefined, { signal });
  });
});

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
