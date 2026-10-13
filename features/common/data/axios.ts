import axios, { isAxiosError, create as createAxiosInstance } from "axios";
import { getAccessToken, getRefreshToken } from "./utils/token";
import { env } from "@/lib/env";
import {
  destroySession,
  createSession,
} from "@/features/common/data/utils/session";
import { GENERAL_TIMEOUT } from "@/lib/consts";
import { getDefaultStore } from "jotai";
import { countryCodeAtom } from "@/atoms";

// Create the axios instance
const axiosInstance = createAxiosInstance({
  baseURL: env.EXPO_PUBLIC_BACKEND_URL,
  timeout: GENERAL_TIMEOUT, // requests hanging beyond this will throw an ECONNABORTED error
});

// --- Request Interceptor ---
// Runs *before* every request is sent
axiosInstance.interceptors.request.use(
  async (config) => {
    // 1. Handle automatic API versioning
    // If the URL doesn't already start with a version prefix (like /v1, /v2, or v1, v2)
    if (config.url && !/^\/?v\d+\//.test(config.url)) {
      const prefix = config.url.startsWith("/") ? "/v1" : "/v1/";
      config.url = `${prefix}${config.url}`;
    }

    // 2. Attach auth token
    const token = await getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 3. Attach country code for localized content
    const countryCode = getDefaultStore().get(countryCodeAtom);
    if (countryCode) {
      config.headers["x-user-country"] = countryCode;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// Thrown when there is no refresh token to try. The session cannot recover,
// so it is handled like a rejected token rather than a transient failure.
class NoRefreshTokenError extends Error {}

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
          throw new NoRefreshTokenError("No refresh token available");
        }

        // Scenario B: Attempt to refresh
        const refreshResponse = await axios.post(
          `${env.EXPO_PUBLIC_BACKEND_URL}/v1/auth/refresh-token`,
          { refreshToken },
        );

        const { accessToken, refreshToken: newRefreshToken } =
          refreshResponse.data.data;

        // Save new tokens
        await createSession({
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
        // The session is dead (not a network blip) when there is no refresh
        // token, or the server rejected it. The backend answers 403 when the
        // refresh token is known but revoked/mismatched, and 401 when the
        // refresh token itself is expired, malformed, or signed with another
        // secret (e.g. a token from a different environment).
        const rejectedStatus = isAxiosError(refreshError)
          ? refreshError.response?.status
          : undefined;
        const isAuthRejection =
          refreshError instanceof NoRefreshTokenError ||
          rejectedStatus === 401 ||
          rejectedStatus === 403;

        if (isAuthRejection) {
          // Scenario C1: The session is dead.
          // Clean up client state and downgrade to guest.
          console.log("Refresh token rejected. Logging out.");
          await destroySession();

          processQueue(null, null);

          delete originalRequest.headers.Authorization;
          return axiosInstance(originalRequest);
        }

        // Scenario C2: Transient failure (network error, timeout, server down).
        // Do NOT delete tokens — the refresh token may still be valid.
        // Just fail the request and let the user retry naturally.
        console.log(
          "Refresh failed (transient). Keeping tokens.",
          refreshError,
        );
        processQueue(refreshError, null);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Return other errors (400, 403, 500, etc.)
    return Promise.reject(error);
  },
);

export default axiosInstance;
