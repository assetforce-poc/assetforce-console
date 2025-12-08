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
// GraphQL queries/mutations - re-exported from generated files
export { CheckEmailAvailabilityInRegistrationDocument as CHECK_EMAIL_AVAILABILITY } from '../generated/graphql';
export { RegisterInRegistrationDocument as REGISTER_MUTATION } from '../generated/graphql';
export { VerifyEmailInRegistrationDocument as VERIFY_EMAIL_MUTATION } from '../generated/graphql';
