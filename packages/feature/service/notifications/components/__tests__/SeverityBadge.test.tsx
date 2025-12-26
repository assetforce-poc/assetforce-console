import { render, screen } from '@testing-library/react';

import { ChangeSeverity } from '../../../generated/graphql';
import { SeverityBadge } from '../SeverityBadge';

describe('SeverityBadge', () => {
  describe('severity display', () => {
    it('should display MAJOR severity with error color and Breaking Change label', () => {
      render(<SeverityBadge severity={ChangeSeverity.Major} />);
      expect(screen.getByText('Breaking Change')).toBeInTheDocument();
    });

    it('should display MINOR severity with warning color and New Feature label', () => {
      render(<SeverityBadge severity={ChangeSeverity.Minor} />);
      expect(screen.getByText('New Feature')).toBeInTheDocument();
    });

    it('should display PATCH severity with info color and Patch label', () => {
      render(<SeverityBadge severity={ChangeSeverity.Patch} />);
      expect(screen.getByText('Patch')).toBeInTheDocument();
    });
  });

  describe('size prop', () => {
    it('should default to small size', () => {
      render(<SeverityBadge severity={ChangeSeverity.Major} />);
      const chip = screen.getByText('Breaking Change').closest('.MuiChip-root');
      expect(chip).toHaveClass('MuiChip-sizeSmall');
    });

    it('should support medium size', () => {
      render(<SeverityBadge severity={ChangeSeverity.Major} size="medium" />);
      const chip = screen.getByText('Breaking Change').closest('.MuiChip-root');
      expect(chip).toHaveClass('MuiChip-sizeMedium');
    });
  });
});
