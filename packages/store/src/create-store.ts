import type {
  Expiry,
  StandardStoreOptionsV1,
  StandardStoreV1,
  TemporalDurationLike,
  TemporalInstantLike,
} from "@standard-store/spec";

interface StoredEntry {
  value: string;
  expiresAt?: string | number;
}

function isTemporalDuration(expiry: Expiry): expiry is TemporalDurationLike {
  return (
    "total" in expiry &&
    typeof (expiry as TemporalDurationLike).total === "function"
  );
}

function isTemporalInstant(expiry: Expiry): expiry is TemporalInstantLike {
  return "epochMilliseconds" in expiry && !("total" in expiry);
}

function resolveExpiresAt(
  expiry: Expiry,
  format: "iso" | "epoch",
): string | number {
  let epochMs: number;

  if (isTemporalDuration(expiry)) {
    epochMs = Date.now() + expiry.total({ unit: "millisecond" });
  } else if (isTemporalInstant(expiry)) {
    epochMs = expiry.epochMilliseconds;
  } else {
    epochMs = expiry.getTime();
  }

  return format === "iso" ? new Date(epochMs).toISOString() : epochMs;
}

function isExpired(expiresAt: string | number): boolean {
  const now = Date.now();
  const expiry =
    typeof expiresAt === "string" ? new Date(expiresAt).getTime() : expiresAt;
  return now >= expiry;
}

export function createStore<
  State extends Record<string, any> = Record<string, unknown>,
>(options: StandardStoreOptionsV1<State>): StandardStoreV1<State> {
  const {
    adapter,
    prefix = "",
    middleware = [],
    ttl: defaultTtl,
    expiryFormat = "iso",
    scope: defaultScope = "tab",
  } = options;

  type Listeners = Map<string, Set<(value: unknown) => void>>;
  const listeners: Listeners = new Map();

  function prefixedKey(key: string): string {
    return `${prefix}${key}`;
  }

  function readEntry(key: string): StoredEntry | null {
    const raw = adapter.get(prefixedKey(key));
    if (raw == null) return null;
    try {
      return JSON.parse(raw) as StoredEntry;
    } catch {
      return { value: raw };
    }
  }

  function writeEntry(key: string, value: unknown, expiry?: Expiry): void {
    const effectiveExpiry = expiry ?? defaultTtl;
    const entry: StoredEntry = { value: JSON.stringify(value) };
    if (effectiveExpiry) {
      entry.expiresAt = resolveExpiresAt(effectiveExpiry, expiryFormat);
    }
    adapter.set(prefixedKey(key), JSON.stringify(entry));
  }

  function notify(key: string): void {
    const keyListeners = listeners.get(key);
    if (!keyListeners) return;
    const value = getValueInternal(key);
    for (const listener of keyListeners) {
      listener(value);
    }
  }

  function getValueInternal(key: string): unknown {
    const entry = readEntry(key);
    if (!entry) return undefined;
    if (entry.expiresAt && isExpired(entry.expiresAt)) {
      adapter.remove(prefixedKey(key));
      return undefined;
    }
    try {
      return JSON.parse(entry.value);
    } catch {
      return entry.value;
    }
  }

  function applyGetMiddleware(key: string, value: unknown): unknown {
    let result = value;
    for (let i = middleware.length - 1; i >= 0; i--) {
      const mw = middleware[i];
      if (mw.onGet) {
        const prev = result;
        result = mw.onGet(key, result, () => prev);
      }
    }
    return result;
  }

  function applySetMiddleware(
    key: string,
    value: unknown,
    fn: () => void,
  ): void {
    let chain = fn;
    for (let i = middleware.length - 1; i >= 0; i--) {
      const mw = middleware[i];
      if (mw.onSet) {
        const next = chain;
        chain = () => mw.onSet!(key, value, next);
      }
    }
    chain();
  }

  function applyRemoveMiddleware(key: string, fn: () => void): void {
    let chain = fn;
    for (let i = middleware.length - 1; i >= 0; i--) {
      const mw = middleware[i];
      if (mw.onRemove) {
        const next = chain;
        chain = () => mw.onRemove!(key, next);
      }
    }
    chain();
  }

  const store: StandardStoreV1<State> = {
    "~standard": {
      version: 1,
      vendor: "standard-store",
      get(key) {
        const value = getValueInternal(key);
        return applyGetMiddleware(key, value) as State[typeof key] | undefined;
      },
      set(key, value, setOptions) {
        applySetMiddleware(key, value, () => {
          writeEntry(key, value, setOptions?.ttl);
        });
        notify(key);
      },
      remove(key) {
        applyRemoveMiddleware(key, () => {
          adapter.remove(prefixedKey(key));
        });
        notify(key);
      },
      clear() {
        adapter.clear();
        for (const key of listeners.keys()) {
          notify(key);
        }
      },
      subscribe(key, listener) {
        if (!listeners.has(key)) {
          listeners.set(key, new Set());
        }
        listeners.get(key)!.add(listener as (value: unknown) => void);

        // Subscribe to adapter-level events if supported
        let adapterUnsub: (() => void) | undefined;
        if (adapter.subscribe) {
          adapterUnsub = adapter.subscribe(
            prefixedKey(key),
            () => notify(key),
            { scope: defaultScope },
          );
        }

        return () => {
          listeners.get(key)?.delete(listener as (value: unknown) => void);
          if (listeners.get(key)?.size === 0) {
            listeners.delete(key);
          }
          adapterUnsub?.();
        };
      },
      hydrate() {},
    },
  };

  return store;
}
