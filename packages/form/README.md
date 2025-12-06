# @assetforce/form

Stable form abstraction layer with pluggable backend (default: react-hook-form + zod).

## Features

- **Adapter Pattern** - Swappable backend (RHF, Formik, TanStack Form)
- **Namespace API** - `form.values.get()`, `form.errors.set()`, `form.meta.some()`
- **Reactive Watching** - `form.values.watch()`, `useWatch()` hook
- **FieldArray** - Dynamic array field management
- **Nested Objects** - Dot notation support (`address.city`)
- **Cross-Field Validation** - Password confirmation, date ranges, conditional required
- **FieldMetaStorage** - Unified storage for error, validator, loading, progress
- **Type-Safe** - Full TypeScript support with zod schema inference
- **Zero RHF Leakage** - Public API is backend-agnostic

## Installation

```bash
yarn add @assetforce/form
```

### Peer Dependencies

```bash
yarn add react react-hook-form @hookform/resolvers zod
```

## Quick Start

```tsx
import { Form, Field, useFormContext } from '@assetforce/form';
import { z } from 'zod';

// 1. Define your field component
const TextInput = ({ field, fieldState }) => (
  <div>
    <input
      name={field.name}
      value={field.value ?? ''}
      onChange={(e) => field.onChange(e.target.value)}
      onBlur={field.onBlur}
    />
    {fieldState.error && <span>{fieldState.error.message}</span>}
  </div>
);

// 2. Define schema (optional)
const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Min 8 characters'),
});

// 3. Use in form
const LoginForm = () => (
  <Form schema={schema} onSubmit={(values) => console.log(values)}>
    <Field name="email" component={TextInput} />
    <Field name="password" component={TextInput} />
    <button type="submit">Login</button>
  </Form>
);
```

## API Reference

### `<Form>`

Root form component.

```tsx
<Form
  defaultValues={{ email: '', password: '' }}
  schema={zodSchema}           // Optional: zod validation
  onSubmit={(values) => {}}    // Submit handler
  mode="onChange"              // 'onChange' | 'onBlur' | 'onSubmit' | 'onTouched'
>
  {children}
</Form>
```

### `<Field>`

Field component that connects to the form.

```tsx
<Field
  name="email"
  component={TextInput}
  props={{ label: 'Email' }}   // Extra props passed to component
  rules={{ required: 'Required' }}  // Inline validation rules
/>
```

### `useFormContext()`

Access form context from any child component.

```tsx
const MyComponent = () => {
  const form = useFormContext();

  // Values API (non-reactive - snapshot)
  const allValues = form.values.get();
  const email = form.values.get('email');
  form.values.set('email', 'new@example.com');

  // Values API (reactive - re-renders on change)
  const watchedEmail = form.values.watch('email');
  const watchedAll = form.values.watch();

  // Errors API
  const hasErrors = form.errors.has('email');
  const emailError = form.errors.get('email');
  form.errors.set('email', 'Custom error');
  form.errors.clear('email');

  // Meta API (for loading, progress, custom data)
  form.meta.set('email', { loading: true });
  const isAnyLoading = form.meta.some((m) => m.loading);
  const allValid = form.meta.every((m) => !m.error);

  // State (readonly)
  const { isValid, isDirty, isSubmitting, submitCount } = form.state;

  // Actions
  await form.trigger('email');  // Validate field
  form.reset();                 // Reset form
  form.submit();                // Programmatic submit

  return <div>...</div>;
};
```

### `useWatch()`

Reactive hook for watching field values.

```tsx
import { useWatch } from '@assetforce/form';

const MyComponent = () => {
  // Watch single field (re-renders when email changes)
  const email = useWatch('email');

  // Watch multiple fields
  const [password, confirmPassword] = useWatch(['password', 'confirmPassword']);

  // Watch all values
  const allValues = useWatch();

  return <div>{email}</div>;
};
```

### `<FieldArray>`

Manage dynamic array fields with render prop pattern.

```tsx
import { FieldArray } from '@assetforce/form';

const ItemsForm = () => (
  <Form defaultValues={{ items: [{ name: '' }] }}>
    <FieldArray name="items">
      {({ fields, append, remove, getName }) => (
        <div>
          {fields.map((field, index) => (
            <div key={field.id}>
              <Field name={getName(index, 'name')} component={TextInput} />
              <button onClick={() => remove(index)}>Remove</button>
            </div>
          ))}
          <button onClick={() => append({ name: '' })}>Add Item</button>
        </div>
      )}
    </FieldArray>
  </Form>
);
```

**FieldArray API:**
- `fields` - Array of items with unique `id` for React key
- `append(value)` - Add item to end
- `prepend(value)` - Add item to start
- `insert(index, value)` - Add item at index
- `remove(index)` - Remove item at index
- `swap(indexA, indexB)` - Swap two items
- `move(from, to)` - Move item to new position
- `update(index, value)` - Update item at index
- `replace(values)` - Replace entire array
- `getName(index, field)` - Get nested field name (e.g., `items.0.name`)

### Nested Object Support

Use dot notation for nested fields:

