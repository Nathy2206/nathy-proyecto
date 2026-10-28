"use client";

import { useActionState, useEffect, useRef } from "react";
import { createTask, type FormState } from "@/lib/actions";

const initialState: FormState = {};

export function TaskForm() {
  const [state, formAction, pending] = useActionState(createTask, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  // Limpia el input después de crear la tarea
  useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="space-y-2">
      <div className="flex gap-2">
        <label htmlFor="title" className="sr-only">
          Nueva tarea
        </label>
        <input
          id="title"
          name="title"
          placeholder="¿Qué hay que hacer?"
          maxLength={120}
          autoComplete="off"
          className="flex-1 rounded-lg border border-border bg-surface px-3 py-2 outline-none focus:border-accent"
        />
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-accent text-accent-foreground px-4 py-2 font-medium disabled:opacity-60"
        >
          {pending ? "Agregando…" : "Agregar"}
        </button>
      </div>
      {state.error && (
        <p role="alert" className="text-sm text-danger">
          {state.error}
        </p>
      )}
    </form>
  );
}
