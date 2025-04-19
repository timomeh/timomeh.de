import { Footer } from '@/comps/footer'

type Props = {
  children: React.ReactNode
}

export default async function Layout({ children }: Props) {
  return (
    <>
      <main className="relative z-30 min-w-full">{children}</main>
      <Footer />
    </>
  )
}
