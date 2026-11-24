import { act, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { AxiosError, type AxiosResponse } from "axios";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { publicApi } from "@rexolute/api";
import LoginForm from "./login";

const { navigate } = vi.hoisted(() => ({ navigate: vi.fn() }));
const redirect = "/tasks?tab=therapists";
vi.mock("@tanstack/react-router", () => ({
  useRouter: () => ({ navigate }),
  Link: ({ to, children }: { to: string; children: ReactNode }) => <a href={to}>{children}</a>,
}));
Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });

async function submitLogin(check: (container: HTMLElement) => void) {
  const container = document.createElement("div");
  document.body.append(container);
  const root = createRoot(container);
  try {
    await act(async () => root.render(<LoginForm redirect={redirect} />));
    const setValue = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!;
    await act(async () => {
      for (const [id, value] of [["email", "admin@example.co"], ["password", "example-password"]]) {
        const input = container.querySelector<HTMLInputElement>(`#${id}`)!;
        setValue.call(input, value);
        input.dispatchEvent(new Event("input", { bubbles: true }));
      }
    });
    await act(async () => {
      container.querySelector("form")!.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    });
    check(container);
  } finally {
    await act(async () => root.unmount());
    container.remove();
  }
}

beforeEach(() => navigate.mockReset());

describe("admin login", () => {
  it("passes the challenge and return path to the OTP page", async () => {
    const id = "10019107-ce18-458c-af79-acb163346878";
    const expiry = "2026-11-24T11:13:05Z";
    vi.spyOn(publicApi, "post").mockResolvedValue({
      data: { data: { challenge_id: id, delivery_status: "queued", expires_at: expiry, resend_after_seconds: 60 } },
    });
    await submitLogin(() => {
      expect(navigate).toHaveBeenCalledWith({
        to: "/verify-otp",
        search: { challenge_id: id, redirect },
        state: { loginChallenge: { id, deliveryStatus: "queued", expiresAt: Date.parse(expiry), resendAt: expect.any(Number) } },
      });
    });
  });

  it("shows a structured backend error in the form without navigating", async () => {
    const post = vi.spyOn(publicApi, "post").mockRejectedValue(new AxiosError("Request failed", undefined, undefined, undefined, {
      status: 400, data: { error: { code: "INVALID_CREDENTIALS", message: "Invalid email or password" } },
    } as AxiosResponse));
    await submitLogin((container) => {
      expect(post).toHaveBeenCalledWith("/auth/signin", { email: "admin@example.co", password: "example-password" });
      expect(container.textContent).toContain("Invalid email or password");
      expect(container.querySelector("form")).not.toBeNull();
      expect(container.querySelector<HTMLInputElement>("#email")!.value).toBe("admin@example.co");
      expect(navigate).not.toHaveBeenCalled();
    });
  });
});
