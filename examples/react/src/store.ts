import { createStore } from "@standard-store/store";
import { localStorageAdapter } from "@standard-store/adapters/local-storage";

export interface AppState {
  theme: "light" | "dark";
  locale: string;
  authToken: string;
}

export const appStore = createStore<AppState>({
  adapter: localStorageAdapter(),
  prefix: "app:",
  scope: "global",
});
