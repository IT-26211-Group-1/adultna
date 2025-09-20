/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // For local development with HTTPS
  ...(process.env.NODE_ENV === "development" && {
    output: undefined, // Remove export for dev server
  }),
};

export default nextConfig;
