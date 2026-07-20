import type { NextConfig } from "next";
import withBundleAnalyzer from "@next/bundle-analyzer";

const nextConfig: NextConfig = {
  // Compress assets using gzip/brotli
  compress: true,
  // Disable x-powered-by header for slight security/bandwidth improvement
  poweredByHeader: false,
  // Ensure strict mode for better performance/caching behavior in React 19
  reactStrictMode: true,
};

const withAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

export default withAnalyzer(nextConfig);
