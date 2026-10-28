"use server";

import { refresh } from "next/cache";
import { api } from "./api";

export type FormState = { error?: string; ok?: boolean };

export async function createTask(_prev: FormState, formData: FormData): Promise<FormState> {
  const title = String(formData.get("title") ?? "").trim();
  if (!title) return { error: "Escribe un título para la tarea." };
  if (title.length > 120) return { error: "Máximo 120 caracteres." };

  try {
    await api.createTask(title);
  } catch (e) {
    return { error: e instanceof Error ? e.message : "No se pudo crear la tarea." };
  }
  refresh();
  return { ok: true };
}

export async function toggleTask(id: string, done: boolean) {
  await api.updateTask(id, { done });
  refresh();
}

export async function deleteTask(id: string) {
  await api.deleteTask(id);
  refresh();
}
