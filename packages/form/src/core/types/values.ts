/**
 * Values API - namespace for value operations
 */
export type ValuesAPI<TValues = Record<string, unknown>> = {
  /**
   * Get all values (non-reactive snapshot)
   */
  get(): TValues;

  /**
   * Get a single value by field name (non-reactive snapshot)
   */
  get<K extends keyof TValues>(name: K): TValues[K];

  /**
   * Get a value by field name (generic string)
   */
  get(name: string): unknown;

  /**
   * Set a field value
   */
  set<K extends keyof TValues>(name: K, value: TValues[K]): void;

  /**
   * Set a field value (generic string)
   */
  set(name: string, value: unknown): void;

  /**
   * Watch all values (reactive - re-renders on change)
   */
  watch(): TValues;

  /**
   * Watch a single field (reactive - re-renders on change)
   */
  watch<K extends keyof TValues>(name: K): TValues[K];

  /**
   * Watch a field by name (generic string)
   */
  watch(name: string): unknown;

  /**
   * Watch multiple fields (reactive - re-renders on change)
   */
  watch<K extends keyof TValues>(names: K[]): TValues[K][];

  /**
   * Watch multiple fields (generic string array)
   */
  watch(names: string[]): unknown[];
};

/**
 * Internal implementation type for ValuesAPI
 */
export type ValuesAPIImpl<TValues = Record<string, unknown>> = {
  get: {
    (): TValues;
    (name?: string): unknown;
  };
  set: (name: string, value: unknown) => void;
  watch: {
    (): TValues;
    (name?: string | string[]): unknown;
  };
};
