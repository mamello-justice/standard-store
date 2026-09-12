---
title: Persistence & Adapters
description: Adapters allow you to persist state to different storage backends without changing your application logic.
---

## LocalStorage Adapter

Persist state to browser localStorage:

```typescript
import { createStore } from '@standard-store/store';
import { localStorageAdapter } from '@standard-store/adapters/local-storage';

const store = createStore(
  { count: 0, name: 'John' },
  { adapter: localStorageAdapter('my-store') }
);
```

State persists across page reloads and browser sessions.

## SessionStorage Adapter

Persist state for the current browser tab only:

```typescript
import { sessionStorageAdapter } from '@standard-store/adapters/session-storage';

const store = createStore(initialState, {
  adapter: sessionStorageAdapter('my-store'),
});
```

State is automatically cleared when the tab closes.

## Cookie Adapter

Store state in HTTP cookies, shared between client and server:

```typescript
import { cookieAdapter } from '@standard-store/adapters/cookie';

const store = createStore(initialState, {
  adapter: cookieAdapter({
    name: 'my-store',
    maxAge: 60 * 60 * 24 * 7, // 7 days expiration
    secure: true,              // Use HTTPS only
    sameSite: 'Lax',          // CSRF protection
  }),
});
```

Useful for authentication tokens and user preferences that need server-side access.

## Memory Adapter (Default)

In-memory storage with no persistence. This is the default if no adapter is specified:

```typescript
import { memoryAdapter } from '@standard-store/adapters/memory';

const store = createStore(initialState, {
  adapter: memoryAdapter(),
});
```

State is cleared on page reload. Best for temporary or cached data.

## Next.js nuqs Adapter

Sync store state with Next.js search parameters automatically:

```typescript
import { nuqsAdapter } from '@standard-store/adapters/nuqs';

const store = createStore(
  { search: '', page: 1, sort: 'date' },
  { adapter: nuqsAdapter() }
);
```

State updates automatically reflect in the URL, enabling bookmark-able links and shareable URLs.

## React Router Adapter

Sync store state with React Router location for browser history integration:

```typescript
import { reactRouterAdapter } from '@standard-store/adapters/react-router';

const store = createStore(
  { tab: 'home', page: 1 },
  { adapter: reactRouterAdapter() }
);
```

State updates are reflected in the URL and work seamlessly with browser back/forward navigation.

## Custom Adapter

Create your own adapter for any storage backend (database, API, file system, etc.):

```typescript
const customAdapter = {
  name: 'custom',
  
  // Load initial state from external source
  load: async () => {
    return await fetch('/api/state').then(r => r.json());
  },
  
  // Save state changes to external source
  save: async (state) => {
    await fetch('/api/state', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(state),
    });
  },
};

const store = createStore(initialState, { adapter: customAdapter });
```

### Adapter Implementation Pattern

Any custom adapter should implement these methods:

| Method | Required | Description |
|--------|----------|-------------|
| `name` | Yes | Unique identifier for the adapter |
| `load()` | Optional | Load initial state when store is created |
| `save(state)` | Optional | Save state changes after updates |

## Examples

### Database Adapter

```typescript
const dbAdapter: StandardStoreAdapterV1 = {
  name: 'database',
  
  async load() {
    const doc = await db.collection('app-state').doc('current').get();
    return doc.data();
  },
  
  async save(state) {
    await db.collection('app-state').doc('current').set(state);
  },
};
```

### API Adapter

```typescript
const apiAdapter: StandardStoreAdapterV1 = {
  name: 'api',
  
  async load() {
    return fetch('/api/app-state').then(r => r.json());
  },
  
  async save(state) {
    await fetch('/api/app-state', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(state),
    });
  },
};
```

## Choosing an Adapter

| Use Case | Recommended Adapter |
|----------|---------------------|
| App preferences & cache | localStorage |
| Temporary tab data | sessionStorage |
| Authentication tokens | Cookie (httpOnly) |
| URL state & bookmarks | nuqs or reactRouter |
| Server-client sync | API adapter |
| Client-only app | localStorage |

## See Also

- [Adapters API](../api/adapters.md) - Full adapter reference
