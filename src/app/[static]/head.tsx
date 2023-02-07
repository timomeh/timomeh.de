import { Seo } from '@/components/Seo'
import { CommonHead } from '@/components/CommonHead'
import { getSite } from './getSite'

type Props = {
  params: {
    static: string
  }
}

export default async function Head({ params }: Props) {
  const site = await getSite(params.static)
  if (!site) return null

  return (
    <>
      <CommonHead />
      <Seo {...site.head} />
    </>
  )
}
