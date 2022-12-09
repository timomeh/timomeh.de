/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    appDir: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'timomeh.de',
        pathname: '/api/og-image',
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
            '/_next/image?url=https://timomeh.de/api/og-image?slug=:slug&w=1200&q=100',
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
    ]
  },
}

module.exports = nextConfig
