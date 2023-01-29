import Link from 'next/link'
import { notFound } from 'next/navigation'

import { listOfftopicsPaginated, listPosts } from '@/lib/blog'
import { GreenAurora, VioletAurora } from '@/components/Aurora'
import { ListedOfftopic } from '../../ListedOfftopic'

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

  const offtopics = await listPosts()

  return (
    <>
      <div className="meh-main relative">
        <div className="absolute top-0">
          <div className="absolute -left-2 -top-32">
            <GreenAurora />
          </div>
          <div className="absolute left-60 -top-24">
            <VioletAurora />
          </div>
        </div>
        <main className="mt-40">
          <div className="space-y-10">
            {offtopics.slice(-2, -1).map((offtopic) => (
              <article key={offtopic.number}>
                <ListedOfftopic offtopic={offtopic} />
              </article>
            ))}
          </div>
        </main>
      </div>
    </>
  )
}
