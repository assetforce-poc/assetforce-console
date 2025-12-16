import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  transpilePackages: ['@assetforce/material', '@assetforce/graphql', '@assetforce/authentication', '@assetforce/auth-ui'],
};

export default nextConfig;
