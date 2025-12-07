/**
 * Unit tests for useRegister hook
 */

import type { MockedResponse } from '@apollo/client/testing';
import { MockedProvider } from '@apollo/client/testing/react';
import { renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';

import { REGISTER_MUTATION } from '../../register/graphql';
import { useRegister } from '../../register/hooks/useRegister';
import type { RegisterInput, RegisterResult } from '../../register/types';

// ============ Test Data ============

const validInput: RegisterInput = {
  email: 'test@example.com',
  password: 'Password123!',
  firstName: 'Test',
  lastName: 'User',
  acceptTerms: true,
};

const successResult: RegisterResult = {
  success: true,
  accountId: 'test-account-123',
  message: 'Registration successful',
  requiresVerification: true,
  appliedTenant: undefined,
};

const failureResult: RegisterResult = {
  success: false,
  accountId: undefined,
  message: 'Email already exists',
  requiresVerification: false,
  appliedTenant: undefined,
};

// ============ Mock Helpers ============

function createSuccessMock(input: RegisterInput): MockedResponse {
  return {
    request: {
      query: REGISTER_MUTATION,
      variables: { input },
    },
    result: {
      data: {
        register: successResult,
      },
    },
  };
}

function createFailureMock(input: RegisterInput): MockedResponse {
  return {
    request: {
      query: REGISTER_MUTATION,
      variables: { input },
    },
    result: {
      data: {
        register: failureResult,
      },
    },
  };
}

function createNetworkErrorMock(input: RegisterInput): MockedResponse {
  return {
    request: {
      query: REGISTER_MUTATION,
      variables: { input },
    },
    error: new Error('Network error'),
  };
}

function createWrapper(mocks: MockedResponse[]) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return <MockedProvider mocks={mocks}>{children}</MockedProvider>;
  };
}

// ============ Tests ============

describe('useRegister', () => {
  describe('initial state', () => {
    it('should return register function and loading false initially', () => {
      const { result } = renderHook(() => useRegister(), {
        wrapper: createWrapper([]),
      });

      expect(result.current.register).toBeInstanceOf(Function);
      expect(result.current.loading).toBe(false);
    });
  });

  describe('successful registration', () => {
    it('should return success result with email', async () => {
      const { result } = renderHook(() => useRegister(), {
        wrapper: createWrapper([createSuccessMock(validInput)]),
      });

      const registerResult = await result.current.register(validInput);

      expect(registerResult.success).toBe(true);
      expect(registerResult.accountId).toBe('test-account-123');
      expect(registerResult.message).toBe('Registration successful');
      expect(registerResult.requiresVerification).toBe(true);
      expect(registerResult.email).toBe(validInput.email);
    });

    it('should return loading false after mutation completes', async () => {
      const { result } = renderHook(() => useRegister(), {
        wrapper: createWrapper([createSuccessMock(validInput)]),
      });

      // Execute mutation and wait for completion
      await result.current.register(validInput);

      // Loading should be false after completion
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
    });
  });

  describe('failed registration', () => {
    it('should return failure result from server', async () => {
      const failInput = { ...validInput, email: 'taken@example.com' };
      const { result } = renderHook(() => useRegister(), {
        wrapper: createWrapper([createFailureMock(failInput)]),
      });

      const registerResult = await result.current.register(failInput);

      expect(registerResult.success).toBe(false);
      expect(registerResult.message).toBe('Email already exists');
      expect(registerResult.email).toBe(failInput.email);
    });
  });

  describe('error handling', () => {
    it('should handle network errors gracefully', async () => {
      const { result } = renderHook(() => useRegister(), {
        wrapper: createWrapper([createNetworkErrorMock(validInput)]),
      });

      const registerResult = await result.current.register(validInput);

      expect(registerResult.success).toBe(false);
      expect(registerResult.message).toBe('Network error');
      expect(registerResult.requiresVerification).toBe(false);
      expect(registerResult.email).toBe(validInput.email);
    });

    it('should handle non-Error exceptions with fallback message', async () => {
      // Mock that throws a non-Error value
      const nonErrorMock: MockedResponse = {
        request: {
          query: REGISTER_MUTATION,
          variables: { input: validInput },
        },
        error: 'string error' as unknown as Error, // Non-Error type
      };

      const { result } = renderHook(() => useRegister(), {
        wrapper: createWrapper([nonErrorMock]),
      });

      const registerResult = await result.current.register(validInput);

      expect(registerResult.success).toBe(false);
      // Should use fallback message since it's not an Error instance
      expect(registerResult.message).toBeDefined();
      expect(registerResult.email).toBe(validInput.email);
    });

    it('should handle null response from server', async () => {
      const nullResponseMock: MockedResponse = {
        request: {
          query: REGISTER_MUTATION,
          variables: { input: validInput },
        },
        result: {
          data: {
            register: null,
          },
        },
      };

      const { result } = renderHook(() => useRegister(), {
        wrapper: createWrapper([nullResponseMock]),
      });

      const registerResult = await result.current.register(validInput);

      expect(registerResult.success).toBe(false);
      expect(registerResult.message).toBe('No response from server');
    });
  });
});
