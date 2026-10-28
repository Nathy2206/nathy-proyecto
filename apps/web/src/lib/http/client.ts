// apps/web/src/lib/http/client.ts
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { BASE_URL } from './endpoints';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Inyectar Token si existe en el navegador
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Interceptor para estandarizar mensajes de error
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    const errorMsg =
      error.response?.data?.message || error.message || 'Error de conexión con el servidor';
    return Promise.reject(new Error(errorMsg));
  }
);