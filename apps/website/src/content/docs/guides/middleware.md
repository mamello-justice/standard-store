---
title: Middleware
description: Middleware allows you to intercept state updates for cross-cutting concerns like logging, validation, and side effects.
---

## Logger Middleware

Log all state changes before updates:

```typescript
import { createStore } from '@standard-store/store';
import { loggerMiddleware } from '@standard-store/store/middleware/logger';

const store = createStore(
  { count: 0 },
  { middleware: [loggerMiddleware] }
);

store.setState({ count: 1 });
// Console output: { count: 0 } → { count: 1 }
```

## Validation Middleware

Validate state before updates to enforce business rules:

```typescript
import { validateMiddleware } from '@standard-store/store/middleware/validate';

const store = createStore(
  { count: 0 },
  {
    middleware: [
      validateMiddleware((state) => {
        if (state.count < 0) {
          throw new Error('Count cannot be negative');
        }
        // Add more validation rules here...
      }),
    ],
  }
);

store.setState({ count: -1 }); // Throws error
```

## Custom Middleware

Create your own middleware for any use case:

```typescript
const customMiddleware = {
  name: 'custom',
  
  async before(state, nextState) {
    // Before state update hook
    console.log('Before:', state, 'Next:', nextState);
    
    // Return false to prevent the update
    return true;
  },
  
  async after(state, nextState) {
    // After state update hook
    console.log('After update:', nextState);
    
    // Can perform side effects here
  },
};

const store = createStore(initialState, { middleware: [customMiddleware] });
```

## Chaining Middleware

Combine multiple middleware in any order. They execute sequentially for `before` hooks, and in reverse order for `after` hooks:

```typescript
const store = createStore(initialState, {
  middleware: [
    loggerMiddleware,      // Logs first
    validateMiddleware(validator),  // Validates second
    customMiddleware,      // Executes third
  ],
});
```

## Common Patterns

### Analytics Tracking

Track all state changes for analytics:

```typescript
const analyticsMiddleware = {
  name: 'analytics',
  
  async after(state, nextState) {
    // Track state changes
    await analytics.track('state_change', { 
      oldState: state,
      newState: nextState,
      timestamp: Date.now(),
    });
  },
};
```

### Persistence Debouncing

Debounce state updates to reduce storage writes:

```typescript
const debounceMiddleware = {
  name: 'debounce-persist',
  timeoutId: null as NodeJS.Timeout | null,
  
  async after(state, nextState) {
    // Clear previous timeout
    if (this.timeoutId) clearTimeout(this.timeoutId);
    
    // Debounce by 500ms
    this.timeoutId = setTimeout(() => {
      localStorage.setItem('store', JSON.stringify(nextState));
    }, 500);
  },
};
```

### Side Effects Based on State Changes

Fetch data when user changes:

```typescript
const sideEffectMiddleware = {
  name: 'fetch-user',
  
  async after(state, nextState) {
    // User changed, fetch their profile data
    if (nextState.userId !== state.userId && nextState.userId) {
      const userData = await fetchUser(nextState.userId);
      
      // Update store with fetched data
      store.setState({ 
        user: userData,
        lastFetched: new Date(),
      });
    }
  },
};
```

### Error Boundary Middleware

Catch errors and handle them gracefully:

```typescript
const errorHandlerMiddleware = {
  name: 'error-handler',
  
  async after(state, nextState) {
    try {
      await someAsyncOperation(nextState);
    } catch (error) {
      // Log error or show user-friendly message
      console.error('State update failed:', error);
      
      // Optionally revert to previous state
      store.setState(state);
    }
  },
};
```

## See Also

- [Middleware API](../api/middleware.md) - Middleware reference
