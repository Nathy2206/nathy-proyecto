export function Header() {
  return (
    <header className="border-b border-border bg-surface">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        <span className="font-semibold tracking-tight">
          <span className="text-accent">●</span> Tareas
        </span>
        <nav className="text-sm text-muted">Next.js · NestJS · PostgreSQL</nav>
      </div>
    </header>
  );
}
