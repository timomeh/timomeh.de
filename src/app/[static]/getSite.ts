import { NextSeoProps } from 'next-seo'
import * as impressum from './impressum'
import * as datenschutz from './datenschutz'
import * as about from './about'
import * as feeds from './feeds'

const sites = {
  impressum,
  datenschutz,
  about,
  feeds,
} as Record<string, { body: string; head: NextSeoProps }>

export async function getSite(path: string) {
  return sites[path]
}
