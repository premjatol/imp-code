import axios from "axios";
import Cookies from "js-cookie"; // For client-side access to cookies
import useAuthStore from "@/stores/auth/useAuthStore";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // important for cookies to be sent
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Attach access token from cookie
apiClient.interceptors.request.use((config) => {
  let token = null;

  if (typeof window !== "undefined") {
    token = Cookies.get("access_token") || null;
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// 🔥 Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      let refresh_token = null;
      let device_id = null;

      if (typeof window !== "undefined") {
        refresh_token = Cookies.get("refresh_token") || null;
        device_id = Cookies.get("device_id") || null;
      }

      if (!refresh_token || !device_id) {
        useAuthStore.getState().logout();
        return Promise.reject(error);
      }

      try {
        const response = await axios.post(
          "/auth/refresh",
          {
            refresh_token,
            device_id,
          },
          { baseURL: process.env.NEXT_PUBLIC_API_URL, withCredentials: true }
        );

        const newAccessToken = response.data.data.access_token;
        const newRefreshToken = response.data.data.refresh_token;

        // Save tokens in cookies
        Cookies.set("access_token", newAccessToken, { path: "/" });
        Cookies.set("refresh_token", newRefreshToken, { path: "/" });

        useAuthStore.setState({ accessToken: newAccessToken });

        processQueue(null, newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
