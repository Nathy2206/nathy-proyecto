export function TaskListSkeleton() {
  return (
    <div className="flex flex-col md:flex-row gap-6 w-full mt-4 animate-pulse">
      {/* Esqueleto contenedor 1 */}
      <div className="flex-1 rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 min-h-[300px]">
        <div className="h-5 w-36 bg-zinc-800 rounded mx-auto mb-4" />
        <div className="h-12 bg-zinc-800/50 rounded mb-2" />
        <div className="h-12 bg-zinc-800/50 rounded" />
      </div>

      {/* Esqueleto contenedor 2 */}
      <div className="flex-1 rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 min-h-[300px]">
        <div className="h-5 w-36 bg-zinc-800 rounded mx-auto mb-4" />
        <div className="h-12 bg-zinc-800/50 rounded mb-2" />
        <div className="h-12 bg-zinc-800/50 rounded" />
      </div>
    </div>
  );
}