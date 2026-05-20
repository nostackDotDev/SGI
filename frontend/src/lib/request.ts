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
let refreshError: any = null;
const refreshSubscribers: Array<(error: any) => void> = [];

const subscribeToRefresh = (callback: (error: any) => void) => {
  refreshSubscribers.push(callback);
};

const notifyRefreshSubscribers = (error?: any) => {
  refreshSubscribers.forEach((callback) => callback(error));
  refreshSubscribers.length = 0;
};

const refreshAccessToken = async (): Promise<boolean> => {
  try {
    const response = await axiosInstance.post("/auth/refresh");
    // Cookies automatically updated by server
    refreshError = null;
    notifyRefreshSubscribers(null); // Success - pass null error
    return true;
  } catch (error) {
    console.error("Token refresh failed:", error);
    // Refresh failed - clear auth state
    localStorage.removeItem("user");
    refreshError = error;
    notifyRefreshSubscribers(error); // Failure - pass error to queued requests
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

    // Don't attempt token refresh for login endpoint - 401 means invalid credentials, not expired token
    const isLoginRequest = originalRequest.url?.includes("/auth/login");

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isLoginRequest
    ) {
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
            try {
              return await axiosInstance(originalRequest);
            } catch (retryError) {
              // Retry failed even after refresh succeeded
              return Promise.reject(retryError);
            }
          }

          refreshAttempts++;

          if (refreshAttempts < maxRefreshAttempts) {
            // Exponential backoff: 500ms, 1s
            await new Promise((resolve) =>
              setTimeout(resolve, 500 * refreshAttempts),
            );
          }
        }

        // All refresh attempts failed - release lock so future requests can try
        isRefreshing = false;
        refreshError = error;
        localStorage.removeItem("user");
        // Redirect to login after a tick to avoid race conditions with error callbacks
        setTimeout(() => {
          window.location.href = "/login";
        }, 0);
        return Promise.reject(error);
      } else {
        // Refresh is already in-flight, queue this request
        return new Promise((resolve, reject) => {
          subscribeToRefresh((error) => {
            if (error) {
              // Refresh failed - reject queued request with the refresh error
              reject(error);
            } else {
              // Refresh succeeded - retry this request
              axiosInstance(originalRequest).then(resolve).catch(reject);
            }
          });
        });
      }
    }

    return Promise.reject(error);
  },
);

// ============================================================================
// REFRESH REGISTRY - Manage data refresh callbacks
// ============================================================================

type RefreshCallback = () => void | Promise<void>;
const refreshRegistry: Map<string, RefreshCallback> = new Map();

export const refreshManager = {
  /**
   * Register a refresh callback for a specific key
   * @param key - Unique identifier for the refresh (e.g., 'cargos', 'categorias')
   * @param callback - Function to call when refresh is needed
   */
  register: (key: string, callback: RefreshCallback) => {
    refreshRegistry.set(key, callback);
  },

  /**
   * Unregister a refresh callback
   * @param key - The key to unregister
   */
  unregister: (key: string) => {
    refreshRegistry.delete(key);
  },

  /**
   * Trigger a refresh for a specific key
   * @param key - The key to refresh
   */
  refresh: async (key: string) => {
    const callback = refreshRegistry.get(key);
    if (callback) {
      await callback();
    }
  },

  /**
   * Trigger multiple refreshes
   * @param keys - Array of keys to refresh
   */
  refreshMultiple: async (keys: string[]) => {
    await Promise.all(keys.map((key) => refreshManager.refresh(key)));
  },
};

export interface RequestOptions<T = any> extends Omit<
  AxiosRequestConfig<T>,
  "url" | "method"
> {
  withCredentials?: boolean;
  refreshKey?: string | string[];
}

export function request<T = any>(
  path: string,
  method: Method,
  options: RequestOptions = {},
  onSuccess?: (data: T) => void,
  onError?: (error: any) => void,
): void {
  const { refreshKey, ...requestOptions } = options;

  const requestHeaders = {
    ...requestOptions.headers,
  };

  const isFormData = requestOptions.data instanceof FormData;
  if (isFormData) {
    delete requestHeaders["Content-Type"];
    delete requestHeaders["content-type"];
  }

  axiosInstance
    .request<T>({
      url: path,
      method,
      baseURL: options.baseURL ?? API_BASE_URL,
      ...requestOptions,
      headers: requestHeaders,
    })
    .then((response) => {
      // Always call success callback - let the component decide what to do
      if (onSuccess) onSuccess(response.data);

      // Trigger refresh if refreshKey is provided
      if (refreshKey) {
        if (Array.isArray(refreshKey)) {
          refreshManager.refreshMultiple(refreshKey);
        } else {
          refreshManager.refresh(refreshKey);
        }
      }
    })
    .catch((error) => {
      // Don't process error callback if we're being redirected to login
      // This prevents cascading error handlers during logout
      if (
        window.location.pathname.includes("/login") &&
        error.response?.status !== 401
      ) {
        console.debug(
          "[Request] Error suppressed during logout - user is being redirected to login",
        );
        return;
      }

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
