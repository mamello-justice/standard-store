import { cookieAdapter } from "@standard-store/adapters/cookie";
import { createStore } from "@standard-store/store";

interface Preferences {
  consent: "accepted" | "rejected";
  theme: "light" | "dark";
  locale: string;
}

const store = createStore<Preferences>({
  adapter: cookieAdapter({
    path: "/",
    secure: true,
    sameSite: "lax",
  }),
  prefix: "prefs_",
});

const api = store["~standard"];

// Store user consent
api.set("consent", "accepted");

// Store preferences
api.set("theme", "dark");
api.set("locale", "en-US");

// Read back
console.log(api.get("consent")); // "accepted"
console.log(api.get("theme")); // "dark"

// Subscribe to changes
const unsubscribe = api.subscribe("theme", (value) => {
  console.log("Theme preference changed:", value);
});

api.set("theme", "light");
unsubscribe();

// Remove a single cookie
api.remove("locale");

// Clear all prefixed cookies
api.clear();
