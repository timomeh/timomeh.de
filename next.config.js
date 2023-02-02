/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    appDir: true,
    esmExternals: 'loose',
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'timomeh.de',
        pathname: '/api/og',
      },
      {
        protocol: 'https',
        hostname: 'user-images.githubusercontent.com',
        pathname: '/4227520/**',
      },
    ],
  },
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/assets/og-image/posts/:slug.png',
          destination:
            '/_next/image?url=https://timomeh.de/api/og?slug=:slug&w=1200&q=100',
        },
        {
          source: '/posts/feed.atom',
          destination: '/api/feed?format=atom',
        },
        {
          source: '/posts/feed.rss',
          destination: '/api/feed?format=rss',
        },
        {
          source: '/posts/feed.json',
          destination: '/api/feed?format=json',
        },
        {
          source: '/posts',
          destination: '/posts/page/1',
        },
        {
          source: '/offtopic',
          destination: '/offtopic/page/1',
        },
        {
          source: '/',
          destination: '/offtopic/page/1',
        },
      ],
    }
  },
  async redirects() {
    return [
      {
        source: '/posts/feed',
        destination: '/posts/feed.atom',
        permanent: true,
      },
      {
        source: '/feed',
        destination: '/posts/feed.atom',
        permanent: false,
      },
      {
        source: '/posts/page/1',
        destination: '/posts',
        permanent: true,
      },
      {
        source: '/offtopic/page/1',
        destination: '/offtopic',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
