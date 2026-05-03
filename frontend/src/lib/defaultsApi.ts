/**
 * API helpers for fetching default items and non-default lists
 * Provides type-safe methods for accessing defaults and regular items
 */

import { api } from "./request";

export interface DefaultItemResponse<T> {
  data: T & { isDefault: boolean };
  error: null | string;
}

export interface ListResponse<T> {
  data: T[];
  error: null | string;
}

/**
 * Cargo API helpers
 */
export const cargoApi = {
  getDefault: (
    onSuccess?: (data: any) => void,
    onError?: (error: any) => void,
  ) =>
    api.get<DefaultItemResponse<any>>("/cargo/default", {}, onSuccess, onError),

  getList: (onSuccess?: (data: any) => void, onError?: (error: any) => void) =>
    api.get<ListResponse<any>>("/cargo", {}, onSuccess, onError),

  getById: (
    id: number,
    onSuccess?: (data: any) => void,
    onError?: (error: any) => void,
  ) => api.get<any>(`/cargo/${id}`, {}, onSuccess, onError),
};

/**
 * Categoria API helpers
 */
export const categoriaApi = {
  getDefault: (
    onSuccess?: (data: any) => void,
    onError?: (error: any) => void,
  ) =>
    api.get<DefaultItemResponse<any>>(
      "/categoria/default",
      {},
      onSuccess,
      onError,
    ),

  getList: (onSuccess?: (data: any) => void, onError?: (error: any) => void) =>
    api.get<ListResponse<any>>("/categoria", {}, onSuccess, onError),

  getById: (
    id: number,
    onSuccess?: (data: any) => void,
    onError?: (error: any) => void,
  ) => api.get<any>(`/categoria/${id}`, {}, onSuccess, onError),
};

/**
 * Sala (Localizacao) API helpers
 */
export const salaApi = {
  getDefault: (
    onSuccess?: (data: any) => void,
    onError?: (error: any) => void,
  ) =>
    api.get<DefaultItemResponse<any>>(
      "/localizacao/default",
      {},
      onSuccess,
      onError,
    ),

  getList: (onSuccess?: (data: any) => void, onError?: (error: any) => void) =>
    api.get<ListResponse<any>>("/localizacao", {}, onSuccess, onError),

  getById: (
    id: number,
    onSuccess?: (data: any) => void,
    onError?: (error: any) => void,
  ) => api.get<any>(`/localizacao/${id}`, {}, onSuccess, onError),
};

/**
 * Utilizador API helpers
 */
export const utilizadorApi = {
  getDefault: (
    onSuccess?: (data: any) => void,
    onError?: (error: any) => void,
  ) =>
    api.get<DefaultItemResponse<any>>(
      "/utilizador/default",
      {},
      onSuccess,
      onError,
    ),

  getList: (onSuccess?: (data: any) => void, onError?: (error: any) => void) =>
    api.get<ListResponse<any>>("/utilizador", {}, onSuccess, onError),

  getById: (
    id: number,
    onSuccess?: (data: any) => void,
    onError?: (error: any) => void,
  ) => api.get<any>(`/utilizador/${id}`, {}, onSuccess, onError),
};
