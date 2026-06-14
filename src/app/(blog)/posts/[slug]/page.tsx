import { Metadata } from 'next'
import { Suspense } from 'react'

import { PostEyebrow } from '@/app/(blog)/post-eyebrow'
import { PostNavScrollTitle } from '@/app/(blog)/posts/[slug]/post-nav-scroll-title'
import { RelatedPosts } from '@/app/(blog)/posts/[slug]/related-post'
import { PageFooter } from '@/comps/layout/page-footer'
import { PageMain } from '@/comps/layout/page-main'
import { PageNav } from '@/comps/layout/page-nav'
import { PageNavBack } from '@/comps/layout/page-nav-back'
import { Lightbox } from '@/comps/lightbox'
import { ActiveHeadingProvider } from '@/comps/mdx/active-heading-context'
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
    <ActiveHeadingProvider>
      <PageNav>
        <PageNavBack href="/" />
        <PostNavScrollTitle />
      </PageNav>
      <PageMain>
        <article
          lang={post.metaLang?.split('_')[0]}
          className="relative"
          data-landmark="content-page"
        >
          <div className="mx-auto max-w-2xl p-4 py-12! sm:p-6 md:p-8">
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
                  trackHeadings
                />
              </Lightbox>
            </Prose>
            <div className="mt-10">
              <span className="font-mono text-xs text-current/60">
                Published at{' '}
                <time dateTime={post.publishedAt.toISOString()}>
                  {post.publishedAt.toISOString()}
                </time>
              </span>
            </div>
            <p className="font-mono text-xs text-current/60">
              Comment: <a href="mailto:hello@timomeh.de">hello@timomeh.de</a>
            </p>
          </div>
        </article>
        {post.relatedPosts.length > 0 && (
          <Suspense>
            <RelatedPosts forSlug={slug} />
          </Suspense>
        )}
      </PageMain>
      <PageFooter />
    </ActiveHeadingProvider>
  )
}

export async function generateStaticParams() {
  return []
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  return PostMetadata.invoke(params.slug)
}
