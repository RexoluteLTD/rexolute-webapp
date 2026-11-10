import axios from "axios";
import { clearSession, getValidSession } from "./session";
import { publicApi } from "./transport";

const api = axios.create(publicApi.defaults);
api.interceptors.request.use(async (config) => {
  const session = await getValidSession();
  if (session) config.headers.set("Authorization", `Bearer ${session.user.accessToken}`);
  return config;
});
api.interceptors.response.use((response) => response, (error) => {
  if (error.response?.status === 401) clearSession();
  return Promise.reject(error);
});
export default api;
