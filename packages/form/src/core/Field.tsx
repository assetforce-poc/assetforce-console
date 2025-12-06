import { useCallback, useMemo, useContext } from 'react';
import { Controller, useAdapterFormContext } from '../adapters/rhf';
import { FormContext } from './FormContext';
import type { FieldComponentProps, FieldComponent } from './types';

/**
 * Field component - wraps a form field with validation and state management
 *
 * Features:
 * - Automatically injects registered validators from meta
 * - Passes stable field/fieldState props to component
 * - Supports user-defined validation rules
 *
 * @example
 * ```tsx
 * <Field name="email" component={TextField} props={{ label: 'Email' }} />
 *
 * // With validation rules
 * <Field
 *   name="password"
 *   component={TextField}
 *   rules={{ required: 'Password is required' }}
 *   props={{ label: 'Password', type: 'password' }}
 * />
 * ```
 */
export const Field = <TExtra extends Record<string, unknown> = Record<string, unknown>>(
  props: FieldComponentProps<TExtra>
) => {
  const { name, component: Component, rules, props: extraProps } = props;

  // Get adapter control
  const { control } = useAdapterFormContext();

  // Get our form context for meta validators
  const formContext = useContext(FormContext);

  // Combined validate function that includes meta validators
  const combinedValidate = useCallback(
    (value: unknown) => {
      // 1. Check meta.error (immediate errors set by component)
      const meta = formContext?.meta.get(name);
      if (meta?.error) {
        return meta.error;
      }

      // 2. Run registered validator (if any)
      if (meta?.validator) {
        const validatorError = meta.validator();
        if (validatorError) {
          return validatorError;
        }
      }

      // 3. Run user-provided validate
      if (rules?.validate) {
        const userError = rules.validate(value);
        if (userError && userError !== true) {
          return userError;
        }
      }

      return true;
    },
    [name, formContext?.meta, rules]
  );

  // Memoize combined rules
  const combinedRules = useMemo(
    () => ({
      required: rules?.required,
      validate: combinedValidate,
    }),
    [rules?.required, combinedValidate]
  );

  return (
    <Controller
      name={name}
      control={control}
      rules={combinedRules}
      render={({ field, fieldState }) => (
        <Component
          field={{
            name: field.name,
            value: field.value,
            onChange: field.onChange,
            onBlur: field.onBlur,
            ref: field.ref,
          }}
          fieldState={{
            invalid: fieldState.invalid,
            isTouched: fieldState.isTouched,
            isDirty: fieldState.isDirty,
            error: fieldState.error ? { message: fieldState.error.message } : undefined,
          }}
          {...(extraProps as TExtra)}
        />
      )}
    />
  );
};

Field.displayName = 'Field';
