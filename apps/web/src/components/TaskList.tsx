import { connection } from "next/server";
import { api } from "@/lib/api";
import { TaskItem } from "./TaskItem";
import { TaskStats } from "./TaskStats";

export async function TaskList() {
  // Datos por request: no se pre-renderizan en el build
  await connection();

  let tasks;
  try {
    tasks = await api.listTasks();
  } catch {
    return (
      <div className="rounded-lg border border-danger/40 bg-surface px-4 py-6 text-sm text-danger">
        No se pudo conectar con la API. ¿Está corriendo el servicio <code>api</code>?
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border px-4 py-10 text-center text-sm text-muted">
        No hay tareas todavía. Agrega la primera arriba.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <TaskStats tasks={tasks} />
      <ul className="rounded-lg border border-border bg-surface divide-y divide-border">
        {tasks.map((task) => (
          <TaskItem key={task.id} task={task} />
        ))}
      </ul>
    </div>
  );
}
