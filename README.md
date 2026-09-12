# Standard Store

Lightweight, type-safe state management with flexible storage adapters

```bash
npm add @standard-store/store
```

## Packages

- **[@standard-store/store](./packages/store)** - Core state management
- **[@standard-store/react](./packages/react)** - React integration
- **[@standard-store/adapters](./packages/adapters)** - Storage adapters (localStorage, sessionStorage, cookies, memory, and more)

## Quick Start

```typescript
import { createStore } from '@standard-store/store';

const store = createStore({
  count: 0,
});

store.setState({ count: 1 });
store.subscribe(() => console.log(store.getState()));
```

**React:**

```typescript
import { createStoreHook } from '@standard-store/react';

const useStore = createStoreHook(store);

function App() {
  const { count } = useStore();
  return <div>{count}</div>;
}
```

## Docs

See [docs](./apps/website) for full documentation, examples, and API reference.

- [Getting Started](./apps/website/docs/getting-started/installation.md)
- [Core Concepts](./apps/website/docs/getting-started/concepts.md)
- [Creating a Store](./apps/website/docs/guides/creating-store.md)
- [Persistence & Adapters](./apps/website/docs/guides/adapters.md)
- [Middleware](./apps/website/docs/guides/middleware.md)
- [React Integration](./apps/website/docs/guides/react-integration.md)

## License

MIT
