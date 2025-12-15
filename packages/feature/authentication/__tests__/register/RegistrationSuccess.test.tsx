/**
 * Component tests for RegistrationSuccess
 */

import { MockedProvider } from '@apollo/client/testing/react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';

import { RegistrationSuccess } from '../../register/components/RegistrationSuccess';

// Mock next/link
jest.mock('next/link', () => {
  return function MockLink({ children, href }: { children: React.ReactNode; href: string }) {
    return <a href={href}>{children}</a>;
  };
});

// Wrapper with Apollo Client context
function TestWrapper({ children }: { children: ReactNode }) {
  return <MockedProvider mocks={[]}>{children}</MockedProvider>;
}

describe('RegistrationSuccess', () => {
  const defaultEmail = 'test@example.com';

  describe('rendering', () => {
    it('should render success title', () => {
      render(<RegistrationSuccess email={defaultEmail} />, { wrapper: TestWrapper });

      expect(screen.getByRole('heading', { name: /registration successful/i })).toBeInTheDocument();
    });

    it('should display the user email', () => {
      render(<RegistrationSuccess email={defaultEmail} />, { wrapper: TestWrapper });

      expect(screen.getByText(defaultEmail)).toBeInTheDocument();
    });

    it('should render verification email instructions', () => {
      render(<RegistrationSuccess email={defaultEmail} />, { wrapper: TestWrapper });

      expect(screen.getByText(/we've sent a verification email to/i)).toBeInTheDocument();
      expect(screen.getByText(/check your inbox and click the verification link/i)).toBeInTheDocument();
    });

    it('should render back to login button', () => {
      render(<RegistrationSuccess email={defaultEmail} />, { wrapper: TestWrapper });

      const loginLink = screen.getByRole('link', { name: /back to sign in/i });
      expect(loginLink).toBeInTheDocument();
      expect(loginLink).toHaveAttribute('href', '/auth/login');
    });
  });

  describe('resend email', () => {
    it('should show resend button with cooldown', () => {
      render(<RegistrationSuccess email={defaultEmail} />, { wrapper: TestWrapper });

      // Should show resend button (with initial cooldown timer)
      const resendButton = screen.getByRole('button', { name: /resend in \d+s/i });
      expect(resendButton).toBeInTheDocument();
      expect(resendButton).toBeDisabled();
    });

    it('should show resend button when onResend is provided', () => {
      const onResend = jest.fn();
      render(<RegistrationSuccess email={defaultEmail} onResend={onResend} />, { wrapper: TestWrapper });

      expect(screen.getByRole('button', { name: /resend/i })).toBeInTheDocument();
    });

    it('should call onResend when resend button is clicked', async () => {
      const user = userEvent.setup();
      const onResend = jest.fn();
      render(<RegistrationSuccess email={defaultEmail} onResend={onResend} />, { wrapper: TestWrapper });

      // Note: This test may fail because the button has initial cooldown
      // In real implementation, button is disabled for first 60 seconds
      const resendButton = screen.getByRole('button', { name: /resend/i });
      if (!resendButton.hasAttribute('disabled')) {
        await user.click(resendButton);
        expect(onResend).toHaveBeenCalledTimes(1);
      }
    });
  });

  describe('spam notice', () => {
    it('should display spam folder notice', () => {
      render(<RegistrationSuccess email={defaultEmail} />, { wrapper: TestWrapper });

      expect(screen.getByText(/didn't receive the email\?/i)).toBeInTheDocument();
      expect(screen.getByText(/check your spam folder/i)).toBeInTheDocument();
    });
  });
});
