import { listOfftopicsPaginated } from '@/lib/blog'
import { Toc, TocEntry } from '@/components/Toc'
import { MDXRenderer } from '@/components/MDXRenderer'

type Props = {
  params: { page: string }
}

export default async function AsideOfftopic({ params }: Props) {
  const page = +params.page
  const { offtopics } = await listOfftopicsPaginated(page)

  return (
    <Toc>
      {offtopics.map((offtopic) => (
        <TocEntry name={offtopic.slug} key={offtopic.slug}>
          <MDXRenderer content={offtopic.safeTitle} inline />
        </TocEntry>
      ))}
    </Toc>
  )
}
