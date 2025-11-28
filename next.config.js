/** @type {import('next').NextConfig} */
import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig = {
  // Static export for S3 hosting
  output: "export",
  trailingSlash: true,

  // Generate consistent build ID for cache busting
  generateBuildId: async () => {
    return `build-${Date.now()}`;
  },

  // Images must be unoptimized for static export (no Image Optimization API)
  images: {
    unoptimized: true,
  },

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
      "framer-motion",
      "react-pdf",
      "date-fns",
      "@googlemaps/js-api-loader",
    ],
    webpackMemoryOptimizations: true,
  },

  // Production optimizations
  productionBrowserSourceMaps: false,

  // Compiler optimizations
  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production"
        ? {
            exclude: ["error", "warn"],
          }
        : false,
  },

  // Webpack optimizations
  webpack: (config, { dev, isServer }) => {
    if (!dev) {
      config.optimization = {
        ...config.optimization,
        moduleIds: "deterministic",
        runtimeChunk: {
          name: (entrypoint) => `runtime-${entrypoint.name}`,
        },
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            // Framework essentials (React, Next.js) - load everywhere
            framework: {
              name: 'framework',
              test: /[\\/]node_modules[\\/](react|react-dom|scheduler|next)[\\/]/,
              priority: 50,
              enforce: true,
              reuseExistingChunk: true,
            },

            // 3D/Graphics libraries - ONLY for roadmap route
            graphics3d: {
              name: 'graphics3d',
              test: /[\\/]node_modules[\\/](@splinetool|three|@react-three|@react-spring\/three)[\\/]/,
              priority: 40,
              enforce: true,
              reuseExistingChunk: true,
            },

            // Markdown libraries - ONLY for AI Gabay route
            markdown: {
              name: 'markdown',
              test: /[\\/]node_modules[\\/](react-markdown|remark-gfm|remark|unified|micromark)[\\/]/,
              priority: 40,
              enforce: true,
              reuseExistingChunk: true,
            },

            // PDF libraries - ONLY for filebox/resume routes
            pdfLibs: {
              name: 'pdf-libs',
              test: /[\\/]node_modules[\\/](pdfjs-dist|react-pdf)[\\/]/,
              priority: 40,
              enforce: true,
              reuseExistingChunk: true,
            },

            // Animation libraries - route-specific
            animations: {
              name: 'animations',
              test: /[\\/]node_modules[\\/](framer-motion|gsap|lottie-react)[\\/]/,
              priority: 40,
              enforce: true,
              reuseExistingChunk: true,
            },

            // AWS SDK - ONLY for features using it
            aws: {
              name: 'aws-sdk',
              test: /[\\/]node_modules[\\/]@aws-sdk[\\/]/,
              priority: 40,
              enforce: true,
              reuseExistingChunk: true,
            },

            // UI library (HeroUI, NextUI)
            uiFramework: {
              name: 'ui-framework',
              test: /[\\/]node_modules[\\/](@heroui|@nextui-org)[\\/]/,
              priority: 35,
              enforce: true,
              reuseExistingChunk: true,
            },

            // TanStack Query - used globally
            reactQuery: {
              name: 'react-query',
              test: /[\\/]node_modules[\\/]@tanstack[\\/]/,
              priority: 35,
              enforce: true,
              reuseExistingChunk: true,
            },

            // Everything else - common vendor code
            commons: {
              name: 'commons',
              test: /[\\/]node_modules[\\/]/,
              priority: 20,
              minChunks: 2,
              reuseExistingChunk: true,
            },
          },
        },
      };
    }

    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }

    return config;
  },

  eslint: {
    ignoreDuringBuilds: true,
  },

  // Development-only rewrites for API proxying
  async rewrites() {
    if (process.env.NODE_ENV !== "development") {
      return [];
    }

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
};

export default withBundleAnalyzer(nextConfig);
