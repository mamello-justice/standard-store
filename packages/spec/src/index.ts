export interface TemporalDurationLike {
  readonly total: (options: { unit: string }) => number;
}

export interface TemporalInstantLike {
  readonly epochMilliseconds: number;
  readonly toString: () => string;
}

export type Expiry = TemporalDurationLike | TemporalInstantLike | Date;

export interface StandardStoreV1<
  State extends Record<string, any> = Record<string, unknown>,
> {
  readonly "~standard": StandardStoreV1.Props<State>;
}

export namespace StandardStoreV1 {
  export interface Props<State extends Record<string, any>> {
    readonly version: 1;
    readonly vendor: string;
    readonly types?: Types<State>;
    get<K extends keyof State & string>(key: K): State[K] | undefined;
    set<K extends keyof State & string>(
      key: K,
      value: State[K],
      options?: SetOptions,
    ): void;
    remove<K extends keyof State & string>(key: K): void;
    clear(): void;
    subscribe<K extends keyof State & string>(
      key: K,
      listener: (value: State[K] | undefined) => void,
    ): () => void;
    hydrate(): Promise<void> | void;
  }

  export interface Types<State> {
    readonly state: State;
  }

  export interface SetOptions {
    ttl?: Expiry;
  }

  export type InferState<T> = T extends StandardStoreV1<infer S> ? S : never;

  export type InferKey<T> =
    T extends StandardStoreV1<infer S> ? keyof S & string : never;
}

export interface StandardStoreAdapterV1 {
  get(key: string): string | null | undefined;
  set(key: string, value: string): void;
  remove(key: string): void;
  clear(): void;
  subscribe?(
    key: string,
    listener: (value: string | null) => void,
    options?: SubscribeOptions,
  ): () => void;
}

export interface SubscribeOptions {
  scope?: "tab" | "global";
}

export interface StandardStoreMiddlewareV1 {
  onGet?<T>(key: string, value: T, next: () => T): T;
  onSet?<T>(key: string, value: T, next: () => void): void;
  onRemove?(key: string, next: () => void): void;
}

export interface StandardStoreOptionsV1<
  State extends Record<string, any> = Record<string, unknown>,
> {
  adapter: StandardStoreAdapterV1;
  prefix?: string;
  middleware?: StandardStoreMiddlewareV1[];
  ttl?: Expiry;
  expiryFormat?: "iso" | "epoch";
  scope?: "tab" | "global";
}
