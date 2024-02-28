import { Metadata } from 'next'

import * as about from './about'
import * as datenschutz from './datenschutz'
import * as feeds from './feeds'
import * as impressum from './impressum'

const sites = {
  impressum,
  datenschutz,
  about,
  feeds,
} as Record<string, { body: string; head: Metadata }>

export async function getSite(path: string) {
  return sites[path]
}
