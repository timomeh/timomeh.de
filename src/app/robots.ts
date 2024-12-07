import { config } from '@/config'
import { MetadataRoute } from 'next'

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
          'anthropic-ai',
          'Applebot',
          'AwarioRssBot',
          'AwarioSmartBot',
          'Bytespider',
          'CCBot',
          'ChatGPT-User',
          'ClaudeBot',
          'Claude-Web',
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
          'PerplexityBot',
          'YouBot',
        ],
        disallow: '*',
      },
    ],
    sitemap: `${config.siteUrl}/sitemap.xml`,
  } satisfies MetadataRoute.Robots
}
