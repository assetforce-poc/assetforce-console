/**
 * Component tests for RegisterForm
 */

import type { MockedResponse } from '@apollo/client/testing';
import { MockedProvider } from '@apollo/client/testing/react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';

import { RegisterForm } from '../../register/components/RegisterForm';
import { CHECK_EMAIL_AVAILABILITY, REGISTER_MUTATION } from '../../register/graphql';

// Mock next/link
jest.mock('next/link', () => {
  return function MockLink({ children, href }: { children: React.ReactNode; href: string }) {
    return <a href={href}>{children}</a>;
  };
});

// ============ Mock Data ============

const validFormData = {
  email: 'newuser@example.com',
  password: 'Password123!',
  firstName: 'Test',
  lastName: 'User',
};

// ============ Mock Helpers ============

function createEmailAvailableMock(email: string): MockedResponse {
  return {
    request: {
      query: CHECK_EMAIL_AVAILABILITY,
      variables: { email },
    },
    result: {
      data: {
        registration: {
          email: {
            available: true,
            reason: null,
          },
        },
      },
    },
  };
}

function createEmailUnavailableMock(email: string): MockedResponse {
  return {
    request: {
      query: CHECK_EMAIL_AVAILABILITY,
      variables: { email },
    },
    result: {
      data: {
        registration: {
          email: {
            available: false,
            reason: 'EMAIL_ALREADY_EXISTS',
          },
        },
      },
    },
  };
}

function createRegisterSuccessMock(): MockedResponse {
  return {
    request: {
      query: REGISTER_MUTATION,
      variables: {
        input: {
          email: validFormData.email,
          password: validFormData.password,
          firstName: validFormData.firstName,
          lastName: validFormData.lastName,
          acceptTerms: true,
        },
      },
    },
    result: {
      data: {
        registration: {
          register: {
            success: true,
            accountId: 'test-account-123',
            message: 'Registration successful',
            requiresVerification: true,
            appliedTenant: null,
          },
        },
      },
    },
  };
}

function createRegisterFailureMock(): MockedResponse {
  return {
    request: {
      query: REGISTER_MUTATION,
      variables: {
        input: {
          email: validFormData.email,
          password: validFormData.password,
          firstName: validFormData.firstName,
          lastName: validFormData.lastName,
          acceptTerms: true,
        },
      },
    },
    result: {
      data: {
        registration: {
          register: {
            success: false,
            accountId: null,
            message: 'Email already exists',
            requiresVerification: false,
            appliedTenant: null,
          },
        },
      },
    },
  };
}

function createWrapper(mocks: MockedResponse[]) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return <MockedProvider mocks={mocks}>{children}</MockedProvider>;
  };
}

// ============ Tests ============

