/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    appDir: true,
    serverComponentsExternalPackages: ['shiki', 'vscode-oniguruma'],
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
      afterFiles: [
        {
          source: '/assets/og-image/:category(posts|offtopic)/:slug.png',
          destination:
            '/_next/image?url=https://timomeh.de/api/og?slug=:slug&category=:category&w=1200&q=100',
        },
        {
          source: '/:type(posts|offtopic)/feed.:format(rss|atom|json)',
          destination: '/api/feed?format=:format&type=:type',
        },
        {
          source: '/:page(about|datenschutz|feeds|impressum)',
          destination: '/static/:page',
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
        source: '/static/:page',
        destination: '/:page',
        permanent: true,
      },
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
