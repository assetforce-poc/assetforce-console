'use client';

import { Box, Typography } from '@assetforce/material';

import type { BrandConfig } from '../themes';
import { defaultBrandConfig } from '../themes';

export interface AuthHeaderProps {
  /** Brand configuration */
  brand?: BrandConfig;
}

/**
 * AuthHeader - Authentication page header with logo and brand name
 *
 * @example
 * <AuthHeader brand={{ name: "My App", logo: "/logo.png", logoSize: "lg" }} />
 */
export function AuthHeader({ brand }: AuthHeaderProps) {
  const config = { ...defaultBrandConfig, ...brand };

  const logoSizeMap: Record<'sm' | 'md' | 'lg', number> = {
    sm: 40,
    md: 56,
    lg: 72,
  };

  return (
    <Box sx={{ textAlign: 'center', mb: 4 }}>
      {/* Logo */}
      {typeof config.logo === 'string' ? (
        <Box
          component="img"
          src={config.logo}
          alt={config.name}
          sx={{
            height: logoSizeMap[config.logoSize as keyof typeof logoSizeMap],
            mb: 2,
          }}
        />
      ) : (
        <Box sx={{ fontSize: logoSizeMap[config.logoSize as keyof typeof logoSizeMap], mb: 2 }}>{config.logo}</Box>
      )}

      {/* Brand name */}
      <Typography variant="h5" component="div" fontWeight={600}>
        {config.name}
      </Typography>
    </Box>
  );
}
