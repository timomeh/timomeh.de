import { saneParseInt } from '@/lib/saneParseInt'

type Props = {
  children: React.ReactNode
  params: Promise<{ year: string }>
}

export const fetchCache = 'force-cache'

export default function Layout({ children }: Props) {
  return <>{children}</>
}

export async function generateMetadata({ params }: Props) {
  const year = saneParseInt((await params).year)

  return {
    title: String(year),
    description: `About blog about software development, music, my life, and other random thoughts I wanted to elaborate on.`,
  }
}
