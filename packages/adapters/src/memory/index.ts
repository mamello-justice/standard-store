import type { StandardStoreAdapterV1 } from "@standard-store/spec";

export function memoryAdapter(): StandardStoreAdapterV1 {
  const store = new Map<string, string>();
  const listeners = new Map<string, Set<(value: string | null) => void>>();

  return {
    get(key) {
      return store.get(key) ?? null;
    },
    set(key, value) {
      store.set(key, value);
      const keyListeners = listeners.get(key);
      if (keyListeners) {
        for (const listener of keyListeners) {
          listener(value);
        }
      }
    },
    remove(key) {
      store.delete(key);
      const keyListeners = listeners.get(key);
      if (keyListeners) {
        for (const listener of keyListeners) {
          listener(null);
        }
      }
    },
    clear() {
      const keys = [...store.keys()];
      store.clear();
      for (const key of keys) {
        const keyListeners = listeners.get(key);
        if (keyListeners) {
          for (const listener of keyListeners) {
            listener(null);
          }
        }
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
}
