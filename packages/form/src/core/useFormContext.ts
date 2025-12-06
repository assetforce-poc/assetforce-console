import { useContext } from 'react';
import { FormContext } from './FormContext';
import type { FormContextValue, FormValues } from './types';

/**
 * Hook to access form context
 * Must be used within a Form component
 */
export const useFormContext = <TValues extends FormValues = FormValues>(): FormContextValue<TValues> => {
  const context = useContext(FormContext);

  if (!context) {
    throw new Error(
      'useFormContext must be used within a Form component. ' + 'Make sure your component is wrapped with <Form>.'
    );
  }

  return context as FormContextValue<TValues>;
};
