import withPlaiceholder from '@plaiceholder/next'
import { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // bypasses the file-system-cache's 2MB limit
  cacheHandler: require.resolve(
    'next/dist/server/lib/incremental-cache/file-system-cache.js',
  ),

  experimental: {
    viewTransition: true,
  },

  output: 'standalone',
  poweredByHeader: false,
  compress: false,

  images: {
    minimumCacheTTL: 31536000,
    remotePatterns: [
      {
        protocol: new URL(process.env.SITE_URL!).protocol.slice(0, -1) as
          | 'http'
          | 'https',
        hostname: new URL(process.env.SITE_URL!).hostname,
        port: new URL(process.env.SITE_URL!).port,
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
      },
    ],
  },

  async rewrites() {
    return [
      { source: '/posts/feed.rss', destination: '/feeds/rss' },
      { source: '/posts/feed.atom', destination: '/feeds/atom' },
      { source: '/posts/feed.json', destination: '/feeds/json' },
    ]
  },

  async redirects() {
    return [
      {
        source: '/offtopic/feed.atom',
        destination: '/posts/feed.atom',
        permanent: true,
      },
      {
        source: '/offtopic/feed.json',
        destination: '/posts/feed.json',
        permanent: true,
      },
      {
        source: '/offtopic/feed.rss',
        destination: '/posts/feed.rss',
        permanent: true,
      },
      {
        source: '/posts',
        destination: '/',
        permanent: true,
      },
      {
        source: '/posts/page/:num*',
        destination: '/',
        permanent: true,
      },
      {
        source: '/offtopic',
        destination: '/',
        permanent: true,
      },
      {
        source: '/offtopic/page/:num*',
        destination: '/',
        permanent: true,
      },
      {
        source: '/offtopic/:slug*',
        destination: '/posts/:slug*',
        permanent: true,
      },
    ]
  },

  logging: {
    fetches: {
      fullUrl: true,
    },
  },
}

export default withPlaiceholder(nextConfig)
