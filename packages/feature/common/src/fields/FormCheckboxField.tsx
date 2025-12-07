'use client';

import { Checkbox, FormControlLabel, FormHelperText, type CheckboxProps } from '@assetforce/material';
import type { ReactNode } from 'react';

import type { FieldControllerProps } from './FormTextField';

export interface FormCheckboxFieldProps extends FieldControllerProps {
  /** Checkbox label */
  label: ReactNode;
  /** Whether field is required */
  required?: boolean;
  /** Whether field is disabled */
  disabled?: boolean;
  /** Checkbox color */
  color?: CheckboxProps['color'];
  /** Checkbox size */
  size?: CheckboxProps['size'];
  /** Test ID for E2E testing */
  'data-testid'?: string;
}

/**
 * FormCheckboxField - Checkbox adapter for @assetforce/form
 *
 * @example
 * ```tsx
 * import { Field } from '@assetforce/form';
 * import { FormCheckboxField } from '@assetforce/feature-common/fields';
 *
 * <Field
 *   name="acceptTerms"
 *   component={FormCheckboxField}
 *   props={{
 *     label: (
 *       <>
 *         I accept the <Link href="/terms">Terms of Service</Link>
 *       </>
 *     ),
 *     required: true,
 *   }}
 * />
 * ```
 */
export function FormCheckboxField({
  field,
  fieldState,
  label,
  required = false,
  disabled = false,
  color = 'primary',
  size = 'medium',
  'data-testid': testId,
}: FormCheckboxFieldProps) {
  const hasError = fieldState.invalid && (fieldState.isTouched || fieldState.isDirty);
  const errorMessage = fieldState.error?.message;

  return (
    <>
      <FormControlLabel
        data-testid={testId}
        control={
          <Checkbox
            name={field.name}
            checked={Boolean(field.value)}
            onChange={(e) => field.onChange(e.target.checked)}
            onBlur={field.onBlur}
            inputRef={field.ref}
            required={required}
            disabled={disabled}
            color={hasError ? 'error' : color}
            size={size}
          />
        }
        label={label}
      />
      {hasError && errorMessage && (
        <FormHelperText error sx={{ mt: -1, ml: 2 }}>
          {errorMessage}
        </FormHelperText>
      )}
    </>
  );
}
