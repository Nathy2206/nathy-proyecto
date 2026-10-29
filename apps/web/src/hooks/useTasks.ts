"use client";

import { useCallback, useEffect, useState } from "react";
import { tasksApi } from "@/lib/http/tasks";
import type { Task } from "@/lib/types";

const errorMessage = (e: unknown, fallback: string) => (e instanceof Error ? e.message : fallback);

/** Estado de las tareas sincronizado con la API, con actualizaciones optimistas. */
export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    tasksApi
      .list()
      .then((data) => !cancelled && setTasks(data))
      .catch((e) => !cancelled && setError(errorMessage(e, "No se pudieron cargar las tareas.")))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  /** Devuelve el mensaje de error si falla, para que el formulario lo muestre. */
  const createTask = useCallback(async (title: string): Promise<string | null> => {
    try {
      const task = await tasksApi.create(title);
      setTasks((prev) => [task, ...prev]);
      return null;
    } catch (e) {
      return errorMessage(e, "No se pudo crear la tarea.");
    }
  }, []);

  const toggleTask = useCallback(async (task: Task) => {
    const done = !task.done;
    setError(null);
    setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, done } : t)));
    try {
      await tasksApi.update(task.id, { done });
    } catch (e) {
      setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, done: task.done } : t)));
      setError(errorMessage(e, "No se pudo actualizar la tarea."));
    }
  }, []);

  const deleteTask = useCallback(async (task: Task) => {
    setError(null);
    setTasks((prev) => prev.filter((t) => t.id !== task.id));
    try {
      await tasksApi.remove(task.id);
    } catch (e) {
      setTasks((prev) => [task, ...prev]);
      setError(errorMessage(e, "No se pudo eliminar la tarea."));
    }
  }, []);

  return { tasks, loading, error, createTask, toggleTask, deleteTask };
}
