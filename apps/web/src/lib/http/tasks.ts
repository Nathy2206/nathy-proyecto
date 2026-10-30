import type { Task, UpdateTaskInput } from "@/lib/types";
import { apiClient } from "./client";

export const tasksApi = {
  list: async (): Promise<Task[]> => {
    const res = await apiClient.get("/tasks");
    if (Array.isArray(res.data)) return res.data;
    if (Array.isArray(res.data?.data)) return res.data.data;
    if (Array.isArray(res.data?.tasks)) return res.data.tasks;
    return [];
  },
  create: async (title: string): Promise<Task> => {
    const res = await apiClient.post("/tasks", { title });
    return res.data?.data || res.data;
  },
  update: async (id: string, data: UpdateTaskInput): Promise<Task> => {
    const res = await apiClient.patch(`/tasks/${id}`, data);
    return res.data?.data || res.data;
  },
  remove: async (id: string): Promise<void> => {
    await apiClient.delete(`/tasks/${id}`);
  },
};