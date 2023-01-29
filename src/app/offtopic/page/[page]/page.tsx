import Link from 'next/link'
import { notFound } from 'next/navigation'

import { listOfftopicsPaginated, listPosts } from '@/lib/blog'
import { GreenAurora, VioletAurora } from '@/components/Aurora'
import { ListedOfftopic } from '../../ListedOfftopic'
import { NorthernLights } from '@/components/NorthernLights'

export const revalidate = false
export const generateStaticParams = () => []

type Props = {
  params: { page: string }
}

export default async function Offtopics({ params }: Props) {
  const page = +params.page - 1

  if (!Number.isInteger(page)) {
    notFound()
  }

  const offtopics = await listOfftopicsPaginated(page)

  if (offtopics.length < 1) {
    notFound()
  }

  return (
    <>
      <NorthernLights />
      <main className="meh-main">
        <div className="space-y-10">
          {offtopics.map((offtopic) => (
            <article key={offtopic.number}>
              <ListedOfftopic offtopic={offtopic} />
            </article>
          ))}
        </div>
      </main>
    </>
  )
}
