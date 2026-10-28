import type { Task } from "@/lib/types";

export function TaskStats({ tasks }: { tasks: Task[] }) {
  const done = tasks.filter((t) => t.done).length;
  return (
    <p className="text-sm text-muted">
      {done} de {tasks.length} completadas
    </p>
  );
}
