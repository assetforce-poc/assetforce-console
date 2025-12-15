'use client';

import { Button, type ButtonProps, CircularProgress } from '@assetforce/material';

export interface SubmitButtonProps extends Omit<ButtonProps, 'type'> {
  /** Loading state */
  loading?: boolean;

  /** Text to show when loading (default: same as children) */
  loadingText?: string;
}

/**
 * SubmitButton - Submit button with loading state
 *
 * Features:
 * - Loading indicator
 * - Disabled during loading
 * - Optional loading text
 * - Full-width by default
 *
 * @example
 * <SubmitButton loading={isSubmitting} loadingText="Signing in...">
 *   Sign In
 * </SubmitButton>
 */
export function SubmitButton({
  loading = false,
  loadingText,
  children,
  disabled,
  fullWidth = true,
  variant = 'contained',
  ...props
}: SubmitButtonProps) {
  return (
    <Button
      {...props}
      type="submit"
      variant={variant}
      fullWidth={fullWidth}
      disabled={disabled || loading}
      startIcon={loading ? <CircularProgress size={20} color="inherit" /> : props.startIcon}
    >
      {loading && loadingText ? loadingText : children}
    </Button>
  );
}
