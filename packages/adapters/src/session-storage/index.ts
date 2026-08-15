import type {
  StandardStoreAdapterV1,
  SubscribeOptions,
} from "@standard-store/spec";

export function sessionStorageAdapter(): StandardStoreAdapterV1 {
  const tabListeners = new Map<string, Set<(value: string | null) => void>>();

  return {
    get(key) {
      return sessionStorage.getItem(key);
    },
    set(key, value) {
      sessionStorage.setItem(key, value);
      notifyTab(key, value);
    },
    remove(key) {
      sessionStorage.removeItem(key);
      notifyTab(key, null);
    },
    clear() {
      const keys: string[] = [];
      for (let i = 0; i < sessionStorage.length; i++) {
        keys.push(sessionStorage.key(i)!);
      }
      sessionStorage.clear();
      for (const key of keys) {
        notifyTab(key, null);
      }
    },
    subscribe(key, listener, options?: SubscribeOptions) {
      const scope = options?.scope ?? "tab";

      if (!tabListeners.has(key)) {
        tabListeners.set(key, new Set());
      }
      tabListeners.get(key)!.add(listener);

      let storageHandler: ((e: StorageEvent) => void) | undefined;
      if (scope === "global") {
        storageHandler = (e: StorageEvent) => {
          if (e.key === key && e.storageArea === sessionStorage) {
            listener(e.newValue);
          }
        };
        window.addEventListener("storage", storageHandler);
      }

      return () => {
        tabListeners.get(key)?.delete(listener);
        if (tabListeners.get(key)?.size === 0) {
          tabListeners.delete(key);
        }
        if (storageHandler) {
          window.removeEventListener("storage", storageHandler);
        }
      };
    },
  };

  function notifyTab(key: string, value: string | null): void {
    const keyListeners = tabListeners.get(key);
    if (keyListeners) {
      for (const listener of keyListeners) {
        listener(value);
      }
    }
  }
}
