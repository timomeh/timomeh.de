import { PostEyebrow } from '@/app/(blog)/post-eyebrow'
import { PageFooter } from '@/comps/layout/page-footer'
import { PageMain } from '@/comps/layout/page-main'
import { PageNav } from '@/comps/layout/page-nav'
import { PageNavBack } from '@/comps/layout/page-nav-back'
import { Lightbox } from '@/comps/lightbox'
import { MDX } from '@/comps/mdx/mdx'
import { Prose } from '@/comps/prose'

import { PostMetadata, ShowPost } from './data'

type Props = {
  params: Promise<{ slug: string }>
}

export default async function Page(props: Props) {
  const { slug } = await props.params
  const { post, assetPrefix } = await ShowPost.invoke(slug)

  return (
    <>
      <PageNav>
        <PageNavBack href="/" />
      </PageNav>
      <PageMain>
        <article
          lang={post.metaLang?.split('_')[0]}
          className="relative"
          data-landmark="content-page"
        >
          <div className="mx-auto max-w-2xl p-4 !py-12 sm:p-6 md:p-8">
            <div className="mb-3">
              <PostEyebrow post={post} />
            </div>
            <Prose>
              <Lightbox>
                <MDX
                  cacheKey={`post-${post.slug}`}
                  cacheTags={['mdx-type:post', `mdx-post:${post.slug}`]}
                  content={post.content}
                  assetPrefix={assetPrefix}
                  scope="post"
                />
              </Lightbox>
            </Prose>
          </div>
        </article>
      </PageMain>
      <PageFooter />
    </>
  )
}

export async function generateStaticParams() {
  return []
}

export async function generateMetadata(props: Props) {
  const params = await props.params
  return PostMetadata.invoke(params.slug)
}
