const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Provide a stable build id
  generateBuildId: () => 'pph-static-id',

  // Support "@/..." imports via alias in webpack resolve
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src'),
    };
    return config;
  },

  // Skip ESLint during production builds
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Ensure TypeScript errors don't block builds
  typescript: {
    ignoreBuildErrors: false,
  },
};

module.exports = nextConfig;