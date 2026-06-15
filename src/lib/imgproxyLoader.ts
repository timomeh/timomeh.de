import { generateUrl } from '@imgproxy/imgproxy-js-core'

import { getEnv } from '@/env'

export default function imgproxyLoader({
  src,
  width,
  quality,
  internal,
}: {
  src: string
  width?: number
  quality?: number
  internal?: boolean
}) {
  const imgproxyUrl = getEnv('IMAGE_PROXY_PUBLIC_URL')
  const imgproxyInternalUrl = getEnv('IMAGE_PROXY_PRIVATE_URL')

  if (!src.startsWith(getEnv('CONTENT_PROXY_PRIVATE_URL'))) {
    return src
  }

  // when imgproxy is deployed within the same network, allow to make
  // an internal request
  let proxyUrl = imgproxyUrl
  if (internal && imgproxyInternalUrl) {
    proxyUrl = imgproxyInternalUrl
  }

  const escapedSrc = src
    .replace('%', '%25')
    .replace('?', '%3F')
    .replace('@', '%40')

  const path = generateUrl(
    { value: escapedSrc, type: 'plain' },
    { width, quality },
  )

  return `${proxyUrl}/unsafe${path}`
}
