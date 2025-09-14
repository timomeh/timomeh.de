import { HeaderBackdropEmpty } from '@/comps/header-backdrop-empty'

type Props = {
  params: Promise<{ id: string }>
}

export default async function Page(_props: Props) {
  return <HeaderBackdropEmpty />
}

export async function generateStaticParams() {
  return []
}
