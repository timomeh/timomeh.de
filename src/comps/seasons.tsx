import { ListObjectsV2Command, S3Client } from '@aws-sdk/client-s3'
import { memoize } from 'nextjs-better-unstable-cache'
import { Suspense } from 'react'
import { config } from '../config'
import { getPlaceholder } from '../lib/placeholder'
import { FadeInImage } from './fade-in-image'

export async function Seasons() {
  const imageSrcs = await imageSrcCache()

  return (
    <div className="absolute -z-10 h-full w-full select-none">
      {imageSrcs.lightSrc && (
        <div className="dark:hidden">
          <Suspense fallback={<div />}>
            <Cover
              src={`s3://${config.buckets.generatedImages.bucket}/${imageSrcs.lightSrc}`}
            />
          </Suspense>
        </div>
      )}
      {imageSrcs.darkSrc && (
        <div className="hidden dark:block">
          <Suspense fallback={<div />}>
            <Cover
              src={`s3://${config.buckets.generatedImages.bucket}/${imageSrcs.darkSrc}`}
            />
          </Suspense>
        </div>
      )}
    </div>
  )
}

async function Cover({ src }: { src: string }) {
  let cover: Awaited<ReturnType<typeof getPlaceholder>>

  try {
    cover = await getPlaceholder(src)
  } catch {
    return <div />
  }

  return (
    <div
      className="relative mx-auto block h-auto max-h-[800px]
            w-full max-w-[1100px] overflow-hidden
            [mask-image:linear-gradient(to_bottom,#000_95%,transparent_100%)]
            [mask-composite:intersect]
            lg:[mask-image:linear-gradient(to_bottom,#000_95%,transparent_100%),linear-gradient(to_left,#000_95%,transparent_100%),linear-gradient(to_right,#000_95%,transparent_100%)]"
      style={{
        aspectRatio: cover.img.width / cover.img.height,
      }}
    >
      <FadeInImage
        alt=""
        fill
        src={cover.img.src}
        sizes="(max-width: 1024px) 100vw, 1024px"
        className="h-auto w-full max-w-full object-contain object-bottom"
      />
    </div>
  )
}

const imageSrcCache = memoize(
  async () => {
    if (!config.buckets.generatedImages.bucket) {
      return { lightSrc: undefined, darkSrc: undefined }
    }

    const srcs = await getLatestSeasonImages()
    return srcs
  },
  {
    revalidateTags: ['season-images'],
    duration: 60 * 60 * 7, // 7 hours. webhook should come after 6 hours but better safe
  },
)

async function getLatestSeasonImages() {
  const [lightFiles, darkFiles] = await Promise.all([
    listSeasonFiles('seasons/light/'),
    listSeasonFiles('seasons/dark/'),
  ])

  const darkSrc = darkFiles.at(0)
  const lightSrc = lightFiles.at(0)

  return { darkSrc, lightSrc }
}

async function listSeasonFiles(prefix: string) {
  const Bucket = config.buckets.generatedImages.bucket

  const s3client = new S3Client({
    region: config.buckets.generatedImages.region,
    endpoint: config.buckets.generatedImages.endpoint,
    credentials: {
      accessKeyId: config.buckets.generatedImages.accessKeyId,
      secretAccessKey: config.buckets.generatedImages.secretAccessKey,
    },
  })

  const res = await s3client.send(
    new ListObjectsV2Command({
      Bucket,
      Prefix: prefix,
      Delimiter: '/',
    }),
  )

  const keys = (res.Contents || [])
    .map((obj) => obj.Key)
    .filter((key): key is string => !!key)

  const sorted = keys.sort((a, b) => {
    const numA = parseInt(a.replace(prefix, ''), 10)
    const numB = parseInt(b.replace(prefix, ''), 10)
    return numB - numA
  })

  return sorted
}
