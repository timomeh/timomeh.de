import { TagMetadata } from '@/data/actions/tagMetadata'

type Props = {
  children: React.ReactNode
  params: Promise<{ tag: string }>
}

export default function Layout({ children }: Props) {
  return <>{children}</>
}

export async function generateMetadata(props: Props) {
  const params = await props.params
  return TagMetadata.invoke(params.tag)
}
