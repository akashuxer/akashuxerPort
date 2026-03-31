import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    /** Tree-shake framer-motion entry (lucide-react is optimized by default in Next 16). */
    optimizePackageImports: ["framer-motion"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
