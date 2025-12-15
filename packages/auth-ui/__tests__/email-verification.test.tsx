import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import type { ResendVerificationResult, VerifyEmailResult } from '../src/adapter/types';
import { ResendVerificationForm, VerifyEmailPage } from '../src/forms';

describe('VerifyEmailPage', () => {
  it('should show verifying state on mount with autoVerify', () => {
    const mockVerify = jest.fn().mockResolvedValue({
      success: true,
    } as VerifyEmailResult);

    render(<VerifyEmailPage token="test-token" onVerifyEmail={mockVerify} />);

    expect(screen.getByText(/verifying your email/i)).toBeInTheDocument();
  });

  it('should call verify email on mount when autoVerify is true', async () => {
    const mockVerify = jest.fn().mockResolvedValue({
      success: true,
    } as VerifyEmailResult);

    render(<VerifyEmailPage token="test-token" onVerifyEmail={mockVerify} autoVerify={true} />);

    await waitFor(() => {
      expect(mockVerify).toHaveBeenCalledWith({ token: 'test-token' });
    });
  });

  it('should show success state after successful verification', async () => {
    const mockVerify = jest.fn().mockResolvedValue({
      success: true,
      message: 'Email verified',
    } as VerifyEmailResult);

    render(<VerifyEmailPage token="test-token" onVerifyEmail={mockVerify} />);

    await waitFor(() => {
      expect(screen.getByText(/email verified successfully/i)).toBeInTheDocument();
    });
  });

  it('should show error state on verification failure', async () => {
    const mockVerify = jest.fn().mockResolvedValue({
      success: false,
      error: 'Invalid token',
    } as VerifyEmailResult);

    render(<VerifyEmailPage token="test-token" onVerifyEmail={mockVerify} />);

    await waitFor(() => {
      expect(screen.getByText(/verification failed/i)).toBeInTheDocument();
      expect(screen.getByText(/invalid token/i)).toBeInTheDocument();
    });
  });

  it('should show sign in link on success', async () => {
    const mockVerify = jest.fn().mockResolvedValue({
      success: true,
    } as VerifyEmailResult);

    render(<VerifyEmailPage token="test-token" onVerifyEmail={mockVerify} />);

    await waitFor(() => {
      expect(screen.getByText(/sign in/i)).toBeInTheDocument();
    });
  });

  it('should show retry button on error', async () => {
    const mockVerify = jest.fn().mockResolvedValue({
      success: false,
      error: 'Network error',
    } as VerifyEmailResult);

    render(<VerifyEmailPage token="test-token" onVerifyEmail={mockVerify} />);

    await waitFor(() => {
      expect(screen.getByText(/try again/i)).toBeInTheDocument();
    });
  });

  it('should not auto-verify when autoVerify is false', () => {
    const mockVerify = jest.fn().mockResolvedValue({
      success: true,
    } as VerifyEmailResult);

    render(<VerifyEmailPage token="test-token" onVerifyEmail={mockVerify} autoVerify={false} />);

    expect(mockVerify).not.toHaveBeenCalled();
  });
});

describe('ResendVerificationForm', () => {
  it('should render resend verification form', () => {
    render(<ResendVerificationForm />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send verification email/i })).toBeInTheDocument();
  });

  it('should pre-fill email when defaultEmail provided', () => {
    render(<ResendVerificationForm defaultEmail="test@example.com" />);
    const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
    expect(emailInput.value).toBe('test@example.com');
  });

  it('should show validation error for empty email', async () => {
    render(<ResendVerificationForm />);

    const submitButton = screen.getByRole('button', { name: /send verification email/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/please enter your email address/i)).toBeInTheDocument();
    });
  });

  it('should show validation error for invalid email', async () => {
    render(<ResendVerificationForm />);

    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole('button', { name: /send verification email/i });

    fireEvent.change(emailInput, { target: { value: 'invalid' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/please enter a valid email/i)).toBeInTheDocument();
    });
  });

  it('should call onResendVerification with email', async () => {
    const mockResend = jest.fn().mockResolvedValue({
      success: true,
      message: 'Email sent',
    } as ResendVerificationResult);

    render(<ResendVerificationForm onResendVerification={mockResend} />);

    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole('button', { name: /send verification email/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockResend).toHaveBeenCalledWith({ email: 'test@example.com' });
    });
  });

  it('should show success message after sending', async () => {
    const mockResend = jest.fn().mockResolvedValue({
      success: true,
      message: 'Verification email sent',
    } as ResendVerificationResult);

    render(<ResendVerificationForm onResendVerification={mockResend} />);

    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole('button', { name: /send verification email/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/verification email sent/i)).toBeInTheDocument();
    });
  });

  it('should show cooldown timer when provided', async () => {
    const mockResend = jest.fn().mockResolvedValue({
      success: true,
      cooldownSeconds: 60,
    } as ResendVerificationResult);

    render(<ResendVerificationForm onResendVerification={mockResend} />);

    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole('button', { name: /send verification email/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/you can resend again in \d+ seconds/i)).toBeInTheDocument();
    });
  });

  it('should show back to sign in link', () => {
    render(<ResendVerificationForm />);
    expect(screen.getByText(/back to sign in/i)).toBeInTheDocument();
  });

  it('should not show back to sign in link when showBackToSignIn is false', () => {
    render(<ResendVerificationForm showBackToSignIn={false} />);
    expect(screen.queryByText(/back to sign in/i)).not.toBeInTheDocument();
  });
});
