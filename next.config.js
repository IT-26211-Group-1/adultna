/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,

  // Performance optimizations
  images: {
    unoptimized: true,
  },

  // Compression
  compress: true,

  // Bundle optimization
  experimental: {
    optimizeCss: true,
    optimizePackageImports: [
      "@heroui/react",
      "@heroui/modal",
      "@heroui/button",
      "@heroui/input",
      "@heroui/dropdown",
      "@heroui/navbar",
      "@heroui/toast",
      "lucide-react",
      "@tanstack/react-query",
    ],
  },

  // Reduce polyfills for modern browsers
  transpilePackages: [],

  // Production optimizations
  productionBrowserSourceMaps: false,

  // Minification and optimization
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production" ? {
      exclude: ["error", "warn"],
    } : false,
  },

  // Optimize CSS
  optimizeFonts: true,

  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        moduleIds: 'deterministic',
        runtimeChunk: 'single',
        splitChunks: {
          chunks: 'all',
          maxAsyncRequests: 30,
          maxInitialRequests: 30,
          cacheGroups: {
            default: false,
            vendors: false,
            framework: {
              name: 'framework',
              chunks: 'all',
              test: /(?<!node_modules.*)[\\/]node_modules[\\/](react|react-dom|scheduler|prop-types|use-subscription)[\\/]/,
              priority: 40,
              enforce: true,
            },
            lib: {
              test(module) {
                return (
                  module.size() > 160000 &&
                  /node_modules[/\\]/.test(module.identifier())
                );
              },
              name(module) {
                const hash = require('crypto').createHash('sha1');
                hash.update(module.identifier());
                return hash.digest('hex').substring(0, 8);
              },
              priority: 30,
              minChunks: 1,
              reuseExistingChunk: true,
            },
            three: {
              name: 'three',
              test: /[\\/]node_modules[\\/](three|@react-three|@splinetool)[\\/]/,
              priority: 25,
              reuseExistingChunk: true,
            },
            pdf: {
              name: 'pdf',
              test: /[\\/]node_modules[\\/](pdfjs-dist|react-pdf)[\\/]/,
              priority: 25,
              reuseExistingChunk: true,
            },
            animation: {
              name: 'animation',
              test: /[\\/]node_modules[\\/](framer-motion|gsap|@react-spring)[\\/]/,
              priority: 25,
              reuseExistingChunk: true,
            },
            heroui: {
              name: 'heroui',
              test: /[\\/]node_modules[\\/]@heroui[\\/]/,
              priority: 20,
              reuseExistingChunk: true,
            },
            tanstack: {
              name: 'tanstack',
              test: /[\\/]node_modules[\\/]@tanstack[\\/]/,
              priority: 20,
              reuseExistingChunk: true,
            },
            commons: {
              name: 'commons',
              minChunks: 2,
              priority: 10,
              reuseExistingChunk: true,
            },
          },
        },
      };
    }

    return config;
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/jobs/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=300, stale-while-revalidate=600',
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin-allow-popups',
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'unsafe-none',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.awswaf.com https://jsearch.p.rapidapi.com https://fonts.googleapis.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' data: https://fonts.gstatic.com",
              "img-src 'self' data: blob: https:",
              "connect-src 'self' https://*.awswaf.com https://jsearch.p.rapidapi.com https://*.execute-api.ap-southeast-1.amazonaws.com",
              "frame-ancestors 'self'",
            ].join('; '),
          },
        ],
      },
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin-allow-popups',
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'unsafe-none',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.awswaf.com https://jsearch.p.rapidapi.com https://fonts.googleapis.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' data: https://fonts.gstatic.com",
              "img-src 'self' data: blob: https:",
              "connect-src 'self' https://*.awswaf.com https://jsearch.p.rapidapi.com https://*.execute-api.ap-southeast-1.amazonaws.com",
              "frame-ancestors 'self'",
            ].join('; '),
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  eslint: {
    ignoreDuringBuilds: true,
  },

  ...(process.env.NODE_ENV === "development" && {
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
