import { Suspense } from "react";
import { TaskForm } from "@/components/TaskForm";
import { TaskList } from "@/components/TaskList";
import { TaskListSkeleton } from "@/components/TaskListSkeleton";

export default function HomePage() {
  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Mis tareas</h1>
        <p className="text-sm text-muted mt-1">
          Agrega, completa y elimina tareas. Se guardan en PostgreSQL a través de la API.
        </p>
      </div>

      <TaskForm />

      {/* Lo estático se muestra al instante; la lista se transmite cuando llegan los datos */}
      <Suspense fallback={<TaskListSkeleton />}>
        <TaskList />
      </Suspense>
    </section>
  );
}
