import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  transpilePackages: ['@assetforce/material', '@assetforce/graphql', '@assetforce/authentication'],
};

export default nextConfig;
