/**
 * Auth Adapter Types
 *
 * Defines the interface for authentication operations.
 * Users can implement this interface to connect auth-ui to their backend.
 */

/**
 * Login credentials
 */
export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

/**
 * Login result
 */
export interface LoginResult {
  success: boolean;
  user?: {
    id: string;
    email: string;
    name?: string;
    [key: string]: any;
  };
  token?: string;
  /** Multi-tenant: list of available tenants */
  tenants?: Array<{
    id: string;
    name: string;
    [key: string]: any;
  }>;
  error?: string;
}

/**
 * Registration data
 */
export interface RegisterData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  acceptTerms: boolean;
}

/**
 * Registration result
 */
export interface RegisterResult {
  success: boolean;
  email?: string;
  userId?: string;
  error?: string;
  /** If true, user needs to verify email */
  requiresEmailVerification?: boolean;
}

/**
 * Forgot password data
 */
export interface ForgotPasswordData {
  email: string;
}

/**
 * Forgot password result
 */
export interface ForgotPasswordResult {
  success: boolean;
  message?: string;
  error?: string;
}

/**
 * Reset password data
 */
export interface ResetPasswordData {
  token: string;
  newPassword: string;
}

/**
 * Reset password result
 */
export interface ResetPasswordResult {
  success: boolean;
  message?: string;
  error?: string;
}

/**
 * Change password data
 */
export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

/**
 * Change password result
 */
export interface ChangePasswordResult {
  success: boolean;
  message?: string;
  error?: string;
}

/**
 * Verify email data
 */
export interface VerifyEmailData {
  token: string;
}

/**
 * Verify email result
 */
export interface VerifyEmailResult {
  success: boolean;
  message?: string;
  error?: string;
  /** Redirect URL after verification */
  redirectUrl?: string;
}

/**
 * Resend verification email data
 */
export interface ResendVerificationData {
  email: string;
}

/**
 * Resend verification email result
 */
export interface ResendVerificationResult {
  success: boolean;
  message?: string;
  error?: string;
  /** Cooldown in seconds before next resend allowed */
  cooldownSeconds?: number;
}

/**
 * Auth Adapter Interface
 *
 * Implement this interface to connect auth-ui to your authentication backend.
 *
 * @example
 * ```typescript
 * const myAuthAdapter: AuthAdapter = {
 *   login: async (credentials) => {
 *     const response = await fetch('/api/auth/login', {
 *       method: 'POST',
 *       body: JSON.stringify(credentials),
 *     });
 *     return response.json();
 *   },
 *   register: async (data) => {
 *     // Your registration logic
 *   },
 *   // ... implement other methods
 * };
 * ```
 */
export interface AuthAdapter {
  /**
   * Login with email and password
   */
  login(credentials: LoginCredentials): Promise<LoginResult>;

  /**
   * Register new user
   */
  register(data: RegisterData): Promise<RegisterResult>;

  /**
   * Initiate forgot password flow (send reset email)
   */
  forgotPassword(data: ForgotPasswordData): Promise<ForgotPasswordResult>;

  /**
   * Reset password with token
   */
  resetPassword(data: ResetPasswordData): Promise<ResetPasswordResult>;

  /**
   * Change password (for logged-in users)
   */
  changePassword(data: ChangePasswordData): Promise<ChangePasswordResult>;

  /**
   * Verify email with token
   */
  verifyEmail(data: VerifyEmailData): Promise<VerifyEmailResult>;

  /**
   * Resend verification email
   */
  resendVerification(data: ResendVerificationData): Promise<ResendVerificationResult>;
}
