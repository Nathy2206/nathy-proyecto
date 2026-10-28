"use server";

import { refresh, revalidatePath } from "next/cache";
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
  try {
    await api.updateTask(id, { done });
    refresh();
  } catch (error) {
    console.error("Error al actualizar la tarea:", error);
    throw error;
  }
}

/**
 * Nueva Server Action con manejo de errores controlado y revalidación de ruta.
 */
export async function deleteTaskAction(id: string) {
  try {
    // 1. Llamar a tu función de la API de NestJS
    await api.deleteTask(id);

    // 2. Revalidar la ruta principal para actualizar la vista sin recargar
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error al eliminar la tarea:", error);
    // No rompe la interfaz del cliente al capturar el error
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "No se pudo eliminar la tarea" 
    };
  }
}

/**
 * Mantiene compatibilidad con componentes previos que llaman directamente a `deleteTask(id)`.
 */
export async function deleteTask(id: string) {
  const result = await deleteTaskAction(id);
  refresh();
  return result;
}