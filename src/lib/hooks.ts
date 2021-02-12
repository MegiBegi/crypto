import { useRef, useEffect } from "react";

export function useConstant<T>(fn: () => T): T {
  const ref = useRef<{ value: T }>();

  if (!ref.current) {
    ref.current = { value: fn() };
  }

  return ref.current.value;
}

export function usePrevious(value) {
  // The ref object is a generic container whose current property is mutable ...
  // ... and can hold any value, similar to an instance property on a class
  const ref = useRef();

  // Store current value in ref
  useEffect(() => {
    ref.current = value;
  }, [value]); // Only re-run if value changes

  // Return previous value (happens before update in useEffect above)
  return ref.current;
}
