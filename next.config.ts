import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
    ],
  },
};

export default nextConfig;