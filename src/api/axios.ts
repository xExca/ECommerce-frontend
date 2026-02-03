import axios, { AxiosHeaders } from "axios";
import { getAccessToken, setAccessToken, triggerLogout,} from "@/lib/helpers/authStore";

let isRefreshing = false;
let pendingRequests: Array<(token: string | null) => void> = [];

const refreshClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/",
  withCredentials: true,
});

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/",
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers = AxiosHeaders.from(config.headers);
    config.headers.set("Authorization", `Bearer ${token}`);
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      error.response?.data?.message === "Authentication failed" &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingRequests.push((token) => {
            if (!token) return reject(error);
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(axiosInstance(originalRequest));
          });
        });
      }

      isRefreshing = true;

      try {
        const { data } = await refreshClient.post("/api/auth/refresh");

        const newAccessToken = data.accessToken;
        setAccessToken(newAccessToken);

        pendingRequests.forEach((cb) => cb(newAccessToken));
        pendingRequests = [];

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch {
        setAccessToken(null);
        pendingRequests.forEach((cb) => cb(null));
        pendingRequests = [];
        triggerLogout();
        return Promise.reject(error);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance 