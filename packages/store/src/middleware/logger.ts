import type { StandardStoreMiddlewareV1 } from "@standard-store/spec";

export function logger(): StandardStoreMiddlewareV1 {
  return {
    onGet(key, value, next) {
      const result = next();
      console.log(`[store] get "${key}" →`, result);
      return result;
    },
    onSet(key, value, next) {
      console.log(`[store] set "${key}" ←`, value);
      next();
    },
    onRemove(key, next) {
      console.log(`[store] remove "${key}"`);
      next();
    },
  };
}
