import { TaskBoard } from "@/components/TaskBoard";

export default function HomePage() {
  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Mis tareas</h1>
        <p className="text-sm text-muted">
          Agrega, completa y elimina tareas. Se guardan en PostgreSQL a través de la API.
        </p>
      </div>

      <TaskBoard />
    </section>
  );
}
