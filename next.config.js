/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    appDir: true,
    esmExternals: 'loose',
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
      beforeFiles: [
        {
          source: '/assets/og-image/:category(posts|offtopic|static)/:slug.png',
          destination:
            '/_next/image?url=https://timomeh.de/api/og%3Fslug=:slug%26category=:category%26v=2&w=1200&q=100',
        },
      ],
    }
    // This SHOULD work but: https://github.com/vercel/next.js/issues/40549
    // {
    //   source: '/posts',
    //   destination: '/posts/page/1',
    // },
    // {
    //   source: '/offtopic',
    //   destination: '/offtopic/page/1',
    // },
    // {
    //   source: '/',
    //   destination: '/offtopic/page/1',
    // },
  },
  async redirects() {
    return [
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
