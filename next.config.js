/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
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
      ],
    }
  },
}

module.exports = nextConfig
