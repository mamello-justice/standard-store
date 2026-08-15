import {
  createStoreHookContexts,
  createStoreHook,
} from "@standard-store/react";
import type { StoreHook } from "@standard-store/react";
import { appStore } from "./store";
import type { AppState } from "./store";

const { storeContext } = createStoreHookContexts<AppState>();

const storeHook: StoreHook<AppState> = createStoreHook({
  storeContext,
  store: appStore,
});

export const { useStore, useHydrate, StoreProvider } = storeHook;
