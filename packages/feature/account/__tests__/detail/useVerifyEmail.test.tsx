/**
 * Unit tests for useVerifyEmail hook
 */

import type { MockedResponse } from '@apollo/client/testing';
import { MockedProvider } from '@apollo/client/testing/react';
import { renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';

import { VERIFY_EMAIL_BY_ADMIN_MUTATION } from '../../detail/hooks/useVerifyEmail';
import { useVerifyEmail } from '../../detail/hooks/useVerifyEmail';
import type { VerifyEmailResult } from '../../detail/types';

// ============ Test Data ============

const successResult: VerifyEmailResult = {
  success: true,
  message: 'Email verified successfully',
};

const failureResult: VerifyEmailResult = {
  success: false,
  message: 'Account not found',
};

// ============ Mock Helpers ============

function createSuccessMock(accountId: string): MockedResponse {
  return {
    request: {
      query: VERIFY_EMAIL_BY_ADMIN_MUTATION,
      variables: { accountId },
    },
    result: {
      data: {
        verifyEmailByAdmin: successResult,
      },
    },
  };
}

function createFailureMock(accountId: string): MockedResponse {
  return {
    request: {
      query: VERIFY_EMAIL_BY_ADMIN_MUTATION,
      variables: { accountId },
    },
    result: {
      data: {
        verifyEmailByAdmin: failureResult,
      },
    },
  };
}

function createNetworkErrorMock(accountId: string): MockedResponse {
  return {
    request: {
      query: VERIFY_EMAIL_BY_ADMIN_MUTATION,
      variables: { accountId },
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

describe('useVerifyEmail', () => {
  describe('initial state', () => {
    it('should return verifyEmail function and loading false initially', () => {
      const { result } = renderHook(() => useVerifyEmail(), {
        wrapper: createWrapper([]),
      });

      expect(result.current.verifyEmail).toBeInstanceOf(Function);
      expect(result.current.loading).toBe(false);
    });
  });

  describe('successful verification', () => {
    it('should verify email and return success result', async () => {
      const { result } = renderHook(() => useVerifyEmail(), {
        wrapper: createWrapper([createSuccessMock('test-account-123')]),
      });

      let verifyResult: VerifyEmailResult | undefined;

      verifyResult = await result.current.verifyEmail('test-account-123');

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(verifyResult).toEqual(successResult);
      expect(verifyResult.success).toBe(true);
      expect(verifyResult.message).toBe('Email verified successfully');
    });

    it('should set loading true during verification', async () => {
      // Use delayed mock response to observe loading state
      const delayedMock: MockedResponse = {
        ...createSuccessMock('test-account-123'),
        delay: 100, // 100ms delay to observe loading state
      };

      const { result } = renderHook(() => useVerifyEmail(), {
        wrapper: createWrapper([delayedMock]),
      });

      expect(result.current.loading).toBe(false);

      const verifyPromise = result.current.verifyEmail('test-account-123');

      // Loading should be true during verification
      await waitFor(() => {
        expect(result.current.loading).toBe(true);
      });

      await verifyPromise;

      // Loading should be false after completion
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
    });
  });

  describe('failed verification', () => {
    it('should handle verification failure', async () => {
      const { result } = renderHook(() => useVerifyEmail(), {
        wrapper: createWrapper([createFailureMock('non-existent-account')]),
      });

      let verifyResult: VerifyEmailResult | undefined;

      verifyResult = await result.current.verifyEmail('non-existent-account');

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(verifyResult).toEqual(failureResult);
      expect(verifyResult.success).toBe(false);
      expect(verifyResult.message).toBe('Account not found');
    });
  });

  describe('error handling', () => {
    it('should handle network errors', async () => {
      const { result } = renderHook(() => useVerifyEmail(), {
        wrapper: createWrapper([createNetworkErrorMock('test-account-123')]),
      });

      await expect(async () => {
        await result.current.verifyEmail('test-account-123');
      }).rejects.toThrow('Network error');

      // Loading should be false after error
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
    });

    it('should handle null result from mutation', async () => {
      const nullResultMock: MockedResponse = {
        request: {
          query: VERIFY_EMAIL_BY_ADMIN_MUTATION,
          variables: { accountId: 'test-account-123' },
        },
        result: {
          data: {
            verifyEmailByAdmin: null,
          },
        },
      };

      const { result } = renderHook(() => useVerifyEmail(), {
        wrapper: createWrapper([nullResultMock]),
      });

      await expect(async () => {
        await result.current.verifyEmail('test-account-123');
      }).rejects.toThrow('Verification failed: No response from server');
    });
  });

  describe('multiple verifications', () => {
    it('should handle multiple sequential verifications', async () => {
      const mocks = [createSuccessMock('account-1'), createSuccessMock('account-2')];

      const { result } = renderHook(() => useVerifyEmail(), {
        wrapper: createWrapper(mocks),
      });

      // First verification
      const result1 = await result.current.verifyEmail('account-1');
      expect(result1.success).toBe(true);

      // Second verification
      const result2 = await result.current.verifyEmail('account-2');
      expect(result2.success).toBe(true);
    });
  });
});
