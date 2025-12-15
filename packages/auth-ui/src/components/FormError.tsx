'use client';

import { Alert, type AlertProps } from '@assetforce/material';

export interface FormErrorProps extends Omit<AlertProps, 'severity'> {
  /** Error message to display */
  error?: string | null;

  /** Show error even if empty (default: false) */
  showEmpty?: boolean;
}

/**
 * FormError - Form error message display component
 *
 * Features:
 * - Only shows when error exists
 * - Alert severity: error
 * - Dismissible
 *
 * @example
 * <FormError error={error} />
 */
export function FormError({ error, showEmpty = false, sx, ...props }: FormErrorProps) {
  if (!error && !showEmpty) {
    return null;
  }

  return (
    <Alert {...props} severity="error" sx={{ mb: 2, ...sx }}>
      {error || 'An error occurred'}
    </Alert>
  );
}
