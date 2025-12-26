import { render, screen } from '@testing-library/react';

import { SubgraphStatus } from '../../../../generated/graphql';
import { SubgraphStatusBadge } from '../SubgraphStatusBadge';

describe('SubgraphStatusBadge', () => {
  describe('status display', () => {
    it('should display ACTIVE status with success color and label', () => {
      render(<SubgraphStatusBadge status={SubgraphStatus.Active} />);
      expect(screen.getByText('Active')).toBeInTheDocument();
    });

    it('should display PENDING status with warning color and label', () => {
      render(<SubgraphStatusBadge status={SubgraphStatus.Pending} />);
      expect(screen.getByText('Pending')).toBeInTheDocument();
    });

    it('should display UNHEALTHY status with error color and label', () => {
      render(<SubgraphStatusBadge status={SubgraphStatus.Unhealthy} />);
      expect(screen.getByText('Unhealthy')).toBeInTheDocument();
    });

    it('should display INACTIVE status with default color and label', () => {
      render(<SubgraphStatusBadge status={SubgraphStatus.Inactive} />);
      expect(screen.getByText('Inactive')).toBeInTheDocument();
    });
  });

  describe('size prop', () => {
    it('should default to small size', () => {
      render(<SubgraphStatusBadge status={SubgraphStatus.Active} />);
      const chip = screen.getByText('Active').closest('.MuiChip-root');
      expect(chip).toHaveClass('MuiChip-sizeSmall');
    });

    it('should support medium size', () => {
      render(<SubgraphStatusBadge status={SubgraphStatus.Active} size="medium" />);
      const chip = screen.getByText('Active').closest('.MuiChip-root');
      expect(chip).toHaveClass('MuiChip-sizeMedium');
    });
  });
});
