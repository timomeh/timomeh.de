import Link from 'next/link'
import { notFound } from 'next/navigation'

import { listOfftopicPaginated } from '@/lib/blog'

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

  const offtopics = await listOfftopicPaginated(page)

  return (
    <>
      <div className="h-6" />
      <ul className="space-y-4">
        {offtopics.map((offtopic) => (
          <li key={offtopic.slug}>{offtopic.markdown}</li>
        ))}
      </ul>
    </>
  )
}
