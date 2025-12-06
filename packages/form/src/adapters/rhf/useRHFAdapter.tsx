import { useMemo, useRef, ReactNode } from 'react';
import { useForm, FormProvider, FieldValues, Path, FieldError as RHFFieldError, UseFormReturn } from 'react-hook-form';
import type { FormAdapter } from '../../core/types';
import type { RHFAdapterOptions } from './types';

/**
 * React Hook Form adapter implementation
 * Wraps RHF to match our FormAdapter interface
 */
export const useRHFAdapter = <TValues extends FieldValues = FieldValues>(
  options: RHFAdapterOptions<TValues> = {}
): { adapter: FormAdapter<TValues>; Provider: React.ComponentType<{ children: ReactNode }> } => {
  const methods = useForm<TValues>({
    defaultValues: options.defaultValues,
    mode: options.mode ?? 'onChange',
    resolver: options.resolver,
  });

  const adapter: FormAdapter<TValues> = useMemo(
    () => ({
      getValues: () => methods.getValues(),

      getValue: (name: string) => methods.getValues(name as Path<TValues>),

      setValue: (name: string, value: unknown) => {
        methods.setValue(name as Path<TValues>, value as TValues[keyof TValues], {
          shouldValidate: true,
          shouldDirty: true,
        });
      },

      watch: (name?: string | string[]) => {
        if (name === undefined) {
          return methods.watch();
        }
        if (Array.isArray(name)) {
          return methods.watch(name as Path<TValues>[]);
        }
        return methods.watch(name as Path<TValues>);
      },

      getError: (name: string) => {
        const error = methods.formState.errors[name as keyof TValues] as RHFFieldError | undefined;
        if (!error) return undefined;
        return { message: error.message as string | undefined };
      },

      setError: (name: string, error: { message?: string } | undefined) => {
        if (error) {
          methods.setError(name as Path<TValues>, {
            type: 'manual',
            message: error.message,
          });
        } else {
          methods.clearErrors(name as Path<TValues>);
        }
      },

      clearErrors: (name?: string) => {
        if (name) {
          methods.clearErrors(name as Path<TValues>);
        } else {
          methods.clearErrors();
        }
      },

      trigger: async (name?: string) => {
        if (name) {
          return methods.trigger(name as Path<TValues>);
        }
        return methods.trigger();
      },

      reset: (values?: Partial<TValues>) => {
        methods.reset(values as TValues);
      },

      handleSubmit: (onSubmit: (values: TValues) => void | Promise<void>) => {
        return methods.handleSubmit(onSubmit);
      },

      formState: {
        get isValid() {
          return methods.formState.isValid;
        },
        get isDirty() {
          return methods.formState.isDirty;
        },
        get isSubmitting() {
          return methods.formState.isSubmitting;
        },
        get isValidating() {
          return methods.formState.isValidating;
        },
        get submitCount() {
          return methods.formState.submitCount;
        },
        get errors() {
          const result: Record<string, { message?: string }> = {};
          for (const key of Object.keys(methods.formState.errors)) {
            const error = methods.formState.errors[key as keyof TValues] as RHFFieldError | undefined;
            if (error) {
              result[key] = { message: error.message as string | undefined };
            }
          }
          return result;
        },
      },
    }),
    [methods]
  );

  // Store methods in ref for stable Provider component
  const methodsRef = useRef<UseFormReturn<TValues>>(methods);
  methodsRef.current = methods;

  // Provider component - created once with stable identity
  // Uses ref internally to access latest methods without causing re-creation
  const providerRef = useRef<React.ComponentType<{ children: ReactNode }> | null>(null);
  if (!providerRef.current) {
    const StableProvider = ({ children }: { children: ReactNode }) => (
      <FormProvider {...methodsRef.current}>{children}</FormProvider>
    );
    StableProvider.displayName = 'RHFAdapterProvider';
    providerRef.current = StableProvider;
  }

  return { adapter, Provider: providerRef.current };
};
