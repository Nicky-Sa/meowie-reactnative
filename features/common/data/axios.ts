import axios, { isAxiosError } from "axios";
import { getAccessToken, getRefreshToken } from "./utils/token-storage";
import { env } from "@/lib/env";
import { unregisterUser } from "@/features/common/data/utils/unregister-user";
import { registerUser } from "@/features/common/data/utils/register-user";
import { GENERAL_TIMEOUT } from "@/lib/consts";

// Create the axios instance
const axiosInstance = axios.create({
  baseURL: env.EXPO_PUBLIC_BACKEND_URL,
  timeout: GENERAL_TIMEOUT, // requests hanging beyond this will throw an ECONNABORTED error
});

// --- Request Interceptor ---
// Runs *before* every request is sent
axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Flag to prevent multiple refresh attempts
let isRefreshing = false;

// Queue to hold requests while refreshing
// Note: 'resolve' now accepts string OR null (for Guest mode)
let failedQueue: {
  resolve: (token: string | null) => void;
  reject: (error: unknown) => void;
}[] = [];

// Helper to process the queue
const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      // Resolve the promise (passing null if we are downgrading to guest)
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// --- Response Interceptor ---
// Runs *after* a response is received
axiosInstance.interceptors.response.use(
  // Any 2xx or 3xx status code triggers this
  (response) => response,

  // Any 4xx/5xx status code triggers this
  async (error) => {
    if (!isAxiosError(error)) {
      return Promise.reject(error);
    }

    const originalRequest = error.config;
    console.log({
      error,
      apiError: error.response?.data.errors,
      url: error.response?.config?.url,
    });

    // Check for 401 Unauthorized
    if (error.response?.status === 401 && originalRequest) {
      // Prevent infinite 401 loops
      if (originalRequest._retry) {
        // If it fails AGAIN after retry, we must reject it to avoid a loop.
        return Promise.reject(error);
      }
      originalRequest._retry = true;

      // 1. If refreshing is already in progress, queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (token) {
              // Valid token refreshed: Attach it
              originalRequest.headers.Authorization = `Bearer ${token}`;
            } else {
              // Refresh failed / Guest mode: Remove header
              delete originalRequest.headers.Authorization;
            }
            return axiosInstance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      // 2. Start the token refresh
      isRefreshing = true;

      try {
        const refreshToken = await getRefreshToken();

        // Scenario A: No refresh token exists -> Downgrade to Guest immediately
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        // Scenario B: Attempt to refresh
        const refreshResponse = await axios.post(
          `${env.EXPO_PUBLIC_BACKEND_URL}/auth/refresh-token`,
          { refreshToken },
        );

        const { accessToken, refreshToken: newRefreshToken } =
          refreshResponse.data.data;

        // Save new tokens
        await registerUser({
          accessToken,
          refreshToken: newRefreshToken,
        });

        // Update header for the original request
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        // Process queue with the NEW token
        processQueue(null, accessToken);

        // Retry original request
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Scenario C: Refresh Failed (or didn't exist)
        console.log(
          "Token refresh failed. Downgrading to Guest.",
          refreshError,
        );

        // 1. Clear tokens safely (waits for storage deletion)
        await unregisterUser();

        // 2. Process the queue with NULL (Trigger Guest Retry for all waiting requests)
        processQueue(null, null);

        // 3. Retry the ORIGINAL request as Guest (remove header)
        delete originalRequest.headers.Authorization;
        return axiosInstance(originalRequest);
      } finally {
        isRefreshing = false;
      }
    }

    // Return other errors (400, 403, 500, etc.)
    return Promise.reject(error);
  },
);

export default axiosInstance;
