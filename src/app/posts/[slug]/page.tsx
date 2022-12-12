import { notFound } from 'next/navigation'

import { getBlogPost } from '../../../lib/blog'
import { GithubLogo } from '../../../components/GithubLogo'
import { PostTitle } from '../../../components/PostTitle'
import { Prose } from '../../../components/Prose'
import { PostComments } from './PostComments'
import { PostBody } from '../../../components/PostBody'

type Props = {
  params: {
    slug: string
  }
}

// false is the default and not necessary, but I wanted to be explicit
export const revalidate = false

// this needs to be defined for dynamic routes, otherwise caching won't work
export async function generateStaticParams() {
  return []
}

export default async function Post({ params }: Props) {
  const post = await getBlogPost(params.slug)

  if (!post) {
    return notFound()
  }

  return (
    <>
      <Prose>
        <h1 className="!mb-0">
          {/* @ts-expect-error Server Component */}
          <PostTitle title={post.rawTitle} />
        </h1>
        <div className="flex items-center space-x-2">
          <div className="text-slate-500 text-sm">
            posted on {post.postedAt}
            <div className="hidden">
              and generated at {new Date().toUTCString()}
            </div>
          </div>
          <a
            href={`https://github.com/timomeh/timomeh.de/discussions/${post.discussionNumber}`}
            rel="noopener noreferrer"
            target="_blank"
            className="fill-slate-500 hover:fill-slate-700 transition-colors"
          >
            <GithubLogo className="w-[26px] h-[26px] -m-1 p-1" />
          </a>
        </div>
        <div className="h-6 md:h-8" />

        {/* @ts-expect-error Server Component */}
        <PostBody body={post.rawBody} />
      </Prose>
      <hr className="h-px bg-slate-200 mt-12 md:mt-20 mb-12" />

      <PostComments discussionNumber={post.discussionNumber} />
    </>
  )
}
