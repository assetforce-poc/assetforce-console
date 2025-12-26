import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import type { SubgraphRegisterInput } from '../../types';
import { SubgraphRegisterDialog } from '../SubgraphRegisterDialog';

describe('SubgraphRegisterDialog', () => {
  const mockOnClose = jest.fn();
  const mockOnSubmit = jest.fn().mockResolvedValue(undefined);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('form validation', () => {
    it('should show validation errors for invalid inputs', async () => {
      const user = userEvent.setup();

      render(<SubgraphRegisterDialog open={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />);

      // Try to submit empty form
      const registerButton = screen.getByRole('button', { name: /register/i });
      await user.click(registerButton);

      // Should show validation errors
      await waitFor(() => {
        expect(screen.getByText('Name is required')).toBeInTheDocument();
        expect(screen.getByText('GraphQL URL is required')).toBeInTheDocument();
      });

      // onSubmit should not be called
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('should validate name format and URL', async () => {
      const user = userEvent.setup();

      render(<SubgraphRegisterDialog open={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />);

      // Fill with invalid name (uppercase, starts with number)
      const nameInput = screen.getByRole('textbox', { name: /^Name/i });
      await user.type(nameInput, '123Invalid');

      // Fill with invalid URL
      const urlInput = screen.getByRole('textbox', { name: /GraphQL URL/i });
      await user.type(urlInput, 'not-a-url');

      // Fill with negative priority (spinbutton for type="number")
      const priorityInput = screen.getByRole('spinbutton', { name: /Priority/i });
      await user.clear(priorityInput);
      await user.type(priorityInput, '-10');

      // Try to submit
      const registerButton = screen.getByRole('button', { name: /register/i });
      await user.click(registerButton);

      // Should show validation errors
      await waitFor(() => {
        expect(screen.getByText(/name must start with lowercase letter/i)).toBeInTheDocument();
        expect(screen.getByText('Must be a valid URL')).toBeInTheDocument();
        expect(screen.getByText('Priority must be a non-negative number')).toBeInTheDocument();
      });

      // onSubmit should not be called
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });
  });

  describe('successful submission', () => {
    it('should call onSubmit with correct data and reset form', async () => {
      const user = userEvent.setup();

      render(<SubgraphRegisterDialog open={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />);

      // Fill form with valid data
      const nameInput = screen.getByRole('textbox', { name: /^Name/i });
      await user.type(nameInput, 'aac');

      const displayNameInput = screen.getByRole('textbox', { name: /Display Name/i });
      await user.type(displayNameInput, 'AAC Subgraph');

      const urlInput = screen.getByRole('textbox', { name: /GraphQL URL/i });
      await user.type(urlInput, 'http://localhost:8081/graphql');

      const priorityInput = screen.getByRole('spinbutton', { name: /Priority/i });
      await user.clear(priorityInput);
      await user.type(priorityInput, '50');

      // Submit form
      const registerButton = screen.getByRole('button', { name: /register/i });
      await user.click(registerButton);

      // Should call onSubmit with correct data
      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          name: 'aac',
          displayName: 'AAC Subgraph',
          graphqlUrl: 'http://localhost:8081/graphql',
          priority: 50,
        });
      });

      // Form should be reset (check if name input is empty)
      await waitFor(() => {
        expect(nameInput).toHaveValue('');
      });
    });

    it('should handle optional displayName correctly', async () => {
      const user = userEvent.setup();

      render(<SubgraphRegisterDialog open={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />);

      // Fill form without displayName
      const nameInput = screen.getByRole('textbox', { name: /^Name/i });
      await user.type(nameInput, 'imc');

      const urlInput = screen.getByRole('textbox', { name: /GraphQL URL/i });
      await user.type(urlInput, 'http://localhost:8082/graphql');

      // Submit form
      const registerButton = screen.getByRole('button', { name: /register/i });
      await user.click(registerButton);

      // Should call onSubmit with displayName as undefined
      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          name: 'imc',
          displayName: undefined,
          graphqlUrl: 'http://localhost:8082/graphql',
          priority: 100,
        });
      });
    });
  });

  describe('dialog interactions', () => {
    it('should close and reset form when cancel button clicked', async () => {
      const user = userEvent.setup();

      render(<SubgraphRegisterDialog open={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />);

      // Fill form partially
      const nameInput = screen.getByRole('textbox', { name: /^Name/i });
      await user.type(nameInput, 'test');

      // Click cancel
      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      await user.click(cancelButton);

      // Should call onClose
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should disable buttons when loading', () => {
      render(<SubgraphRegisterDialog open={true} onClose={mockOnClose} onSubmit={mockOnSubmit} loading={true} />);

      const registerButton = screen.getByRole('button', { name: /registering/i });
      const cancelButton = screen.getByRole('button', { name: /cancel/i });

      expect(registerButton).toBeDisabled();
      expect(cancelButton).toBeDisabled();
    });
  });
});
