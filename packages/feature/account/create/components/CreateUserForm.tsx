'use client';

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Stack,
  TextField,
  Typography,
} from '@assetforce/material';
import { useTenants } from '@assetforce/tenant';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { AccountProvision } from '../../generated/graphql';
import type { CreateUserInput } from '../../generated/graphql';
import { useCreateUser } from '../hooks';

const ROLES = [
  { value: 'TENANT_ADMIN', label: 'Tenant Admin' },
  { value: 'TENANT_MEMBER', label: 'Tenant Member' },
];

export interface CreateUserFormProps {
  /** Callback on successful creation */
  onSuccess?: (accountId: string) => void;
  /** Callback on cancel */
  onCancel?: () => void;
}

/**
 * CreateUserForm - Form for creating new user accounts
 *
 * Supports two provisioning methods:
 * - EMAIL: Send activation email (user sets own password)
 * - TEMPORARY: Admin sets temporary password (user must change on first login)
 *
 * @example
 * ```tsx
 * <CreateUserForm
 *   onSuccess={(accountId) => router.push(`/accounts/${accountId}`)}
 *   onCancel={() => router.push('/accounts')}
 * />
 * ```
 */
export function CreateUserForm({ onSuccess, onCancel }: CreateUserFormProps) {
  const router = useRouter();
  const { createUser, loading: creating } = useCreateUser();
  const { tenants, loading: loadingTenants } = useTenants();

  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [tenantId, setTenantId] = useState('');
  const [role, setRole] = useState('TENANT_MEMBER');
  const [provision, setProvision] = useState<AccountProvision>(AccountProvision.Email);
  const [password, setPassword] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validation
    if (!email || !displayName || !tenantId || !role) {
      setError('Please fill in all required fields');
      return;
    }

    if (provision === AccountProvision.Temporary && (!password || password.length < 8)) {
      setError('Password must be at least 8 characters');
      return;
    }

    const input: CreateUserInput = {
      email,
      displayName,
      tenantId,
      role,
      provision,
      password: provision === AccountProvision.Temporary ? password : undefined,
    };

    try {
      const result = await createUser(input);

      if (result.error) {
        setError(result.error.message);
        return;
      }

      setSuccess(
        `User created successfully! Status: ${result.status === 'PENDING_VERIFICATION' ? 'Activation email sent' : 'Active'}`
      );

      // Wait 1 second before redirecting
      setTimeout(() => {
        if (onSuccess) {
          onSuccess(result.accountId);
        } else {
          router.push(`/accounts/${result.accountId}`);
        }
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create user');
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      router.push('/accounts');
    }
  };

  if (loadingTenants) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Card>
      <CardHeader
        title="Create New User"
        subheader="Create a new user account with activation email or temporary password"
      />
      <CardContent>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {success}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            {/* Email */}
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
              helperText="User's email address (used for login)"
              disabled={creating}
            />

            {/* Display Name */}
            <TextField
              label="Display Name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
              fullWidth
              helperText="User's full name or display name"
              disabled={creating}
            />

            {/* Tenant ID */}
            <FormControl fullWidth required>
              <FormLabel>Tenant</FormLabel>
              <Select value={tenantId} onChange={(e) => setTenantId(e.target.value)} disabled={creating}>
                <MenuItem value="">
                  <em>Select a tenant</em>
                </MenuItem>
                {tenants.map((tenant) => (
                  <MenuItem key={tenant.id} value={tenant.id}>
                    {tenant.name} ({tenant.id})
                  </MenuItem>
                ))}
              </Select>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                Tenant to assign the user to
              </Typography>
            </FormControl>

            {/* Role */}
            <FormControl fullWidth required>
              <FormLabel>Role</FormLabel>
              <Select value={role} onChange={(e) => setRole(e.target.value)} disabled={creating}>
                {ROLES.map((r) => (
                  <MenuItem key={r.value} value={r.value}>
                    {r.label}
                  </MenuItem>
                ))}
              </Select>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                User's role within the tenant
              </Typography>
            </FormControl>

            {/* Provision Method */}
            <FormControl>
              <FormLabel>Account Provisioning Method</FormLabel>
              <RadioGroup
                value={provision}
                onChange={(e) => setProvision(e.target.value as AccountProvision)}
              >
                <FormControlLabel
                  value={AccountProvision.Email}
                  control={<Radio />}
                  disabled={creating}
                  label={
                    <Box>
                      <Typography variant="body1">Send activation email</Typography>
                      <Typography variant="caption" color="text.secondary">
                        User will receive an email to set their own password (recommended)
                      </Typography>
                    </Box>
                  }
                />
                <FormControlLabel
                  value={AccountProvision.Temporary}
                  control={<Radio />}
                  disabled={creating}
                  label={
                    <Box>
                      <Typography variant="body1">Set temporary password</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Admin sets a temporary password - user must change on first login
                      </Typography>
                    </Box>
                  }
                />
              </RadioGroup>
            </FormControl>

            {/* Temporary Password (conditional) */}
            {provision === AccountProvision.Temporary && (
              <TextField
                label="Temporary Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                fullWidth
                helperText="Minimum 8 characters. User will be required to change this password on first login."
                disabled={creating}
                inputProps={{ minLength: 8 }}
              />
            )}

            {/* Action Buttons */}
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button variant="outlined" onClick={handleCancel} disabled={creating}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={creating}
                startIcon={creating ? <CircularProgress size={20} /> : null}
              >
                {creating ? 'Creating...' : 'Create User'}
              </Button>
            </Stack>
          </Stack>
        </form>
      </CardContent>
    </Card>
  );
}
