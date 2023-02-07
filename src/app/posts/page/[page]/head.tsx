import { CommonHead } from '@/components/CommonHead'
import { Feeds } from '@/components/Feeds'
import { Seo } from '@/components/Seo'

type Props = {
  params: { page: string }
}

export default function Head({ params }: Props) {
  let title = 'Posts'
  if (+params.page > 1) title += ` - Page ${params.page}`

  return (
    <>
      <CommonHead />
      <Feeds type="posts" />
      <Seo
        title={title}
        description="About software development and other thoughts I wanted to elaborate on."
      />
    </>
  )
}
