/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",

  // Performance optimizations
  images: {
    unoptimized: false,
    formats: ["image/webp", "image/avif"],
    minimumCacheTTL: 31536000,
  },

  // Compression
  compress: true,

  // Bundle optimization
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ["@heroui/react", "lucide-react"],
  },

  // Security headers
  // async headers() {
  //   return [
  //     {
  //       source: '/(.*)',
  //       headers: [
  //         {
  //           key: 'X-Content-Type-Options',
  //           value: 'nosniff',
  //         },
  //         {
  //           key: 'X-Frame-Options',
  //           value: 'DENY',
  //         },
  //         {
  //           key: 'X-XSS-Protection',
  //           value: '1; mode=block',
  //         },
  //         {
  //           key: 'Referrer-Policy',
  //           value: 'strict-origin-when-cross-origin',
  //         },
  //         {
  //           key: 'Content-Security-Policy',
  //           value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.awswaf.com; style-src 'self' 'unsafe-inline'; font-src 'self' data:; img-src 'self' data: blob:; connect-src 'self' https://*.awswaf.com " + process.env.NEXT_PUBLIC_AUTH_SERVICE_URL + ";",
  //         },
  //       ],
  //     },
  //     {
  //       source: '/static/(.*)',
  //       headers: [
  //         {
  //           key: 'Cache-Control',
  //           value: 'public, max-age=31536000, immutable',
  //         },
  //       ],
  //     },
  //   ];
  // },

  eslint: {
    ignoreDuringBuilds: true,
  },

  ...(process.env.NODE_ENV === "development" && {
    output: undefined,
    images: {
      unoptimized: true,
    },
    async rewrites() {
      const apiUrl = process.env.NEXT_PUBLIC_API;

      if (apiUrl && apiUrl !== "undefined") {
        return [
          {
            source: "/api/:path*",
            destination: `${apiUrl}/auth/:path*`,
          },
        ];
      }

      return [];
    },
  }),
};

export default nextConfig;
