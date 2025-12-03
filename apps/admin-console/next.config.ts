import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@assetforce/ui", "@assetforce/config", "@assetforce/graphql"],
};

export default nextConfig;
