import { act, renderHook, waitFor } from '@testing-library/react';

import type {
  ChangePasswordResult,
  ForgotPasswordResult,
  LoginResult,
  RegisterResult,
  ResetPasswordResult,
} from '../src/adapter/types';
import { useChangePassword, useForgotPassword, useLogin, useRegister, useResetPassword } from '../src/hooks';

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

describe('useForgotPassword', () => {
  it('should handle successful forgot password with callback', async () => {
    const mockForgotPasswordFn = jest.fn().mockResolvedValue({
      success: true,
      message: 'If this email exists, a reset link has been sent',
    } as ForgotPasswordResult);

    const onSuccess = jest.fn();

    const { result } = renderHook(() =>
      useForgotPassword({
        onForgotPassword: mockForgotPasswordFn,
        onSuccess,
      })
    );

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();

    await act(async () => {
      await result.current.forgotPassword({ email: 'test@example.com' });
    });

    expect(mockForgotPasswordFn).toHaveBeenCalledWith({ email: 'test@example.com' });
    expect(onSuccess).toHaveBeenCalled();
    expect(result.current.error).toBeNull();
  });

  it('should handle forgot password failure', async () => {
    const mockForgotPasswordFn = jest.fn().mockResolvedValue({
      success: false,
      error: 'Server error',
    } as ForgotPasswordResult);

    const onError = jest.fn();

    const { result } = renderHook(() =>
      useForgotPassword({
        onForgotPassword: mockForgotPasswordFn,
        onError,
      })
    );

    await act(async () => {
      await result.current.forgotPassword({ email: 'test@example.com' });
    });

    expect(result.current.error).toBe('Server error');
    expect(onError).toHaveBeenCalledWith('Server error');
  });

  it('should show error when no adapter or callback provided', async () => {
    const { result } = renderHook(() => useForgotPassword());

    await act(async () => {
      await result.current.forgotPassword({ email: 'test@example.com' });
    });

    expect(result.current.error).toContain('No forgot password method provided');
  });

  it('should clear error', () => {
    const { result } = renderHook(() => useForgotPassword());

    act(() => {
      result.current.clearError();
    });

    expect(result.current.error).toBeNull();
  });
});

describe('useResetPassword', () => {
  it('should handle successful reset password with callback', async () => {
    const mockResetPasswordFn = jest.fn().mockResolvedValue({
      success: true,
      message: 'Password reset successfully',
    } as ResetPasswordResult);

    const onSuccess = jest.fn();

    const { result } = renderHook(() =>
      useResetPassword({
        onResetPassword: mockResetPasswordFn,
        onSuccess,
      })
    );

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();

    await act(async () => {
      await result.current.resetPassword({ token: 'valid-token', newPassword: 'NewPassword123!' });
    });

    expect(mockResetPasswordFn).toHaveBeenCalledWith({ token: 'valid-token', newPassword: 'NewPassword123!' });
    expect(onSuccess).toHaveBeenCalled();
    expect(result.current.error).toBeNull();
  });

  it('should handle reset password failure', async () => {
    const mockResetPasswordFn = jest.fn().mockResolvedValue({
      success: false,
      error: 'Token expired',
    } as ResetPasswordResult);

    const onError = jest.fn();

    const { result } = renderHook(() =>
      useResetPassword({
        onResetPassword: mockResetPasswordFn,
        onError,
      })
    );

    await act(async () => {
      await result.current.resetPassword({ token: 'expired-token', newPassword: 'NewPassword123!' });
    });

    expect(result.current.error).toBe('Token expired');
    expect(onError).toHaveBeenCalledWith('Token expired');
  });

  it('should show error when no adapter or callback provided', async () => {
    const { result } = renderHook(() => useResetPassword());

    await act(async () => {
      await result.current.resetPassword({ token: 'token', newPassword: 'password' });
    });

    expect(result.current.error).toContain('No reset password method provided');
  });
});

describe('useChangePassword', () => {
  it('should handle successful change password with callback', async () => {
    const mockChangePasswordFn = jest.fn().mockResolvedValue({
      success: true,
      message: 'Password changed successfully',
    } as ChangePasswordResult);

    const onSuccess = jest.fn();

    const { result } = renderHook(() =>
      useChangePassword({
        onChangePassword: mockChangePasswordFn,
        onSuccess,
      })
    );

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();

    await act(async () => {
      await result.current.changePassword({ currentPassword: 'OldPassword123!', newPassword: 'NewPassword123!' });
    });

    expect(mockChangePasswordFn).toHaveBeenCalledWith({
      currentPassword: 'OldPassword123!',
      newPassword: 'NewPassword123!',
    });
    expect(onSuccess).toHaveBeenCalled();
    expect(result.current.error).toBeNull();
  });

  it('should handle change password failure - wrong current password', async () => {
    const mockChangePasswordFn = jest.fn().mockResolvedValue({
      success: false,
      error: 'Current password is incorrect',
    } as ChangePasswordResult);

    const onError = jest.fn();

    const { result } = renderHook(() =>
      useChangePassword({
        onChangePassword: mockChangePasswordFn,
        onError,
      })
    );

    await act(async () => {
      await result.current.changePassword({ currentPassword: 'WrongPassword', newPassword: 'NewPassword123!' });
    });

    expect(result.current.error).toBe('Current password is incorrect');
    expect(onError).toHaveBeenCalledWith('Current password is incorrect');
  });

  it('should show error when no adapter or callback provided', async () => {
    const { result } = renderHook(() => useChangePassword());

    await act(async () => {
      await result.current.changePassword({ currentPassword: 'old', newPassword: 'new' });
    });

    expect(result.current.error).toContain('No change password method provided');
  });

  it('should clear error', () => {
    const { result } = renderHook(() => useChangePassword());

    act(() => {
      result.current.clearError();
    });

    expect(result.current.error).toBeNull();
  });
});
