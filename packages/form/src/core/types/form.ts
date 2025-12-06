import type { ReactNode } from 'react';
import type { ZodType } from 'zod';
import type { ValuesAPIImpl } from './values';
import type { ErrorsAPI } from './errors';
import type { MetaAPIImpl } from './meta';

/**
 * Form values constraint - internal abstraction over RHF's FieldValues
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type FormValues = Record<string, any>;

/**
 * Form state (readonly)
 */
export type FormState = {
  isValid: boolean;
  isDirty: boolean;
  isSubmitting: boolean;
  isValidating: boolean;
  submitCount: number;
  errors: Record<string, { message?: string }>;
};

/**
 * Form context value - what useFormContext returns
 */
export type FormContextValue<TValues extends FormValues = FormValues> = {
  /** Values namespace */
  values: ValuesAPIImpl<TValues>;

  /** Errors namespace */
  errors: ErrorsAPI;

  /** Meta namespace */
  meta: MetaAPIImpl;

  /** Form state (readonly) */
  state: FormState;

  /** Trigger validation */
  trigger(name?: string): Promise<boolean>;

  /** Reset form */
  reset(values?: Partial<TValues>): void;

  /** Submit form programmatically */
  submit(): void;
};

/**
 * Form component props
 */
export type FormProps<TValues extends FormValues = FormValues> = {
  children: ReactNode;
  defaultValues?: TValues;
  schema?: ZodType<TValues, TValues>;
  onSubmit?: (values: TValues) => void | Promise<void>;
  mode?: 'onChange' | 'onBlur' | 'onSubmit' | 'onTouched';
  className?: string;
};
