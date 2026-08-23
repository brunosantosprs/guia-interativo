'use client';

import * as React from 'react';
import type { ToastProps } from '@/components/ui/toast';

/**
 * Store minimalista de toasts (padrao shadcn/ui, simplificado).
 * Mantem uma fila global fora do React e notifica os componentes inscritos.
 */
const TOAST_LIMIT = 3;
const TOAST_REMOVE_DELAY = 5000;

export interface ToasterToast extends Omit<ToastProps, 'title'> {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
}

let count = 0;
function nextId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

let memoryState: { toasts: ToasterToast[] } = { toasts: [] };
const listeners: Array<(state: typeof memoryState) => void> = [];

function dispatch(next: typeof memoryState) {
  memoryState = next;
  listeners.forEach((listener) => listener(memoryState));
}

export function toast({ ...props }: Omit<ToasterToast, 'id'>) {
  const id = nextId();

  const dismiss = () =>
    dispatch({ toasts: memoryState.toasts.filter((t) => t.id !== id) });

  dispatch({
    toasts: [{ ...props, id, open: true }, ...memoryState.toasts].slice(0, TOAST_LIMIT),
  });

  setTimeout(dismiss, TOAST_REMOVE_DELAY);

  return { id, dismiss };
}

export function useToast() {
  const [state, setState] = React.useState(memoryState);

  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) listeners.splice(index, 1);
    };
  }, []);

  return {
    ...state,
    toast,
    dismiss: (id: string) =>
      dispatch({ toasts: memoryState.toasts.filter((t) => t.id !== id) }),
  };
}
