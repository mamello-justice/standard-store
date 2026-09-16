import { type Context,createContext, useContext } from "react";
import type { StandardStoreV1 } from "@standard-store/spec";

export interface StoreHookContexts<
  State extends Record<string, any> = Record<string, unknown>,
> {
  storeContext: Context<StandardStoreV1<State> | null>;
  useStoreContext: () => StandardStoreV1<State>;
}

export function createStoreHookContexts<
  State extends Record<string, any> = Record<string, unknown>,
>(): StoreHookContexts<State> {
  const storeContext = createContext<StandardStoreV1<State> | null>(null);

  function useStoreContext(): StandardStoreV1<State> {
    const ctx = useContext(storeContext);
    if (!ctx) {
      throw new Error("useStoreContext must be used within a StoreProvider");
    }
    return ctx;
  }

  return { storeContext, useStoreContext };
}
