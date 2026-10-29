export function TaskListSkeleton() {
  return (
    <div className="grid animate-pulse gap-6 md:grid-cols-2" aria-hidden>
      {[0, 1].map((column) => (
        <div key={column} className="rounded-xl border border-border bg-surface p-4">
          <div className="mb-4 h-4 w-24 rounded bg-border" />
          <div className="mb-2 h-10 rounded bg-border/60" />
          <div className="h-10 rounded bg-border/60" />
        </div>
      ))}
    </div>
  );
}
