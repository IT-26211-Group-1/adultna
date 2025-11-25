/** @type {import('next').NextConfig} */
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
            default: false,
            vendors: false,
            framework: {
              name: 'framework',
              chunks: 'all',
              test: /[\\/]node_modules[\\/](react|react-dom|scheduler|next)[\\/]/,
              priority: 40,
              enforce: true,
            },
            lib: {
              test: /[\\/]node_modules[\\/]/,
              name(module) {
                const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
                return `npm.${packageName.replace('@', '')}`;
              },
              priority: 30,
              minChunks: 1,
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

export default nextConfig;
