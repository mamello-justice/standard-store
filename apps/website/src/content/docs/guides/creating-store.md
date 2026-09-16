---
title: Creating a Store
description: Learn how to create stores with different use cases and configurations.
---

## Basic Store

Create a simple store with initial state:

```typescript
import { createStore } from '@standard-store/store';

const store = createStore({
  count: 0,
  user: { name: 'John', age: 30 },
  items: [],
});
```

## Typed Store

Use TypeScript generics for type safety. This prevents invalid updates at compile time:

```typescript
interface AppState {
  count: number;
  user: { name: string; age: number };
  items: string[];
}

const store = createStore<AppState>({
  count: 0,
  user: { name: 'John', age: 30 },
  items: [],
});

// Type checking ensures correct updates
store.setState({ count: 'invalid' }); // ❌ TypeScript error
store.setState({ count: 1 });         // ✅ OK
```

## With Options

Configure store behavior with options:

```typescript
import { localStorageAdapter } from '@standard-store/adapters';
import { loggerMiddleware } from '@standard-store/store/middleware/logger';

const store = createStore(initialState, {
  adapter: localStorageAdapter('my-store'),
  prefix: 'my-app:',
  middleware: [loggerMiddleware],
});
```

## Store Methods Reference

### `getState(): State`

Get the current state object.

```typescript
const state = store.getState();
// Returns the complete state object
```

### `setState(updates: Partial<State>): void`

Update the state with a partial object. All properties not specified are preserved from the current state.

```typescript
store.setState({ count: 1 });

// Multiple updates merge
store.setState({ count: 2 }); // { count: 2, user: {...}, items: [...] }
```

### `subscribe(listener: (state: State) => void): () => void`

Listen to state changes. Returns an unsubscribe function to stop listening.

```typescript
const unsubscribe = store.subscribe((state) => {
  console.log('State updated:', state);
});

// Stop listening
unsubscribe();
```

## Examples

### Counter Store

Create a counter with derived actions:

```typescript
const counterStore = createStore({
  count: 0,
});

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

### User Store with Authentication Flow

Manage user authentication state:

```typescript
interface User {
  id: string;
  name: string;
  email: string;
}

const userStore = createStore<{ currentUser: User | null }>({
  currentUser: null,
});

export const setUser = (user: User) => {
  userStore.setState({ currentUser: user });
};

export const clearUser = () => {
  userStore.setState({ currentUser: null });
};

// Login flow
const login = async (email: string, password: string) => {
  // Simulate API call
  const response = await fetch('/api/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  
  const user = await response.json();
  setUser(user);
};

// Logout flow
export const logout = () => {
  clearUser();
  // Redirect to login page if needed
};
```

### Settings Store

Manage application settings with persistence:

```typescript
const settingsStore = createStore({
  theme: 'light',
  language: 'en',
  notifications: true,
});

// Auto-save to localStorage on changes
const unsubscribe = settingsStore.subscribe((state) => {
  localStorage.setItem('settings', JSON.stringify(state));
});
```

## See Also

- [Adapters](../guides/adapters.md) - Storage adapters guide
- [Middleware](./middleware.md) - Middleware integration guide
