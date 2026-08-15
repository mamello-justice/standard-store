import {
  useCallback,
  useEffect,
  useSyncExternalStore,
  type Context,
  type ReactNode,
} from "react";
import type { Expiry, StandardStoreV1 } from "@standard-store/spec";

export interface CreateStoreHookOptions<State extends Record<string, any>> {
  storeContext: Context<StandardStoreV1<State> | null>;
  store: StandardStoreV1<State>;
}

export interface StoreHook<State extends Record<string, any>> {
  useStore<K extends keyof State & string>(
    key: K,
  ): [
    value: State[K] | undefined,
    setValue: (value: State[K], options?: { ttl?: Expiry }) => void,
    removeValue: () => void,
  ];
  useHydrate(): void;
  StoreProvider: (props: { children: ReactNode }) => ReactNode;
}

export function createStoreHook<State extends Record<string, any>>(
  options: CreateStoreHookOptions<State>,
): StoreHook<State> {
  const { storeContext, store } = options;
  const api = store["~standard"];

  function useStore<K extends keyof State & string>(
    key: K,
  ): [
    value: State[K] | undefined,
    setValue: (value: State[K], options?: { ttl?: Expiry }) => void,
    removeValue: () => void,
  ] {
    const subscribe = useCallback(
      (onStoreChange: () => void) => {
        return api.subscribe(key, onStoreChange as () => void);
      },
      [key],
    );

    const getSnapshot = useCallback(() => api.get(key), [key]);

    const value = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

    const setValue = useCallback(
      (newValue: State[K], setOptions?: { ttl?: Expiry }) => {
        api.set(key, newValue, setOptions);
      },
      [key],
    );

    const removeValue = useCallback(() => {
      api.remove(key);
    }, [key]);

    return [value, setValue, removeValue];
  }

  function useHydrate(): void {
    useEffect(() => {
      api.hydrate();
    }, []);
  }

  function StoreProvider({ children }: { children: ReactNode }): ReactNode {
    const Provider = storeContext.Provider;
    return <Provider value={store}>{children}</Provider>;
  }

  return { useStore, useHydrate, StoreProvider };
}
