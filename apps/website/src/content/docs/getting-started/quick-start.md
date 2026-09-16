---
title: Quick Start
description: Get up and running with Standard Store in minutes.
---

## Basic Store

Create a store with initial state:

```typescript
import { createStore } from '@standard-store/store';

// Create a store with initial state
const store = createStore({
  count: 0,
  name: 'John',
});

// Get current state
const state = store.getState();
console.log(state); // { count: 0, name: 'John' }

// Update state
store.setState({ count: 1 });

// Subscribe to changes
const unsubscribe = store.subscribe((state) => {
  console.log('State updated:', state);
});

// Unsubscribe when needed
unsubscribe();
```

## React Integration

Create a custom hook for React components:

```typescript
import { createStoreHook } from '@standard-store/react';

// Create a custom hook
const useStore = createStoreHook(store);

function MyComponent() {
  const state = useStore();

  return (
    <div>
      <p>Count: {state.count}</p>
      <p>Name: {state.name}</p>
      <button onClick={() => store.setState({ count: state.count + 1 })}>
        Increment
      </button>
    </div>
  );
}
```

## With Persistence

Persist state to localStorage automatically:

```typescript
import { createStore } from '@standard-store/store';
import { localStorageAdapter } from '@standard-store/adapters';

const store = createStore(
  {
    count: 0,
    name: 'John',
  },
  {
    adapter: localStorageAdapter('my-app-store'),
  }
);

// State will automatically persist to localStorage
// and restore on page reload!
```

## Next Steps

- Learn about [Core Concepts](./concepts.md)
- Explore [Guides](../guides/creating-store.md)
- Check [API Reference](../api/create-store.md)
