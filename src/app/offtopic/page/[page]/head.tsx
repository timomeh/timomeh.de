import { CommonHead } from '@/components/CommonHead'
import { Feeds } from '@/components/Feeds'
import { Seo } from '@/components/Seo'

type Props = {
  params: { page: string }
}

export default function Head({ params }: Props) {
  let title = 'Offtopic'
  const page = +params.page
  if (page > 1) title += ` - Page ${page}`

  return (
    <>
      <CommonHead />
      <Feeds type="offtopic" />
      <Seo
        title={page > 1 ? title : undefined}
        description="I think things and just write 'em down."
        canonical={page === 1 ? 'https://timomeh.de/' : undefined}
      />
    </>
  )
}
