import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ContractType } from '../../types';
import { ContractFormDialog } from '../ContractFormDialog';

describe('ContractFormDialog', () => {
  const mockOnClose = jest.fn();
  const mockOnSubmit = jest.fn().mockResolvedValue(undefined);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('form rendering', () => {
    it('should render form with default values', () => {
      render(<ContractFormDialog open={true} onClose={mockOnClose} serviceId="svc-test" onSubmit={mockOnSubmit} />);

      // Should have dialog title
      expect(screen.getByText('Add GraphQL Contract')).toBeInTheDocument();

      // Should have required operation field
      expect(screen.getByRole('textbox', { name: /GraphQL Operation/i })).toBeInTheDocument();

      // Should have optional fields
      expect(screen.getByRole('textbox', { name: /Schema URL/i })).toBeInTheDocument();
      expect(screen.getByRole('textbox', { name: /Schema Version/i })).toBeInTheDocument();
      expect(screen.getByRole('textbox', { name: /API Version/i })).toBeInTheDocument();

      // Should have action buttons
      expect(screen.getByRole('button', { name: /create/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    });

    //     it('should allow changing contract type', async () => {
    //       const user = userEvent.setup();
    //
    //       render(<ContractFormDialog open={true} onClose={mockOnClose} serviceId="svc-test" onSubmit={mockOnSubmit} />);
    //
    //       // Find the Select trigger button (MUI Select renders the trigger as a div with role="button")
    //       const typeSelectButton = screen.getByRole('button', { name: /Contract Type/i });
    //       expect(typeSelectButton).toHaveTextContent('PROVIDES');
    //
    //       // Click to open dropdown
    //       await user.click(typeSelectButton);
    //
    //       // Select CONSUMES
    //       const consumesOption = await screen.findByRole('option', { name: 'CONSUMES' });
    //       await user.click(consumesOption);
    //
    //       // Should update to CONSUMES
    //       await waitFor(() => {
    //         expect(typeSelectButton).toHaveTextContent('CONSUMES');
    //       });
    //     });
  });

  describe('form submission', () => {
    it('should call onSubmit with all fields when filled', async () => {
      const user = userEvent.setup();

      render(<ContractFormDialog open={true} onClose={mockOnClose} serviceId="svc-aac" onSubmit={mockOnSubmit} />);

      // Fill operation (required)
      const operationInput = screen.getByRole('textbox', { name: /GraphQL Operation/i });
      await user.type(operationInput, 'Query.users');

      // Fill optional fields
      const schemaUrlInput = screen.getByRole('textbox', { name: /Schema URL/i });
      await user.type(schemaUrlInput, 'http://localhost:8081/graphql');

      const schemaVersionInput = screen.getByRole('textbox', { name: /Schema Version/i });
      await user.type(schemaVersionInput, '1');

      const versionInput = screen.getByRole('textbox', { name: /API Version/i });
      await user.type(versionInput, '1.0.0');

      // Submit
      const submitButton = screen.getByRole('button', { name: /create/i });
      await user.click(submitButton);

      // Should call onSubmit with all data
      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          serviceId: 'svc-aac',
          type: ContractType.Provides,
          operation: 'Query.users',
          schemaUrl: 'http://localhost:8081/graphql',
          schemaVersion: '1',
          version: '1.0.0',
        });
      });
    });

    it('should call onSubmit with only required fields', async () => {
      const user = userEvent.setup();

      render(<ContractFormDialog open={true} onClose={mockOnClose} serviceId="svc-imc" onSubmit={mockOnSubmit} />);

      // Change type to CONSUMES
      // //       const typeSelectButton = screen.getByRole('button', { name: /Contract Type/i });
      // //       await user.click(typeSelectButton);
      // //       const consumesOption = await screen.findByRole('option', { name: 'CONSUMES' });
      // //       await user.click(consumesOption);

      // Fill only operation
      const operationInput = screen.getByRole('textbox', { name: /GraphQL Operation/i });
      await user.type(operationInput, 'Mutation.createUser');

      // Submit
      const submitButton = screen.getByRole('button', { name: /create/i });
      await user.click(submitButton);

      // Should call onSubmit with only required fields
      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          serviceId: 'svc-imc',
          type: ContractType.Provides,
          operation: 'Mutation.createUser',
          schemaUrl: undefined,
          schemaVersion: undefined,
          version: undefined,
        });
      });
    });

    it('should reset form after successful submit', async () => {
      const user = userEvent.setup();

      render(<ContractFormDialog open={true} onClose={mockOnClose} serviceId="svc-test" onSubmit={mockOnSubmit} />);

      // Fill operation
      const operationInput = screen.getByRole('textbox', { name: /GraphQL Operation/i });
      await user.type(operationInput, 'Query.test');

      // Submit
      const submitButton = screen.getByRole('button', { name: /create/i });
      await user.click(submitButton);

      // Form should be reset
      await waitFor(() => {
        expect(operationInput).toHaveValue('');
      });
    });
  });

  describe('dialog interactions', () => {
    it('should close dialog when cancel clicked', async () => {
      const user = userEvent.setup();

      render(<ContractFormDialog open={true} onClose={mockOnClose} serviceId="svc-test" onSubmit={mockOnSubmit} />);

      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      await user.click(cancelButton);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should disable buttons when submitting', async () => {
      const user = userEvent.setup();
      // Make onSubmit delay to test loading state
      const delayedSubmit = jest.fn(() => new Promise((resolve) => setTimeout(resolve, 100)));

      render(<ContractFormDialog open={true} onClose={mockOnClose} serviceId="svc-test" onSubmit={delayedSubmit} />);

      // Fill operation
      const operationInput = screen.getByRole('textbox', { name: /GraphQL Operation/i });
      await user.type(operationInput, 'Query.test');

      // Click submit
      const submitButton = screen.getByRole('button', { name: /create/i });
      await user.click(submitButton);

      // Buttons should be disabled during submit
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /creating/i })).toBeDisabled();
        expect(screen.getByRole('button', { name: /cancel/i })).toBeDisabled();
      });
    });
  });
});
