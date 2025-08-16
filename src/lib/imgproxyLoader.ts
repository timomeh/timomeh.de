import { generateUrl } from '@imgproxy/imgproxy-js-core'

const imgproxyUrl =
  process.env.NEXT_PUBLIC_IMGPROXY_URL || 'https://images.timomeh.de'

export default function imgproxyLoader({
  src,
  width,
  quality,
}: {
  src: string
  width?: number
  quality?: number
}) {
  if (!src.startsWith('http://github-content-proxy.railway.internal')) {
    return src
  }

  const escapedSrc = src
    .replace('%', '%25')
    .replace('?', '%3F')
    .replace('@', '%40')

  const path = generateUrl(
    { value: escapedSrc, type: 'plain' },
    { width, quality },
  )

  return `${imgproxyUrl}/unsafe${path}`
}
