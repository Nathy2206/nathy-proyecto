"use client";

import { useTasks } from "@/hooks/useTasks";
import type { Task } from "@/lib/types";
import { TaskColumn } from "./TaskColumn";
import { TaskForm } from "./TaskForm";
import { TaskListSkeleton } from "./TaskListSkeleton";
import { TaskStats } from "./TaskStats";

export function TaskBoard() {
  const { tasks, loading, error, createTask, toggleTask, deleteTask } = useTasks();

  const pending = tasks.filter((t) => !t.done);
  const completed = tasks.filter((t) => t.done);

  const handleCreateTask = async (title: string): Promise<string | null> => {
    try {
      await createTask(title);
      return null;
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } }; message?: string })?.response
          ?.data?.message ||
        (err as Error)?.message ||
        "No se pudo crear la tarea";
      return message;
    }
  };

  const handleToggle = (task: Task) => {
    toggleTask(task.id);
  };

  const handleDelete = (task: Task) => {
    deleteTask(task.id);
  };

  return (
    <div className="space-y-6">
      <TaskForm onCreate={handleCreateTask} />

      {error && (
        <p role="alert" className="rounded-lg border border-danger/40 bg-surface px-4 py-3 text-sm text-danger">
          {error}
        </p>
      )}

      {loading ? (
        <TaskListSkeleton />
      ) : (
        <div className="space-y-3">
          <TaskStats tasks={tasks} />
          <div className="grid gap-6 md:grid-cols-2">
            <TaskColumn
              title="Pendientes"
              emptyText="No hay tareas pendientes."
              tasks={pending}
              onToggle={handleToggle}
              onDelete={handleDelete}
            />
            <TaskColumn
              title="Realizadas"
              emptyText="No hay tareas completadas."
              tasks={completed}
              onToggle={handleToggle}
              onDelete={handleDelete}
            />
          </div>
        </div>
      )}
    </div>
  );
}