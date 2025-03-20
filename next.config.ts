import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["@chakra-ui/react"],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'kfofo-api-production.up.railway.app',
        port: '8080',
        pathname: '/home/picture'
      }
    ]
  }
};

export default nextConfig;
