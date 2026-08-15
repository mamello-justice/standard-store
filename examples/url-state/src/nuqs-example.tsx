import { useMemo, useSyncExternalStore } from "react";
import { createStore } from "@standard-store/store";
import {
  createStoreHookContexts,
  createStoreHook,
} from "@standard-store/react";
import { nuqsAdapter } from "@standard-store/adapters/nuqs";

interface FiltersState {
  category: string;
  minPrice: string;
  maxPrice: string;
  inStock: string;
}

const { storeContext } = createStoreHookContexts<FiltersState>();

// nuqs adapter with throttled URL updates
export function FiltersPage() {
  const searchParams = useSyncExternalStore(
    (cb) => {
      window.addEventListener("popstate", cb);
      return () => window.removeEventListener("popstate", cb);
    },
    () => new URLSearchParams(window.location.search),
  );

  const store = useMemo(
    () =>
      createStore<FiltersState>({
        adapter: nuqsAdapter({
          getSearchParams: () => searchParams,
          setSearchParams: (updater) => {
            const next = updater(searchParams);
            const url = new URL(window.location.href);
            url.search = next.toString();
            window.history.pushState(null, "", url);
          },
          throttleMs: 100,
        }),
      }),
    [searchParams],
  );

  const { useStore, StoreProvider } = createStoreHook({ storeContext, store });

  return (
    <StoreProvider>
      <FilterControls useStore={useStore} />
    </StoreProvider>
  );
}

function FilterControls({
  useStore,
}: {
  useStore: ReturnType<typeof createStoreHook<FiltersState>>["useStore"];
}) {
  const [category, setCategory] = useStore("category");
  const [minPrice, setMinPrice] = useStore("minPrice");
  const [maxPrice, setMaxPrice] = useStore("maxPrice");
  const [inStock, setInStock] = useStore("inStock");

  return (
    <div>
      <select
        value={category ?? "all"}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="all">All</option>
        <option value="electronics">Electronics</option>
        <option value="clothing">Clothing</option>
      </select>

      <input
        type="number"
        placeholder="Min price"
        value={minPrice ?? ""}
        onChange={(e) => setMinPrice(e.target.value)}
      />
      <input
        type="number"
        placeholder="Max price"
        value={maxPrice ?? ""}
        onChange={(e) => setMaxPrice(e.target.value)}
      />

      <label>
        <input
          type="checkbox"
          checked={inStock === "true"}
          onChange={(e) => setInStock(String(e.target.checked))}
        />
        In stock only
      </label>
    </div>
  );
}
