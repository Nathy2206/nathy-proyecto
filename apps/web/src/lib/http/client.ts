import axios, { AxiosError } from "axios";
import { API_URL } from "@/lib/config";

type ApiErrorBody = { message?: string | string[] };

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 10_000,
});

// Convierte los errores de NestJS (message puede ser un array de validaciones) en un Error legible
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorBody>) => {
    const message = error.response?.data?.message;
    const text = Array.isArray(message) ? message.join(", ") : message;
    return Promise.reject(new Error(text ?? error.message ?? "Error de conexión con la API"));
  },
);
