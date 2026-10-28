// apps/web/src/lib/http/task.hook.ts
'use client';

import { useState, useCallback } from 'react';
import type { Task } from '@/lib/types';
import { useHttp } from './http.hook';
import { ENDPOINTS } from './endpoints';

// 1. Obtener tareas
export const useGetTasks = () => {
  const { get, loading, error } = useHttp();
  const [tasks, setTasks] = useState<Task[]>([]);

  const fetchTasks = useCallback(async () => {
    const data = await get<Task[]>(`${ENDPOINTS.tasks}`);
    setTasks(data);
    return data;
  }, [get]);

  return { tasks, fetchTasks, loading, error, setTasks };
};

// 2. Crear o actualizar (Upsert)
export const useUpsertTask = () => {
  const { post, put, loading, error } = useHttp();

  const upsertTask = useCallback(
    async (task: Partial<Task> & { title: string }): Promise<Task> => {
      if (task.id) {
        // Actualizar tarea existente (PUT /tasks/:id)
        return await put<Task>(`${ENDPOINTS.tasks}/${task.id}`, task);
      } else {
        // Crear nueva tarea (POST /tasks)
        return await post<Task>(ENDPOINTS.tasks, task);
      }
    },
    [post, put]
  );

  return { upsertTask, loading, error };
};

// 3. Eliminar tarea
export const useDeleteTask = () => {
  const { del, loading, error } = useHttp();

  const deleteTask = useCallback(
    async (id: string | number) => {
      return await del<{ success: boolean }>(`${ENDPOINTS.tasks}/${id}`);
    },
    [del]
  );

  return { deleteTask, loading, error };
};