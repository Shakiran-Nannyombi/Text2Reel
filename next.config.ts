import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.scdn.co', // Spotify album art
        pathname: '/**',
      },
    ],
  },
  output: 'standalone',
  // Ensure Tailwind 4 process correctly by ignoring some fallback CSS restrictions
  webpack: (config) => {
    config.resolve.fallback = { fs: false, path: false };
    return config;
  },
  turbopack: {}, // explicitly disable/acknowledge Turbopack conflict
};

export default nextConfig;
