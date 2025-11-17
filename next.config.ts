import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "example.com",
      },
    ],
  },



  experimental: {
    serverActions: {
      bodySizeLimit: "10mb", // eller "5mb", "20mb", etc.
    },
  },
};

export default nextConfig;
