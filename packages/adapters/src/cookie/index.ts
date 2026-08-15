import type { StandardStoreAdapterV1 } from "@standard-store/spec";

export interface CookieAdapterOptions {
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: "strict" | "lax" | "none";
}

export function cookieAdapter(
  options: CookieAdapterOptions = {},
): StandardStoreAdapterV1 {
  const { path = "/", domain, secure, sameSite = "lax" } = options;
  const listeners = new Map<string, Set<(value: string | null) => void>>();

  function buildAttributes(): string {
    let attrs = `; path=${path}; samesite=${sameSite}`;
    if (domain) attrs += `; domain=${domain}`;
    if (secure) attrs += "; secure";
    return attrs;
  }

  function getCookie(key: string): string | null {
    const match = document.cookie.match(
      new RegExp(`(?:^|; )${encodeURIComponent(key)}=([^;]*)`),
    );
    return match ? decodeURIComponent(match[1]) : null;
  }

  function setCookie(key: string, value: string): void {
    document.cookie = `${encodeURIComponent(key)}=${encodeURIComponent(value)}${buildAttributes()}`;
  }

  function deleteCookie(key: string): void {
    document.cookie = `${encodeURIComponent(key)}=; max-age=0${buildAttributes()}`;
  }

  return {
    get(key) {
      return getCookie(key);
    },
    set(key, value) {
      setCookie(key, value);
      notify(key, value);
    },
    remove(key) {
      deleteCookie(key);
      notify(key, null);
    },
    clear() {
      const keys = document.cookie
        .split("; ")
        .map((c) => decodeURIComponent(c.split("=")[0]));
      for (const key of keys) {
        deleteCookie(key);
        notify(key, null);
      }
    },
    subscribe(key, listener) {
      if (!listeners.has(key)) {
        listeners.set(key, new Set());
      }
      listeners.get(key)!.add(listener);
      return () => {
        listeners.get(key)?.delete(listener);
        if (listeners.get(key)?.size === 0) {
          listeners.delete(key);
        }
      };
    },
  };

  function notify(key: string, value: string | null): void {
    const keyListeners = listeners.get(key);
    if (keyListeners) {
      for (const listener of keyListeners) {
        listener(value);
      }
    }
  }
}