```tsx
<Form defaultValues={{ address: { city: '', zip: '' } }}>
  <Field name="address.city" component={TextInput} />
  <Field name="address.zip" component={TextInput} />
</Form>
```

### Cross-Field Validation

Built-in helpers for common cross-field validations:

```tsx
import { useCrossFieldValidation, matchField, dateRange, requiredWhen } from '@assetforce/form';

// Password confirmation
const PasswordForm = () => {
  useCrossFieldValidation(matchField('password', 'confirmPassword', 'Passwords must match'));

  return (
    <>
      <Field name="password" component={TextInput} />
      <Field name="confirmPassword" component={TextInput} />
    </>
  );
};

// Date range validation
const DateRangeForm = () => {
  useCrossFieldValidation(dateRange('startDate', 'endDate', 'End date must be after start'));

  return (
    <>
      <Field name="startDate" component={DateInput} />
      <Field name="endDate" component={DateInput} />
    </>
  );
};

// Conditional required field
const ConditionalForm = () => {
  useCrossFieldValidation(
    requiredWhen('otherField', 'hasOther', (v) => v === true, 'This field is required')
  );

  return (
    <>
      <Field name="hasOther" component={Checkbox} />
      <Field name="otherField" component={TextInput} />
    </>
  );
};

// Custom cross-field validation
const CustomValidation = () => {
  useCrossFieldValidation({
    watch: ['min', 'max'],
    validate: (values) => ({
      max: values.min > values.max ? 'Max must be greater than min' : undefined,
    }),
  });

  return (
    <>
      <Field name="min" component={NumberInput} />
      <Field name="max" component={NumberInput} />
    </>
  );
};
```

### `withFieldValidator(Component)`

HOC for third-party components that report errors via `onError` callback.

This is useful for components like file uploaders that have internal validation
(e.g., file size limits) and report errors through a callback.

```tsx
import { FileUpload } from 'some-file-upload-library';
import { withFieldValidator } from '@assetforce/form';

// Wrap the component - it will intercept onError callbacks
const ValidatedFileUpload = withFieldValidator(FileUpload);

// Usage - errors from the component's onError will be shown in the form
<Field
  name="documents"
  component={ValidatedFileUpload}
  props={{
    maxSize: 5 * 1024 * 1024, // 5MB
    accept: '.pdf,.doc,.docx',
  }}
/>
```

**How it works:**
1. Intercepts the component's `onError` callback
2. Extracts the error message from the first error
3. Sets the error in form state for immediate UI feedback
4. Registers a validator that returns the error during form validation

## Field Component Interface

Your field components receive these props:

```tsx
type FieldProps<TExtra = {}> = {
  field: {
    name: string;
    value: unknown;
    onChange: (value: unknown) => void;
    onBlur: () => void;
    ref: React.Ref<any>;
  };
  fieldState: {
    invalid: boolean;
    isDirty: boolean;
    isTouched: boolean;
    error?: { message?: string };
  };
} & TExtra;
```

## MUI Integration Example

```tsx
import { TextField } from '@mui/material';
import { Form, Field, FieldProps } from '@assetforce/form';

const MuiTextField = ({ field, fieldState, label }: FieldProps<{ label: string }>) => (
  <TextField
    name={field.name}
    value={field.value ?? ''}
    onChange={(e) => field.onChange(e.target.value)}
    onBlur={field.onBlur}
    error={fieldState.invalid}
    helperText={fieldState.error?.message}
    label={label}
    fullWidth
  />
);

const MyForm = () => (
  <Form schema={schema} onSubmit={handleSubmit}>
    <Field name="email" component={MuiTextField} props={{ label: 'Email' }} />
    <button type="submit">Submit</button>
  </Form>
);
```

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Consumer Code                           │
│  <Form> <Field> <FieldArray> useFormContext() useWatch()   │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│                   Core Types Layer                          │
│  FormContextValue, FieldProps, ValuesAPI, ErrorsAPI, etc.  │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│                   Adapter Interface                         │
│  FormAdapter<TValues>                                       │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│                RHF Adapter (Default)                        │
│  useRHFAdapter() → { adapter, Provider }                   │
│  react-hook-form + @hookform/resolvers + zod               │
└─────────────────────────────────────────────────────────────┘
```

## Scripts

```bash
yarn workspace @assetforce/form type-check  # TypeScript check
yarn workspace @assetforce/form build       # Build package
yarn workspace @assetforce/form test        # Run tests
yarn workspace @assetforce/form test:watch  # Run tests in watch mode
```

## Implemented Features

### P0 ✅
- Form, Field, useFormContext
- Zod schema validation
- Namespace API (values, errors, meta)
- withFieldValidator HOC

### P1 ✅
- `values.watch()` - Reactive value watching
- `useWatch()` hook

### P2 ✅
- FieldArray support
- Nested object support (dot notation)
- Cross-field validation helpers (matchField, dateRange, requiredWhen)

## Contributors

- **chomin** <cho-min@smfl.co.jp>
- **geminiyellow** <geminiyellow@gmail.com>
