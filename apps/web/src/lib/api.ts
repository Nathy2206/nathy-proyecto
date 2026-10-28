import "server-only";
import type { Task } from "./types";

// URL interna de la API. En Docker es http://api:3001/api (red de compose).
const API_URL = process.env.API_URL ?? "http://localhost:3001/api";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: { "content-type": "application/json", ...init?.headers },
    cache: "no-store",
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const message = Array.isArray(body.message) ? body.message.join(", ") : body.message;
    throw new Error(message ?? `Error ${res.status} llamando a la API`);
  }
  return (res.status === 204 ? undefined : await res.json()) as T;
}

export const api = {
  listTasks: () => request<Task[]>("/tasks"),
  createTask: (title: string) =>
    request<Task>("/tasks", { method: "POST", body: JSON.stringify({ title }) }),
  updateTask: (id: string, data: Partial<Pick<Task, "title" | "done">>) =>
    request<Task>(`/tasks/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  deleteTask: (id: string) => request<void>(`/tasks/${id}`, { method: "DELETE" }),
};
