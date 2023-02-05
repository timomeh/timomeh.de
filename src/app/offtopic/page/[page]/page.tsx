import Link from 'next/link'
import { notFound } from 'next/navigation'

import { listOfftopicsPaginated, listPosts } from '@/lib/blog'
import { GreenAurora, VioletAurora } from '@/components/Aurora'
import { ListedOfftopic } from '../../ListedOfftopic'
import { NorthernLights } from '@/components/NorthernLights'
import { StoreProvider } from '@/lib/store'
import { MarkerProvider } from '@/components/InViewMarker'
import { Toc, TocEntry } from '@/components/Toc'

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
    <MarkerProvider names={offtopics.map(({ slug }) => slug)}>
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
            <TocEntry key={offtopic.slug} name={offtopic.slug}>
              {offtopic.title || offtopic.slug}
            </TocEntry>
          ))}
        </Toc>
      </aside>
    </MarkerProvider>
  )
}
