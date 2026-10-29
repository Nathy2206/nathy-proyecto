import type { Task } from "@/lib/types";
import { TaskItem } from "./TaskItem";

type Props = {
  title: string;
  emptyText: string;
  tasks: Task[];
  onToggle: (task: Task) => void;
  onDelete: (task: Task) => void;
};

export function TaskColumn({ title, emptyText, tasks, onToggle, onDelete }: Props) {
  return (
    <section className="rounded-xl border border-border bg-surface p-4">
      <h2 className="mb-3 flex items-center justify-between text-sm font-medium">
        {title}
        <span className="text-muted">{tasks.length}</span>
      </h2>

      {tasks.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border px-4 py-10 text-center text-sm text-muted">
          {emptyText}
        </p>
      ) : (
        <ul className="space-y-2">
          {tasks.map((task) => (
            <TaskItem key={task.id} task={task} onToggle={onToggle} onDelete={onDelete} />
          ))}
        </ul>
      )}
    </section>
  );
}
