/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    esmExternals: 'loose',
    serverComponentsExternalPackages: ['shiki', 'vscode-oniguruma'],
  },
  images: {
    remotePatterns: [
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
        source: '/posts/page/1',
        destination: '/posts',
        permanent: true,
      },
      {
        source: '/offtopic/page/1',
        destination: '/',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
