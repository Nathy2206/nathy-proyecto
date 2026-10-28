'use client';

import React from 'react';
import { Task } from '../lib/types';
import { TaskItem } from './TaskItem';

interface PendingTasksProps {
  tasks: Task[];
  onToggleStatus: (id: string, status: boolean) => void;
  onDelete: (id: string) => void;
}

export const PendingTasks: React.FC<PendingTasksProps> = ({ tasks, onToggleStatus, onDelete }) => {
  return (
    <div className="flex-1 rounded-xl border border-red-500/40 bg-zinc-950/40 p-5 min-h-[350px]">
      <h2 className="text-center font-medium text-red-400 mb-4">Tareas Pendientes</h2>
      {tasks.length === 0 ? (
        <div className="flex items-center justify-center h-48 border border-dashed border-zinc-800 rounded-lg text-zinc-500 text-sm">
          No hay tareas pendientes.
        </div>
      ) : (
        tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggleStatus={onToggleStatus}
            onDelete={onDelete}
          />
        ))
      )}
    </div>
  );
};