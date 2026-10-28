export function TaskListSkeleton() {
  return (
    <ul
      aria-busy="true"
      aria-label="Cargando tareas"
      className="rounded-lg border border-border bg-surface divide-y divide-border"
    >
      {[1, 2, 3].map((i) => (
        <li key={i} className="flex items-center gap-3 px-4 py-3">
          <span className="size-5 rounded-full bg-border animate-pulse" />
          <span className="h-4 flex-1 rounded bg-border animate-pulse" />
        </li>
      ))}
    </ul>
  );
}
