'use client';

import { CircularProgress, InputAdornment, TextField, type TextFieldProps } from '@assetforce/material';
import type { ReactNode } from 'react';

/**
 * Field props from @assetforce/form Field component
 */
export interface FieldControllerProps {
  field: {
    name: string;
    value: unknown;
    onChange: (value: unknown) => void;
    onBlur: () => void;
    ref: React.Ref<unknown>;
  };
  fieldState: {
    invalid: boolean;
    isDirty: boolean;
    isTouched: boolean;
    error?: { message?: string };
  };
}

export interface FormTextFieldProps extends FieldControllerProps {
  /** Field label */
  label?: string;
  /** Placeholder text */
  placeholder?: string;
  /** Helper text (shown when no error) */
  helperText?: string;
  /** Input type (text, email, etc.) */
  type?: TextFieldProps['type'];
  /** Whether field is required */
  required?: boolean;
  /** Whether field is disabled */
  disabled?: boolean;
  /** Full width */
  fullWidth?: boolean;
  /** Show loading indicator */
  loading?: boolean;
  /** End adornment (icon, etc.) */
  endAdornment?: ReactNode;
  /** Auto focus */
  autoFocus?: boolean;
  /** Auto complete attribute */
  autoComplete?: string;
  /** Test ID for E2E testing */
  'data-testid'?: string;
}

/**
 * FormTextField - MUI TextField adapter for @assetforce/form
 *
 * @example
 * ```tsx
 * import { Field } from '@assetforce/form';
 * import { FormTextField } from '@assetforce/feature-common/fields';
 *
 * <Field
 *   name="email"
 *   component={FormTextField}
 *   props={{ label: 'Email', type: 'email', required: true }}
 * />
 * ```
 */
export function FormTextField({
  field,
  fieldState,
  label,
  placeholder,
  helperText,
  type = 'text',
  required = false,
  disabled = false,
  fullWidth = true,
  loading = false,
  endAdornment,
  autoFocus = false,
  autoComplete,
  'data-testid': testId,
}: FormTextFieldProps) {
  const hasError = fieldState.invalid && (fieldState.isTouched || fieldState.isDirty);
  const errorMessage = fieldState.error?.message;

  return (
    <TextField
      name={field.name}
      value={(field.value as string) ?? ''}
      onChange={(e) => field.onChange(e.target.value)}
      onBlur={field.onBlur}
      inputRef={field.ref}
      label={label}
      placeholder={placeholder}
      type={type}
      required={required}
      disabled={disabled}
      fullWidth={fullWidth}
      autoFocus={autoFocus}
      autoComplete={autoComplete}
      error={hasError}
      helperText={hasError ? errorMessage : helperText}
      data-testid={testId}
      slotProps={{
        input: {
          endAdornment:
            loading || endAdornment ? (
              <InputAdornment position="end">{loading ? <CircularProgress size={20} /> : endAdornment}</InputAdornment>
            ) : undefined,
        },
      }}
    />
  );
}
