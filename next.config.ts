import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
       allowedOrigins: ["localhost:3000", "192.168.0.139:3000"],
    },
    // Fix for "Cross origin request detected" during local network testing
    allowedDevOrigins: ["localhost:3000", "192.168.0.139:3000"],
  },
};

export default nextConfig;
