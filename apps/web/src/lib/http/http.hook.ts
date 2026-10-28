// apps/web/src/lib/http/http.hook.ts
'use client';

import { useState, useCallback } from 'react';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { apiClient } from './client';

export interface UseHttpReturn {
  loading: boolean;
  error: string | null;
  request: <T>(config: AxiosRequestConfig) => Promise<T>;
  get: <T>(url: string, config?: AxiosRequestConfig) => Promise<T>;
  post: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) => Promise<T>;
  put: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) => Promise<T>;
  patch: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) => Promise<T>;
  del: <T>(url: string, config?: AxiosRequestConfig) => Promise<T>;
}

export const useHttp = (): UseHttpReturn => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const request = useCallback(async <T>(config: AxiosRequestConfig): Promise<T> => {
    setLoading(true);
    setError(null);
    try {
      const response: AxiosResponse<T> = await apiClient(config);
      return response.data;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error desconocido';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const get = useCallback(
    <T>(url: string, config?: AxiosRequestConfig) => request<T>({ ...config, method: 'GET', url }),
    [request]
  );

  const post = useCallback(
    <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
      request<T>({ ...config, method: 'POST', url, data }),
    [request]
  );

  const put = useCallback(
    <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
      request<T>({ ...config, method: 'PUT', url, data }),
    [request]
  );

  const patch = useCallback(
    <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
      request<T>({ ...config, method: 'PATCH', url, data }),
    [request]
  );

  const del = useCallback(
    <T>(url: string, config?: AxiosRequestConfig) => request<T>({ ...config, method: 'DELETE', url }),
    [request]
  );

  return { loading, error, request, get, post, put, patch, del };
};