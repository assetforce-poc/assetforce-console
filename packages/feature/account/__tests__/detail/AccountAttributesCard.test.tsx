/**
 * Unit tests for AccountAttributesCard component
 */

import { render, screen } from '@testing-library/react';

import { AccountAttributesCard } from '../../detail/components/AccountAttributesCard';
import type { AccountAttribute } from '../../detail/types';

// ============ Test Data ============

const mockAttributes: AccountAttribute[] = [
  {
    key: 'emailVerificationToken',
    value: 'abc12345***',
    isSensitive: true,
  },
  {
    key: 'tenantId',
    value: 'tenant-123',
    isSensitive: false,
  },
  {
    key: 'userType',
    value: 'standard',
    isSensitive: false,
  },
];

const mockSensitiveAttribute: AccountAttribute[] = [
  {
    key: 'password',
    value: '***',
    isSensitive: true,
  },
];

// ============ Tests ============

describe('AccountAttributesCard', () => {
  describe('rendering with attributes', () => {
    it('should display card title', () => {
      render(<AccountAttributesCard attributes={mockAttributes} />);

      expect(screen.getByText('Account Attributes')).toBeInTheDocument();
    });

    it('should display attribute count in subheader', () => {
      render(<AccountAttributesCard attributes={mockAttributes} />);

      expect(screen.getByText('3 attributes')).toBeInTheDocument();
    });

    it('should display singular form when only one attribute', () => {
      render(<AccountAttributesCard attributes={mockSensitiveAttribute} />);

      expect(screen.getByText('1 attribute')).toBeInTheDocument();
    });

    it('should display all table headers with correct names', () => {
      render(<AccountAttributesCard attributes={mockAttributes} />);

      expect(screen.getByRole('columnheader', { name: 'Key' })).toBeInTheDocument();
      expect(screen.getByRole('columnheader', { name: 'Value' })).toBeInTheDocument();
      expect(screen.getByRole('columnheader', { name: 'Sensitivity' })).toBeInTheDocument();
    });

    it('should display all attribute keys', () => {
      render(<AccountAttributesCard attributes={mockAttributes} />);

      expect(screen.getByText('emailVerificationToken')).toBeInTheDocument();
      expect(screen.getByText('tenantId')).toBeInTheDocument();
      expect(screen.getByText('userType')).toBeInTheDocument();
    });

    it('should display all attribute values', () => {
      render(<AccountAttributesCard attributes={mockAttributes} />);

      expect(screen.getByText('abc12345***')).toBeInTheDocument();
      expect(screen.getByText('tenant-123')).toBeInTheDocument();
      expect(screen.getByText('standard')).toBeInTheDocument();
    });

    it('should display "Sensitive" chip for sensitive attributes', () => {
      render(<AccountAttributesCard attributes={mockAttributes} />);

      const sensitiveChips = screen.getAllByText('Sensitive');
      expect(sensitiveChips).toHaveLength(1);
    });

    it('should display "Public" chip for non-sensitive attributes', () => {
      render(<AccountAttributesCard attributes={mockAttributes} />);

      const publicChips = screen.getAllByText('Public');
      expect(publicChips).toHaveLength(2);
    });

    it('should render table rows for each attribute', () => {
      render(<AccountAttributesCard attributes={mockAttributes} />);

      const rows = screen.getAllByRole('row');
      // 1 header row + 3 data rows
      expect(rows).toHaveLength(4);
    });
  });

  describe('empty state', () => {
    it('should display empty message when no attributes', () => {
      render(<AccountAttributesCard attributes={[]} />);

      expect(screen.getByText('No attributes found for this account.')).toBeInTheDocument();
    });

    it('should not display table when no attributes', () => {
      render(<AccountAttributesCard attributes={[]} />);

      expect(screen.queryByRole('table')).not.toBeInTheDocument();
    });

    it('should still display card title in empty state', () => {
      render(<AccountAttributesCard attributes={[]} />);

      expect(screen.getByText('Account Attributes')).toBeInTheDocument();
    });
  });

  describe('styling', () => {
    it('should apply monospace font to attribute keys', () => {
      render(<AccountAttributesCard attributes={mockAttributes} />);

      const keyCell = screen.getByText('emailVerificationToken');
      expect(keyCell).toHaveStyle({ fontFamily: 'monospace' });
    });

    it('should apply monospace font to sensitive values', () => {
      render(<AccountAttributesCard attributes={mockSensitiveAttribute} />);

      const valueCell = screen.getByText('***');
      expect(valueCell).toHaveStyle({ fontFamily: 'monospace' });
    });
  });
});
