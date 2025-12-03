import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  transpilePackages: ["@assetforce/ui", "@assetforce/config", "@assetforce/graphql"],
};

export default nextConfig;
