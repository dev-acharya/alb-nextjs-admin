import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // your existing images config unchanged...
    domains: [
      'images.unsplash.com',
      'unsplash.com',
      'utfs.io',
      'alb-web-assets.s3.ap-south-1.amazonaws.com',
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'utfs.io',
      },
      {
        protocol: 'https',
        hostname: 'alb-web-assets.s3.ap-south-1.amazonaws.com',
        pathname: '/**',
      },
    ],
    formats: ['image/webp'],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  async headers() {
    return [
      {
        source: '/firebase-messaging-sw.js',
        headers: [
          {
            key: 'Service-Worker-Allowed',
            value: '/',
          },
          {
            key: 'Content-Type',
            value: 'application/javascript; charset=utf-8',
          },
        ],
      },
    ];
  },

  // ✅ ADD THIS PROXY REWRITES
  async rewrites() {
    return [
      {
        source: '/api/:path*',  // Frontend calls: /api/admin/login
        destination: `${process.env.API_URL}/api/:path*`
      }
    ];
  },

  experimental: {
    optimizeCss: true,
  },
};

export default nextConfig;
