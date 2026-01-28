import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const allowedDevOrigins: string[] = [];
const allowedDevOriginsEnv = process.env.ALLOWED_DEV_ORIGINS;

if (allowedDevOriginsEnv) {
  allowedDevOrigins.push(
    ...allowedDevOriginsEnv
      .split(",")
      .map((origin) => origin.trim())
      .filter(Boolean)
  );
}

if (process.env.APP_URL) {
  try {
    allowedDevOrigins.push(new URL(process.env.APP_URL).origin);
  } catch {
    // Ignore invalid APP_URL values.
  }
}

const nextConfig: NextConfig = {
  ...(allowedDevOrigins.length ? { allowedDevOrigins } : {}),
  images: {
    // Allow loading images from specific remote domains
    remotePatterns: [
      {
        protocol: "https", // Only allow HTTPS protocol
        hostname: "lh3.googleusercontent.com", // Allow Google user content images
      },
      {
        protocol: "https", // Only allow HTTPS protocol
        hostname: "avatars.githubusercontent.com", // Allow GitHub avatar images
      },
      {
        protocol: 'https',
        // This pattern allows any hostname from Vercel's Blob storage.
        hostname: '**.public.blob.vercel-storage.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

const config = withNextIntl(nextConfig) as NextConfig & {
  experimental?: { turbo?: { resolveAlias?: Record<string, string> } };
  turbopack?: { resolveAlias?: Record<string, string> };
};

// next-intl sets experimental.turbo for Turbopack; move to config.turbopack to avoid deprecation warnings.
if (config.experimental?.turbo?.resolveAlias) {
  config.turbopack = {
    ...(config.turbopack ?? {}),
    resolveAlias: {
      ...(config.turbopack?.resolveAlias ?? {}),
      ...config.experimental.turbo.resolveAlias,
    },
  };

  config.experimental = { ...config.experimental };
  delete config.experimental.turbo;
  if (Object.keys(config.experimental).length === 0) {
    delete config.experimental;
  }
}

export default config;
