import type { StandardStoreMiddlewareV1 } from "@standard-store/spec";

export type Validators = Record<string, (value: unknown) => boolean>;

export function validate(validators: Validators): StandardStoreMiddlewareV1 {
  return {
    onSet(key, value, next) {
      const check = validators[key];
      if (check && !check(value)) {
        throw new Error(`[store] validation failed for "${key}"`);
      }
      next();
    },
  };
}
