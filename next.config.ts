import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Every page reads the Supabase auth cookie (the header reflects login state), so
  // routes are dynamic by nature and the prerender-first model doesn't apply here.
  cacheComponents: false,
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
