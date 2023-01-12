import { notFound } from 'next/navigation'

import { getPost, formatPostedAt } from '../../../lib/blog'
import { GithubLogo } from '../../../components/GithubLogo'
import { PostTitle } from '../../../components/PostTitle'
import { Prose } from '../../../components/Prose'
import { PostComments } from './PostComments'
import { PostBody } from '../../../components/PostBody'

export const revalidate = false
export const generateStaticParams = () => []

type Props = {
  params: {
    slug: string
  }
}

export default async function Post({ params }: Props) {
  const post = await getPost(params.slug)

  if (!post) {
    return notFound()
  }

  return (
    <>
      <Prose>
        <h1 className="!mb-0">
          {/* @ts-expect-error Server Component */}
          <PostTitle title={post.title} />
        </h1>
        <div className="flex items-center space-x-2">
          <div
            className="text-slate-500 text-sm"
            data-generatedat={new Date().toISOString()}
          >
            posted on {formatPostedAt(post.postedAt)}
          </div>
          <a
            href={`https://github.com/timomeh/timomeh.de/discussions/${post.number}`}
            rel="noopener noreferrer"
            target="_blank"
            className="fill-slate-500 hover:fill-slate-700 transition-colors"
          >
            <GithubLogo className="w-[26px] h-[26px] -m-1 p-1" />
          </a>
        </div>
        <div className="h-6 md:h-8" />

        {/* @ts-expect-error Server Component */}
        <PostBody body={post.markdown} />
      </Prose>
      <hr className="h-px bg-slate-200 mt-12 md:mt-20 mb-12" />

      <PostComments discussionNumber={post.number} />
    </>
  )
}
