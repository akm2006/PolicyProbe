import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Pin the workspace root to web/ so the stray root package-lock.json isn't picked up.
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
