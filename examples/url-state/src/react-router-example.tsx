import { useMemo } from "react";
import { useSearchParams } from "react-router";
import { createStore } from "@standard-store/store";
import {
  createStoreHookContexts,
  createStoreHook,
} from "@standard-store/react";
import { reactRouterAdapter } from "@standard-store/adapters/react-router";

interface SearchState {
  q: string;
  page: string;
  sort: string;
}

const { storeContext } = createStoreHookContexts<SearchState>();

export function Root() {
  const [searchParams, setSearchParams] = useSearchParams();

  const store = useMemo(
    () =>
      createStore<SearchState>({
        adapter: reactRouterAdapter({
          getSearchParams: () => searchParams,
          setSearchParams,
        }),
      }),
    [searchParams, setSearchParams],
  );

  const { useStore, StoreProvider } = createStoreHook({ storeContext, store });

  return (
    <StoreProvider>
      <SearchForm useStore={useStore} />
    </StoreProvider>
  );
}

function SearchForm({
  useStore,
}: {
  useStore: ReturnType<typeof createStoreHook<SearchState>>["useStore"];
}) {
  const [query, setQuery] = useStore("q");
  const [page, setPage] = useStore("page");
  const [sort, setSort] = useStore("sort");

  return (
    <div>
      <input
        value={query ?? ""}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
      />
      <select
        value={sort ?? "relevance"}
        onChange={(e) => setSort(e.target.value)}
      >
        <option value="relevance">Relevance</option>
        <option value="date">Date</option>
      </select>
      <span>Page: {page ?? "1"}</span>
      <button onClick={() => setPage(String(Number(page ?? "1") + 1))}>
        Next
      </button>
    </div>
  );
}
