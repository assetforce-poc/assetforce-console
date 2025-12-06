import { useEffect, useRef } from 'react';
import { useFormContext } from './useFormContext';
import type { FormValues } from './types';

/**
 * Cross-field validation rule
 */
export type CrossFieldRule<TValues extends FormValues = FormValues> = {
  /** Fields to watch for changes */
  watch: (keyof TValues)[];

  /** Validation function - receives current values, returns error map */
  validate: (values: TValues) => Record<string, string | undefined>;
};

/**
 * Hook for cross-field validation
 *
 * @example
 * ```tsx
 * // Password confirmation
 * useCrossFieldValidation({
 *   watch: ['password', 'confirmPassword'],
 *   validate: (values) => ({
 *     confirmPassword: values.password !== values.confirmPassword
 *       ? 'Passwords must match'
 *       : undefined,
 *   }),
 * });
 *
 * // Date range validation
 * useCrossFieldValidation({
 *   watch: ['startDate', 'endDate'],
 *   validate: (values) => ({
 *     endDate: values.startDate && values.endDate && values.startDate > values.endDate
 *       ? 'End date must be after start date'
 *       : undefined,
 *   }),
 * });
 * ```
 */
export const useCrossFieldValidation = <TValues extends FormValues = FormValues>(
  rule: CrossFieldRule<TValues>
): void => {
  const form = useFormContext<TValues>();
  const prevValuesRef = useRef<Partial<TValues>>({});
  // Track which fields have errors set by this hook (to avoid clearing other errors)
  const ownErrorsRef = useRef<Set<string>>(new Set());

  // Watch the specified fields
  const watchedValues = form.values.watch(rule.watch as string[]) as unknown[];

  useEffect(() => {
    // Get current values for watched fields
    const currentValues: Partial<TValues> = {};
    rule.watch.forEach((fieldName, index) => {
      currentValues[fieldName] = watchedValues[index] as TValues[keyof TValues];
    });

    // Check if values have actually changed
    const hasChanged = rule.watch.some(
      (fieldName) => prevValuesRef.current[fieldName] !== currentValues[fieldName]
    );

    if (!hasChanged) {
      return;
    }

    prevValuesRef.current = currentValues;

    // Run validation
    const allValues = form.values.get();
    const errors = rule.validate(allValues);

    // Apply errors - only clear errors that were set by this hook
    for (const [fieldName, error] of Object.entries(errors)) {
      if (error) {
        form.errors.set(fieldName, error);
        ownErrorsRef.current.add(fieldName);
      } else if (ownErrorsRef.current.has(fieldName)) {
        // Only clear if we previously set this error
        form.errors.clear(fieldName);
        ownErrorsRef.current.delete(fieldName);
      }
      // If error is undefined and we didn't set it, don't touch it
    }
  }, [watchedValues, rule, form]);
};

/**
 * Utility: Match field validation (e.g., password confirmation)
 */
export const matchField = <TValues extends FormValues>(
  sourceField: keyof TValues,
  targetField: keyof TValues,
  message = 'Fields must match'
): CrossFieldRule<TValues> => ({
  watch: [sourceField, targetField],
  validate: (values) => ({
    [targetField]: values[sourceField] !== values[targetField] ? message : undefined,
  }),
});

/**
 * Utility: Date range validation
 */
export const dateRange = <TValues extends FormValues>(
  startField: keyof TValues,
  endField: keyof TValues,
  message = 'End date must be after start date'
): CrossFieldRule<TValues> => ({
  watch: [startField, endField],
  validate: (values) => {
    const start = values[startField] as Date | string | undefined;
    const end = values[endField] as Date | string | undefined;

    if (!start || !end) {
      return {};
    }

    const startDate = start instanceof Date ? start : new Date(start);
    const endDate = end instanceof Date ? end : new Date(end);

    return {
      [endField]: startDate > endDate ? message : undefined,
    };
  },
});

/**
 * Utility: Conditional required field
 */
export const requiredWhen = <TValues extends FormValues>(
  targetField: keyof TValues,
  conditionField: keyof TValues,
  condition: (value: unknown) => boolean,
  message = 'This field is required'
): CrossFieldRule<TValues> => ({
  watch: [conditionField, targetField],
  validate: (values) => {
    const conditionValue = values[conditionField];
    const targetValue = values[targetField];

    if (condition(conditionValue) && !targetValue) {
      return { [targetField]: message };
    }

    return { [targetField]: undefined };
  },
});
