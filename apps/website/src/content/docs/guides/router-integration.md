---
title: Router Integration
description: Sync store state with browser URL and routing libraries for bookmarkable URLs and deep linking.
---

## React Router

Persist store state to React Router location automatically:

```typescript
import { createStore } from '@standard-store/store';
import { reactRouterAdapter } from '@standard-store/adapters/react-router';

const store = createStore(
  { tab: 'home', page: 1 },
  { adapter: reactRouterAdapter() }
);

// State updates automatically reflect in the URL
store.setState({ tab: 'about' }); // → /?tab=about
```

### With useNavigate

Control navigation with React Router's `useNavigate`:

```typescript
import { useNavigate } from 'react-router-dom';
import { reactRouterAdapter } from '@standard-store/adapters/react-router';

const store = createStore(
  { tab: 'home', page: 1 },
  { adapter: reactRouterAdapter() }
);

function Navigation() {
  const navigate = useNavigate();
  const { tab, page } = store.getState();

  const handleTabChange = (newTab: string) => {
    store.setState({ tab: newTab });
    // URL updates automatically via adapter
  };

  return (
    <nav>
      <button onClick={() => handleTabChange('home')}>Home</button>
      <button onClick={() => handleTabChange('about')}>About</button>
      <button onClick={() => handleTabChange('contact')}>Contact</button>
    </nav>
  );
}
```

## Next.js nuqs

Sync store state with Next.js search parameters using nuqs:

```typescript
import { createStore } from '@standard-store/store';
import { nuqsAdapter } from '@standard-store/adapters/nuqs';

const store = createStore(
  { search: '', page: 1, sort: 'date' },
  { adapter: nuqsAdapter() }
);

// Search params update automatically when state changes
```

### With useSearchParams

Combine with Next.js `useSearchParams` for advanced routing:

```typescript
'use client';

import { useSearchParams } from 'next/navigation';
import { nuqsAdapter } from '@standard-store/adapters/nuqs';

export default function Products() {
  const searchParams = useSearchParams();
  const { search, page } = store.getState();

  const handleSearch = (term: string) => {
    store.setState({ search: term, page: 1 });
    // URL updates automatically with nuqsAdapter
  };

  return (
    <div>
      <input
        value={search}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search products"
      />
      <p>Page: {page}</p>
    </div>
  );
}
```

## URL-Driven State Pattern

Best practices for apps where URL state should drive application state:

```typescript
interface UrlState {
  search: string;
  filters: {
    category: string;
    priceRange: [number, number];
  };
  sort: 'relevance' | 'price' | 'rating';
  page: number;
}

const store = createStore<UrlState>(
  {
    search: '',
    filters: { category: '', priceRange: [0, 1000] },
    sort: 'relevance',
    page: 1,
  },
  { adapter: reactRouterAdapter() }
);

// Pagination
export const goToPage = (page: number) => {
  store.setState({ page });
};

// Filter changes reset pagination
export const setFilters = (filters: UrlState['filters']) => {
  store.setState({ filters, page: 1 }); // Reset to page 1
};
```

## Deep Linking Benefits

State is automatically serializable for URLs, enabling:

- **Bookmarkable URLs** - Users can bookmark search results or filtered views
- **Shareable links** - Share product lists or search results via URL
- **Direct navigation** - Users can directly navigate to specific states

```typescript
// User shares this URL
const url = window.location.href;
// https://example.com?search=laptop&category=electronics&page=2

// Visitor lands on this URL and sees the same state
// The router adapter automatically hydrates store from URL!
```

## Persistence Without Routing

For apps without URL-based routing, use other adapters:

### localStorage Adapter

```typescript
import { localStorageAdapter } from '@standard-store/adapters/local-storage';

const store = createStore(state, {
  adapter: localStorageAdapter('app-state'),
});
```

### Cookie Adapter

```typescript
import { cookieAdapter } from '@standard-store/adapters/cookie';

const store = createStore(state, {
  adapter: cookieAdapter({ name: 'app-state' }),
});
```

## See Also

- [Adapters](../guides/adapters.md) - All available adapters
