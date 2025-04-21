import { Footer } from '@/comps/footer'

type Props = {
  children: React.ReactNode
}

export const fetchCache = 'force-cache'

export default async function Layout({ children }: Props) {
  return (
    <div>
      {children}
      <Footer />
    </div>
  )
}
