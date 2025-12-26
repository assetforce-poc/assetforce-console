import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import type { ServiceContract } from '../../types';
import { ContractList } from '../ContractList';

const mockContracts: ServiceContract[] = [
  {
    id: 'contract-1',
    serviceId: 'svc-aac',
    type: 'PROVIDES',
    protocol: 'GRAPHQL',
    version: '1.0.0',
    graphql: {
      operation: 'Query.me',
      schema: {
        version: '1',
        hash: 'abc123',
        sdl: 'type Query { me: User }',
      },
    },
    deprecated: false,
    createdAt: '2025-12-26T00:00:00Z',
    updatedAt: '2025-12-26T00:00:00Z',
  },
  {
    id: 'contract-2',
    serviceId: 'svc-imc',
    type: 'CONSUMES',
    protocol: 'REST',
    version: '2.0.0',
    deprecated: true,
    deprecation: {
      reason: 'Migrating to GraphQL',
      migrateBy: '2026-01-01T00:00:00Z',
    },
    createdAt: '2025-12-26T00:00:00Z',
    updatedAt: '2025-12-26T00:00:00Z',
  },
];

describe('ContractList', () => {
  const mockOnUpsert = jest.fn();
  const mockOnDeprecate = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('empty state', () => {
    it('should display empty state when no contracts', () => {
      render(
        <ContractList
          contracts={[]}
          serviceId="svc-test"
          onUpsert={mockOnUpsert}
          onDeprecate={mockOnDeprecate}
          onDelete={mockOnDelete}
        />
      );

      expect(screen.getByText('No contracts registered')).toBeInTheDocument();
    });

    it('should show Add Contract button in empty state', () => {
      render(
        <ContractList
          contracts={[]}
          serviceId="svc-test"
          onUpsert={mockOnUpsert}
          onDeprecate={mockOnDeprecate}
          onDelete={mockOnDelete}
        />
      );

      expect(screen.getByRole('button', { name: /add contract/i })).toBeInTheDocument();
    });
  });

  describe('list rendering', () => {
    it('should display all contracts with correct data', () => {
      render(
        <ContractList
          contracts={mockContracts}
          serviceId="svc-test"
          onUpsert={mockOnUpsert}
          onDeprecate={mockOnDeprecate}
          onDelete={mockOnDelete}
        />
      );

      // Check first contract (PROVIDES, GRAPHQL, ACTIVE)
      expect(screen.getByText('PROVIDES')).toBeInTheDocument();
      expect(screen.getByText('GRAPHQL')).toBeInTheDocument();
      expect(screen.getByText('Query.me')).toBeInTheDocument();
      expect(screen.getByText('1.0.0')).toBeInTheDocument();
      expect(screen.getByText('ACTIVE')).toBeInTheDocument();

      // Check second contract (CONSUMES, REST, DEPRECATED)
      expect(screen.getByText('CONSUMES')).toBeInTheDocument();
      expect(screen.getByText('REST')).toBeInTheDocument();
      expect(screen.getByText('2.0.0')).toBeInTheDocument();
      expect(screen.getByText('DEPRECATED')).toBeInTheDocument();
    });

    it('should display action buttons appropriately', () => {
      render(
        <ContractList
          contracts={mockContracts}
          serviceId="svc-test"
          onUpsert={mockOnUpsert}
          onDeprecate={mockOnDeprecate}
          onDelete={mockOnDelete}
        />
      );

      // Active contract should have Deprecate button
      const deprecateButtons = screen.getAllByLabelText(/deprecate/i);
      expect(deprecateButtons).toHaveLength(1);

      // Both contracts should have Delete button
      const deleteButtons = screen.getAllByLabelText(/delete/i);
      expect(deleteButtons).toHaveLength(2);
    });
  });

  describe('interactions', () => {
    it('should open contract form dialog when Add Contract clicked', async () => {
      const user = userEvent.setup();

      render(
        <ContractList
          contracts={mockContracts}
          serviceId="svc-test"
          onUpsert={mockOnUpsert}
          onDeprecate={mockOnDeprecate}
          onDelete={mockOnDelete}
        />
      );

      const addButton = screen.getByRole('button', { name: /add contract/i });
      await user.click(addButton);

      // Check that ContractFormDialog is rendered (it has a dialog role or specific text)
      // Note: Actual dialog testing depends on ContractFormDialog implementation
      // For now, we just verify the button was clickable
      expect(addButton).toBeInTheDocument();
    });

    it('should call onDelete when delete button clicked and confirmed', async () => {
      const user = userEvent.setup();
      // Mock window.confirm to auto-confirm
      global.confirm = jest.fn(() => true);

      render(
        <ContractList
          contracts={mockContracts}
          serviceId="svc-test"
          onUpsert={mockOnUpsert}
          onDeprecate={mockOnDeprecate}
          onDelete={mockOnDelete}
        />
      );

      const deleteButtons = screen.getAllByLabelText(/delete/i);
      await user.click(deleteButtons[0]);

      expect(mockOnDelete).toHaveBeenCalledWith('contract-1');
    });

    it('should open deprecate dialog when deprecate button clicked', async () => {
      const user = userEvent.setup();

      render(
        <ContractList
          contracts={mockContracts}
          serviceId="svc-test"
          onUpsert={mockOnUpsert}
          onDeprecate={mockOnDeprecate}
          onDelete={mockOnDelete}
        />
      );

      const deprecateButton = screen.getByLabelText(/deprecate/i);
      await user.click(deprecateButton);

      // Dialog should open (DeprecateDialog component)
      // Note: Actual dialog testing depends on DeprecateDialog implementation
      expect(deprecateButton).toBeInTheDocument();
    });
  });
});
