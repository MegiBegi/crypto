import { useRef } from "react";

export function useConstant<T>(fn: () => T): T {
  const ref = useRef<{ value: T }>();

  if (!ref.current) {
    ref.current = { value: fn() };
  }

  return ref.current.value;
}
