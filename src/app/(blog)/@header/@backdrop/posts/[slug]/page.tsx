import { Suspense } from 'react'

import { HeaderBackdropEmpty } from '@/comps/header-backdrop-empty'
import { HeaderBackdropImage } from '@/comps/header-backdrop-image'
import { contentAsset } from '@/data/cms'
import { getPostBySlug } from '@/data/posts'

type Props = {
  params: Promise<{ slug: string }>
}

export default async function Page(props: Props) {
  const params = await props.params
  const post = await getPostBySlug(params.slug)

  return (
    <>
      {post?.lightCover || post?.darkCover ? (
        <Suspense
          fallback={
            <div className="-mb-36 aspect-[3/2] h-auto max-h-[500px] min-h-[300px] w-full max-w-[1024px]" />
          }
        >
          <HeaderBackdropImage
            lightSrc={
              post.lightCover
                ? contentAsset('posts', post.slug, post.lightCover)
                : undefined
            }
            darkSrc={
              post.darkCover
                ? contentAsset('posts', post.slug, post.darkCover)
                : undefined
            }
          />
        </Suspense>
      ) : (
        <HeaderBackdropEmpty />
      )}
      {post?.lightBgColor && (
        <div
          style={{ background: post?.lightBgColor }}
          className="absolute inset-0 -z-10 mix-blend-multiply dark:hidden"
        />
      )}
      {post?.darkBgColor && (
        <div
          style={{ background: post?.darkBgColor }}
          className="absolute inset-0 -z-10 hidden mix-blend-exclusion dark:block"
        />
      )}
    </>
  )
}

export async function generateStaticParams() {
  return []
}
