/** Next.js config (function export) to ensure generateBuildId is a function in loaded config */
const path = require('path');

/**
 * Export a function so Next's config loader always receives a resolved object,
 * guaranteeing generateBuildId is a function at runtime.
 */
module.exports = (_phase, _opts) => {
  const cfg = {
    // Stable build id to satisfy Next 14 build pipeline; avoids calling fallback when undefined
    generateBuildId() {
      return 'pph-static-id';
    },

    // Support "@/..." imports via alias in webpack resolve
    webpack: (config) => {
      config.resolve = config.resolve || {};
      config.resolve.alias = {
        ...(config.resolve.alias || {}),
        // Legacy alias needed for Next 14 builds (internal path changed across versions)
        'next/dist/server/web/exports/next-response': require.resolve(
          'next/dist/server/web/spec-extension/response.js'
        ),
        'next/dist/server/web/exports/next-response.js': require.resolve(
          'next/dist/server/web/spec-extension/response.js'
        ),
        // Ensure TS path alias works at runtime
        '@': path.resolve(__dirname, 'src'),
      };
      return config;
    },
  };

  // Minimal one-time diagnostic to verify Next sees our function during build
  if (process.env.NODE_ENV === 'production') {
    console.log('[next.config.js] generateBuildId type:', typeof cfg.generateBuildId);
  }

  return cfg;
};