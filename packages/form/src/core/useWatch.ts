import { useFormContext } from './useFormContext';
import type { FormValues } from './types';

/**
 * Watch form values reactively
 *
 * @example
 * ```tsx
 * // Watch single field
 * const email = useWatch<MyForm>('email'); // returns MyForm['email']
 *
 * // Watch multiple fields
 * const [email, password] = useWatch(['email', 'password']); // returns unknown[]
 *
 * // Watch all values
 * const values = useWatch<MyForm>(); // returns MyForm
 * ```
 */
export function useWatch<TValues extends FormValues = FormValues>(): TValues;
export function useWatch<TValues extends FormValues, K extends keyof TValues>(name: K): TValues[K];
export function useWatch(name: string): unknown;
export function useWatch(names: string[]): unknown[];
export function useWatch<TValues extends FormValues = FormValues>(
  name?: string | string[]
): TValues | TValues[keyof TValues] | unknown | unknown[] {
  const form = useFormContext<TValues>();

  if (name === undefined) {
    return form.values.watch() as TValues;
  }

  if (Array.isArray(name)) {
    return form.values.watch(name) as unknown[];
  }

  return form.values.watch(name);
}
