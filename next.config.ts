import withPlaiceholder from '@plaiceholder/next'
import { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // bypasses the file-system-cache's 2MB limit
  cacheHandler: require.resolve('./dist/cache-handler.js'),
  cacheMaxMemorySize: 0,

  experimental: {
    viewTransition: true,
  },

  output: 'standalone',
  outputFileTracingIncludes: {
    './**/*': [
      // required so that @libsql's pre-built binaries are included
      './node_modules/@libsql/darwin*/**/*',
      './node_modules/@libsql/linux*/**/*',
    ],
  },

  poweredByHeader: false,
  compress: false,

  images: {
    minimumCacheTTL: 31536000,
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
        source: '/:path*',
        has: [{ type: 'host', value: 'www.timomeh.de' }],
        destination: 'https://timomeh.de/:path*',
        permanent: true,
      },
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
        source: '/page/:num*',
        destination: '/',
        permanent: true,
      },
      {
        source: '/tag/:tag/page/:num*',
        destination: '/tag/:tag',
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
