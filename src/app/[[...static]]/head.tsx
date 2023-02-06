import mime from 'mime-types'
import { Seo } from '@/components/Seo'
import { getSite } from './getSite'
import { CommonHead } from '../CommonHead'

type Props = {
  params: {
    static: string[]
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
