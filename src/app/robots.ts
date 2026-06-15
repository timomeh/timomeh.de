import type { MetadataRoute } from 'next'

import { getEnv } from '@/env'

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [],
        crawlDelay: 3,
      },
      {
        userAgent: [
          'Twitterbot',
          'AdsBot-Google',
          'Amazonbot',
          'Applebot',
          'AwarioRssBot',
          'AwarioSmartBot',
          'Bytespider',
          'CCBot',
          'cohere-ai',
          'DataForSeoBot',
          'FacebookBot',
          'Google-Extended',
          'GoogleOther',
          'GPTBot',
          'ImagesiftBot',
          'magpie-crawler',
          'omgili',
          'omgilibot',
          'peer39_crawler',
          'peer39_crawler/1.0',
          'YouBot',
        ],
        disallow: '*',
      },
    ],
    sitemap: `${getEnv('SITE_PUBLIC_URL')}/sitemap.xml`,
  } satisfies MetadataRoute.Robots
}
