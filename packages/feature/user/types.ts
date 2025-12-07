// ===== Enums =====
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'ARCHIVED';
export type UserType = 'PRODUCTION' | 'TRIAL' | 'DEMO' | 'PARTNER' | 'SYSTEM';

// ===== Namespace Types =====
export interface UserProfile {
  displayName: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  avatarUrl: string | null;
  department: string | null;
  title: string | null;
}

export interface UserPreferences {
  location: string | null;
  timezone: string | null;
  locale: string | null;
}

export type TenantExtensions = Record<string, unknown> | null;

// ===== Main User Type =====
export interface User {
  // Core Identity
  userId: string;
  subject: string;

  // Four-Dimensional Positioning
  zoneId: string;
  realmId: string;

  // Classification/Status
  userType: UserType;
  status: UserStatus;
  isVerified: boolean;

  // Namespace Groups
  profile: UserProfile;
  preferences: UserPreferences;
  extensions: TenantExtensions;

  // Audit
  createdAt: string;
  updatedAt: string;
}
