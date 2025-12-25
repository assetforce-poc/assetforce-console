'use client';

import {
  type ActivateAccountInput,
  ActivationForm,
  useActivateAccount,
  useValidateActivationToken,
} from '@assetforce/authentication';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

function ActivatePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams?.get('token');

  const [pageState, setPageState] = useState<'loading' | 'valid' | 'invalid' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  const {
    validate,
    loading: validating,
    result: validationResult,
    error: validationError,
  } = useValidateActivationToken();
  const { activate, loading: activating, result: activationResult, error: activationError } = useActivateAccount();

  // Validate token on page load
  useEffect(() => {
    if (!token) {
      setPageState('invalid');
      setErrorMessage('No activation token provided');
      return;
    }

    // Validate the token
    validate(token)
      .then(() => {
        // Validation result will be available in validationResult
      })
      .catch((err) => {
        console.error('Token validation error:', err);
        setPageState('invalid');
        setErrorMessage('Failed to validate activation token');
      });
  }, [token, validate]);

  // Handle validation result
  useEffect(() => {
    if (validationResult) {
      if (validationResult.valid) {
        setPageState('valid');
      } else {
        setPageState('invalid');
        setErrorMessage('Invalid or expired activation token');
      }
    }
  }, [validationResult]);

  // Handle validation error
  useEffect(() => {
    if (validationError) {
      setPageState('invalid');
      setErrorMessage('Token validation failed. Please check your activation link.');
    }
  }, [validationError]);

  // Handle activation result
  useEffect(() => {
    if (activationResult) {
      if (activationResult.success) {
        setPageState('success');

        // Redirect to login page after 2 seconds
        setTimeout(() => {
          router.push('/auth/login?activated=success');
        }, 2000);
      } else {
        setPageState('error');
        setErrorMessage(activationResult.error?.message || 'Account activation failed');
      }
    }
  }, [activationResult, router]);

  // Handle activation error
  useEffect(() => {
    if (activationError) {
      setPageState('error');
      setErrorMessage('Activation request failed. Please try again.');
    }
  }, [activationError]);

  const handleSubmit = async (password: string) => {
    if (!token) {
      setErrorMessage('No activation token available');
      return;
    }

    setErrorMessage('');

    const input: ActivateAccountInput = {
      token,
      password,
    };

    try {
      await activate(input);
    } catch (err) {
      console.error('Activation error:', err);
      setPageState('error');
      setErrorMessage('Failed to activate account');
    }
  };

  // Render loading state
  if (pageState === 'loading' || validating) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h1>Validating Activation Token...</h1>
        <p>Please wait while we verify your activation link.</p>
      </div>
    );
  }

  // Render invalid token state
  if (pageState === 'invalid') {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h1 style={{ color: 'red' }}>Invalid Activation Link</h1>
        <p>{errorMessage || 'The activation link is invalid or has expired.'}</p>
        <p>Please contact support or request a new activation email.</p>
      </div>
    );
  }

  // Render success state
  if (pageState === 'success') {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h1 style={{ color: 'green' }}>Account Activated Successfully!</h1>
        <p>Your account has been activated. You will be redirected to the login page shortly.</p>
      </div>
    );
  }

  // Render activation form
  return (
    <div style={{ padding: '40px', maxWidth: '500px', margin: '0 auto' }}>
      <ActivationForm
        email={validationResult?.email ?? undefined}
        loading={activating}
        error={errorMessage}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

export default function ActivatePage() {
  return (
    <Suspense
      fallback={
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <p>Loading...</p>
        </div>
      }
    >
      <ActivatePageContent />
    </Suspense>
  );
}
