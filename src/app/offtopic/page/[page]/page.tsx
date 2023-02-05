import { notFound } from 'next/navigation'

import { listOfftopicsPaginated } from '@/lib/blog'
import { ListedOfftopic } from '../../ListedOfftopic'
import { NorthernLights } from '@/components/NorthernLights'
import { Toc, TocEntry } from '@/components/Toc'
import { MDXRenderer } from '@/components/MDXRenderer'

export const revalidate = false
export const generateStaticParams = () => []

type Props = {
  params: { page: string }
}

export default async function Offtopics({ params }: Props) {
  const page = +params.page
  if (!Number.isInteger(page)) notFound()

  const { offtopics } = await listOfftopicsPaginated(page)
  if (offtopics.length < 1) notFound()

  return (
    <>
      <NorthernLights />
      <main className="meh-main">
        <div className="space-y-10">
          {offtopics.map((offtopic) => (
            <ListedOfftopic offtopic={offtopic} key={offtopic.number} />
          ))}
        </div>
      </main>
      <aside className="meh-aside">
        <Toc>
          {offtopics.map((offtopic) => (
            <TocEntry name={offtopic.slug} key={offtopic.slug}>
              <MDXRenderer content={offtopic.title || offtopic.slug} inline />
            </TocEntry>
          ))}
        </Toc>
      </aside>
    </>
  )
}
