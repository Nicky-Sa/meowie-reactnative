import axios, { isAxiosError } from "axios";
import * as SecureStore from "expo-secure-store";
import { Emitter } from "@/features/common/event-emitting/emitter";
import { env } from "@/lib/env";

const onClearTokens = async () => {
  console.log("Refresh token failed -> clearing tokens");
  // Emit logout event to be listened to by the root layout
  Emitter.emit("clearTokens");
};

// Create the axios instance
const axiosInstance = axios.create({
  baseURL: env.EXPO_PUBLIC_BACKEND_URL,
});

// --- Request Interceptor ---
// Runs *before* every request is sent
axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync("access-token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// A flag to prevent infinite loops during token refresh
let isRefreshing = false;
// A list of requests to retry after token is refreshed
let failedQueue: {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}[] = [];

const processQueue = (error: unknown, token: string | null) => {
  failedQueue.forEach((prom) => {
    if (error || !token) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// --- Response Interceptor ---
// Runs *after* a response is received
axiosInstance.interceptors.response.use(
  (response) => {
    // Any 2xx status code triggers this
    return response;
  },
  async (error) => {
    // Any non-2xx status code triggers this
    if (!isAxiosError(error)) {
      return Promise.reject(error);
    }

    const originalRequest = error.config;
    console.log({ error, apiError: error.response?.data.errors });

    // Check for 401 Unauthorized
    if (error.response?.status === 401 && originalRequest) {
      // Prevent infinite 401 loops
      if (originalRequest._retry) {
        return Promise.reject(error);
      }
      originalRequest._retry = true;

      // Handle token refresh logic
      if (isRefreshing) {
        // If already refreshing, add this request to the queue
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      // Start the token refresh
      isRefreshing = true;

      try {
        const refreshToken = await SecureStore.getItemAsync("refresh-token");
        if (!refreshToken) {
          await onClearTokens();
          return Promise.reject(error);
        }

        // Make the refresh token request
        // NOTE: Use a *new* axios instance or 'axios.post' to avoid
        // the interceptor trying to add an 'Authorization' header.
        const refreshResponse = await axios.post(
          `${env.EXPO_PUBLIC_BACKEND_URL}/auth/refresh-token`,
          {
            refreshToken,
          },
        );

        const { accessToken, refreshToken: newRefreshToken } =
          refreshResponse.data.data;

        // Save new tokens
        await SecureStore.setItemAsync("access-token", accessToken);
        await SecureStore.setItemAsync("refresh-token", newRefreshToken);

        // Update the header on the original request
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        // Retry all queued requests
        processQueue(null, accessToken);

        // Retry the original request
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.log({ refreshError });
        // If refresh fails, clear tokens
        await onClearTokens();
        processQueue(refreshError, null);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Return other errors
    return Promise.reject(error);
  },
);

export default axiosInstance;
