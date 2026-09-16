import type { StoreHook } from "@standard-store/react";
import {
  createStoreHook,
  createStoreHookContexts,
} from "@standard-store/react";

import type { AppState } from "./store";
import { appStore } from "./store";

const { storeContext } = createStoreHookContexts<AppState>();

const storeHook: StoreHook<AppState> = createStoreHook({
  storeContext,
  store: appStore,
});

export const { useStore, useHydrate, StoreProvider } = storeHook;
