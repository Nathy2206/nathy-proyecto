import type { Task, UpdateTaskInput } from "@/lib/types";
import { apiClient } from "./client";

export const tasksApi = {
  list: () => apiClient.get<Task[]>("/tasks").then((res) => res.data),
  create: (title: string) => apiClient.post<Task>("/tasks", { title }).then((res) => res.data),
  update: (id: string, data: UpdateTaskInput) =>
    apiClient.patch<Task>(`/tasks/${id}`, data).then((res) => res.data),
  remove: (id: string) => apiClient.delete<void>(`/tasks/${id}`).then(() => undefined),
};
