// ...existing content from 混淆产物/next.config.mjs...import { withBundleAnalyzer } from '@next/bundle-analyzer';

export default withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
  i18n: {
    locales: ['en', 'zh'],
    defaultLocale: 'zh'
  }
});
