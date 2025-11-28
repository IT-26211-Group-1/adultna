/** @type {import('next').NextConfig} */
import bundleAnalyzer from "@next/bundle-analyzer";
import Critters from "critters";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
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
    cssChunking: "strict",
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
  webpack: (config, { dev, isServer, webpack }) => {
    if (!dev && !isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        "core-js": false,
        "regenerator-runtime": false,
      };
    }

    if (!dev && !isServer) {
      // Add Critters plugin for critical CSS inlining
      const CrittersPlugin = class {
        apply(compiler) {
          compiler.hooks.compilation.tap("CrittersPlugin", (compilation) => {
            compilation.hooks.processAssets.tapAsync(
              {
                name: "CrittersPlugin",
                stage: webpack.Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE_SIZE,
              },
              async (assets, callback) => {
                const critters = new Critters({
                  path: compilation.options.output.path,
                  publicPath: "",
                  external: true,
                  inlineThreshold: 0,
                  minimumExternalSize: 0,
                  pruneSource: false,
                  mergeStylesheets: true,
                  additionalStylesheets: [],
                  preload: "media",
                  noscriptFallback: true,
                  inlineFonts: false,
                  preloadFonts: true,
                  fonts: false,
                  keyframes: "critical",
                  compress: true,
                  logLevel: "info",
                });

                const htmlAssets = Object.keys(assets).filter((filename) =>
                  filename.endsWith(".html")
                );

                for (const filename of htmlAssets) {
                  try {
                    const source = assets[filename].source();
                    const html =
                      typeof source === "string" ? source : source.toString();
                    const inlined = await critters.process(html);

                    compilation.updateAsset(
                      filename,
                      new webpack.sources.RawSource(inlined)
                    );
                  } catch (error) {
                    console.warn(
                      `Critters warning for ${filename}:`,
                      error.message
                    );
                  }
                }

                callback();
              }
            );
          });
        }
      };

      config.plugins.push(new CrittersPlugin());
    }

    if (!dev) {
      config.optimization = {
        ...config.optimization,
        moduleIds: "deterministic",
        runtimeChunk: {
          name: (entrypoint) => `runtime-${entrypoint.name}`,
        },
        splitChunks: {
          chunks: "all",
          cacheGroups: {
            // Framework essentials (React, Next.js) - load everywhere
            framework: {
              name: "framework",
              test: /[\\/]node_modules[\\/](react|react-dom|scheduler|next)[\\/]/,
              priority: 50,
              enforce: true,
              reuseExistingChunk: true,
            },

            // 3D/Graphics libraries - ONLY for roadmap route
            graphics3d: {
              name: "graphics3d",
              test: /[\\/]node_modules[\\/](@splinetool|three|@react-three|@react-spring\/three)[\\/]/,
              priority: 40,
              enforce: true,
              reuseExistingChunk: true,
            },

            // Markdown libraries - ONLY for AI Gabay route
            markdown: {
              name: "markdown",
              test: /[\\/]node_modules[\\/](react-markdown|remark-gfm|remark|unified|micromark)[\\/]/,
              priority: 40,
              enforce: true,
              reuseExistingChunk: true,
            },

            // PDF libraries - ONLY for filebox/resume routes
            pdfLibs: {
              name: "pdf-libs",
              test: /[\\/]node_modules[\\/](pdfjs-dist|react-pdf)[\\/]/,
              priority: 40,
              enforce: true,
              reuseExistingChunk: true,
            },

            // Animation libraries - route-specific
            animations: {
              name: "animations",
              test: /[\\/]node_modules[\\/](framer-motion|gsap|lottie-react)[\\/]/,
              priority: 40,
              enforce: true,
              reuseExistingChunk: true,
            },

            // AWS SDK - ONLY for features using it
            aws: {
              name: "aws-sdk",
              test: /[\\/]node_modules[\\/]@aws-sdk[\\/]/,
              priority: 40,
              enforce: true,
              reuseExistingChunk: true,
            },

            // UI library (HeroUI, NextUI)
            uiFramework: {
              name: "ui-framework",
              test: /[\\/]node_modules[\\/](@heroui|@nextui-org)[\\/]/,
              priority: 35,
              enforce: true,
              reuseExistingChunk: true,
            },

            // TanStack Query - used globally
            reactQuery: {
              name: "react-query",
              test: /[\\/]node_modules[\\/]@tanstack[\\/]/,
              priority: 35,
              enforce: true,
              reuseExistingChunk: true,
            },

            // Everything else - common vendor code
            commons: {
              name: "commons",
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
