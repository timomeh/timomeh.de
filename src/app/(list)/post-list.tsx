import { listPostsByYear } from '@/lib/blog'

import { PostItem } from './post-item'

type Props = {
  tag?: string
}

export async function PostList({ tag }: Props) {
  const postsByYear = await listPostsByYear({ tag })

  return (
    <>
      {postsByYear.map(({ year, posts }) => (
        <div key={year} className="mt-10">
          <h2 className="effect-crt-blue font-pixel text-2xl font-bold leading-none">
            {year}
          </h2>
          <div className="h-4" />
          {posts.length === 0 && (
            <div className="font-display font-semibold text-white/50">
              No posts this year
            </div>
          )}
          {posts.map((post) => (
            <PostItem key={post} slug={post} />
          ))}
        </div>
      ))}
    </>
  )
}
