"use client";

import { useEffect } from "react";
import { AxiosHeaders } from "axios";
import { getSession, signOut } from "next-auth/react";
import { ApiClient as api } from "@/lib/api";

export function useAxiosInterceptors() {
  useEffect(() => {
    const requestInterceptor = api.interceptors.request.use(
      async (config) => {
        const session = await getSession();

        config.headers = new AxiosHeaders(config.headers as any);
        if (session?.user?.accessToken) {
          config.headers.set("Authorization", `Bearer ${session.user.accessToken}`);
        }

        return config;
      },
      (error) => Promise.reject(error),
    );

    const responseInterceptor = api.interceptors.response.use(
      (res) => res,
      async (error) => {
        if (error.response?.status === 401) {
          await signOut({ callbackUrl: "/admin/login" });
        }

        return Promise.reject(error);
      },
    );

    return () => {
      api.interceptors.request.eject(requestInterceptor);
      api.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  return api;
}
