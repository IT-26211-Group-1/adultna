/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export for S3 hosting
  output: "export",
  trailingSlash: true,

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
    if (dev && !isServer) {
      // Disable caching in development to prevent chunk loading errors
      config.cache = false;
    }

    if (!dev) {
      config.optimization = {
        ...config.optimization,
        moduleIds: "deterministic",
        runtimeChunk: {
          name: (entrypoint) => `runtime-${entrypoint.name}`,
        },
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
