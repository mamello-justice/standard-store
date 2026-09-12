---
title: createStoreHook
description: Create a React hook for accessing store state with automatic reactivity.
---

## Signature

```typescript
function createStoreHook<T>(store: Store): () => T;
```

## Parameters

### `store`

A store instance created with [`createStore`](./create-store.md).

```typescript
import { createStore } from '@standard-store/store';
import { createStoreHook } from '@standard-store/react';

const store = createStore({ count: 0 });
const useStore = createStoreHook(store);
```

## Returns

A React hook that returns the current store state. The component will automatically re-render when state changes.

```typescript
const state = useStore(); // { count: 0 }
// Re-renders when store.setState() is called
```

## Usage Examples

### Basic Usage

```typescript
import { useState, useEffect } from 'react';
import { createStore } from '@standard-store/store';
import { createStoreHook } from '@standard-store/react';

const store = createStore({ count: 0 });
const useStore = createStoreHook(store);

function Counter() {
  const state = useStore();

  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => store.setState({ count: state.count + 1 })}>
        Increment
      </button>
    </div>
  );
}
```

### Multiple Stores

Create separate hooks for different stores:

```typescript
const userStore = createStore({ name: 'John' });
const settingsStore = createStore({ theme: 'light' });

const useUserStore = createStoreHook(userStore);
const useSettingsStore = createStoreHook(settingsStore);

function App() {
  const user = useUserStore();
  const settings = useSettingsStore();

  return (
    <div>
      <h1>{user.name}</h1>
      <p>Theme: {settings.theme}</p>
    </div>
  );
}
```

### With TypeScript

Use generic type parameters for type safety:

```typescript
interface AppState {
  count: number;
  name: string;
  user: User;
}

const store = createStore<AppState>({
  count: 0,
  name: 'Counter',
  user: null,
});

const useStore = createStoreHook(store);

function Component() {
  const state = useStore(); // Typed as AppState
  
  return <div>{state.count}</div>;
}
```

### Partial Selection

Select only specific parts of state to optimize re-renders:

```typescript
const useCount = () => {
  const { count } = useStore();
  return count;
};

const useName = () => {
  const { name } = useStore();
  return name;
};

function Component() {
  const count = useCount();      // Re-renders only when count changes
  const name = useName();        // Re-renders only when name changes
  
  return <div>{name}: {count}</div>;
}
```

## React Context Pattern

Combine with React Context for provider pattern:

```typescript
import React from 'react';
import { createStore } from '@standard-store/store';
import { createStoreHook } from '@standard-store/react';

const store = createStore({ count: 0 });

const StoreContext = React.createContext<typeof store | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  return (
    <StoreContext.Provider value={store}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = React.useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within StoreProvider');
  }
  return context.getState();
}
```

## Performance Optimization

### Prevent Unnecessary Re-renders

Use `React.memo` to memoize components:

```typescript
const Counter = React.memo(() => {
  const { count } = useStore();
  return <div>{count}</div>;
});
```

### Memoize Derived Values

```typescript
function Component() {
  const { count, name } = useStore();

  // Only recompute when dependencies change
  const computedValue = React.useMemo(() => count * 2, [count]);

  return <div>{computedValue}</div>;
}
```

## Advanced Patterns

### Hook Composition

Create custom hooks that wrap store state:

```typescript
const useCounterActions = () => {
  const { count } = useStore();

  return {
    count,
    increment: () => store.setState({ count: count + 1 }),
    decrement: () => store.setState({ count: count - 1 }),
    reset: () => store.setState({ count: 0 }),
  };
};

function Counter() {
  const { count, increment, decrement } = useCounterActions();
  return (
    <div>
      {count}
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
    </div>
  );
}
```

### Custom Hook with History

Track state history automatically:

```typescript
import React, { useState, useEffect } from 'react';

const useCounterWithHistory = () => {
  const store = useStore();
  const [history, setHistory] = useState<number[]>([]);

  useEffect(() => {
    // Subscribe to state changes
    const unsubscribe = store.subscribe((state) => {
      setHistory((h) => [...h, state.count]);
    });

    return unsubscribe;
  }, []);

  return { ...store, history };
};
```

## See Also

- [createStore](./create-store.md) - Create a store instance
- [React Integration](../guides/react-integration.md) - Comprehensive React guide
