'use client';

import type { ReactNode } from 'react';
import { useFormStatus } from 'react-dom';

export function SubmitButton({ children, className }: { children: ReactNode; className?: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      aria-disabled={pending}
      disabled={pending}
      className={className ?? 'rounded-2xl bg-brand px-4 py-2 text-sm font-semibold text-white disabled:opacity-60'}
    >
      {pending ? 'Guardando...' : children}
    </button>
  );
}
