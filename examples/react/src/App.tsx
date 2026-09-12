import { StoreProvider,useHydrate, useStore } from "./hooks";

function ThemeToggle() {
  const [theme, setTheme] = useStore("theme");

  return (
    <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
      Current: {theme ?? "not set"}
    </button>
  );
}

function LocaleSelector() {
  const [locale, setLocale, removeLocale] = useStore("locale");

  return (
    <div>
      <span>Locale: {locale ?? "default"}</span>
      <button onClick={() => setLocale("fr-FR")}>French</button>
      <button onClick={() => removeLocale()}>Reset</button>
    </div>
  );
}

function AuthStatus() {
  const [token] = useStore("authToken");
  return <span>{token ? "Authenticated" : "Not authenticated"}</span>;
}

export function App() {
  useHydrate();

  return (
    <StoreProvider>
      <ThemeToggle />
      <LocaleSelector />
      <AuthStatus />
    </StoreProvider>
  );
}
