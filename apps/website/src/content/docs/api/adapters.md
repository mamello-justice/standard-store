---
title: Storage Adapters
description: Adapters persist store state to different storage backends. Standard Store ships with several built-in adapters, and you can implement your own.
---

## Available Adapters

| Adapter | Import Path | Description |
|---------|-------------|-------------|
| Memory | `@standard-store/adapters/memory` | In-memory storage (default) |
| Local Storage | `@standard-store/adapters/local-storage` | Browser localStorage |
| Session Storage | `@standard-store/adapters/session-storage` | Browser sessionStorage |
| Cookie | `@standard-store/adapters/cookie` | HTTP cookies |
| React Router | `@standard-store/adapters/react-router` | React Router location sync |
| nuqs | `@standard-store/adapters/nuqs` | Next.js search params sync |

## Adapter Usage Pattern

```typescript
import { createStore } from '@standard-store/store';
import { localStorageAdapter } from '@standard-store/adapters/local-storage';

const store = createStore(
  { count: 0, user: null },
  { adapter: localStorageAdapter('my-app') }
);
```

## Built-in Adapters

### Local Storage Adapter

Persist state to browser localStorage.

```typescript
import { localStorageAdapter } from '@standard-store/adapters/local-storage';

const store = createStore(initialState, {
  adapter: localStorageAdapter('my-store'),
});
```

**Features:**
- Persists across browser sessions
- Works in all modern browsers
- ~5-10MB storage limit per domain

### Session Storage Adapter

Persist state for the current browser tab only.

```typescript
import { sessionStorageAdapter } from '@standard-store/adapters/session-storage';

const store = createStore(initialState, {
  adapter: sessionStorageAdapter('my-store'),
});
```

**Features:**
- Persists for the current tab session only
- Cleared when tab closes
- Same API as localStorage

### Cookie Adapter

Store state in HTTP cookies.

```typescript
import { cookieAdapter } from '@standard-store/adapters/cookie';

const store = createStore(initialState, {
  adapter: cookieAdapter({
    name: 'my-store',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    secure: true,              // Use HTTPS only
    sameSite: 'Lax',          // CSRF protection
  }),
});
```

**Signature:**

```typescript
interface CookieOptions {
  name: string;
  maxAge?: number;
  domain?: string;
  path?: string;
  secure?: boolean;
  sameSite?: 'Strict' | 'Lax' | 'None';
}

function cookieAdapter(options: CookieOptions): StorageAdapter;
```

**Features:**
- Shared between client and server
- Useful for authentication state
- Can set expiration and security options

### Memory Adapter (Default)

In-memory storage with no persistence.

```typescript
import { memoryAdapter } from '@standard-store/adapters/memory';

const store = createStore(initialState, {
  adapter: memoryAdapter(),
});
```

**Features:**
- No persistence (clears on page reload)
- Fastest option
- Default if no adapter specified

### React Router Adapter

Sync store state with React Router location.

```typescript
import { reactRouterAdapter } from '@standard-store/adapters/react-router';

const store = createStore(
  { tab: 'home', page: 1 },
  { adapter: reactRouterAdapter() }
);
```

**Features:**
- Sync state with React Router location
- Browser history integration
- Enables browser back/forward navigation

### Next.js nuqs Adapter

Sync store state with Next.js search parameters.

```typescript
import { nuqsAdapter } from '@standard-store/adapters/nuqs';

const store = createStore(
  { search: '', page: 1, sort: 'date' },
  { adapter: nuqsAdapter() }
);
```

**Features:**
- Sync state with URL search params
- Bookmark-able URLs
- Works with Next.js app router

## Custom Adapter Interface

Implement your own adapter for custom storage backends.

### StorageAdapter Interface

```typescript
interface StandardStoreAdapterV1 {
  name: string;
  
  load?(): Promise<any> | any;
  save?(state: any): Promise<void> | void;
}
```

**Methods:**

- **`name`** (required) - Identifier for the adapter
- **`load()`** (optional) - Load initial state from storage. Called when store is created.
- **`save(state)`** (optional) - Save state to storage. Called after each state update.

### Examples

#### Database Adapter

```typescript
import { Database } from 'some-db-lib';

const db: Database = getDatabase();

const dbAdapter: StorageAdapter = {
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

#### API Adapter

```typescript
const apiAdapter: StorageAdapter = {
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

## See Also

- [Creating a Store](../guides/creating-store.md) - Store with adapter example
