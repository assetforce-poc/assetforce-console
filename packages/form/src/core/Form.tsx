import { useMemo, useCallback, useRef, FormEvent } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import type { DefaultValues, FieldValues, Resolver } from 'react-hook-form';
import { FormContext } from './FormContext';
import { useRHFAdapter } from '../adapters/rhf';
import { useFieldMetaStorage } from '../meta/useFieldMetaStorage';
import type { FormProps, FormContextValue, FormValues, ValuesAPIImpl, ErrorsAPI, MetaAPIImpl } from './types';

/**
 * Form component - top-level form container
 *
 * @example
 * ```tsx
 * import { Form, Field } from '@assetforce/form';
 * import { z } from 'zod';
 *
 * const schema = z.object({
 *   email: z.string().email(),
 *   password: z.string().min(8),
 * });
 *
 * <Form schema={schema} onSubmit={(values) => console.log(values)}>
 *   <Field name="email" component={TextField} />
 *   <Field name="password" component={TextField} />
 * </Form>
 * ```
 */
export const Form = <TValues extends FormValues = FormValues>(props: FormProps<TValues>) => {
  const { children, defaultValues, schema, onSubmit, mode = 'onChange', className } = props;

  // Create RHF adapter (internal: cast to RHF's FieldValues)
  const { adapter, Provider } = useRHFAdapter<TValues & FieldValues>({
    defaultValues: defaultValues as DefaultValues<TValues & FieldValues>,
    mode,
    resolver: schema ? (zodResolver(schema) as Resolver<TValues & FieldValues>) : undefined,
  });

  // Create meta storage
  const metaStorage = useFieldMetaStorage();

  // Store submit handler ref to avoid recreating context
  const onSubmitRef = useRef(onSubmit);
  onSubmitRef.current = onSubmit;

  // Build namespace APIs
  const valuesAPI: ValuesAPIImpl<TValues> = useMemo(
    () => ({
      get: ((name?: string) => {
        if (name === undefined) {
          return adapter.getValues();
        }
        return adapter.getValue(name);
      }) as ValuesAPIImpl<TValues>['get'],
      set: (name: string, value: unknown) => {
        adapter.setValue(name, value);
      },
      watch: ((name?: string | string[]) => {
        return adapter.watch(name);
      }) as ValuesAPIImpl<TValues>['watch'],
    }),
    [adapter]
  );

  const errorsAPI: ErrorsAPI = useMemo(
    () => ({
      get: (name: string) => adapter.getError(name),
      set: (name: string, message: string | undefined) => {
        if (message) {
          adapter.setError(name, { message });
        } else {
          adapter.setError(name, undefined);
        }
      },
      clear: (name?: string) => adapter.clearErrors(name),
      has: (name: string) => !!adapter.getError(name),
    }),
    [adapter]
  );

  const metaAPI: MetaAPIImpl = useMemo(
    () => ({
      get: ((nameOrNames: string | string[]) => {
        if (Array.isArray(nameOrNames)) {
          return metaStorage.getMultiple(nameOrNames);
        }
        return metaStorage.get(nameOrNames);
      }) as MetaAPIImpl['get'],
      set: metaStorage.set,
      some: metaStorage.some,
      every: metaStorage.every,
      clear: metaStorage.clear,
    }),
    [metaStorage]
  );

  // Wrap trigger to also run meta validators
  const trigger = useCallback(
    async (name?: string): Promise<boolean> => {
      // Run RHF validation
      let isValid = await adapter.trigger(name);

      if (name) {
        // Single field: run its meta validator
        const error = metaStorage.validators.run(name);
        if (error) {
          adapter.setError(name, { message: error });
          isValid = false;
        }
      } else {
        // All fields: run all meta validators
        const allErrors = metaStorage.validators.runAll();
        for (const [fieldName, error] of Object.entries(allErrors)) {
          if (error) {
            adapter.setError(fieldName, { message: error });
            isValid = false;
          }
        }
      }

      return isValid;
    },
    [adapter, metaStorage.validators]
  );

  // Submit handler
  const handleFormSubmit = useCallback(
    (e?: FormEvent) => {
      e?.preventDefault();
      if (onSubmitRef.current) {
        adapter.handleSubmit(onSubmitRef.current)(e);
      }
    },
    [adapter]
  );

  // Submit programmatically
  const submit = useCallback(() => {
    handleFormSubmit();
  }, [handleFormSubmit]);

  // Build context value
  const contextValue: FormContextValue<TValues> = useMemo(
    () => ({
      values: valuesAPI,
      errors: errorsAPI,
      meta: metaAPI,
      state: {
        get isValid() {
          return adapter.formState.isValid;
        },
        get isDirty() {
          return adapter.formState.isDirty;
        },
        get isSubmitting() {
          return adapter.formState.isSubmitting;
        },
        get isValidating() {
          return adapter.formState.isValidating;
        },
        get submitCount() {
          return adapter.formState.submitCount;
        },
        get errors() {
          return adapter.formState.errors;
        },
      },
      trigger,
      reset: (values) => adapter.reset(values),
      submit,
    }),
    [valuesAPI, errorsAPI, metaAPI, adapter, trigger, submit]
  );

  return (
    <Provider>
      <FormContext.Provider value={contextValue as FormContextValue}>
        <form onSubmit={handleFormSubmit} className={className}>
          {children}
        </form>
      </FormContext.Provider>
    </Provider>
  );
};

Form.displayName = 'Form';
