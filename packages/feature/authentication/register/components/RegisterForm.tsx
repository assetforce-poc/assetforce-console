'use client';

import { Form, Field, useFormContext, useWatch } from '@assetforce/form';
import { Alert, Box, Button, Link as MuiLink, Stack, Typography } from '@assetforce/material';
import { FormCheckboxField, FormPasswordField, FormTextField } from '@assetforce/feature-common/fields';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { z } from 'zod';

import { useEmailAvailability, useRegister } from '../hooks';
import type { RegisterResult } from '../types';

// ============ Schema ============

const registerSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().min(1, 'First name is required').max(50, 'First name is too long'),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Last name is too long'),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: 'You must accept the terms of service',
  }),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

// ============ Props ============

export interface RegisterFormProps {
  /** Called when registration is successful */
  onSuccess?: (result: RegisterResult) => void;
  /** Called when registration fails */
  onError?: (message: string) => void;
  /** Link to login page click handler */
  onLoginClick?: () => void;
}

// ============ Email Field with Availability Check ============

function EmailFieldWithCheck() {
  const form = useFormContext<RegisterFormValues>();
  const { checkEmail, available, reason, loading } = useEmailAvailability();

  // Watch email value changes using useWatch hook
  const email = useWatch<RegisterFormValues, 'email'>('email');

  useEffect(() => {
    if (email && typeof email === 'string') {
      checkEmail(email);
    }
  }, [email, checkEmail]);

  // Set error when email is not available
  useEffect(() => {
    if (available === false && reason) {
      const friendlyMessage =
        reason === 'EMAIL_ALREADY_EXISTS'
          ? 'This email is already registered'
          : 'Email is not available';
      form.errors.set('email', friendlyMessage);
    }
  }, [available, reason, form]);

  return (
    <Field
      name="email"
      component={FormTextField}
      props={{
        label: 'Email',
        type: 'email',
        required: true,
        autoComplete: 'email',
        loading,
        placeholder: 'you@example.com',
      }}
    />
  );
}

// ============ Main Component ============

/**
 * RegisterForm - User registration form
 *
 * Uses @assetforce/form for form management with zod validation.
 * Includes real-time email availability checking.
 *
 * @example
 * ```tsx
 * <RegisterForm
 *   onSuccess={(result) => {
 *     router.push(`/auth/registration-success?email=${email}`);
 *   }}
 *   onError={(message) => {
 *     console.error(message);
 *   }}
 *   onLoginClick={() => router.push('/auth/login')}
 * />
 * ```
 */
export function RegisterForm({ onSuccess, onError, onLoginClick }: RegisterFormProps) {
  const { register, loading } = useRegister();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = useCallback(
    async (values: RegisterFormValues) => {
      setSubmitError(null);

      const result = await register({
        email: values.email,
        password: values.password,
        firstName: values.firstName,
        lastName: values.lastName,
        acceptTerms: values.acceptTerms,
      });

      if (result.success) {
        onSuccess?.(result);
      } else {
        const message = result.message || 'Registration failed. Please try again.';
        setSubmitError(message);
        onError?.(message);
      }
    },
    [register, onSuccess, onError]
  );

  return (
    <Form<RegisterFormValues>
      schema={registerSchema}
      onSubmit={handleSubmit}
      defaultValues={{
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        acceptTerms: false,
      }}
    >
      <Stack spacing={3}>
        {/* Header */}
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Create Account
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Enter your details to create a new account
          </Typography>
        </Box>

        {/* Error Alert */}
        {submitError && (
          <Alert severity="error" onClose={() => setSubmitError(null)}>
            {submitError}
          </Alert>
        )}

        {/* Name Fields */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <Field
            name="firstName"
            component={FormTextField}
            props={{
              label: 'First Name',
              required: true,
              autoComplete: 'given-name',
            }}
          />
          <Field
            name="lastName"
            component={FormTextField}
            props={{
              label: 'Last Name',
              required: true,
              autoComplete: 'family-name',
            }}
          />
        </Stack>

        {/* Email Field with availability check */}
        <EmailFieldWithCheck />

        {/* Password Field */}
        <Field
          name="password"
          component={FormPasswordField}
          props={{
            label: 'Password',
            required: true,
            autoComplete: 'new-password',
            helperText: 'At least 8 characters',
          }}
        />

        {/* Terms Checkbox */}
        <Field
          name="acceptTerms"
          component={FormCheckboxField}
          props={{
            label: (
              <>
                I accept the{' '}
                <MuiLink component={Link} href="/terms" target="_blank">
                  Terms of Service
                </MuiLink>{' '}
                and{' '}
                <MuiLink component={Link} href="/privacy" target="_blank">
                  Privacy Policy
                </MuiLink>
              </>
            ),
            required: true,
          }}
        />

        {/* Submit Button */}
        <Button type="submit" variant="contained" size="large" disabled={loading} fullWidth>
          {loading ? 'Creating Account...' : 'Create Account'}
        </Button>

        {/* Login Link */}
        <Typography variant="body2" align="center">
          Already have an account?{' '}
          {onLoginClick ? (
            <MuiLink component="button" type="button" onClick={onLoginClick}>
              Sign in
            </MuiLink>
          ) : (
            <MuiLink component={Link} href="/auth/login">
              Sign in
            </MuiLink>
          )}
        </Typography>
      </Stack>
    </Form>
  );
}
