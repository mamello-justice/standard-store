import { memoryAdapter } from "@standard-store/adapters/memory";
import { createStore, validate } from "@standard-store/store";

interface AppState {
  theme: "light" | "dark";
  locale: string;
  authToken: string;
}

const store = createStore<AppState>({
  adapter: memoryAdapter(),
  middleware: [
    validate({
      theme: (v) => v === "light" || v === "dark",
      locale: (v) => typeof v === "string" && v.length >= 2,
    }),
  ],
});

const api = store["~standard"];

// Valid writes
api.set("theme", "dark");
api.set("locale", "en-US");
console.log(api.get("theme")); // "dark"

// Invalid write throws
try {
  api.set("theme", "invalid" as "light");
} catch (e) {
  console.error(e); // Error: [store] validation failed for "theme"
}

// Keys without a validator pass through
api.set("authToken", "abc123");
console.log(api.get("authToken")); // "abc123"
