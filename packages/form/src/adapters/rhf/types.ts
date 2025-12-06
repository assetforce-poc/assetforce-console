import type { FieldValues, DefaultValues, Resolver } from 'react-hook-form';

/**
 * RHF adapter options
 */
export type RHFAdapterOptions<TValues extends FieldValues = FieldValues> = {
  defaultValues?: DefaultValues<TValues>;
  mode?: 'onChange' | 'onBlur' | 'onSubmit' | 'onTouched';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  resolver?: Resolver<TValues, any>;
};
