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
          // Token invalid, clear localStorage (router will handle redirect if on protected route)
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
