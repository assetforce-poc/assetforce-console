import { act, renderHook, waitFor } from '@testing-library/react';

import type { LoginResult, RegisterResult } from '../src/adapter/types';
import { useLogin, useRegister } from '../src/hooks';

describe('useLogin', () => {
  it('should handle successful login with callback', async () => {
    const mockLoginFn = jest.fn().mockResolvedValue({
      success: true,
      user: { id: '1', email: 'test@example.com' },
    } as LoginResult);

    const onSuccess = jest.fn();

    const { result } = renderHook(() =>
      useLogin({
        onLogin: mockLoginFn,
        onSuccess,
      })
    );

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();

    await act(async () => {
      await result.current.login({
        email: 'test@example.com',
        password: 'Test1234!',
      });
    });

    expect(mockLoginFn).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'Test1234!',
    });
    expect(onSuccess).toHaveBeenCalled();
    expect(result.current.error).toBeNull();
  });

  it('should handle login failure', async () => {
    const mockLoginFn = jest.fn().mockResolvedValue({
      success: false,
      error: 'Invalid credentials',
    } as LoginResult);

    const onError = jest.fn();

    const { result } = renderHook(() =>
      useLogin({
        onLogin: mockLoginFn,
        onError,
      })
    );

    await act(async () => {
      await result.current.login({
        email: 'test@example.com',
        password: 'wrong',
      });
    });

    expect(result.current.error).toBe('Invalid credentials');
    expect(onError).toHaveBeenCalledWith('Invalid credentials');
  });

  it('should show error when no adapter or callback provided', async () => {
    const { result } = renderHook(() => useLogin());

    await act(async () => {
      await result.current.login({
        email: 'test@example.com',
        password: 'Test1234!',
      });
    });

    expect(result.current.error).toContain('No login method provided');
  });

  it('should clear error', () => {
    const { result } = renderHook(() => useLogin());

    act(() => {
      result.current.clearError();
    });

    expect(result.current.error).toBeNull();
  });
});

describe('useRegister', () => {
  it('should handle successful registration with callback', async () => {
    const mockRegisterFn = jest.fn().mockResolvedValue({
      success: true,
      email: 'test@example.com',
      userId: '1',
    } as RegisterResult);

    const onSuccess = jest.fn();

    const { result } = renderHook(() =>
      useRegister({
        onRegister: mockRegisterFn,
        onSuccess,
      })
    );

    await act(async () => {
      await result.current.register({
        email: 'test@example.com',
        password: 'Test1234!',
        acceptTerms: true,
      });
    });

    expect(mockRegisterFn).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'Test1234!',
      acceptTerms: true,
    });
    expect(onSuccess).toHaveBeenCalled();
    expect(result.current.error).toBeNull();
  });

  it('should handle registration failure', async () => {
    const mockRegisterFn = jest.fn().mockResolvedValue({
      success: false,
      error: 'Email already exists',
    } as RegisterResult);

    const { result } = renderHook(() =>
      useRegister({
        onRegister: mockRegisterFn,
      })
    );

    await act(async () => {
      await result.current.register({
        email: 'test@example.com',
        password: 'Test1234!',
        acceptTerms: true,
      });
    });

    expect(result.current.error).toBe('Email already exists');
  });
});
