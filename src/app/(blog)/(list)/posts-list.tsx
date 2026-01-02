import React, { Fragment } from 'react'
import { GlassPill } from '@/comps/glass-pill'
import { pluralizePosts } from '@/lib/plurals'
import { ListLatestYearPosts } from '../../../data/actions/listLatestYearPosts'
import { ListTaggedPosts } from '../../../data/actions/listTaggedPosts'
import { ListYearPosts } from '../../../data/actions/listYearPosts'
import { ListedPost } from './listed-post'
import { ShortsTeaser } from './shorts-teaser'

type Props = {
  sort?: 'asc' | 'desc'
  year?: number
  tagSlug?: string
}

export async function PostsList({ sort = 'desc', year, tagSlug }: Props) {
  if (tagSlug) {
    const { tag, posts } = await ListTaggedPosts.invoke(tagSlug, sort)

    return (
      <div className="space-y-10">
        <div className="mb-4 flex relative justify-center">
          <GlassPill>
            <h3>
              {pluralizePosts(posts.length)} in {tag.title}
            </h3>
          </GlassPill>
        </div>
        {posts.map((post) => (
          <div className="relative" key={post.slug}>
            <ListedPost slug={post.slug} />
          </div>
        ))}
      </div>
    )
  }

  if (year) {
    const { postYear, posts } = await ListYearPosts.invoke(year, sort)

    return (
      <div className="space-y-10">
        <div className="mb-4 flex justify-center relative">
          <GlassPill>
            <h3>
              {pluralizePosts(posts.length)} in {postYear.year}
            </h3>
          </GlassPill>
        </div>
        {posts.map((post) => (
          <div className="relative" key={post.slug}>
            <ListedPost slug={post.slug} />
          </div>
        ))}
      </div>
    )
  }

  const { groupedPosts, hasShorts, shorts, shortsAtTop } =
    await ListLatestYearPosts.invoke(sort)

  return (
    <div className="space-y-10">
      {shortsAtTop && hasShorts && (
        <div className="mt-11">
          <ShortsTeaser shorts={shorts} />
        </div>
      )}
      {groupedPosts.map((group, groupIndex) => (
        <Fragment key={group.marker}>
          <div className="mb-4 flex justify-center relative">
            <GlassPill>
              <h3>{group.title}</h3>
            </GlassPill>
          </div>
          {group.posts.map((post, postIndex) => (
            <React.Fragment key={post.slug}>
              {!shortsAtTop &&
                groupIndex === 0 &&
                postIndex === 1 &&
                hasShorts && <ShortsTeaser shorts={shorts} />}
              <div className="relative" key={post.slug}>
                <ListedPost slug={post.slug} />
              </div>
              {!shortsAtTop &&
                groupIndex === 0 &&
                group.posts.length === 1 &&
                hasShorts && <ShortsTeaser shorts={shorts} />}
            </React.Fragment>
          ))}
        </Fragment>
      ))}
    </div>
  )
}
