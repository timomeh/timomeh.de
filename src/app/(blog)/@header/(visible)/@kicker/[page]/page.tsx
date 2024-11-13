import { getPage } from '@/data/pages'
import { RandomKicker } from '../random-kicker'

type Props = {
  params: Promise<{ page: string }>
}

export default async function Page(props: Props) {
  const params = await props.params
  const page = await getPage(params.page)

  if (page?.frontmatter.kicker) {
    return <span>{page.frontmatter.kicker}</span>
  }

  return <RandomKicker />
}
