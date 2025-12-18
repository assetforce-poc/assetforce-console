'use client';

import { Container } from '@assetforce/material';
import {
  InviteAcceptCard,
  InviteEmailMismatch,
  InviteErrorCode,
  InviteExpiredCard,
  InviteLoading,
  InviteLoginRequired,
  InvitePageState,
  InviteSuccessCard,
  Membership,
  useAcceptInvite,
  useInviteTokenRecovery,
  useValidateInvite,
} from '@assetforce/tenant';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useCallback, useEffect, useMemo, useState } from 'react';

/**
 * Tenant Invite Page
 *
 * This page handles the invite acceptance flow:
 * 1. Validates the invite token
 * 2. Shows appropriate UI based on validation result
 * 3. Handles login/register redirect if needed
 * 4. Accepts the invite and redirects to success
 *
 * Route: /tenant/invite?token=...
 */
const InvitePage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  // State for tracking page state and accepted membership
  const [pageState, setPageState] = useState<InvitePageState>('loading');
  const [acceptedMembership, setAcceptedMembership] = useState<Membership | null>(null);

  // Hooks
  const { redirectToLogin, redirectToRegister } = useInviteTokenRecovery();
  const { loading, data, error, refetch } = useValidateInvite({
    token,
    skip: !token,
  });
  const { accept, loading: accepting } = useAcceptInvite();

  // Determine page state based on validation result
  useEffect(() => {
    if (!token) {
      setPageState('invalid');
      return;
    }

    if (loading) {
      setPageState('loading');
      return;
    }

    if (error) {
      setPageState('error');
      return;
    }

    if (!data) {
      setPageState('loading');
      return;
    }

    if (!data.valid) {
      setPageState('expired');
      return;
    }

    if (data.auth.required) {
      setPageState('login-required');
      return;
    }

    if (data.email && !data.email.match) {
      setPageState('email-mismatch');
      return;
    }

    setPageState('accept-ready');
  }, [token, loading, error, data]);

  // Handle accept invitation
  const handleAccept = useCallback(async () => {
    if (!token) return;

    setPageState('accepting');
    const result = await accept(token);

    if (result.success && result.membership) {
      setAcceptedMembership(result.membership);
      setPageState('success');
    } else {
      // Handle specific error cases
      if (result.error?.code === InviteErrorCode.ALREADY_MEMBER) {
        // User is already a member, redirect to home
        router.push('/');
        return;
      }
      // For other errors, show expired card with error
      setPageState('expired');
    }
  }, [token, accept, router]);

  // Handle login redirect
  const handleLogin = useCallback(() => {
    if (token) {
      redirectToLogin(token);
    }
  }, [token, redirectToLogin]);

  // Handle register redirect
  const handleRegister = useCallback(() => {
    if (token) {
      redirectToRegister(token);
    }
  }, [token, redirectToRegister]);

  // Handle switch account (logout and login again)
  const handleSwitchAccount = useCallback(() => {
    if (token) {
      // TODO: Implement logout logic here
      // For now, just redirect to login
      redirectToLogin(token);
    }
  }, [token, redirectToLogin]);

  // Handle continue after success
  const handleContinue = useCallback(() => {
    router.push('/');
  }, [router]);

  // Handle go home
  const handleGoHome = useCallback(() => {
    router.push('/');
  }, [router]);

  // Render based on page state
  const content = useMemo(() => {
    switch (pageState) {
      case 'loading':
      case 'accepting':
        return (
          <InviteLoading message={pageState === 'accepting' ? 'Joining organization...' : 'Validating invitation...'} />
        );

      case 'invalid':
        return (
          <InviteExpiredCard
            error={{
              code: InviteErrorCode.INVALID_TOKEN,
              message: 'No invitation token provided.',
            }}
            onGoHome={handleGoHome}
          />
        );

      case 'expired':
      case 'error':
        return (
          <InviteExpiredCard
            error={
              data?.error || error
                ? { code: InviteErrorCode.INVALID_TOKEN, message: error?.message || 'Unknown error' }
                : undefined
            }
            onGoHome={handleGoHome}
          />
        );

      case 'login-required':
        return <InviteLoginRequired invite={data?.invite} onLogin={handleLogin} onRegister={handleRegister} />;

      case 'email-mismatch':
        return data?.email ? (
          <InviteEmailMismatch
            invite={data?.invite}
            email={data.email}
            onSwitchAccount={handleSwitchAccount}
            onCancel={handleGoHome}
          />
        ) : null;

      case 'accept-ready':
        return data?.invite ? (
          <InviteAcceptCard invite={data.invite} onAccept={handleAccept} loading={accepting} />
        ) : null;

      case 'success':
        return acceptedMembership ? (
          <InviteSuccessCard membership={acceptedMembership} onContinue={handleContinue} />
        ) : null;

      default:
        return null;
    }
  }, [
    pageState,
    data,
    error,
    accepting,
    acceptedMembership,
    handleGoHome,
    handleLogin,
    handleRegister,
    handleSwitchAccount,
    handleAccept,
    handleContinue,
  ]);

  return <Container maxWidth="sm">{content}</Container>;
};

// Wrap with Suspense to handle useSearchParams()
export default function InvitePageWrapper() {
  return (
    <Suspense
      fallback={
        <Container maxWidth="sm">
          <InviteLoading message="Loading..." />
        </Container>
      }
    >
      <InvitePage />
    </Suspense>
  );
}
