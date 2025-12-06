/**
 * MSW handlers for @assetforce/authentication tests
 */

import { graphql, HttpResponse } from 'msw';

import type { EmailAvailability, RegisterInput, RegisterResult } from '../../register/types';

// ============ Mock Data ============

export const mockEmailAvailable: EmailAvailability = {
  available: true,
  reason: undefined,
};

export const mockEmailTaken: EmailAvailability = {
  available: false,
  reason: 'EMAIL_ALREADY_EXISTS',
};

export const mockRegisterSuccess: RegisterResult = {
  success: true,
  accountId: 'test-account-id-123',
  message: 'Registration successful. Please check your email to verify your account.',
  requiresVerification: true,
  appliedTenant: undefined,
};

export const mockRegisterFailure: RegisterResult = {
  success: false,
  accountId: undefined,
  message: 'Email already exists',
  requiresVerification: false,
  appliedTenant: undefined,
};

// ============ Handlers ============

export const handlers = [
  // CheckEmailAvailability query
  graphql.query('CheckEmailAvailability', ({ variables }) => {
    const { email } = variables as { email: string };

    // Simulate taken emails
    if (email === 'taken@example.com') {
      return HttpResponse.json({
        data: {
          checkEmailAvailability: mockEmailTaken,
        },
      });
    }

    return HttpResponse.json({
      data: {
        checkEmailAvailability: mockEmailAvailable,
      },
    });
  }),

  // Register mutation
  graphql.mutation('Register', ({ variables }) => {
    const { input } = variables as { input: RegisterInput };

    // Simulate registration failure for taken email
    if (input.email === 'taken@example.com') {
      return HttpResponse.json({
        data: {
          register: mockRegisterFailure,
        },
      });
    }

    return HttpResponse.json({
      data: {
        register: mockRegisterSuccess,
      },
    });
  }),
];
