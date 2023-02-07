import { notFound } from 'next/navigation'
import removeMd from 'remove-markdown'

import { listOfftopicsPaginated } from '@/lib/blog'
import { NorthernLights } from '@/components/NorthernLights'
import { Toc, TocEntry } from '@/components/Toc'
import { MDXRenderer } from '@/components/MDXRenderer'
import { ListedOfftopic } from '../../ListedOfftopic'
import Link from 'next/link'

export const revalidate = false
export const generateStaticParams = () => []

type Props = {
  params: { page: string }
}

export default async function Offtopics({ params }: Props) {
  const page = +params.page
  if (!Number.isInteger(page)) notFound()

  const { offtopics, prev, next } = await listOfftopicsPaginated(page)
  if (offtopics.length < 1) notFound()

  return (
    <>
      <NorthernLights />
      <main className="meh-main">
        <div className="h-16 lg:hidden" />
        <div className="space-y-10">
          {offtopics.map((offtopic) => (
            <ListedOfftopic offtopic={offtopic} key={offtopic.number} />
          ))}
        </div>
        <div className="mt-10 flex space-x-4 max-w-[682px] px-4 justify-center text-[13px] font-bold uppercase">
          {prev && (
            <Link
              className="underline decoration-violet-400 underline-offset-4 glow opacity-60 hover:opacity-80"
              href={prev === 1 ? `/` : `/offtopic/page/${prev}`}
            >
              Newer
            </Link>
          )}
          {next && (
            <Link
              className="justify-self-start underline decoration-violet-400 underline-offset-4 glow opacity-60 hover:opacity-80"
              href={`/offtopic/page/${next}`}
            >
              Older
            </Link>
          )}
        </div>
      </main>
      <aside className="meh-aside">
        <Toc>
          {offtopics.map((offtopic) => (
            <TocEntry name={offtopic.slug} key={offtopic.slug}>
              <MDXRenderer
                content={removeMd(
                  offtopic.title ||
                    offtopic.meta.title ||
                    offtopic.body
                      .split(' ')
                      .slice(0, 10)
                      .join(' ')
                      .concat('…') ||
                    offtopic.slug
                )}
                inline
              />
            </TocEntry>
          ))}
        </Toc>
      </aside>
    </>
  )
}
