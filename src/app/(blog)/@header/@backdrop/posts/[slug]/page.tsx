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
      {post?.lightCover ? (
        <HeaderBackdropImage
          lightSrc={contentAsset('posts', post.slug, post.lightCover)}
          darkSrc={
            post.darkCover
              ? contentAsset('posts', post.slug, post.darkCover)
              : undefined
          }
        />
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
