/**
 * @assetforce/auth-ui - Authentication UI Components
 *
 * Unified authentication UI components with better-auth patterns
 */

// Layouts
export { AuthCard } from './layouts/AuthCard';
export { AuthLayout } from './layouts/AuthLayout';

// Components
export { AuthFooter } from './components/AuthFooter';
export { AuthHeader } from './components/AuthHeader';
export { AuthTabBar } from './components/AuthTabBar';
export { EmailInput } from './components/EmailInput';
export { FormError } from './components/FormError';
export { PasswordInput } from './components/PasswordInput';
export { SubmitButton } from './components/SubmitButton';

// Forms
export type {
  ChangePasswordFormProps,
  ForgotPasswordFormProps,
  LoginFormProps,
  RegisterFormProps,
  ResendVerificationFormProps,
  ResetPasswordFormProps,
  VerifyEmailPageProps,
} from './forms';
export {
  ChangePasswordForm,
  ForgotPasswordForm,
  LoginForm,
  RegisterForm,
  ResendVerificationForm,
  ResetPasswordForm,
  VerifyEmailPage,
} from './forms';

// Hooks
export type {
  UseChangePasswordOptions,
  UseChangePasswordReturn,
  UseForgotPasswordOptions,
  UseForgotPasswordReturn,
  UseLoginOptions,
  UseLoginReturn,
  UseRegisterOptions,
  UseRegisterReturn,
  UseResendVerificationOptions,
  UseResendVerificationReturn,
  UseResetPasswordOptions,
  UseResetPasswordReturn,
  UseVerifyEmailOptions,
  UseVerifyEmailReturn,
} from './hooks';
export {
  useChangePassword,
  useForgotPassword,
  useLogin,
  useRegister,
  useResendVerification,
  useResetPassword,
  useVerifyEmail,
} from './hooks';

// Adapter
export type {
  AuthAdapter,
  ChangePasswordData,
  ChangePasswordResult,
  ForgotPasswordData,
  ForgotPasswordResult,
  LoginCredentials,
  LoginResult,
  RegisterData,
  RegisterResult,
  ResendVerificationData,
  ResendVerificationResult,
  ResetPasswordData,
  ResetPasswordResult,
  VerifyEmailData,
  VerifyEmailResult,
} from './adapter';
export { AuthProvider, useAuthAdapter } from './adapter';

// Types
export type { AuthProviderProps } from './adapter';
export type { AuthFooterProps } from './components/AuthFooter';
export type { AuthHeaderProps } from './components/AuthHeader';
export type { AuthTabBarProps } from './components/AuthTabBar';
export type { EmailInputProps } from './components/EmailInput';
export type { FormErrorProps } from './components/FormError';
export type { PasswordInputProps } from './components/PasswordInput';
export type { SubmitButtonProps } from './components/SubmitButton';
export type { AuthCardProps } from './layouts/AuthCard';
export type { AuthLayoutProps } from './layouts/AuthLayout';
export type { BrandConfig } from './themes/types';
