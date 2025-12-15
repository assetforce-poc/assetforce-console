'use client';

import { Box, Link as MuiLink, Typography } from '@assetforce/material';

import type { BrandConfig } from '../themes';
import { defaultBrandConfig } from '../themes';

export interface AuthFooterProps {
  /** Brand configuration */
  brand?: BrandConfig;
}

/**
 * AuthFooter - Authentication page footer with "Powered by" text
 *
 * @example
 * <AuthFooter brand={{ poweredByText: "Powered by My Company", showPoweredBy: true }} />
 */
export function AuthFooter({ brand }: AuthFooterProps) {
  const config = { ...defaultBrandConfig, ...brand };

  if (!config.showPoweredBy) {
    return null;
  }

  return (
    <Box sx={{ textAlign: 'center', mt: 4 }}>
      <Typography variant="body2" color="text.secondary">
        {config.poweredByLink ? (
          <MuiLink
            href={config.poweredByLink}
            target="_blank"
            rel="noopener noreferrer"
            color="inherit"
            underline="hover"
          >
            {config.poweredByText}
          </MuiLink>
        ) : (
          config.poweredByText
        )}
      </Typography>
    </Box>
  );
}
