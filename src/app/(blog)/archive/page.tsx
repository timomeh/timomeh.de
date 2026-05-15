import type { Metadata } from 'next'
import Link from 'next/link'
import React from 'react'

import { ListPostsGroupedByYear } from '@/app/(blog)/archive/data'
import { PostEyebrow } from '@/app/(blog)/post-eyebrow'
import { ListAllTags } from '@/app/(blog)/tags/data'
import { PageFooter } from '@/comps/layout/page-footer'
import { PageMain } from '@/comps/layout/page-main'
import { PageNav } from '@/comps/layout/page-nav'
import { Prose } from '@/comps/prose'
import { TagLink } from '@/comps/tag-link'

export default async function Page() {
  const tags = await ListAllTags.invoke()
  const { groupedPosts } = await ListPostsGroupedByYear.invoke()

  return (
    <>
      <PageNav />
      <PageMain>
        <div className="mx-auto max-w-2xl p-4 !py-12 sm:p-6 md:p-8">
          <Prose>
            <h1>The Archive</h1>
          </Prose>

          <div className="mt-10" />
          <Prose>
            <h2>Tags</h2>
            <p className="font-mono font-medium text-current/60">
              {tags.map((tag, i) => (
                <span key={tag.slug} className="not-prose">
                  <TagLink {...tag} />
                  {i <= tags.length - 2 && ', '}
                </span>
              ))}
            </p>
          </Prose>

          {groupedPosts.map((group) => (
            <React.Fragment key={group.year}>
              <div className="mt-10" />
              <Prose>
                <h2 className="mb-[1em]">{group.year}</h2>
              </Prose>
              <ul className="space-y-5">
                {group.posts.map((post) => (
                  <li key={post.id}>
                    <div className="mb-1">
                      <PostEyebrow post={post} linked />
                    </div>
                    <Prose>
                      <h4>
                        <Link
                          href={`/posts/${post.slug}`}
                          className="no-underline hover:underline"
                        >
                          {post.title}
                        </Link>
                      </h4>
                    </Prose>
                  </li>
                ))}
              </ul>
            </React.Fragment>
          ))}
        </div>
      </PageMain>
      <PageFooter />
    </>
  )
}

export async function generateMetadata() {
  const metadata: Metadata = {
    title: 'The Archive',
  }

  return metadata
}
