import createNextIntlPlugin from 'next-intl/plugin';

// Next.js configuration with Turbopack compatibility and next-intl plugin
const nextConfig = {
  images: {},
  // Ensure Turbopack resolves next-intl correctly by aliasing the config path
  turbopack: {
    resolveAlias: {
      // Map the internal next-intl config import to our request configuration file
      'next-intl/config': './src/i18n/request.ts',
    },
  },
};

// Provide the plugin (no custom path needed since we set the alias manually)
export default createNextIntlPlugin()(nextConfig as any);



