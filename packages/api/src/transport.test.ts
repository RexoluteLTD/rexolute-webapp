import { describe, expect, it, vi } from "vitest";
import api from "./axios";
import { publicApi } from "./transport";

describe("same-origin API routing", () => {
  it("ignores legacy backend-origin configuration", async () => {
    vi.stubEnv("VITE_API_BASE_URL", "https://old-backend.invalid");
    try {
      vi.resetModules();
      const { publicApi: freshClient } = await import("./transport");
      expect(freshClient.getUri({ url: "/auth/signin" })).toBe("/v1/auth/signin");
    } finally { vi.unstubAllEnvs(); }
  });

  it.each([
    "https://example.co",
    "https://admin.example.co",
    "https://client.example.co",
    "https://landing-dev.example.co",
    "https://admin-dev.example.co",
    "https://client-dev.example.co",
    "http://localhost:5174",
  ])("keeps public and authenticated requests on %s, including deep links", (origin) => {
    for (const client of [publicApi, api]) {
      const uri = client.getUri({ url: "/auth/verify-otp", params: { mode: "token" } });
      expect(new URL(uri, `${origin}/users/details/123`).href).toBe(`${origin}/v1/auth/verify-otp?mode=token`);
    }
  });

  it.each(["/auth/signin", "auth/refresh-token", "/users"])("adds the versioned API prefix exactly once for %s", (url) => {
    expect(publicApi.getUri({ url })).toBe(`/v1/${url.replace(/^\//, "")}`);
    expect(api.getUri({ url })).toBe(publicApi.getUri({ url }));
  });
});
