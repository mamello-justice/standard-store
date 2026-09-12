---
title: Core Concepts
description: Understand the fundamental building blocks of Standard Store.
---

## Store

A **Store** is the single source of truth for your application state. It holds the state and manages updates.

```typescript
const store = createStore({ count: 0 });
```

## State

**State** is the data your store holds. It can be any JavaScript object, including nested structures and arrays.

```typescript
const state = store.getState();
```

## Actions

**Actions** are updates to the state. Use `setState()` to update with a partial object that merges with existing state:

```typescript
store.setState({ count: 1 });
```

### Partial Updates

When updating, only changed values are replaced. Unchanged values persist:

```typescript
const initial = { count: 0, user: { name: 'John', age: 30 } };
store.setState({ count: 1 });
// Result: { count: 1, user: { name: 'John', age: 30 } }

store.setState({ count: 2, user: { name: 'Jane' } });
// Result: { count: 2, user: { name: 'Jane', age: 30 } }
```

## Subscriptions

**Subscriptions** let you listen to state changes. They automatically clean up when unsubscribed.

```typescript
const unsubscribe = store.subscribe((state) => {
  console.log('State changed:', state);
});

// Stop listening later
unsubscribe();
```

## Adapters

**Adapters** persist state to different storage backends. Available adapters include localStorage, sessionStorage, cookies, memory, and URL-based persistence.

```typescript
import { localStorageAdapter } from '@standard-store/adapters';

const store = createStore(initialState, {
  adapter: localStorageAdapter('key'),
});
```

Available adapters:

- `localStorageAdapter` - Browser localStorage
- `sessionStorageAdapter` - Browser sessionStorage
- `cookieAdapter` - HTTP cookies
- `memoryAdapter` - In-memory (default)
- `nuqsAdapter` - Next.js search params
- `reactRouterAdapter` - React Router location

## Middleware

**Middleware** intercepts state updates for logging, validation, or side effects.

```typescript
import { loggerMiddleware } from '@standard-store/store/middleware';

const store = createStore(initialState, {
  middleware: [loggerMiddleware],
});
```

## React Integration

Use `createStoreHook` to create a React hook for your store:

```typescript
const useStore = createStoreHook(store);

function Component() {
  const state = useStore();
  return <div>{state.count}</div>;
}
```

See also [React Integration](../guides/react-integration.md) for advanced patterns.
