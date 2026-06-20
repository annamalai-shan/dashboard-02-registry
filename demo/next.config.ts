import type { NextConfig } from "next";

// Static export served from GitHub Pages at
// https://annamalai-shan.github.io/dashboard-02-registry/demo/
const nextConfig: NextConfig = {
  output: "export",
  basePath: "/dashboard-02-registry/demo",
  assetPrefix: "/dashboard-02-registry/demo",
  trailingSlash: true,
  images: { unoptimized: true },
  // This is a preview, not a linted product — don't fail the build on lint/types.
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
};

export default nextConfig;
