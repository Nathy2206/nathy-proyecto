"use client";

import { useFormStatus } from "react-dom";

type Props = {
  label: string;
  children: React.ReactNode;
  className?: string;
};

/** Botón de formulario que se deshabilita mientras su Server Action está en curso. */
export function SubmitButton({ label, children, className = "" }: Props) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      aria-label={label}
      title={label}
      disabled={pending}
      className={`disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  );
}
