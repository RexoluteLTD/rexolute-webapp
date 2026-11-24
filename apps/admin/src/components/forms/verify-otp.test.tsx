import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { publicApi } from "@rexolute/api";
import { clearSession, getSession } from "@rexolute/api/session";
import VerifyOTPForm from "./verify-otp";

const { navigate } = vi.hoisted(() => ({ navigate: vi.fn() }));
const challengeId = "10019107-ce18-458c-af79-acb163346878";
const redirect = "/tasks?tab=therapists";
vi.mock("@tanstack/react-router", () => ({
  useRouter: () => ({ navigate }),
  Link: ({ children }: { children: string }) => <a href="/login">{children}</a>,
}));

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
let container: HTMLDivElement;
let root: Root;

beforeEach(() => {
  vi.useFakeTimers();
  clearSession();
  vi.stubGlobal("ResizeObserver", class {
    observe() {}
    disconnect() {}
  });
  navigate.mockReset();
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
});

afterEach(async () => {
  await act(async () => root.unmount());
  // The OTP input schedules a deferred selection update after typing.
  await act(async () => vi.runOnlyPendingTimersAsync());
  container.remove();
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

it("resends without a body after cooldown and reloads timing after an empty response", async () => {
  const timing = {
    challenge_id: challengeId,
    delivery_status: "accepted",
    expires_at: new Date(Date.now() + 120_000).toISOString(),
    resend_after_seconds: 2,
  };
  const get = vi.spyOn(publicApi, "get")
    .mockResolvedValueOnce({ data: { data: timing } })
    .mockResolvedValueOnce({ data: { data: { ...timing, resend_after_seconds: 60 } } });
  const post = vi.spyOn(publicApi, "post").mockResolvedValue({ data: "" });

  await act(async () => root.render(<VerifyOTPForm challengeId={challengeId} redirect={redirect} />));
  const resend = container.querySelector<HTMLButtonElement>("button[type=button]")!;
  expect(resend.disabled).toBe(true);
  expect(resend.textContent).toContain("2s");
  await act(async () => vi.advanceTimersByTimeAsync(2000));
  expect(resend.disabled).toBe(false);

  await act(async () => resend.click());
  expect(post).toHaveBeenCalledExactlyOnceWith(`/auth/login-challenges/${challengeId}/resend`, undefined, { signal: expect.any(AbortSignal) });
  expect(get).toHaveBeenCalledTimes(2);
  expect(resend.disabled).toBe(true);
  expect(resend.textContent).toContain("60s");
});

it("verifies and returns to the requested admin route when delivery status is unavailable", async () => {
  vi.spyOn(publicApi, "get").mockRejectedValue(new Error("Delivery status unavailable"));
  const claims = btoa(JSON.stringify({
    sub: "admin-1", exp: Math.floor(Date.now() / 1000) + 3600, role: "admin",
  }));
  const post = vi.spyOn(publicApi, "post").mockResolvedValue({
    data: { data: { access_token: `header.${claims}.signature`, refresh_token: "test-refresh" } },
  });

  await act(async () => root.render(<VerifyOTPForm challengeId={challengeId} redirect={redirect} />));
  const input = container.querySelector<HTMLInputElement>("input")!;
  await act(async () => {
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!.call(input, "123456");
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });
  await act(async () => {
    container.querySelector("form")!.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
  });
  expect(post).toHaveBeenCalledExactlyOnceWith(`/auth/login-challenges/${challengeId}/verify`, { code: "123456" }, { signal: expect.any(AbortSignal) });
  expect(getSession()?.user.role).toBe("admin");
  expect(navigate).toHaveBeenCalledWith({ to: redirect, replace: true });
});
