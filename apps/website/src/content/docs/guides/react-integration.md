---
title: React Integration
description: Learn how to integrate Standard Store with React for automatic reactivity and performance optimization.
---

## Basic Hook

Create a hook for accessing store state:

```typescript
import { createStore } from '@standard-store/store';
import { createStoreHook } from '@standard-store/react';

const store = createStore({ count: 0 });
const useStore = createStoreHook(store);

export default function Counter() {
  const { count } = useStore();

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => store.setState({ count: count + 1 })}>
        Increment
      </button>
    </div>
  );
}
```

## Multiple Hooks

Create separate hooks for different stores to isolate re-renders:

```typescript
import { createStoreHook } from '@standard-store/react';

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

## Selector Pattern

Select only the state you need to optimize performance:

```typescript
const useCount = () => {
  const { count } = useStore();
  return count;
};

function Counter() {
  const count = useCount();
  return <div>{count}</div>; // Only re-renders when count changes
}
```

## Custom Hooks

Combine store state with React hooks for advanced patterns:

```typescript
import React, { useState, useEffect } from 'react';

const useCounterWithHistory = () => {
  const store = useStore();
  const [history, setHistory] = useState<number[]>([]);

  // Subscribe to state changes and track history
  useEffect(() => {
    const unsubscribe = store.subscribe((state) => {
      setHistory((h) => [...h, state.count]);
    });

    return unsubscribe;
  }, []);

  return { ...store, history };
};
```

## Context Integration

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

### Memoization

Prevent unnecessary re-renders:

```typescript
// Memoize the component
const Counter = React.memo(() => {
  const { count } = useStore();
  return <div>{count}</div>;
});

// Or memoize computed values
function Component() {
  const { count, name } = useStore();

  // Only recompute when dependencies change
  const displayName = React.useMemo(() => `User ${name}`, [name]);

  return <div>{displayName}</div>;
}
```

## Examples

### Todo List App

A complete todo list application:

```typescript
interface Todo {
  id: string;
  text: string;
  done: boolean;
}

const todoStore = createStore<{ todos: Todo[] }>({
  todos: [],
});

const useTodos = createStoreHook(todoStore);

function TodoList() {
  const { todos } = useTodos();

  const addTodo = (text: string) => {
    todoStore.setState({
      todos: [
        ...todos,
        { id: Date.now().toString(), text, done: false },
      ],
    });
  };

  const toggleTodo = (id: string) => {
    todoStore.setState((state) => ({
      todos: state.todos.map(t =>
        t.id === id ? { ...t, done: !t.done } : t
      ),
    }));
  };

  return (
    <div>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <input
              type="checkbox"
              checked={todo.done}
              onChange={() => toggleTodo(todo.id)}
            />
            {todo.text}
          </li>
        ))}
      </ul>
      <button onClick={() => addTodo('New todo')}>Add</button>
    </div>
  );
}
```

## See Also

- [createStoreHook API](../api/create-store-hook.md) - Full hook reference
- [Quick Start](../getting-started/quick-start.md) - React integration example
