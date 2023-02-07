import { CommonHead } from '@/components/CommonHead'
import { Feeds } from '@/components/Feeds'
import { Seo } from '@/components/Seo'

type Props = {
  params: { page: string }
}

export default function Head({ params }: Props) {
  let title = 'Posts'
  const page = +params.page
  if (page > 1) title += ` - Page ${page}`

  return (
    <>
      <CommonHead />
      <Feeds type="posts" />
      <Seo
        title={title}
        description="About software development and other thoughts I wanted to elaborate on."
        canonical={page === 1 ? 'https://timomeh.de/posts' : undefined}
      />
    </>
  )
}
