import { headers } from 'next/headers'
import Link from 'next/link'

import { Tag } from './tag'

export function BackTag() {
  const referer = headers().get('referer')
  const host = headers().get('host')?.replace(':3000', '')
  let backHref = '/'

  // if the referer was a tags page, go back there
  if (referer) {
    const url = new URL(referer)
    if (url.hostname === host && url.pathname.startsWith('/tag')) {
      backHref = url.pathname
    }
  }

  return (
    <Link href={backHref}>
      <Tag color="#DEC1EF" clickable name="← Back" />
    </Link>
  )
}
