import { describe, expect, it, vi } from "vitest";

async function loadClients() {
  vi.resetModules();
  const { publicApi } = await import("./transport");
  const { default: api } = await import("./axios");
  return { publicApi, api };
}

async function deployedClients() {
  vi.stubEnv("DEV", false);
  try {
    return await loadClients();
  } finally {
    vi.unstubAllEnvs();
  }
}

describe("API routing", () => {
  it.each([
    { dev: false, url: "https://local-api.invalid/v1/", expected: "/v1/" },
    { dev: true, url: "https://local-api.invalid/v1/", expected: "https://local-api.invalid/v1/" },
    { dev: true, url: "", expected: "/v1/" },
  ])("uses $expected in Vite development mode $dev with endpoint '$url'", async ({ dev, url, expected }) => {
    vi.stubEnv("DEV", dev);
    vi.stubEnv("VITE_LOCAL_API_URL", url);
    vi.stubEnv("VITE_API_BASE_URL", "https://old-backend.invalid");
    try {
      const { publicApi, api } = await loadClients();
      expect(publicApi.getUri({ url: "/auth/signin" })).toBe(`${expected}auth/signin`);
      expect(api.getUri({ url: "/users" })).toBe(`${expected}users`);
    } finally {
      vi.unstubAllEnvs();
    }
  });

  it.each([
    "https://example.co",
    "https://admin.example.co",
    "https://client.example.co",
    "https://landing-dev.example.co",
    "https://admin-dev.example.co",
    "https://client-dev.example.co",
    "http://localhost:5174",
  ])("keeps public and authenticated requests on %s, including deep links", async (origin) => {
    const { publicApi, api } = await deployedClients();
    for (const client of [publicApi, api]) {
      const uri = client.getUri({ url: "/auth/verify-otp", params: { mode: "token" } });
      expect(new URL(uri, `${origin}/users/details/123`).href).toBe(`${origin}/v1/auth/verify-otp?mode=token`);
    }
  });

  it.each(["/auth/signin", "auth/refresh-token", "/users"])("adds the versioned API prefix exactly once for %s", async (url) => {
    const { publicApi, api } = await deployedClients();
    expect(publicApi.getUri({ url })).toBe(`/v1/${url.replace(/^\//, "")}`);
    expect(api.getUri({ url })).toBe(publicApi.getUri({ url }));
  });
});
