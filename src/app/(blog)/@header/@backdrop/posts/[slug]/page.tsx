import { HeaderBackdropEmpty } from '@/comps/header-backdrop-empty'
import { HeaderBackdropImage } from '@/comps/header-backdrop-image'
import { contentAsset } from '@/data/cms'
import { getPost } from '@/data/posts'

type Props = {
  params: Promise<{ slug: string }>
}

export default async function Page(props: Props) {
  const params = await props.params
  const post = await getPost(params.slug)

  return (
    <>
      {post?.frontmatter.lightCover ? (
        <HeaderBackdropImage
          lightSrc={contentAsset(
            'posts',
            post.slug,
            post.frontmatter.lightCover,
          )}
          darkSrc={
            post.frontmatter.darkCover
              ? contentAsset('posts', post.slug, post.frontmatter.darkCover)
              : undefined
          }
        />
      ) : (
        <HeaderBackdropEmpty />
      )}
      {post?.frontmatter.lightBgColor && (
        <div
          style={{ background: post?.frontmatter.lightBgColor }}
          className="absolute inset-0 -z-10 mix-blend-multiply dark:hidden"
        />
      )}
      {post?.frontmatter.darkBgColor && (
        <div
          style={{ background: post?.frontmatter.darkBgColor }}
          className="absolute inset-0 -z-10 hidden mix-blend-exclusion dark:block"
        />
      )}
    </>
  )
}
