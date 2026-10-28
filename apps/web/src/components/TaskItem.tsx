import { deleteTask, toggleTask } from "@/lib/actions";
import type { Task } from "@/lib/types";
import { SubmitButton } from "./SubmitButton";

interface TaskItemProps {
  task: Task;
  onToggleStatus: (id: string, status: boolean) => void;
}

export function TaskItem({ task, onToggleStatus }: TaskItemProps) {
  const toggleAction = toggleTask.bind(null, task.id, !task.done);
  const deleteAction = deleteTask.bind(null, task.id);

  return (
    <li className="flex items-center gap-3 px-4 py-3 bg-[#222] text-white rounded-md my-2">
      {/* Botón circular / checkbox de estado */}
      <form action={toggleAction}>
        <SubmitButton
          label={task.done ? "Marcar como pendiente" : "Marcar como hecha"}
          className={`size-5 rounded-full border-2 grid place-items-center text-[10px] cursor-pointer ${
            task.done ? "bg-accent border-accent text-accent-foreground" : "border-border"
          }`}
        >
          {task.done ? "✓" : ""}
        </SubmitButton>
      </form>

      {/* Título de la tarea */}
      <span className={`flex-1 ${task.done ? "line-through text-muted opacity-60" : ""}`}>
        {task.title}
      </span>

      {/* Botón textual de estado (Completar / Deshacer) */}
      <form action={toggleAction}>
        <SubmitButton
          label={task.done ? "Deshacer tarea" : "Completar tarea"}
          className={`px-3 py-1 text-sm rounded text-white font-medium transition-colors ${
            task.done ? "bg-amber-600 hover:bg-amber-700" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {task.done ? "Deshacer" : "Completar"}
        </SubmitButton>
      </form>

      {/* Botón de eliminación */}
      <form action={deleteAction}>
        <SubmitButton
          label="Eliminar tarea"
          className="text-sm text-muted hover:text-red-500 transition-colors ml-2"
        >
          Eliminar
        </SubmitButton>
      </form>
    </li>
  );
}