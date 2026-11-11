import { act, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { AxiosError, type AxiosResponse } from "axios";
import { describe, expect, it, vi } from "vitest";
import { publicApi } from "@rexolute/api";
import LoginForm from "./login";

const { navigate } = vi.hoisted(() => ({ navigate: vi.fn() }));
vi.mock("@tanstack/react-router", () => ({
  useRouter: () => ({ navigate }),
  useSearch: () => ({}),
  Link: ({ to, children }: { to: string; children: ReactNode }) => <a href={to}>{children}</a>,
}));
Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });

describe("admin login errors", () => {
  it("shows a structured backend error in the form without navigating or crashing", async () => {
    const post = vi.spyOn(publicApi, "post").mockRejectedValue(new AxiosError("Request failed", undefined, undefined, undefined, {
      status: 400, data: { error: { code: "INVALID_CREDENTIALS", message: "Invalid email or password" } },
    } as AxiosResponse));
    const container = document.createElement("div");
    document.body.append(container);
    const root = createRoot(container);
    try {
      await act(async () => root.render(<LoginForm />));
      const setValue = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!;
      await act(async () => {
        for (const [id, value] of [["email", "admin@example.co"], ["password", "incorrect-password"]]) {
          const input = container.querySelector<HTMLInputElement>(`#${id}`)!;
          setValue.call(input, value);
          input.dispatchEvent(new Event("input", { bubbles: true }));
        }
      });
      await act(async () => {
        container.querySelector("form")!.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
      });
      expect(post).toHaveBeenCalledWith("/auth/signin", { email: "admin@example.co", password: "incorrect-password" });
      expect(container.textContent).toContain("Invalid email or password");
      expect(container.querySelector("form")).not.toBeNull();
      expect(container.querySelector<HTMLInputElement>("#email")!.value).toBe("admin@example.co");
      expect(navigate).not.toHaveBeenCalled();
    } finally {
      await act(async () => root.unmount());
      container.remove();
      vi.restoreAllMocks();
    }
  });
});
