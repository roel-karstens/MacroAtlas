"use client";

import { useSyncExternalStore } from "react";

type Snap<T> = { value: T; remember: boolean };

export function createBrowserStore<T>(key: string, parse: (value: unknown) => T | null, initial: T) {
  const listeners = new Set<() => void>();
  const serverSnap: Snap<T> = { value: initial, remember: false };
  let snap: Snap<T> = serverSnap;

  function load(): Snap<T> {
    try {
      const parsed = parse(JSON.parse(localStorage.getItem(key) ?? "null"));
      if (parsed) return { value: parsed, remember: true };
    } catch {
      /* Ignore unreadable local data. */
    }
    return { value: initial, remember: false };
  }

  if (typeof window !== "undefined") snap = load();

  function emit() {
    listeners.forEach((listener) => listener());
  }

  function commit(next: Snap<T>) {
    snap = next;
    if (next.remember) localStorage.setItem(key, JSON.stringify(next.value));
    else localStorage.removeItem(key);
    emit();
  }

  return {
    useSnap() {
      return useSyncExternalStore(
        (listener) => {
          listeners.add(listener);
          return () => listeners.delete(listener);
        },
        () => snap,
        () => serverSnap,
      );
    },
    update(value: T) {
      commit({ value, remember: snap.remember });
    },
    setRemember(remember: boolean) {
      commit({ value: snap.value, remember });
    },
  };
}
