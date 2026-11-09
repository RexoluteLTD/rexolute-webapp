import { AxiosHeaders } from "axios";
import { getSession, signOut } from "next-auth/react";

import api from "./axios";

export const setupAxiosInterceptors = () => {
  api.interceptors.request.use(async (config) => {
    const session = await getSession();
    config.headers = new AxiosHeaders(config.headers as any);

    if (session?.user?.accessToken) {
      config.headers.set("Authorization", `Bearer ${session.user.accessToken}`);
    }

    return config;
  });

  api.interceptors.response.use(
    (response) => response,

    async (error) => {
      if (error.response?.status === 401) {
        await signOut({ callbackUrl: "/admin/login" });
      }

      return Promise.reject(error);
    },
  );
};
