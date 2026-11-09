import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { jwtDecode } from "jwt-decode";

import { ApiClient as api } from "@/lib/api";
import { JWT } from "next-auth/jwt";

async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    const res = await api.post(
      "/auth/refresh-token",
      {},
      {
        headers: {
          Authorization: `Bearer ${token.refreshToken}`,
        },
      },
    );
    const data = res.data?.data;

    if (!data?.access_token) {
      throw new Error("Invalid refresh token response");
    }

    const decoded: any = jwtDecode(data.access_token);

    return {
      ...token,
      role: decoded.role,
      permissions: decoded.permissions,
      accessToken: data.access_token,
      refreshToken: data.refresh_token ?? token.refreshToken,
      expiresAt: decoded.exp * 1000,
      error: undefined,
    };
  } catch (error) {
    console.error("Refresh Token Error:", error);
    return { ...token, error: "RefreshTokenError" };
  }
}

export default NextAuth({
  secret: process.env.NEXTAUTH_SECRET,

  pages: {
    signIn: "/auth/admin/login",
    error: "/auth/errors",
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  providers: [
    CredentialsProvider({
      id: "admin-auth",
      name: "admin-auth",
      credentials: {
        code: { label: "OTP", type: "text" },
        identity: { label: "Identity", type: "text" },
        provider: { label: "Provider", type: "text" },
      },
      authorize: async (credentials) => {
        const { code, identity, provider } = credentials || {};
        console.log("verifying...", { identity });
        const res = await api.post("/auth/verify-otp?mode=token", {
          provider: provider,
          payload: {
            identity: identity,
            code: code,
          },
        });

        const { data } = res.data;
        const accessToken = data?.access_token;
        const refreshToken = data?.refresh_token;

        if (!accessToken || !refreshToken) return null;

        const decoded: any = jwtDecode(accessToken);

        return {
          id: decoded.sub,
          email: identity,
          role: decoded.role,
          permissions: decoded.permissions,
          accessToken,
          refreshToken,
        };
      },
    }),
  ],

  callbacks: {
    /**
     * Runs whenever a JWT is created or updated
     */
    async jwt({ token, user, trigger, session }) {
      if (user) {
        const accessToken = (user as any).accessToken;
        const refreshToken = (user as any).refreshToken;
        const decoded: any = jwtDecode(accessToken);

        token.id = user.id;
        token.email = user.email;
        token.role = decoded.role;
        token.permissions = decoded.permissions;
        token.accessToken = accessToken;
        token.refreshToken = refreshToken;
        token.expiresAt = decoded.exp * 1000;
      }

      if (trigger === "update" && session?.user) {
        token.accessToken = session.user.accessToken ?? token.accessToken;
        token.refreshToken = session.user.refreshToken ?? token.refreshToken;
        token.role = session.user.role ?? token.role;
        token.permissions = session.user.permissions ?? token.permissions;

        if (token.accessToken) {
          const decoded: any = jwtDecode(token.accessToken);
          token.expiresAt = decoded.exp * 1000;
        }

        return token;
      }

      if (!token.accessToken || !token.expiresAt) {
        return token;
      }

      // Refresh a little early to avoid racing requests with an expiring token.
      if (Date.now() < token.expiresAt - 60_000) {
        return token;
      }

      return refreshAccessToken(token);
    },
    /**
     * Controls what is sent to the client inside session
     */
    async session({ session, token }) {
      session.user = {
        id: token.id,
        email: token.email!,
        role: token.role,
        permissions: token.permissions,
        accessToken: token.accessToken,
        refreshToken: token.refreshToken,
      };
      session.error = token.error;

      return session;
    },
  },
});
