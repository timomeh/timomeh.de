import withPlaiceholder from '@plaiceholder/next'

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'user-images.githubusercontent.com',
        pathname: '/4227520/**',
      },
      {
        protocol: 'https',
        hostname: 'github.com',
        pathname: '/timomeh/timomeh.de/assets/4227520/**',
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
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: cspHeader.replace(/\n/g, ''),
          },
        ],
      },
    ]
  },
}

const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline';
  style-src 'self' 'unsafe-inline';
  img-src 'self' blob: data:;
  font-src 'self';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  upgrade-insecure-requests;
`

export default withPlaiceholder(nextConfig)
