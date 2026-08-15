import type { StandardStoreAdapterV1 } from "@standard-store/spec";

export interface NuqsAdapterOptions {
  getSearchParams: () => URLSearchParams;
  setSearchParams: (
    updater: (prev: URLSearchParams) => URLSearchParams,
  ) => void;
  history?: "push" | "replace";
  shallow?: boolean;
  throttleMs?: number;
}

export function nuqsAdapter(
  options: NuqsAdapterOptions,
): StandardStoreAdapterV1 {
  const { getSearchParams, setSearchParams } = options;
  const listeners = new Map<string, Set<(value: string | null) => void>>();

  let pendingUpdates: Map<string, string | null> = new Map();
  let flushTimeout: ReturnType<typeof setTimeout> | null = null;
  const throttleMs = options.throttleMs ?? 50;

  function scheduleFlush(): void {
    if (flushTimeout !== null) return;
    flushTimeout = setTimeout(() => {
      flushTimeout = null;
      const updates = pendingUpdates;
      pendingUpdates = new Map();
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        for (const [key, value] of updates) {
          if (value === null) {
            next.delete(key);
          } else {
            next.set(key, value);
          }
        }
        return next;
      });
    }, throttleMs);
  }

  return {
    get(key) {
      return getSearchParams().get(key);
    },
    set(key, value) {
      pendingUpdates.set(key, value);
      scheduleFlush();
      notify(key, value);
    },
    remove(key) {
      pendingUpdates.set(key, null);
      scheduleFlush();
      notify(key, null);
    },
    clear() {
      const keys = [...getSearchParams().keys()];
      for (const key of keys) {
        pendingUpdates.set(key, null);
      }
      scheduleFlush();
      for (const key of keys) {
        notify(key, null);
      }
    },
    subscribe(key, listener) {
      if (!listeners.has(key)) {
        listeners.set(key, new Set());
      }
      listeners.get(key)!.add(listener);
      return () => {
        listeners.get(key)?.delete(listener);
        if (listeners.get(key)?.size === 0) {
          listeners.delete(key);
        }
      };
    },
  };

  function notify(key: string, value: string | null): void {
    const keyListeners = listeners.get(key);
    if (keyListeners) {
      for (const listener of keyListeners) {
        listener(value);
      }
    }
  }
}
