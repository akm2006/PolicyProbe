import path from "node:path";
import { fileURLToPath } from "node:url";
import { createMDX } from "fumadocs-mdx/next";

const root = path.dirname(fileURLToPath(import.meta.url));

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  // Keep Turbopack's workspace root scoped to this app.
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
