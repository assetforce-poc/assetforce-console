import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import type { ServiceContract } from '../../types';
import { DeprecateDialog } from '../DeprecateDialog';

const mockContract: ServiceContract = {
  id: 'contract-1',
  serviceId: 'svc-aac',
  type: 'PROVIDES',
  protocol: 'GRAPHQL',
  version: '1.0.0',
  graphql: {
    operation: 'Query.users',
    schema: {
      version: '1',
      hash: 'abc123',
      sdl: 'type Query { users: [User] }',
    },
  },
  deprecated: false,
  createdAt: '2025-12-26T00:00:00Z',
  updatedAt: '2025-12-26T00:00:00Z',
};

describe('DeprecateDialog', () => {
  const mockOnClose = jest.fn();
  const mockOnSubmit = jest.fn().mockResolvedValue(undefined);
  let alertSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    alertSpy.mockRestore();
  });

  describe('form validation', () => {
    it('should disable deprecate button when reason is empty', () => {
      render(<DeprecateDialog open={true} onClose={mockOnClose} contract={mockContract} onSubmit={mockOnSubmit} />);

      const deprecateButton = screen.getByRole('button', { name: /^Deprecate$/i });
      expect(deprecateButton).toBeDisabled();
    });
  });

  describe('successful submission', () => {
    it('should call onSubmit with required and optional fields', async () => {
      const user = userEvent.setup();

      render(<DeprecateDialog open={true} onClose={mockOnClose} contract={mockContract} onSubmit={mockOnSubmit} />);

      // Fill required reason field
      const reasonInput = screen.getByRole('textbox', { name: /Deprecation Reason/i });
      await user.type(reasonInput, 'Migrating to GraphQL v2');

      // Fill optional fields
      const sinceInput = screen.getByRole('textbox', { name: /Deprecated Since/i });
      await user.type(sinceInput, 'v1.5.0');

      const alternativeInput = screen.getByRole('textbox', { name: /Alternative/i });
      await user.type(alternativeInput, 'Query.usersV2');

      const removalInput = screen.getByRole('textbox', { name: /Planned Removal/i });
      await user.type(removalInput, 'v2.0.0');

      // Submit
      const deprecateButton = screen.getByRole('button', { name: /^Deprecate$/i });
      await user.click(deprecateButton);

      // Should call onSubmit with all data
      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          id: 'contract-1',
          reason: 'Migrating to GraphQL v2',
          since: 'v1.5.0',
          alternative: 'Query.usersV2',
          removal: 'v2.0.0',
        });
      });
    });

    it('should call onSubmit with only required fields', async () => {
      const user = userEvent.setup();

      render(<DeprecateDialog open={true} onClose={mockOnClose} contract={mockContract} onSubmit={mockOnSubmit} />);

      // Fill only reason
      const reasonInput = screen.getByRole('textbox', { name: /Deprecation Reason/i });
      await user.type(reasonInput, 'No longer supported');

      // Submit
      const deprecateButton = screen.getByRole('button', { name: /^Deprecate$/i });
      await user.click(deprecateButton);

      // Should call onSubmit with only reason and id
      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          id: 'contract-1',
          reason: 'No longer supported',
          since: undefined,
          alternative: undefined,
          removal: undefined,
        });
      });
    });

    it('should reset form after successful submit', async () => {
      const user = userEvent.setup();

      render(<DeprecateDialog open={true} onClose={mockOnClose} contract={mockContract} onSubmit={mockOnSubmit} />);

      // Fill reason
      const reasonInput = screen.getByRole('textbox', { name: /Deprecation Reason/i });
      await user.type(reasonInput, 'Test reason');

      // Submit
      const deprecateButton = screen.getByRole('button', { name: /^Deprecate$/i });
      await user.click(deprecateButton);

      // Form should be reset
      await waitFor(() => {
        expect(reasonInput).toHaveValue('');
      });
    });
  });

  describe('dialog interactions', () => {
    it('should display contract operation in disabled field', () => {
      render(<DeprecateDialog open={true} onClose={mockOnClose} contract={mockContract} onSubmit={mockOnSubmit} />);

      const contractInput = screen.getByRole('textbox', { name: /Contract Operation/i });
      expect(contractInput).toHaveValue('Query.users');
      expect(contractInput).toBeDisabled();
    });

    it('should close dialog when cancel clicked', async () => {
      const user = userEvent.setup();

      render(<DeprecateDialog open={true} onClose={mockOnClose} contract={mockContract} onSubmit={mockOnSubmit} />);

      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      await user.click(cancelButton);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should disable buttons when submitting', async () => {
      const user = userEvent.setup();
      // Make onSubmit delay to test loading state
      const delayedSubmit = jest.fn(() => new Promise((resolve) => setTimeout(resolve, 100)));

      render(<DeprecateDialog open={true} onClose={mockOnClose} contract={mockContract} onSubmit={delayedSubmit} />);

      // Fill reason
      const reasonInput = screen.getByRole('textbox', { name: /Deprecation Reason/i });
      await user.type(reasonInput, 'Test');

      // Click deprecate
      const deprecateButton = screen.getByRole('button', { name: /^Deprecate$/i });
      await user.click(deprecateButton);

      // Buttons should be disabled during submit
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /deprecating/i })).toBeDisabled();
        expect(screen.getByRole('button', { name: /cancel/i })).toBeDisabled();
      });
    });
  });
});
