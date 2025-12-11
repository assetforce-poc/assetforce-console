/**
 * Unit tests for AccountInfoCard component
 */

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { AccountInfoCard } from '../../detail/components/AccountInfoCard';
import type { AccountDetail } from '../../detail/types';

// ============ Test Data ============

const mockAccount: AccountDetail = {
  id: 'test-account-123',
  username: 'testuser',
  email: 'test@example.com',
  emailVerified: false,
  firstName: 'Test',
  lastName: 'User',
  status: 'ACTIVE',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-02T00:00:00Z',
  attributes: [],
  sessions: [],
};

const mockVerifiedAccount: AccountDetail = {
  ...mockAccount,
  emailVerified: true,
};

// ============ Tests ============

describe('AccountInfoCard', () => {
  describe('rendering', () => {
    it('should display all account information fields with colons', () => {
      render(<AccountInfoCard account={mockAccount} />);

      // Check that all labels with colons are displayed
      expect(screen.getByText('Account ID:')).toBeInTheDocument();
      expect(screen.getByText('Username:')).toBeInTheDocument();
      expect(screen.getByText('Email:')).toBeInTheDocument();
      expect(screen.getByText('Status:')).toBeInTheDocument();
      expect(screen.getByText('Email Verified:')).toBeInTheDocument();
      expect(screen.getByText('Created At:')).toBeInTheDocument();
    });

    it('should display account values correctly', () => {
      render(<AccountInfoCard account={mockAccount} />);

      expect(screen.getByText('test-account-123')).toBeInTheDocument();
      expect(screen.getByText('testuser')).toBeInTheDocument();
      expect(screen.getByText('test@example.com')).toBeInTheDocument();
    });

    it('should display "No" chip when email is not verified', () => {
      render(<AccountInfoCard account={mockAccount} />);

      const chip = screen.getByText('No');
      expect(chip).toBeInTheDocument();
    });

    it('should display "Yes" chip when email is verified', () => {
      render(<AccountInfoCard account={mockVerifiedAccount} />);

      const chip = screen.getByText('Yes');
      expect(chip).toBeInTheDocument();
    });

    it('should display account status badge', () => {
      render(<AccountInfoCard account={mockAccount} />);

      expect(screen.getByTestId('account-status-ACTIVE')).toBeInTheDocument();
    });

    it('should format dates correctly', () => {
      render(<AccountInfoCard account={mockAccount} />);

      // Check that dates are formatted (exact format may vary by locale)
      const createdAt = screen.getByText(/2024/);
      expect(createdAt).toBeInTheDocument();
    });
  });

  describe('verify email button', () => {
    it('should show Verify Email button when email is not verified and onVerifyEmail is provided', () => {
      const mockVerify = jest.fn();
      render(<AccountInfoCard account={mockAccount} onVerifyEmail={mockVerify} />);

      expect(screen.getByRole('button', { name: /Verify Email/i })).toBeInTheDocument();
    });

    it('should not show Verify Email button when email is already verified', () => {
      const mockVerify = jest.fn();
      render(<AccountInfoCard account={mockVerifiedAccount} onVerifyEmail={mockVerify} />);

      expect(screen.queryByRole('button', { name: /Verify Email/i })).not.toBeInTheDocument();
    });

    it('should not show Verify Email button when onVerifyEmail is not provided', () => {
      render(<AccountInfoCard account={mockAccount} />);

      expect(screen.queryByRole('button', { name: /Verify Email/i })).not.toBeInTheDocument();
    });

    it('should call onVerifyEmail when button is clicked', async () => {
      const mockVerify = jest.fn().mockResolvedValue(undefined);
      const user = userEvent.setup();

      render(<AccountInfoCard account={mockAccount} onVerifyEmail={mockVerify} />);

      const button = screen.getByRole('button', { name: /Verify Email/i });
      await user.click(button);

      await waitFor(() => {
        expect(mockVerify).toHaveBeenCalledTimes(1);
      });
    });

    it('should show loading state when verifying', () => {
      const mockVerify = jest.fn();
      render(<AccountInfoCard account={mockAccount} onVerifyEmail={mockVerify} verifyLoading={true} />);

      const button = screen.getByRole('button', { name: /Verifying/i });
      expect(button).toBeDisabled();
    });

    it('should show success message after successful verification', async () => {
      const mockVerify = jest.fn().mockResolvedValue(undefined);
      const user = userEvent.setup();

      render(<AccountInfoCard account={mockAccount} onVerifyEmail={mockVerify} />);

      const button = screen.getByRole('button', { name: /Verify Email/i });
      await user.click(button);

      await waitFor(() => {
        expect(screen.getByText('Email verified successfully')).toBeInTheDocument();
      });
    });

    it('should show error message when verification fails', async () => {
      const mockVerify = jest.fn().mockRejectedValue(new Error('Verification failed'));
      const user = userEvent.setup();

      render(<AccountInfoCard account={mockAccount} onVerifyEmail={mockVerify} />);

      const button = screen.getByRole('button', { name: /Verify Email/i });
      await user.click(button);

      await waitFor(() => {
        expect(screen.getByText('Verification failed')).toBeInTheDocument();
      });
    });
  });

  describe('null values', () => {
    it('should display N/A for missing email', () => {
      const accountWithoutEmail = { ...mockAccount, email: null };
      render(<AccountInfoCard account={accountWithoutEmail as any} />);

      expect(screen.getByText('N/A')).toBeInTheDocument();
    });

    it('should display N/A for missing createdAt', () => {
      const accountWithoutDate = { ...mockAccount, createdAt: null };
      render(<AccountInfoCard account={accountWithoutDate as any} />);

      expect(screen.getByText('N/A')).toBeInTheDocument();
    });
  });
});
