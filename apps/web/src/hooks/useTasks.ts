"use client";

import { useState, useEffect, useCallback } from "react";
import { tasksApi } from "@/lib/http/tasks";
import type { Task, UpdateTaskInput } from "@/lib/types";

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const normalizeTask = (t: Record<string, unknown>): Task => ({
    ...(t as unknown as Task),
    done: t.done !== undefined ? Boolean(t.done) : Boolean(t.completed),
    completed: t.completed !== undefined ? Boolean(t.completed) : Boolean(t.done),
  });

  const loadTasks = useCallback(async () => {
    try {
      setError(null);
      const data = await tasksApi.list();
      setTasks(data.map((item) => normalizeTask(item as unknown as Record<string, unknown>)));
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } }; message?: string })?.response
          ?.data?.message ||
        (err as Error)?.message ||
        "Error al cargar tareas";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const createTask = async (title: string) => {
    try {
      const created = await tasksApi.create(title);
      const task = normalizeTask(created as unknown as Record<string, unknown>);
      setTasks((prev) => [task, ...prev]);
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } }; message?: string })?.response
          ?.data?.message ||
        (err as Error)?.message ||
        "Error al crear tarea";
      setError(message);
      throw err;
    }
  };

  const toggleTask = async (id: string) => {
    const target = tasks.find((t) => t.id === id);
    if (!target) return;

    const nextState = !(target.done ?? target.completed);

    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, done: nextState, completed: nextState } : t
      )
    );

    try {
      await tasksApi.update(id, {
        done: nextState,
        completed: nextState,
      } as UpdateTaskInput);
    } catch (err: unknown) {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, done: !nextState, completed: !nextState } : t
        )
      );
      const message =
        (err as { response?: { data?: { message?: string } }; message?: string })?.response
          ?.data?.message ||
        (err as Error)?.message ||
        "Error al actualizar estado";
      setError(message);
    }
  };

  const deleteTask = async (id: string) => {
    const prevTasks = [...tasks];
    setTasks((prev) => prev.filter((t) => t.id !== id));

    try {
      await tasksApi.remove(id);
    } catch (err: unknown) {
      setTasks(prevTasks);
      const message =
        (err as { response?: { data?: { message?: string } }; message?: string })?.response
          ?.data?.message ||
        (err as Error)?.message ||
        "Error al eliminar tarea";
      setError(message);
    }
  };

  return {
    tasks,
    loading,
    error,
    createTask,
    toggleTask,
    deleteTask,
    refetch: loadTasks,
  };
}