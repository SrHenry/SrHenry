import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const isStaticExport = process.env.BUILD_TARGET === "static";

const nextConfig: NextConfig = {
  output: isStaticExport ? "export" : undefined,
  images: {
    unoptimized: isStaticExport,
    remotePatterns: [
      { protocol: "https", hostname: "**.gravatar.com" },
      { protocol: "https", hostname: "**.githubusercontent.com" },
      { protocol: "https", hostname: "github-profile-trophy.vercel.app" },
    ],
  },
  turbopack: {
    resolveAlias: {
      "next-intl/config": "./src/i18n/request.ts",
    },
  },
  reactStrictMode: true,
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || undefined,
};

export default createNextIntlPlugin()(nextConfig);
