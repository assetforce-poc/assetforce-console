/**
 * Unit tests for useEmailAvailability hook
 */

import { renderHook, waitFor, act } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing/react';
import type { MockedResponse } from '@apollo/client/testing';
import type { ReactNode } from 'react';

import { useEmailAvailability } from '../../register/hooks/useEmailAvailability';
import { CHECK_EMAIL_AVAILABILITY } from '../../register/graphql';

// ============ Mock Helpers ============

function createAvailableMock(email: string): MockedResponse {
  return {
    request: {
      query: CHECK_EMAIL_AVAILABILITY,
      variables: { email },
    },
    result: {
      data: {
        checkEmailAvailability: {
          available: true,
          reason: null,
        },
      },
    },
  };
}

function createUnavailableMock(email: string): MockedResponse {
  return {
    request: {
      query: CHECK_EMAIL_AVAILABILITY,
      variables: { email },
    },
    result: {
      data: {
        checkEmailAvailability: {
          available: false,
          reason: 'EMAIL_ALREADY_EXISTS',
        },
      },
    },
  };
}

function createErrorMock(email: string): MockedResponse {
  return {
    request: {
      query: CHECK_EMAIL_AVAILABILITY,
      variables: { email },
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

describe('useEmailAvailability', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('initial state', () => {
    it('should return initial state with null values', () => {
      const { result } = renderHook(() => useEmailAvailability(), {
        wrapper: createWrapper([]),
      });

      expect(result.current.available).toBeNull();
      expect(result.current.reason).toBeNull();
      expect(result.current.loading).toBe(false);
      expect(result.current.checkEmail).toBeInstanceOf(Function);
      expect(result.current.reset).toBeInstanceOf(Function);
    });
  });

  describe('email validation', () => {
    it('should skip check for empty email', async () => {
      const { result } = renderHook(() => useEmailAvailability(), {
        wrapper: createWrapper([]),
      });

      act(() => {
        result.current.checkEmail('');
      });

      // Advance timers past debounce
      act(() => {
        jest.advanceTimersByTime(600);
      });

      expect(result.current.available).toBeNull();
      expect(result.current.loading).toBe(false);
    });

    it('should skip check for email shorter than 3 characters', async () => {
      const { result } = renderHook(() => useEmailAvailability(), {
        wrapper: createWrapper([]),
      });

      act(() => {
        result.current.checkEmail('ab');
      });

      act(() => {
        jest.advanceTimersByTime(600);
      });

      expect(result.current.available).toBeNull();
    });

    it('should skip check for invalid email format', async () => {
      const { result } = renderHook(() => useEmailAvailability(), {
        wrapper: createWrapper([]),
      });

      act(() => {
        result.current.checkEmail('notanemail');
      });

      act(() => {
        jest.advanceTimersByTime(600);
      });

      expect(result.current.available).toBeNull();
    });
  });

  describe('debounce behavior', () => {
    it('should not call API immediately', () => {
      const email = 'test@example.com';
      const { result } = renderHook(() => useEmailAvailability(), {
        wrapper: createWrapper([createAvailableMock(email)]),
      });

      act(() => {
        result.current.checkEmail(email);
      });

      // Immediately after calling, state should still be null (debounced)
      expect(result.current.available).toBeNull();
      expect(result.current.loading).toBe(false);
    });

    it('should call API after debounce time', async () => {
      jest.useRealTimers(); // Use real timers for this test

      const email = 'debounce@example.com';
      const { result } = renderHook(
        () => useEmailAvailability({ debounceMs: 50 }), // Short debounce for faster test
        {
          wrapper: createWrapper([createAvailableMock(email)]),
        }
      );

      act(() => {
        result.current.checkEmail(email);
      });

      // Wait for debounce + API response
      await waitFor(
        () => {
          expect(result.current.available).toBe(true);
        },
        { timeout: 2000 }
      );

      jest.useFakeTimers(); // Restore fake timers
    });

    it('should cancel previous debounce on new input', async () => {
      jest.useRealTimers();

      const email2 = 'second@example.com';

      const { result } = renderHook(
        () => useEmailAvailability({ debounceMs: 50 }),
        {
          wrapper: createWrapper([createAvailableMock(email2)]),
        }
      );

      // First input
      act(() => {
        result.current.checkEmail('first@example.com');
      });

      // Immediately change to second input (cancels first)
      act(() => {
        result.current.checkEmail(email2);
      });

      // Should get result for second email
      await waitFor(
        () => {
          expect(result.current.available).toBe(true);
        },
        { timeout: 2000 }
      );

      jest.useFakeTimers();
    });
  });

  describe('available email', () => {
    it('should return available true for new email', async () => {
      const email = 'newuser@example.com';
      const { result } = renderHook(() => useEmailAvailability(), {
        wrapper: createWrapper([createAvailableMock(email)]),
      });

      act(() => {
        result.current.checkEmail(email);
      });

      act(() => {
        jest.advanceTimersByTime(600);
      });

      await waitFor(() => {
        expect(result.current.available).toBe(true);
        expect(result.current.reason).toBeNull();
      });
    });
  });

  describe('unavailable email', () => {
    it('should return available false with reason for taken email', async () => {
      const email = 'taken@example.com';
      const { result } = renderHook(() => useEmailAvailability(), {
        wrapper: createWrapper([createUnavailableMock(email)]),
      });

      act(() => {
        result.current.checkEmail(email);
      });

      act(() => {
        jest.advanceTimersByTime(600);
      });

      await waitFor(() => {
        expect(result.current.available).toBe(false);
        expect(result.current.reason).toBe('EMAIL_ALREADY_EXISTS');
      });
    });
  });

  describe('error handling', () => {
    it('should reset state on network error', async () => {
      const email = 'error@example.com';
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      const { result } = renderHook(() => useEmailAvailability(), {
        wrapper: createWrapper([createErrorMock(email)]),
      });

      act(() => {
        result.current.checkEmail(email);
      });

      act(() => {
        jest.advanceTimersByTime(600);
      });

      await waitFor(() => {
        expect(result.current.available).toBeNull();
        expect(result.current.reason).toBeNull();
      });

      consoleSpy.mockRestore();
    });
  });

  describe('reset', () => {
    it('should reset all state', async () => {
      const email = 'test@example.com';
      const { result } = renderHook(() => useEmailAvailability(), {
        wrapper: createWrapper([createAvailableMock(email)]),
      });

      // First, get a result
      act(() => {
        result.current.checkEmail(email);
      });

      act(() => {
        jest.advanceTimersByTime(600);
      });

      await waitFor(() => {
        expect(result.current.available).toBe(true);
      });

      // Then reset
      act(() => {
        result.current.reset();
      });

      expect(result.current.available).toBeNull();
      expect(result.current.reason).toBeNull();
    });

    it('should cancel pending debounce on reset', () => {
      const email = 'test@example.com';
      const { result } = renderHook(() => useEmailAvailability(), {
        wrapper: createWrapper([createAvailableMock(email)]),
      });

      act(() => {
        result.current.checkEmail(email);
      });

      // Reset before debounce completes
      act(() => {
        jest.advanceTimersByTime(300);
        result.current.reset();
      });

      // Advance past original debounce time
      act(() => {
        jest.advanceTimersByTime(300);
      });

      // Should still be null because reset cancelled the debounce
      expect(result.current.available).toBeNull();
      expect(result.current.loading).toBe(false);
    });
  });
});
