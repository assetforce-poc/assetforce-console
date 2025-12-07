/**
 * Component tests for RegistrationSuccess
 */

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { RegistrationSuccess } from '../../register/components/RegistrationSuccess';

// Mock next/link
jest.mock('next/link', () => {
  return function MockLink({ children, href }: { children: React.ReactNode; href: string }) {
    return <a href={href}>{children}</a>;
  };
});

describe('RegistrationSuccess', () => {
  const defaultEmail = 'test@example.com';

  describe('rendering', () => {
    it('should render success title', () => {
      render(<RegistrationSuccess email={defaultEmail} />);

      expect(screen.getByRole('heading', { name: /registration successful/i })).toBeInTheDocument();
    });

    it('should display the user email', () => {
      render(<RegistrationSuccess email={defaultEmail} />);

      expect(screen.getByText(defaultEmail)).toBeInTheDocument();
    });

    it('should render verification email instructions', () => {
      render(<RegistrationSuccess email={defaultEmail} />);

      expect(screen.getByText(/we've sent a verification email to/i)).toBeInTheDocument();
      expect(screen.getByText(/check your inbox and click the verification link/i)).toBeInTheDocument();
    });

    it('should render back to login button', () => {
      render(<RegistrationSuccess email={defaultEmail} />);

      const loginLink = screen.getByRole('link', { name: /back to sign in/i });
      expect(loginLink).toBeInTheDocument();
      expect(loginLink).toHaveAttribute('href', '/auth/login');
    });
  });

  describe('resend email', () => {
    it('should show fallback text when onResend is not provided', () => {
      render(<RegistrationSuccess email={defaultEmail} />);

      expect(screen.getByText(/wait a few minutes and try again/i)).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /resend/i })).not.toBeInTheDocument();
    });

    it('should show resend button when onResend is provided', () => {
      const onResend = jest.fn();
      render(<RegistrationSuccess email={defaultEmail} onResend={onResend} />);

      expect(screen.getByRole('button', { name: /resend verification email/i })).toBeInTheDocument();
    });

    it('should call onResend when resend button is clicked', async () => {
      const user = userEvent.setup();
      const onResend = jest.fn();
      render(<RegistrationSuccess email={defaultEmail} onResend={onResend} />);

      await user.click(screen.getByRole('button', { name: /resend verification email/i }));

      expect(onResend).toHaveBeenCalledTimes(1);
    });
  });

  describe('spam notice', () => {
    it('should display spam folder notice', () => {
      render(<RegistrationSuccess email={defaultEmail} />);

      expect(screen.getByText(/didn't receive the email\?/i)).toBeInTheDocument();
      expect(screen.getByText(/check your spam folder/i)).toBeInTheDocument();
    });
  });
});
