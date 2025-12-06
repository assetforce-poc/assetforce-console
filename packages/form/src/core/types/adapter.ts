import type { ReactNode } from 'react';
import type { FieldMeta, ValidatorFn } from './meta';
import type { FieldError } from './errors';

/**
 * Abstract form adapter interface
 * Implementations: RHF, Formik, TanStack Form, etc.
 */
export type FormAdapter<TValues = Record<string, unknown>> = {
  /** Get all form values (non-reactive) */
  getValues(): TValues;

  /** Get a single field value (non-reactive) */
  getValue(name: string): unknown;

  /** Set a field value */
  setValue(name: string, value: unknown): void;

  /** Watch values (reactive - triggers re-render on change) */
  watch(name?: string | string[]): unknown;

  /** Get field error */
  getError(name: string): FieldError | undefined;

  /** Set field error */
  setError(name: string, error: FieldError | undefined): void;

  /** Clear errors */
  clearErrors(name?: string): void;

  /** Trigger validation */
  trigger(name?: string): Promise<boolean>;

  /** Reset form */
  reset(values?: Partial<TValues>): void;

  /** Handle submit */
  handleSubmit(onSubmit: (values: TValues) => void | Promise<void>): (e?: React.FormEvent) => void;

  /** Form state */
  formState: {
    isValid: boolean;
    isDirty: boolean;
    isSubmitting: boolean;
    isValidating: boolean;
    submitCount: number;
    errors: Record<string, FieldError>;
  };
};

/**
 * Form adapter hook return type
 */
export type UseFormAdapterReturn<TValues = Record<string, unknown>> = {
  adapter: FormAdapter<TValues>;
  Provider: React.ComponentType<{ children: ReactNode }>;
};

/**
 * Form adapter options
 */
export type FormAdapterOptions<TValues = Record<string, unknown>> = {
  defaultValues?: TValues;
  mode?: 'onChange' | 'onBlur' | 'onSubmit' | 'onTouched';
  resolver?: unknown; // Adapter-specific resolver
};

/**
 * Validator registry interface (used by Field to run component validators)
 */
export type ValidatorRegistry = {
  register(name: string, fn: ValidatorFn): void;
  unregister(name: string): void;
  run(name: string): string | null | undefined;
  runAll(): Record<string, string | null | undefined>;
};

/**
 * Meta storage interface
 */
export type MetaStorage = {
  get(name: string): FieldMeta | undefined;
  getMultiple(names: string[]): (FieldMeta | undefined)[];
  set(name: string, meta: Partial<FieldMeta>): void;
  clear(name: string): void;
  some(predicate: (meta: FieldMeta, name: string) => boolean): boolean;
  every(predicate: (meta: FieldMeta, name: string) => boolean): boolean;
};
