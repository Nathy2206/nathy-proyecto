import { deleteTask, toggleTask } from "@/lib/actions";
import type { Task } from "@/lib/types";
import { SubmitButton } from "./SubmitButton";

export function TaskItem({ task }: { task: Task }) {
  return (
    <li className="flex items-center gap-3 px-4 py-3">
      <form action={toggleTask.bind(null, task.id, !task.done)}>
        <SubmitButton
          label={task.done ? "Marcar como pendiente" : "Marcar como hecha"}
          className={`size-5 rounded-full border-2 grid place-items-center text-[10px] ${
            task.done ? "bg-accent border-accent text-accent-foreground" : "border-border"
          }`}
        >
          {task.done ? "✓" : ""}
        </SubmitButton>
      </form>

      <span className={`flex-1 ${task.done ? "line-through text-muted" : ""}`}>{task.title}</span>

      <form action={deleteTask.bind(null, task.id)}>
        <SubmitButton label="Eliminar tarea" className="text-sm text-muted hover:text-danger">
          Eliminar
        </SubmitButton>
      </form>
    </li>
  );
}
