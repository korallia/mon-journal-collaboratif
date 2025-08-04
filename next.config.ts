// next.config.ts
import withPWA from 'next-pwa'

// Configuration PWA avec buildExcludes
const pwaConfig = {
  dest: 'public',
  register: true,
  skipWaiting: false,
  disable: process.env.NODE_ENV === 'development',
 buildExcludes: [
  /\.json$/      // ignore **tous** les .json internes
]
}

const nextConfig = {
  reactStrictMode: true,
  // i18n: { locales: ['en'], defaultLocale: 'en' }, // si besoin
}

export default process.env.NODE_ENV === 'production'
  ? withPWA(pwaConfig)(nextConfig)
  : nextConfig
