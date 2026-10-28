import { connection } from "next/server";
import { api } from "@/lib/api";
import { TaskListSkeleton } from "./TaskListSkeleton";
import { TaskStats } from "./TaskStats";

export async function TaskList() {
  await connection();

  let tasks = [];
  try {
    tasks = await api.listTasks();
  } catch {
    return (
      <div className="rounded-lg border border-danger/40 bg-surface px-4 py-6 text-sm text-danger">
        No se pudo conectar con la API. ¿Está corriendo el servicio <code>api</code>?
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <TaskStats tasks={tasks} />
      {/* Esto es lo que invoca tus dos columnas */}
      <TaskListSkeleton initialTasks={tasks} /> 
    </div>
  );
}