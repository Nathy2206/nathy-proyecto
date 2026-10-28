'use client';

import { useState } from "react";
import { Task } from "../lib/types";
import { PendingTasks } from "./PendingTasks";
import { CompletedTasks } from "./CompletedTasks";

interface TaskListSkeletonProps {
  initialTasks: Task[];
}

export function TaskListSkeleton({ initialTasks }: TaskListSkeletonProps) {
  // Guardamos las tareas que vienen de la API en el estado local del cliente
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    // 1. Actualizamos la interfaz inmediatamente (Optimistic UI) para moverla de columna
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !currentStatus } : t)) 
    );

    // 2. Hacemos la petición a la API de NestJS para guardar el cambio en PostgreSQL
    try {
      await fetch(`http://localhost:3001/api/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        // IMPORTANTE: Si en tu API de NestJS lo llamaste "isCompleted", aquí deberías mandar { isCompleted: !currentStatus }
        // Si en tu API lo llamaste "done", manda { done: !currentStatus }
        body: JSON.stringify({ done: !currentStatus }),
      });
    } catch (error) {
      console.error("Error al actualizar la tarea:", error);
    }
  };

  // Filtramos usando la propiedad 'done' que es la correcta según tu type
  const pendingList = tasks.filter((t) => !t.done); 
  const completedList = tasks.filter((t) => t.done);

  return (
    // Las clases 'flex md:flex-row' aseguran que se divida en 2 columnas en pantallas grandes
    <div className="flex flex-col md:flex-row w-full gap-6 mt-6">
      <PendingTasks 
        tasks={pendingList} 
        onToggleStatus={handleToggleStatus} 
      />
      <CompletedTasks 
        tasks={completedList} 
        onToggleStatus={handleToggleStatus} 
      />
    </div>
  );
}