'use client';

import { Task } from "@/lib/types";
import { TaskItem } from "./TaskItem";

interface CompletedTasksProps {
  tasks: Task[];
  onToggleStatus: (id: string, status: boolean) => void;
}

export function CompletedTasks({ tasks, onToggleStatus }: CompletedTasksProps) {
  return (
    <div className="flex-1 min-h-[300px] rounded-lg border-2 border-emerald-500 p-4 bg-surface flex flex-col gap-4">
      <h2 className="text-center font-medium text-emerald-500">
        Tareas Realizadas
      </h2>
      
      {tasks.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border px-4 py-10 text-center text-sm text-muted">
          No hay tareas completadas.
        </div>
      ) : (
        <ul className="rounded-lg border border-border bg-surface divide-y divide-border">
          {tasks.map((task) => (
            <TaskItem 
              key={task.id} 
              task={task} 
              onToggleStatus={onToggleStatus} 
            />
          ))}
        </ul>
      )}
    </div>
  );
}