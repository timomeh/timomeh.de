import { generateUrl } from '@imgproxy/imgproxy-js-core'

const imgproxyUrl =
  process.env.NEXT_PUBLIC_IMGPROXY_URL || 'https://images.timomeh.de'
const imgproxyInternalUrl = process.env.IMGPROXY_INTERNAL_URL

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
  if (!src.startsWith('http://github-content-proxy.railway.internal')) {
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
