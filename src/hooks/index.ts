/**
 * Global hooks
 * -----------------------------------------------------------
 * Hook dùng chung cho toàn hệ thống (không thuộc feature riêng nào).
 * Hook riêng feature sẽ nằm trong src/features/<feature>/hooks/.
 */

import { useEffect, useState } from 'react';

/**
 * useDebounce — trì hoãn cập nhật giá trị (dùng cho search input).
 */
export function useDebounce<T>(value: T, delayMs = 300): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(t);
  }, [value, delayMs]);
  return debounced;
}

/**
 * useLocalStorageState — đồng bộ state với localStorage.
 */
export function useLocalStorageState<T>(
  key: string,
  initial: T,
): [T, (next: T | ((prev: T) => T)) => void] {
  const [state, setState] = useState<T>(() => {
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [key, state]);
  return [state, setState];
}
