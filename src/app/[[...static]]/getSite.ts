import { NextSeoProps } from 'next-seo'
import * as imprint from './imprint'
import * as privacy from './privacy-policy'
import * as about from './about'

const sites = {
  imprint,
  about,
  'privacy-policy': privacy,
} as Record<string, { body: string; head: NextSeoProps }>

export async function getSite(segments: string[]) {
  return sites[segments.join('/')]
}
