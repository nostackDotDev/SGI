import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type Method,
} from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// ============================================================================
// REFRESH TOKEN MANAGEMENT - Prevents concurrent refresh storms
// ============================================================================

let isRefreshing = false;
const refreshSubscribers: Array<(token: string) => void> = [];

const subscribeToRefresh = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

const notifyRefreshSubscribers = () => {
  refreshSubscribers.forEach((callback) => callback(""));
  refreshSubscribers.length = 0;
};

const refreshAccessToken = async (): Promise<boolean> => {
  try {
    const response = await axiosInstance.post("/auth/refresh");
    // Cookies automatically updated by server
    notifyRefreshSubscribers();
    return true;
  } catch (error) {
    console.error("Token refresh failed:", error);
    // Refresh failed - clear auth state
    localStorage.removeItem("user");
    return false;
  }
};

// ============================================================================
// RESPONSE INTERCEPTOR - Handles 401 with refresh logic
// ============================================================================

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;

        // Attempt to refresh token (max 2 retries to avoid infinite loops)
        let refreshAttempts = 0;
        const maxRefreshAttempts = 2;

        while (refreshAttempts < maxRefreshAttempts) {
          const refreshSuccess = await refreshAccessToken();

          if (refreshSuccess) {
            isRefreshing = false;
            // Retry original request with new token
            return axiosInstance(originalRequest);
          }

          refreshAttempts++;

          if (refreshAttempts < maxRefreshAttempts) {
            // Exponential backoff: 500ms, 1s
            await new Promise((resolve) =>
              setTimeout(resolve, 500 * refreshAttempts),
            );
          }
        }

        // All refresh attempts failed
        isRefreshing = false;
        localStorage.removeItem("user");
        window.location.href = "/login";
      } else {
        // Refresh is already in-flight, queue this request
        return new Promise((resolve) => {
          subscribeToRefresh(() => {
            resolve(axiosInstance(originalRequest));
          });
        });
      }
    }

    return Promise.reject(error);
  },
);

export interface RequestOptions<T = any> extends Omit<
  AxiosRequestConfig<T>,
  "url" | "method"
> {
  withCredentials?: boolean;
}

export function request<T = any>(
  path: string,
  method: Method,
  options: RequestOptions = {},
  onSuccess?: (data: T) => void,
  onError?: (error: any) => void,
): void {
  axiosInstance
    .request<T>({
      url: path,
      method,
      baseURL: options.baseURL ?? API_BASE_URL,
      ...options,
    })
    .then((response) => {
      if (onSuccess) onSuccess(response.data);
    })
    .catch((error) => {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          // Token invalid/expired, clear localStorage
          // (interceptor handles refresh and retry)
          localStorage.removeItem("user");
        }
        if (onError) onError(error.response?.data ?? error.message);
      } else {
        if (onError) onError(error);
      }
    });
}

export const api = {
  get: <T = any>(
    path: string,
    options?: RequestOptions<T>,
    onSuccess?: (data: T) => void,
    onError?: (error: any) => void,
  ) => request<T>(path, "GET", options, onSuccess, onError),
  post: <T = any>(
    path: string,
    data?: unknown,
    options?: RequestOptions<T>,
    onSuccess?: (data: T) => void,
    onError?: (error: any) => void,
  ) => request<T>(path, "POST", { data, ...options }, onSuccess, onError),
  put: <T = any>(
    path: string,
    data?: unknown,
    options?: RequestOptions<T>,
    onSuccess?: (data: T) => void,
    onError?: (error: any) => void,
  ) => request<T>(path, "PUT", { data, ...options }, onSuccess, onError),
  patch: <T = any>(
    path: string,
    data?: unknown,
    options?: RequestOptions<T>,
    onSuccess?: (data: T) => void,
    onError?: (error: any) => void,
  ) => request<T>(path, "PATCH", { data, ...options }, onSuccess, onError),
  delete: <T = any>(
    path: string,
    options?: RequestOptions<T>,
    onSuccess?: (data: T) => void,
    onError?: (error: any) => void,
  ) => request<T>(path, "DELETE", options, onSuccess, onError),
};
