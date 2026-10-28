'use client';

import React, { useState } from 'react';
import { Task } from '../lib/types';
import { PendingTasks } from './PendingTasks';
import { CompletedTasks } from './CompletedTasks';

interface TaskBoardProps {
  initialTasks: Task[];
}

export const TaskBoard: React.FC<TaskBoardProps> = ({ initialTasks }) => {
  // Iniciamos el tablero con los datos reales que vienen de PostgreSQL
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    // 1. Actualizamos la pantalla de inmediato (Optimistic UI)
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !currentStatus } : t))
    );

    // 2. Aquí debes hacer tu petición PATCH/PUT a NestJS para guardar el cambio en BD
    /*
    await fetch(`http://localhost:3001/api/tasks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ done: !currentStatus })
    });
    */
  };

  const pendingList = tasks.filter((t) => !t.done);
  const completedList = tasks.filter((t) => t.done);

  return (
    <div style={{ display: 'flex', gap: '24px', width: '100%', marginTop: '20px' }}>
      <CompletedTasks tasks={completedList} onToggleStatus={handleToggleStatus} />
      <PendingTasks tasks={pendingList} onToggleStatus={handleToggleStatus} />
    </div>
  );
};