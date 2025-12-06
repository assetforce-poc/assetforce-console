import React, { useRef, useEffect, useCallback, ComponentType } from 'react';
import { useFormContext } from '../core/useFormContext';
import type { FieldProps } from '../core/types';

type ErrorLike = { message?: string } | string | null | undefined;

/**
 * Props that components wrapped with withFieldValidator should have
 */
type WithErrorCallbackProps = {
  onError?: (errors: ErrorLike[]) => void;
};

/**
 * HOC to bridge third-party component errors to form validation
 *
 * This HOC is designed for third-party components (like FileUpload) that:
 * 1. Have their own internal validation (e.g., file size check)
 * 2. Report errors via an `onError` callback
 * 3. Cannot be modified to use our hooks
 *
 * How it works:
 * 1. Intercepts the `onError` callback from the wrapped component
 * 2. Stores the error in a ref
 * 3. Registers a validator function that returns the stored error
 * 4. Updates RHF error state immediately for UI feedback
 *
 * @example
 * ```tsx
 * import { ThirdPartyFileUpload } from 'some-library';
 * import { withFieldValidator } from '@assetforce/form';
 *
 * const FormFileUpload = withFieldValidator(ThirdPartyFileUpload);
 *
 * // Usage
 * <Field
 *   name="files"
 *   component={FormFileUpload}
 *   props={{ multiple: true }}
 * />
 * ```
 */
export const withFieldValidator = <TProps extends FieldProps & WithErrorCallbackProps>(
  Component: ComponentType<TProps>
) => {
  const WrappedComponent = (props: TProps) => {
    const { field, onError: originalOnError } = props;
    const form = useFormContext();
    const errorRef = useRef<string | null>(null);

    // Register validator that returns stored error
    useEffect(() => {
      form.meta.set(field.name, {
        validator: () => errorRef.current,
      });

      return () => {
        form.meta.clear(field.name);
      };
    }, [field.name, form.meta]);

    // Bridge onError callback
    const handleError = useCallback(
      (errors: ErrorLike[]) => {
        // Extract first error message
        const firstError = errors?.[0];
        let message: string | null = null;

        if (typeof firstError === 'string') {
          message = firstError;
        } else if (firstError && typeof firstError === 'object' && 'message' in firstError) {
          message = firstError.message ?? null;
        }

        // Store in ref for validator
        errorRef.current = message;

        // Store in meta as immediate error
        form.meta.set(field.name, { error: message });

        // Update RHF error state immediately for UI feedback
        if (message) {
          form.errors.set(field.name, message);
        } else {
          form.errors.set(field.name, undefined);
        }

        // Pass through to original handler
        originalOnError?.(errors);
      },
      [field.name, form.meta, form.errors, originalOnError]
    );

    return <Component {...(props as TProps)} onError={handleError} />;
  };

  // Preserve display name
  const displayName = Component.displayName || Component.name || 'Component';
  WrappedComponent.displayName = `withFieldValidator(${displayName})`;

  return WrappedComponent;
};
