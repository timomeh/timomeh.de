import mime from 'mime-types'
import { Seo } from '@/components/Seo'
import { getSite } from './getSite'
import { CommonHead } from '../../CommonHead'

type Props = {
  params: {
    name: string
  }
}

export default async function Head({ params }: Props) {
  const site = await getSite(params.name)
  if (!site) return null

  return (
    <>
      <CommonHead />
      <Seo {...site.head} />
    </>
  )
}
