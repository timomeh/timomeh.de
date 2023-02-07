import { CommonHead } from '@/components/CommonHead'
import { Feeds } from '@/components/Feeds'
import { Seo } from '@/components/Seo'

type Props = {
  params: { page: string }
}

export default function Head({ params }: Props) {
  let title = 'Offtopic'
  if (+params.page > 1) title += ` - Page ${params.page}`

  return (
    <>
      <CommonHead />
      <Feeds type="offtopic" />
      <Seo
        title={title}
        description="I think things and just write 'em down."
      />
    </>
  )
}
