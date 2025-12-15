'use client';

import { Box, Divider, Paper, Stack, type SxProps, Typography } from '@assetforce/material';

import { type AuthTab, AuthTabBar } from '../components/AuthTabBar';

export interface AuthCardProps {
  /** Card content (form, success message, etc.) */
  children: React.ReactNode;

  /** Card title */
  title?: string;

  /** Card subtitle */
  subtitle?: string;

  /** Tab navigation (e.g., Login ↔ Register) */
  tabs?: AuthTab[];

  /** Active tab identifier (for controlled mode) */
  activeTab?: string;

  /** Show "or" divider between content and social login */
  showDivider?: boolean;

  /** Divider text (default: "or") */
  dividerText?: string;

  /** Social login providers (future feature) */
  socialProviders?: Array<'google' | 'microsoft'>;

  /** Custom sx props for Paper */
  sx?: SxProps;

  /** Paper elevation (default: 3) */
  elevation?: number;
}

/**
 * AuthCard - Reusable card component for authentication forms
 *
 * Features:
 * - Optional title and subtitle
 * - Tab navigation (Login ↔ Register)
 * - Main content area (form)
 * - Optional divider
 * - Social login buttons (future)
 *
 * @example
 * <AuthCard
 *   title="Sign In"
 *   subtitle="Welcome back!"
 *   tabs={[
 *     { label: 'Sign In', href: '/auth/login' },
 *     { label: 'Sign Up', href: '/auth/register' }
 *   ]}
 *   activeTab="login"
 *   showDivider={true}
 *   socialProviders={['google', 'microsoft']}
 * >
 *   <LoginForm />
 * </AuthCard>
 */
export function AuthCard({
  children,
  title,
  subtitle,
  tabs,
  activeTab,
  showDivider = false,
  dividerText = 'or',
  socialProviders,
  sx,
  elevation = 3,
}: AuthCardProps) {
  return (
    <Paper elevation={elevation} sx={{ p: 4, ...sx }}>
      {/* Title and subtitle */}
      {(title || subtitle) && (
        <Box sx={{ mb: 3, textAlign: 'center' }}>
          {title && (
            <Typography variant="h4" component="h1" gutterBottom>
              {title}
            </Typography>
          )}
          {subtitle && (
            <Typography variant="body1" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>
      )}

      {/* Tab bar */}
      {tabs && <AuthTabBar tabs={tabs} activeTab={activeTab} />}

      {/* Main content */}
      <Box>{children}</Box>

      {/* Divider */}
      {showDivider && (
        <Divider sx={{ my: 3 }}>
          <Typography variant="body2" color="text.secondary">
            {dividerText}
          </Typography>
        </Divider>
      )}

      {/* Social login buttons (future implementation) */}
      {socialProviders && socialProviders.length > 0 && (
        <Stack spacing={2} sx={{ mt: 3 }}>
          {socialProviders.map((provider) => (
            <Box
              key={provider}
              sx={{
                p: 2,
                border: '1px dashed',
                borderColor: 'divider',
                borderRadius: 1,
                textAlign: 'center',
                color: 'text.secondary',
              }}
            >
              <Typography variant="body2">
                {provider.charAt(0).toUpperCase() + provider.slice(1)} login - Coming soon
              </Typography>
            </Box>
          ))}
        </Stack>
      )}
    </Paper>
  );
}
