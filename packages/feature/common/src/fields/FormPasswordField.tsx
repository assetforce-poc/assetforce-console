'use client';

import { IconButton, InputAdornment, TextField, Icons } from '@assetforce/material';
import { useState } from 'react';

import type { FieldControllerProps } from './FormTextField';

export interface FormPasswordFieldProps extends FieldControllerProps {
  /** Field label */
  label?: string;
  /** Placeholder text */
  placeholder?: string;
  /** Helper text (shown when no error) */
  helperText?: string;
  /** Whether field is required */
  required?: boolean;
  /** Whether field is disabled */
  disabled?: boolean;
  /** Full width */
  fullWidth?: boolean;
  /** Auto complete attribute */
  autoComplete?: string;
  /** Test ID for E2E testing */
  'data-testid'?: string;
}

/**
 * FormPasswordField - Password input with show/hide toggle for @assetforce/form
 *
 * @example
 * ```tsx
 * import { Field } from '@assetforce/form';
 * import { FormPasswordField } from '@assetforce/feature-common/fields';
 *
 * <Field
 *   name="password"
 *   component={FormPasswordField}
 *   props={{ label: 'Password', required: true }}
 * />
 * ```
 */
export function FormPasswordField({
  field,
  fieldState,
  label = 'Password',
  placeholder,
  helperText,
  required = false,
  disabled = false,
  fullWidth = true,
  autoComplete = 'current-password',
  'data-testid': testId,
}: FormPasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  const hasError = fieldState.invalid && (fieldState.isTouched || fieldState.isDirty);
  const errorMessage = fieldState.error?.message;

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <TextField
      name={field.name}
      value={(field.value as string) ?? ''}
      onChange={(e) => field.onChange(e.target.value)}
      onBlur={field.onBlur}
      inputRef={field.ref}
      label={label}
      placeholder={placeholder}
      type={showPassword ? 'text' : 'password'}
      required={required}
      disabled={disabled}
      fullWidth={fullWidth}
      autoComplete={autoComplete}
      error={hasError}
      helperText={hasError ? errorMessage : helperText}
      data-testid={testId}
      slotProps={{
        input: {
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                onClick={handleTogglePassword}
                edge="end"
                tabIndex={-1}
              >
                {showPassword ? <Icons.VisibilityOff /> : <Icons.Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        },
      }}
    />
  );
}
