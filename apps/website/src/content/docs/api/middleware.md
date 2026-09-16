---
title: Middleware
description: Middleware allows you to intercept store operations for validation, logging, or side effects.
---

## Built-in Middleware

### Logger Middleware

Log all state changes before updates.

```typescript
import { createStore } from '@standard-store/store';
import { loggerMiddleware } from '@standard-store/store/middleware/logger';

const store = createStore(initialState, {
  middleware: [loggerMiddleware],
});

store.setState({ count: 1 });
// Console output: { count: 0 } → { count: 1 }
```

### Validation Middleware

Enforce value constraints per key before updates.

```typescript
import { createStore } from '@standard-store/store';
import { validateMiddleware } from '@standard-store/store/middleware/validate';

const store = createStore(initialState, {
  middleware: [
    validateMiddleware({
      theme: (v) => ["light", "dark"].includes(v),
      count: (v) => typeof v === "number",
    }),
  ],
});

store.setState({ theme: 'dark' });   // ✅ OK
store.setState({ theme: 'blue' });   // ❌ Throws error
```

## Custom Middleware Interface

### Middleware Structure

```typescript
interface StandardStoreMiddlewareV1 {
  name?: string;
  
  onGet?<T>(key: string, value: T, next: () => T): T;
  onSet?<T>(key: string, value: T, next: () => void): void;
  onRemove?(key: string, next: () => void): void;
}
```

**Methods:**

| Method | Description |
|--------|-------------|
| `onGet` | Intercept get operations (optional) |
| `onSet` | Intercept set operations (optional) |
| `onRemove` | Intercept remove operations (optional) |

### Custom Middleware Example

```typescript
const customMiddleware = {
  name: 'analytics',
  
  async onSet(key, value, next) {
    // Track state changes
    console.log(`Setting ${key} to`, value);
    
    const result = await next();
    
    // Perform side effect after state is set
    await analytics.track('state_change', {
      key,
      old: undefined,
      new: value,
    });
    
    return result;
  },
};
```

## Middleware Chaining

Combine multiple middleware in any order. They execute sequentially for hooks and in reverse order for after hooks.

```typescript
import { loggerMiddleware } from '@standard-store/store/middleware/logger';
import { validateMiddleware } from '@standard-store/store/middleware/validate';

const store = createStore(initialState, {
  middleware: [
    loggerMiddleware,      // Logs every operation
    validateMiddleware(rules),  // Validates before updates
    customMiddleware,        // Custom logic
  ],
});
```

## Common Patterns

### Analytics Tracking

```typescript
const analyticsMiddleware = {
  name: 'analytics',
  
  async after(state, nextState) {
    // Track state changes for analytics
    await analytics.track('state_change', {
      oldState: state,
      newState: nextState,
    });
  },
};
```

### Persistence Debouncing

Debounce state updates to reduce storage writes.

```typescript
const debounceMiddleware = {
  name: 'debounce-persist',
  timeoutId: null as NodeJS.Timeout | null,
  
  after(state, nextState) {
    if (this.timeoutId) clearTimeout(this.timeoutId);
    
    this.timeoutId = setTimeout(() => {
      localStorage.setItem('store', JSON.stringify(nextState));
    }, 500); // Debounce by 500ms
  },
};
```

### Side Effects Based on State Changes

Fetch data when user changes.

```typescript
const sideEffectMiddleware = {
  name: 'fetch-user',
  
  async after(state, nextState) {
    if (nextState.userId !== state.userId && nextState.userId) {
      // User changed, fetch their profile data
      const userData = await fetchUser(nextState.userId);
      
      // Update store with fetched data
      store.setState({ 
        user: userData,
        lastFetched: new Date() 
      });
    }
  },
};
```

## See Also

- [Creating a Store](../guides/creating-store.md) - Using middleware in createStore
