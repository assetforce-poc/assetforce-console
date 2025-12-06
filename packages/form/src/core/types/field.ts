import type { Ref, ComponentType } from 'react';

/**
 * Field props passed to field components (stable API, not exposing RHF internals)
 */
export type FormField = {
  name: string;
  value: unknown;
  onChange: (value: unknown) => void;
  onBlur: () => void;
  ref: Ref<unknown>;
};

/**
 * Field state (derived from RHF fieldState but abstracted)
 */
export type FormFieldState = {
  invalid: boolean;
  isTouched: boolean;
  isDirty: boolean;
  error?: { message?: string };
};

/**
 * Props that a field component receives
 */
export type FieldProps<TExtra = object> = {
  field: FormField;
  fieldState: FormFieldState;
} & TExtra;

/**
 * A component that can be used with Field
 */
export type FieldComponent<TExtra = object> = ComponentType<FieldProps<TExtra>>;

/**
 * Field validation rules
 */
export type FieldRules = {
  required?: boolean | string;
  validate?: (value: unknown) => string | undefined | true;
};

/**
 * Props for the Field component
 */
export type FieldComponentProps<TExtra = object> = {
  name: string;
  component: FieldComponent<TExtra>;
  rules?: FieldRules;
  props?: TExtra;
};
