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

export async function request<T = any>(
  path: string,
  method: Method,
  options: RequestOptions = {},
): Promise<T> {
  try {
    const response = await axiosInstance.request<T>({
      url: path,
      method,
      baseURL: options.baseURL ?? API_BASE_URL,
      ...options,
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data ?? error.message;
    }
    throw error;
  }
}

export const api = {
  get: <T = any>(path: string, options?: RequestOptions<T>) =>
    request<T>(path, "GET", options),
  post: <T = any>(path: string, data?: unknown, options?: RequestOptions<T>) =>
    request<T>(path, "POST", { data, ...options }),
  put: <T = any>(path: string, data?: unknown, options?: RequestOptions<T>) =>
    request<T>(path, "PUT", { data, ...options }),
  patch: <T = any>(path: string, data?: unknown, options?: RequestOptions<T>) =>
    request<T>(path, "PATCH", { data, ...options }),
  delete: <T = any>(path: string, options?: RequestOptions<T>) =>
    request<T>(path, "DELETE", options),
};
