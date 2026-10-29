import type { Task } from "@/lib/types";

type Props = {
  task: Task;
  onToggle: (task: Task) => void;
  onDelete: (task: Task) => void;
};

export function TaskItem({ task, onToggle, onDelete }: Props) {
  return (
    <li className="flex items-center gap-3 rounded-lg border border-border px-3 py-2">
      <button
        type="button"
        onClick={() => onToggle(task)}
        aria-label={task.done ? "Marcar como pendiente" : "Marcar como hecha"}
        title={task.done ? "Marcar como pendiente" : "Marcar como hecha"}
        className={`grid size-5 shrink-0 place-items-center rounded-full border-2 text-[10px] ${
          task.done ? "border-accent bg-accent text-accent-foreground" : "border-border hover:border-accent"
        }`}
      >
        {task.done ? "✓" : ""}
      </button>

      <span className={`flex-1 break-words text-sm ${task.done ? "text-muted line-through" : ""}`}>
        {task.title}
      </span>

      <button
        type="button"
        onClick={() => onDelete(task)}
        className="text-xs text-muted hover:text-danger"
      >
        Eliminar
      </button>
    </li>
  );
}
