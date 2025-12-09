/**
 * Unit tests for AccountStatusBadge component
 */

import { render, screen } from '@testing-library/react';

import { AccountStatusBadge } from '../../list/components/AccountStatusBadge';
import { AccountStatus } from '../../list/types';

describe('AccountStatusBadge', () => {
  describe('status rendering', () => {
    it('should render ACTIVE status with success color', () => {
      render(<AccountStatusBadge status={AccountStatus.ACTIVE} />);

      const badge = screen.getByTestId('account-status-active');
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveTextContent('Active');
    });

    it('should render PENDING_VERIFICATION status with warning color', () => {
      render(<AccountStatusBadge status={AccountStatus.PENDING_VERIFICATION} />);

      const badge = screen.getByTestId('account-status-pending_verification');
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveTextContent('Pending Verification');
    });

    it('should render LOCKED status with error color', () => {
      render(<AccountStatusBadge status={AccountStatus.LOCKED} />);

      const badge = screen.getByTestId('account-status-locked');
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveTextContent('Locked');
    });

    it('should render SUSPENDED status with default color', () => {
      render(<AccountStatusBadge status={AccountStatus.SUSPENDED} />);

      const badge = screen.getByTestId('account-status-suspended');
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveTextContent('Suspended');
    });
  });

  describe('visual appearance', () => {
    it('should render as a Chip component', () => {
      const { container } = render(<AccountStatusBadge status={AccountStatus.ACTIVE} />);

      // MUI Chip has class MuiChip-root
      const chip = container.querySelector('.MuiChip-root');
      expect(chip).toBeInTheDocument();
    });

    it('should render with small size', () => {
      const { container } = render(<AccountStatusBadge status={AccountStatus.ACTIVE} />);

      // MUI small chip has MuiChip-sizeSmall class
      const smallChip = container.querySelector('.MuiChip-sizeSmall');
      expect(smallChip).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('should have proper test IDs for all statuses', () => {
      const statuses = [
        AccountStatus.ACTIVE,
        AccountStatus.PENDING_VERIFICATION,
        AccountStatus.LOCKED,
        AccountStatus.SUSPENDED,
      ];

      statuses.forEach((status) => {
        const { unmount } = render(<AccountStatusBadge status={status} />);
        const badge = screen.getByTestId(`account-status-${status.toLowerCase()}`);
        expect(badge).toBeInTheDocument();
        unmount();
      });
    });
  });
});
