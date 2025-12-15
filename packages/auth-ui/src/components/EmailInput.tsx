'use client';

import { TextField, type TextFieldProps } from '@assetforce/material';

export type EmailInputProps = Omit<TextFieldProps, 'type'>;

/**
 * EmailInput - Email input field with HTML5 email validation
 *
 * Features:
 * - HTML5 email validation (type="email")
 * - Autocomplete support
 * - All TextField props supported
 *
 * For custom validation, use the parent component pattern:
 * @example
 * ```tsx
 * const [email, setEmail] = useState('');
 * const [error, setError] = useState('');
 *
 * const handleChange = (e) => {
 *   setEmail(e.target.value);
 *   // Custom validation
 *   if (!e.target.value.includes('@')) {
 *     setError('Invalid email');
 *   } else {
 *     setError('');
 *   }
 * };
 *
 * <EmailInput
 *   label="Email"
 *   value={email}
 *   onChange={handleChange}
 *   error={!!error}
 *   helperText={error}
 * />
 * ```
 */
export function EmailInput({ ...props }: EmailInputProps) {
  return (
    <TextField
      {...props}
      type="email"
      inputProps={{
        autoComplete: 'email',
        ...props.inputProps,
      }}
    />
  );
}
