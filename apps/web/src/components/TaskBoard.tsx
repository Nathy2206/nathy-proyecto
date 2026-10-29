"use client";

import { useTasks } from "@/hooks/useTasks";
import { TaskColumn } from "./TaskColumn";
import { TaskForm } from "./TaskForm";
import { TaskListSkeleton } from "./TaskListSkeleton";
import { TaskStats } from "./TaskStats";

export function TaskBoard() {
  const { tasks, loading, error, createTask, toggleTask, deleteTask } = useTasks();

  const pending = tasks.filter((t) => !t.done);
  const completed = tasks.filter((t) => t.done);

  return (
    <div className="space-y-6">
      <TaskForm onCreate={createTask} />

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
              onToggle={toggleTask}
              onDelete={deleteTask}
            />
            <TaskColumn
              title="Realizadas"
              emptyText="No hay tareas completadas."
              tasks={completed}
              onToggle={toggleTask}
              onDelete={deleteTask}
            />
          </div>
        </div>
      )}
    </div>
  );
}
