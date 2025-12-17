import { render, screen } from '@testing-library/react';

import { ServiceStatusBadge } from '../ServiceStatusBadge';

describe('ServiceStatusBadge', () => {
  describe('status display', () => {
    it('should display UP status with success color', () => {
      render(<ServiceStatusBadge status="UP" />);
      expect(screen.getByText('UP')).toBeInTheDocument();
    });

    it('should display DOWN status with error color', () => {
      render(<ServiceStatusBadge status="DOWN" />);
      expect(screen.getByText('DOWN')).toBeInTheDocument();
    });

    it('should display UNKNOWN status with default color', () => {
      render(<ServiceStatusBadge status="UNKNOWN" />);
      expect(screen.getByText('UNKNOWN')).toBeInTheDocument();
    });

    it('should display custom status value', () => {
      render(<ServiceStatusBadge status="CUSTOM_STATUS" />);
      expect(screen.getByText('CUSTOM_STATUS')).toBeInTheDocument();
    });
  });

  describe('size prop', () => {
    it('should default to small size', () => {
      render(<ServiceStatusBadge status="UP" />);
      const chip = screen.getByText('UP').closest('.MuiChip-root');
      expect(chip).toHaveClass('MuiChip-sizeSmall');
    });

    it('should support medium size', () => {
      render(<ServiceStatusBadge status="UP" size="medium" />);
      const chip = screen.getByText('UP').closest('.MuiChip-root');
      expect(chip).toHaveClass('MuiChip-sizeMedium');
    });
  });
});
