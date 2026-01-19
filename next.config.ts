import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/creator/dashboard',
        destination: '/creator/offers',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
