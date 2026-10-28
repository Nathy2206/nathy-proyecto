'use client';

import React, { useState, useEffect } from 'react';
import { Task } from '../lib/types';
import { PendingTasks } from './PendingTasks';
import { CompletedTasks } from './CompletedTasks';
import { useRouter } from 'next/navigation';
import { useUpsertTask, useDeleteTask, useGetTasks } from '@/lib/http/task.hook';

interface TaskBoardProps {
  initialTasks?: Task[];
}

export const TaskBoard: React.FC<TaskBoardProps> = ({ initialTasks = [] }) => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const router = useRouter();

  const { upsertTask } = useUpsertTask();
  const { deleteTask } = useDeleteTask();
  const { fetchTasks, loading, error } = useGetTasks();

  useEffect(() => {
    let cancelled = false;

    fetchTasks()
      .then((fetchedTasks) => {
        if (!cancelled) setTasks(fetchedTasks);
      })
      .catch((error: unknown) => {
        if (!cancelled) console.error('Error al obtener tareas:', error);
      });

    return () => {
      cancelled = true;
    };
  }, [fetchTasks]);

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    const taskToUpdate = tasks.find((t) => String(t.id) === String(id));
    if (!taskToUpdate) return;

    const newStatus = !currentStatus;

    // 1. Actualización optimista inmediata en la UI
    setTasks((prev) =>
      prev.map((t) =>
        String(t.id) === String(id)
          ? { ...t, done: newStatus }
          : t
      )
    );

    try {
      // 2. Enviamos el objeto con su título real (no vacío)
      await upsertTask({
        ...taskToUpdate,
        id,
        done: newStatus,
      });

      router.refresh();
    } catch (error) {
      console.error('Error al actualizar tarea:', error);
      // Revertir en caso de fallo
      setTasks((prev) =>
        prev.map((t) =>
          String(t.id) === String(id)
            ? { ...t, done: currentStatus }
            : t
        )
      );
    }
  };

  const handleDelete = async (id: string) => {
    const previous = [...tasks];
    // Actualización inmediata en UI
    setTasks((prev) => prev.filter((t) => String(t.id) !== String(id)));

    try {
      await deleteTask(id);
      router.refresh();
    } catch (error) {
      console.error('Error al eliminar tarea:', error);
      setTasks(previous);
    }
  };

  const isDone = (task: Task) => task.done;

  const pendingList = tasks.filter((t) => !isDone(t));
  const completedList = tasks.filter((t) => isDone(t));

  return (
    <div className="w-full mt-4">
      {error && (
        <p role="alert" className="mb-4 text-sm text-red-400">
          No se pudieron cargar las tareas: {error}
        </p>
      )}
      {loading && tasks.length === 0 && (
        <p role="status" className="mb-4 text-sm text-zinc-400">
          Cargando tareas…
        </p>
      )}
      <div className="flex flex-col md:flex-row gap-6">
        <PendingTasks
          tasks={pendingList}
          onToggleStatus={handleToggleStatus}
          onDelete={handleDelete}
        />
        <CompletedTasks
          tasks={completedList}
          onToggleStatus={handleToggleStatus}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
};