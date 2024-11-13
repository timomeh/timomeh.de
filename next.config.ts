import withPlaiceholder from '@plaiceholder/next'
import { NextConfig } from 'next'

const nextConfig: NextConfig = {
  cacheHandler: require.resolve(
    'next/dist/server/lib/incremental-cache/file-system-cache.js',
  ),
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'timomeh.de',
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
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.timomeh.de' }],
        destination: 'https://timomeh.de/:path*',
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
