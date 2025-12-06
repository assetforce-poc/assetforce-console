/**
 * Validator function type - called during trigger()
 */
export type ValidatorFn = () => string | null | undefined;

/**
 * Field meta data - stored per field
 */
export type FieldMeta = {
  /** Custom error from component internal validation */
  error?: string | null;
  /** Validator function to run on trigger() */
  validator?: ValidatorFn;
  /** Loading state */
  loading?: boolean;
  /** Upload progress (0-100) */
  progress?: number;
  /** Any additional custom data */
  [key: string]: unknown;
};

/**
 * Meta API - namespace for meta operations
 */
export type MetaAPI = {
  /**
   * Get meta for a single field
   */
  get(name: string): FieldMeta | undefined;

  /**
   * Get meta for multiple fields
   */
  get(names: string[]): (FieldMeta | undefined)[];

  /**
   * Set meta for a field (merges with existing)
   */
  set(name: string, meta: Partial<FieldMeta>): void;

  /**
   * Check if any field meta matches predicate
   */
  some(predicate: (meta: FieldMeta, name: string) => boolean): boolean;

  /**
   * Check if all field metas match predicate
   */
  every(predicate: (meta: FieldMeta, name: string) => boolean): boolean;

  /**
   * Clear meta for a field
   */
  clear(name: string): void;
};

/**
 * Internal implementation type for MetaAPI
 */
export type MetaAPIImpl = {
  get: {
    (name: string): FieldMeta | undefined;
    (names: string[]): (FieldMeta | undefined)[];
  };
  set: (name: string, meta: Partial<FieldMeta>) => void;
  some: (predicate: (meta: FieldMeta, name: string) => boolean) => boolean;
  every: (predicate: (meta: FieldMeta, name: string) => boolean) => boolean;
  clear: (name: string) => void;
};
