'use client';

import { Box, Container, type SxProps } from '@assetforce/material';

import { AuthFooter } from '../components/AuthFooter';
import { AuthHeader } from '../components/AuthHeader';
import type { BrandConfig } from '../themes';

export interface AuthLayoutProps {
  /** Page content */
  children: React.ReactNode;

  /** Brand configuration */
  brand?: BrandConfig;

  /** Show logo in header (default: true) */
  showLogo?: boolean;

  /** Container max width (default: 'sm') */
  maxWidth?: 'xs' | 'sm' | 'md';

  /** Custom sx props for root container */
  sx?: SxProps;
}

/**
 * AuthLayout - Main layout wrapper for authentication pages
 *
 * Provides consistent structure:
 * - Full-height centered container
 * - Optional header with logo/brand
 * - Page content
 * - Optional footer with "Powered by" text
 *
 * @example
 * <AuthLayout brand={{ name: "My App", logo: "/logo.png" }}>
 *   <AuthCard>...</AuthCard>
 * </AuthLayout>
 */
export function AuthLayout({ children, brand, showLogo = true, maxWidth = 'sm', sx }: AuthLayoutProps) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        py: 4,
        ...sx,
      }}
    >
      <Container maxWidth={maxWidth}>
        {showLogo && <AuthHeader brand={brand} />}
        {children}
        <AuthFooter brand={brand} />
      </Container>
    </Box>
  );
}
