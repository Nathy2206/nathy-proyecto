"use client";

import { useState, type FormEvent } from "react";

const MAX_TITLE = 120;

type Props = {
  /** Devuelve un mensaje de error o null si se creó correctamente. */
  onCreate: (title: string) => Promise<string | null>;
};

export function TaskForm({ onCreate }: Props) {
  const [title, setTitle] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = title.trim();
    if (!value) return setError("Escribe un título para la tarea.");

    setPending(true);
    const result = await onCreate(value);
    setPending(false);

    setError(result);
    if (!result) setTitle("");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="flex gap-2">
        <label htmlFor="title" className="sr-only">
          Nueva tarea
        </label>
        <input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="¿Qué hay que hacer?"
          maxLength={MAX_TITLE}
          autoComplete="off"
          className="flex-1 rounded-lg border border-border bg-surface px-3 py-2 outline-none focus:border-accent"
        />
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-accent px-4 py-2 font-medium text-accent-foreground disabled:opacity-60"
        >
          {pending ? "Agregando…" : "Agregar"}
        </button>
      </div>
      {error && (
        <p role="alert" className="text-sm text-danger">
          {error}
        </p>
      )}
    </form>
  );
}
