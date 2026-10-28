'use client';

import React from 'react';
import { Task } from '../lib/types';

interface TaskItemProps {
  task: Task;
  onToggleStatus: (id: string, currentStatus: boolean) => void;
  onDelete: (id: string) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, onToggleStatus, onDelete }) => {
  const isDone = Boolean(task.done ?? (task as any).isCompleted);

  return (
    <div className="flex items-center justify-between p-3 my-2 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors">
      {/* Selector circular y título */}
      <button
        type="button"
        onClick={() => onToggleStatus(task.id, isDone)}
        className="flex items-center gap-3 text-left flex-1 cursor-pointer bg-transparent border-none text-white"
      >
        <span
          className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
            isDone
              ? 'bg-emerald-500 border-emerald-500 text-black text-xs font-bold'
              : 'border-zinc-600 hover:border-zinc-400'
          }`}
        >
          {isDone ? '✓' : ''}
        </span>
        <span className={`text-sm ${isDone ? 'line-through text-zinc-500' : 'text-zinc-200'}`}>
          {task.title}
        </span>
      </button>

      {/* Botón Eliminar original */}
      <button
        type="button"
        onClick={() => onDelete(task.id)}
        className="text-xs text-zinc-500 hover:text-red-400 px-2 py-1 transition-colors cursor-pointer bg-transparent border-none"
      >
        Eliminar
      </button>
    </div>
  );
};