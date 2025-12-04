import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  transpilePackages: ['@assetforce/material', '@assetforce/graphql'],
};

export default nextConfig;
