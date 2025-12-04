// IMC Types (manually defined, matches IMC schema)
export interface Realm {
  realmId: string;
  realmName: string;
  displayName?: string;
  zoneId: string;
  realmType: 'PRODUCTION' | 'TRIAL' | 'DEMO' | 'SANDBOX';
  description?: string;
  isActive: boolean;
  keycloakRealm?: string;
}

// Multi-tenant login flow types
export interface PreAuthResult {
  success: boolean;
  subject?: string;
  error?: string;
}

export interface MultiTenantLoginState {
  step: 'credentials' | 'tenant-selection' | 'complete';
  subject?: string;
  availableRealms?: Realm[];
  selectedRealm?: Realm;
  error?: string;
}