describe('RegisterForm', () => {
  // Helper to get form fields by placeholder or label
  const getFirstNameInput = () => screen.getByRole('textbox', { name: /first name/i });
  const getLastNameInput = () => screen.getByRole('textbox', { name: /last name/i });
  const getEmailInput = () => screen.getByRole('textbox', { name: /email/i });
  const getPasswordInput = () => screen.getByLabelText(/^password/i);
  const getTermsCheckbox = () => screen.getByRole('checkbox');
  const getSubmitButton = () => screen.getByRole('button', { name: /create account/i });

  describe('rendering', () => {
    it('should render form title', () => {
      render(<RegisterForm />, { wrapper: createWrapper([]) });

      expect(screen.getByRole('heading', { name: /create account/i })).toBeInTheDocument();
    });

    it('should render all form fields', () => {
      render(<RegisterForm />, { wrapper: createWrapper([]) });

      expect(getFirstNameInput()).toBeInTheDocument();
      expect(getLastNameInput()).toBeInTheDocument();
      expect(getEmailInput()).toBeInTheDocument();
      expect(getPasswordInput()).toBeInTheDocument();
      expect(getTermsCheckbox()).toBeInTheDocument();
    });

    it('should render submit button', () => {
      render(<RegisterForm />, { wrapper: createWrapper([]) });

      expect(getSubmitButton()).toBeInTheDocument();
    });

    it('should render sign in link', () => {
      render(<RegisterForm />, { wrapper: createWrapper([]) });

      expect(screen.getByText(/already have an account\?/i)).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /sign in/i })).toBeInTheDocument();
    });
  });

  describe('validation', () => {
    it('should not submit form with empty fields', async () => {
      const user = userEvent.setup();
      const onSuccess = jest.fn();
      render(<RegisterForm onSuccess={onSuccess} />, { wrapper: createWrapper([]) });

      await user.click(getSubmitButton());

      // Form should not have called onSuccess with empty fields
      expect(onSuccess).not.toHaveBeenCalled();
    });

    it('should show error for invalid email format', async () => {
      const user = userEvent.setup();
      render(<RegisterForm />, { wrapper: createWrapper([]) });

      await user.type(getEmailInput(), 'invalid-email');
      await user.click(getSubmitButton());

      await waitFor(() => {
        expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
      });
    });

    it('should show error for short password', async () => {
      const user = userEvent.setup();
      render(<RegisterForm />, { wrapper: createWrapper([]) });

      await user.type(getPasswordInput(), 'short');
      await user.click(getSubmitButton());

      await waitFor(() => {
        expect(screen.getByText(/at least 8 characters/i)).toBeInTheDocument();
      });
    });
  });

  describe('successful submission', () => {
    it('should call onSuccess with result when registration succeeds', async () => {
      const user = userEvent.setup();
      const onSuccess = jest.fn();

      render(<RegisterForm onSuccess={onSuccess} />, {
        wrapper: createWrapper([createEmailAvailableMock(validFormData.email), createRegisterSuccessMock()]),
      });

      // Fill form
      await user.type(getFirstNameInput(), validFormData.firstName);
      await user.type(getLastNameInput(), validFormData.lastName);
      await user.type(getEmailInput(), validFormData.email);
      await user.type(getPasswordInput(), validFormData.password);
      await user.click(getTermsCheckbox());

      // Submit
      await user.click(getSubmitButton());

      await waitFor(() => {
        expect(onSuccess).toHaveBeenCalledWith(
          expect.objectContaining({
            success: true,
            accountId: 'test-account-123',
          })
        );
      });
    });
  });

  describe('failed submission', () => {
    it('should show error alert when registration fails', async () => {
      const user = userEvent.setup();
      const onError = jest.fn();

      render(<RegisterForm onError={onError} />, {
        wrapper: createWrapper([createEmailAvailableMock(validFormData.email), createRegisterFailureMock()]),
      });

      // Fill form
      await user.type(getFirstNameInput(), validFormData.firstName);
      await user.type(getLastNameInput(), validFormData.lastName);
      await user.type(getEmailInput(), validFormData.email);
      await user.type(getPasswordInput(), validFormData.password);
      await user.click(getTermsCheckbox());

      // Submit
      await user.click(getSubmitButton());

      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument();
        expect(screen.getByText(/email already exists/i)).toBeInTheDocument();
      });

      expect(onError).toHaveBeenCalledWith('Email already exists');
    });
  });

  describe('email availability check', () => {
    it('should show error when email is already registered', async () => {
      const takenEmail = 'taken@example.com';
      const user = userEvent.setup();

      render(<RegisterForm />, {
        wrapper: createWrapper([createEmailUnavailableMock(takenEmail)]),
      });

      // Type email that is taken
      await user.type(getEmailInput(), takenEmail);

      // Wait for debounce and email check
      await waitFor(
        () => {
          expect(screen.getByText(/already registered/i)).toBeInTheDocument();
        },
        { timeout: 2000 }
      );
    });
  });

  describe('error alert', () => {
    it('should close error alert when close button clicked', async () => {
      const user = userEvent.setup();

      render(<RegisterForm />, {
        wrapper: createWrapper([createEmailAvailableMock(validFormData.email), createRegisterFailureMock()]),
      });

      // Fill form and submit to trigger error
      await user.type(getFirstNameInput(), validFormData.firstName);
      await user.type(getLastNameInput(), validFormData.lastName);
      await user.type(getEmailInput(), validFormData.email);
      await user.type(getPasswordInput(), validFormData.password);
      await user.click(getTermsCheckbox());
      await user.click(getSubmitButton());

      // Wait for error alert to appear
      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument();
      });

      // Click close button on alert
      const closeButton = screen.getByRole('button', { name: /close/i });
      await user.click(closeButton);

      // Alert should be dismissed
      await waitFor(() => {
        expect(screen.queryByRole('alert')).not.toBeInTheDocument();
      });
    });
  });

  describe('login link click', () => {
    it('should call onLoginClick when provided', async () => {
      const user = userEvent.setup();
      const onLoginClick = jest.fn();

      render(<RegisterForm onLoginClick={onLoginClick} />, {
        wrapper: createWrapper([]),
      });

      await user.click(screen.getByRole('button', { name: /sign in/i }));

      expect(onLoginClick).toHaveBeenCalledTimes(1);
    });
  });
});
