/**
 * @assetforce/form
 *
 * Stable form abstraction layer with pluggable backend (default: react-hook-form + zod)
 *
 * Features:
 * - Adapter pattern (底层可替换，换 RHF 不用改核心代码)
 * - Namespace API (form.values.get(), form.errors.set(), form.meta.some())
 * - FieldMetaStorage (统一存储 error、validator、loading 等)
 * - withFieldValidator HOC (第三方组件集成)
 *
 * @example
 * ```tsx
 * import { Form, Field, useFormContext, FieldProps } from '@assetforce/form';
 * import { TextField as MuiTextField } from '@mui/material';
 * import { z } from 'zod';
 *
 * // 1. Define your field adapter
 * const TextField = ({ field, fieldState, label }: FieldProps<{ label: string }>) => (
 *   <MuiTextField
 *     name={field.name}
 *     value={field.value ?? ''}
 *     onChange={(e) => field.onChange(e.target.value)}
 *     error={fieldState.invalid}
 *     helperText={fieldState.error?.message}
 *     label={label}
 *   />
 * );
 *
 * // 2. Define schema
 * const schema = z.object({
 *   email: z.string().email(),
 *   password: z.string().min(8),
 * });
 *
 * // 3. Use in form
 * function LoginForm() {
 *   return (
 *     <Form schema={schema} onSubmit={(values) => console.log(values)}>
 *       <Field name="email" component={TextField} props={{ label: 'Email' }} />
 *       <Field name="password" component={TextField} props={{ label: 'Password' }} />
 *       <button type="submit">Login</button>
 *     </Form>
 *   );
 * }
 * ```
 */

// Core components
export { Form, Field, FieldArray, FormContext, useFormContext, useWatch } from './core';

// Cross-field validation
export { useCrossFieldValidation, matchField, dateRange, requiredWhen } from './core';
export type { CrossFieldRule } from './core';

// HOC
export { withFieldValidator } from './hoc';

// Types
export type {
  // Field types
  FormField,
  FormFieldState,
  FieldProps,
  FieldComponent,
  FieldRules,
  FieldComponentProps,
  // Values types
  ValuesAPI,
  ValuesAPIImpl,
  // Errors types
  FieldError,
  ErrorsAPI,
  // Meta types
  ValidatorFn,
  FieldMeta,
  MetaAPI,
  MetaAPIImpl,
  // Form types
  FormValues,
  FormState,
  FormContextValue,
  FormProps,
  // Adapter types
  FormAdapter,
  UseFormAdapterReturn,
  FormAdapterOptions,
  ValidatorRegistry,
  MetaStorage,
  // FieldArray types
  FieldArrayItem,
  FieldArrayAPI,
  FieldArrayRenderProps,
  FieldArrayProps,
} from './core/types';
