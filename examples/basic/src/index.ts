import type { TemporalDurationLike } from "@standard-store/spec";
import { createStore, logger } from "@standard-store/store";
import { localStorageAdapter } from "@standard-store/adapters/local-storage";
import { memoryAdapter } from "@standard-store/adapters/memory";

interface AppState {
  theme: "light" | "dark";
  locale: string;
  authToken: string;
}

// --- Memory adapter (testing / SSR) ---

const memStore = createStore<AppState>({
  adapter: memoryAdapter(),
  prefix: "app:",
});

const mem = memStore["~standard"];
mem.set("theme", "dark");
console.log(mem.get("theme")); // "dark"

// --- localStorage adapter with TTL ---

const twentyFourHours: TemporalDurationLike = {
  total: ({ unit }) => {
    if (unit === "millisecond") return 24 * 60 * 60 * 1000;
    throw new Error(`Unsupported unit: ${unit}`);
  },
};

const persistentStore = createStore<AppState>({
  adapter: localStorageAdapter(),
  prefix: "app:",
  middleware: [logger()],
  ttl: twentyFourHours,
  expiryFormat: "iso",
  scope: "global",
});

const api = persistentStore["~standard"];

// Basic get/set
api.set("theme", "dark");
api.set("locale", "en-US");

// Per-key TTL using Date (expires in 30 minutes)
api.set("authToken", "abc123", {
  ttl: new Date(Date.now() + 30 * 60 * 1000),
});

// Reading values (expired entries return undefined)
const theme = api.get("theme");
const token = api.get("authToken");
console.log("theme:", theme, "token:", token);

// Subscribe to changes
const unsubscribe = api.subscribe("theme", (value) => {
  console.log("Theme changed:", value);
});

api.set("theme", "light"); // logs: "Theme changed: light"
unsubscribe();

// Clear all entries
api.clear();
