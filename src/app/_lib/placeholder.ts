import { unstable_cache } from 'next/cache'
import { getPlaiceholder } from 'plaiceholder'
import { cache } from 'react'

export const getPlaceholder = cache((src: string) => {
  const cacheFn = unstable_cache(
    () => getPlaceholderUncached(src),
    [`getPlaceholderUncached/${src}`],
  )

  return cacheFn()
})

async function getPlaceholderUncached(src: string) {
  const res = await fetch(src, { cache: 'no-store' })
  const buffer = Buffer.from(await res.arrayBuffer())

  const {
    metadata: { height, width },
    ...plaiceholder
  } = await getPlaiceholder(buffer, { size: 10 })

  return { css: plaiceholder.css, img: { src, height, width } }
}
