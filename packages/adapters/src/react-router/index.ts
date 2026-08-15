import type { StandardStoreAdapterV1 } from "@standard-store/spec";

export interface ReactRouterAdapterOptions {
  getSearchParams: () => URLSearchParams;
  setSearchParams: (
    updater: (prev: URLSearchParams) => URLSearchParams,
  ) => void;
}

export function reactRouterAdapter(
  options: ReactRouterAdapterOptions,
): StandardStoreAdapterV1 {
  const { getSearchParams, setSearchParams } = options;
  const listeners = new Map<string, Set<(value: string | null) => void>>();

  return {
    get(key) {
      return getSearchParams().get(key);
    },
    set(key, value) {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.set(key, value);
        return next;
      });
      notify(key, value);
    },
    remove(key) {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.delete(key);
        return next;
      });
      notify(key, null);
    },
    clear() {
      const keys = [...getSearchParams().keys()];
      setSearchParams(() => new URLSearchParams());
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
