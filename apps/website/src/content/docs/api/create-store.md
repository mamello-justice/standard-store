---
title: createStore
description: Create a state management store with type-safe initialization and optional persistence.
---

## Signature

```typescript
function createStore<State>(
  initialState: State,
  options?: CreateStoreOptions<State>
): Store<State>;
```

## Parameters

### `initialState`

The initial state object containing your application's data. Can be any JavaScript object.

```typescript
const store = createStore({
  count: 0,
  user: { name: 'John', age: 30 },
  items: [],
});
```

### `options` (optional)

Configure store behavior and adapters.

#### Options Interface

```typescript
interface CreateStoreOptions<State> {
  adapter?: StorageAdapter;
  prefix?: string;
  middleware?: Middleware[];
  ttl?: number | Date | Temporal.Duration | Temporal.Instant;
  expiryFormat?: 'iso' | 'epoch';
  scope?: 'tab' | 'global';
}
```

| Option | Type | Description |
|--------|------|-------------|
| `adapter` | `StorageAdapter` | Persist state to storage (localStorage, cookies, URL, etc.) |
| `prefix` | `string` | Prefix for store keys (useful when creating multiple stores) |
| `middleware` | `Middleware[]` | Array of middleware functions |
| `ttl` | `number \| Date \| Temporal.Duration \| Temporal.Instant` | Time-to-live for state expiration |
| `expiryFormat` | `'iso' \| 'epoch'` | Format for TTL timestamps |
| `scope` | `'tab' \| 'global'` | Storage scope (tab-local or global) |

## Methods

### `getState()`: State

Get the current state object.

```typescript
const state = store.getState();
// Returns: { count: 0, user: {...}, items: [...] }
```

### `setState(updates: Partial<State>): void`

Update the state with a partial object. Merges with existing state.

```typescript
store.setState({ count: 1 });
// Result: { count: 1, user: {...}, items: [...] }

store.setState({ 
  count: 2, 
  user: { name: 'Jane' } 
});
// Result: { count: 2, user: { name: 'Jane', age: 30 }, items: [...] }
```

### `subscribe(listener: (state: State) => void): () => void`

Listen to state changes. Returns unsubscribe function.

```typescript
const unsubscribe = store.subscribe((state) => {
  console.log('State updated:', state);
});

// Later, stop listening:
unsubscribe();
```

## Typed Stores

### Generic Syntax

Use TypeScript generics for type safety:

```typescript
interface AppState {
  count: number;
  user: { name: string; age: number };
}

const store = createStore<AppState>({
  count: 0,
  user: { name: 'John', age: 30 },
});

// Type-safe operations
store.setState({ count: 1 });       // ✅ OK
store.setState({ invalid: 'bad' }); // ❌ TypeScript error
```

### Type Utilities

Extract types from stores:

```typescript
type MyState = InferState<typeof store>;
type MyKeys = keyof MyState;
```

## Middleware Integration

```typescript
import { createStore, loggerMiddleware, validateMiddleware } from '@standard-store/store';

const store = createStore({ count: 0 }, {
  middleware: [
    loggerMiddleware,      // Log all operations
    validateMiddleware((state) => {
      if (state.count < 0) throw new Error('Count cannot be negative');
    }),
  ],
});
```

## Adapter Integration

```typescript
import { createStore } from '@standard-store/store';
import { localStorageAdapter } from '@standard-store/adapters';

const store = createStore({ count: 0 }, {
  adapter: localStorageAdapter('my-store'),
});

// State persists across page reloads
store.setState({ count: 1 });
// State automatically saved to localStorage
```

## Examples

### Counter Store

```typescript
const counterStore = createStore({ count: 0 });

export const useCounter = () => {
  const state = counterStore.getState();
  return {
    count: state.count,
    increment: () => counterStore.setState({ count: state.count + 1 }),
    decrement: () => counterStore.setState({ count: state.count - 1 }),
    reset: () => counterStore.setState({ count: 0 }),
  };
};
```

### User Store with Persistence

```typescript
interface User {
  id: string;
  name: string;
  email: string;
}

const userStore = createStore<{ currentUser: User | null }>({
  currentUser: null,
}, {
  adapter: localStorageAdapter('user-store'),
});

export const login = (user: User) => {
  userStore.setState({ currentUser: user });
};

export const logout = () => {
  userStore.setState({ currentUser: null });
};
```

## See Also

- [createStoreHook](./create-store-hook.md) - React hook for stores
- [Adapters](./adapters.md) - Storage adapters reference
- [Middleware](./middleware.md) - Middleware reference
