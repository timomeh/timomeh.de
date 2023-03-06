import { notFound } from 'next/navigation'
import Link from 'next/link'
import { listPostsPaginated } from '@/lib/blog'
import { ListedPost } from '../../ListedPost'
import { NorthernLights } from '@/components/NorthernLights'

export const revalidate = false

type Props = {
  params: { page: string }
}

export default async function Posts({ params }: Props) {
  const page = +params.page
  if (!Number.isInteger(page)) notFound()

  const { posts, next, prev } = await listPostsPaginated(page)
  if (posts.length < 1) notFound()

  return (
    <>
      <NorthernLights />
      <main className="meh-main">
        <div className="h-16 lg:hidden" />
        <div className="space-y-10">
          {posts.map((post) => (
            <ListedPost post={post} key={post.number} />
          ))}
        </div>
        <div className="mt-10 flex space-x-4 max-w-content px-4 justify-center text-[13px] font-bold uppercase">
          {prev && (
            <Link
              className="underline decoration-violet-400 underline-offset-4 glow opacity-60 hover:opacity-80"
              href={prev === 1 ? `/posts` : `/posts/page/${prev}`}
            >
              Newer
            </Link>
          )}
          {next && (
            <Link
              className="justify-self-start underline decoration-violet-400 underline-offset-4 glow opacity-60 hover:opacity-80"
              href={`/posts/page/${next}`}
            >
              Older
            </Link>
          )}
        </div>
      </main>
    </>
  )
}

export async function generateMetadata({ params }: Props) {
  let title = 'Posts'
  const page = +params.page
  if (page > 1) title += ` - Page ${page}`

  return {
    title,
    description:
      'About software development and other thoughts I wanted to elaborate on.',
    alternates: {
      canonical: page === 1 ? 'https://timomeh.de/posts' : undefined,
      types: {
        'application/atom+xml': 'https://timomeh.de/posts/feed.atom',
        'application/rss+xml': 'https://timomeh.de/posts/feed.rss',
        'application/feed+json': 'https://timomeh.de/posts/feed.json',
      },
    },
  }
}
