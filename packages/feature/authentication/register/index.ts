// Hooks
export type { UseEmailAvailabilityOptions, UseEmailAvailabilityReturn, UseRegisterReturn } from './hooks';
export { useEmailAvailability, useRegister } from './hooks';

// Components
export type { RegisterFormProps, RegistrationSuccessProps } from './components';
export { RegisterForm, RegistrationSuccess } from './components';

// Types
export type { EmailAvailability, EmailVerificationResult, RegisterInput, RegisterResult, TenantStatus } from './types';
export { RegisterErrorCodes, VerificationErrorCodes } from './types';

// GraphQL (for advanced use cases)
export { CHECK_EMAIL_AVAILABILITY, REGISTER_MUTATION, VERIFY_EMAIL_MUTATION } from './graphql';
