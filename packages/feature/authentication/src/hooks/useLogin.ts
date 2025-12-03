"use client";

import { useMutation } from '@apollo/client';
import { LoginDocument } from '../graphql/generated/graphql';
import type { LoginMutation, LoginMutationVariables } from '../graphql/generated/graphql';

// Types
export interface UseLoginInput {
  credential: string;        // email 或 username
  password: string;
  rememberMe?: boolean;      // 暂不支持，待 AAC 扩展
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
  identityContext?: {
    zone?: string;
    realm: string;
    subject: {
      accountId: string;
      userId?: string;
      username: string;
      email?: string;
      displayName?: string;
    };
    groups: string[];
  };
}

export interface MFAChallenge {
  type: 'totp' | 'sms' | 'email';
  message: string;
}

export type LoginResult =
  | { type: 'success'; tokens: AuthTokens }
  | { type: 'mfa_required'; challenge: MFAChallenge }
  | { type: 'error'; message: string };

export interface AuthError {
  code: string;
  message: string;
}

/**
 * useLogin Hook - Email/Username + Password 登录
 *
 * @example
 * ```tsx
 * const { login, loading, error } = useLogin();
 *
 * const handleLogin = async () => {
 *   const result = await login({
 *     credential: 'user@example.com',
 *     password: 'password123',
 *   });
 *
 *   if (result.type === 'success') {
 *     // Store tokens, navigate to app
 *   } else if (result.type === 'mfa_required') {
 *     // Navigate to MFA page
 *   }
 * };
 * ```
 */
export function useLogin() {
  const [loginMutation, { loading }] = useMutation<LoginMutation, LoginMutationVariables>(LoginDocument);

  const login = async (input: UseLoginInput): Promise<LoginResult> => {
    try {
      const { data } = await loginMutation({
        variables: {
          input: {
            username: input.credential,  // Keycloak 支持 email 作为 username
            password: input.password,
            realm: 'assetforce-test',    // 默认 realm
          },
        },
      });

      if (!data?.login) {
        return {
          type: 'error',
          message: 'No response from server',
        };
      }

      const { success, accessToken, refreshToken, expiresIn, tokenType, error, identityContext } = data.login;

      // 错误处理
      if (!success || error) {
        // 检查是否是 MFA required
        if (error?.includes('MFA') || error?.includes('2FA')) {
          return {
            type: 'mfa_required',
            challenge: {
              type: 'totp',  // TODO: 从 AAC 返回
              message: error,
            },
          };
        }

        return {
          type: 'error',
          message: error || 'Login failed',
        };
      }

      // 成功
      if (accessToken && refreshToken && expiresIn && tokenType) {
        return {
          type: 'success',
          tokens: {
            accessToken,
            refreshToken,
            expiresIn,
            tokenType,
            identityContext: identityContext ? {
              zone: identityContext.zone ?? undefined,
              realm: identityContext.realm,
              subject: {
                accountId: identityContext.subject.accountId,
                userId: identityContext.subject.userId ?? undefined,
                username: identityContext.subject.username,
                email: identityContext.subject.email ?? undefined,
                displayName: identityContext.subject.displayName ?? undefined,
              },
              groups: identityContext.groups,
            } : undefined,
          },
        };
      }

      return {
        type: 'error',
        message: 'Invalid response format',
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      return {
        type: 'error',
        message,
      };
    }
  };

  return {
    login,
    loading,
    error: null as AuthError | null,  // TODO: 从 mutation error 提取
  };
}
