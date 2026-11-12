import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Content is served from a mutable JSON store that editors change at
   * any time through the admin dashboard, so pages render per-request
   * rather than through the experimental static cache-components model. */
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
