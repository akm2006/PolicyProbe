import path from "node:path";
import { fileURLToPath } from "node:url";
import { createMDX } from "fumadocs-mdx/next";

const root = path.dirname(fileURLToPath(import.meta.url));

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  // Pin the workspace root to web/ so the stray root package-lock.json isn't picked up.
  turbopack: {
    root,
  },
  async redirects() {
    return [{ source: "/docs/recipe-spec", destination: "/docs/recipe-reference", permanent: true }];
  },
};

// Fumadocs MDX is ESM-only, hence .mjs.
const withMDX = createMDX();

export default withMDX(config);
