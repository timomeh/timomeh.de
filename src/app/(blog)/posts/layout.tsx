import { Footer } from '@/comps/footer'

type Props = {
  children: React.ReactNode
}

export default async function Layout({ children }: Props) {
  return (
    <>
      <main className="relative z-30 min-w-full">
        <div className="p-4 sm:p-6 md:p-8">{children}</div>
      </main>
      <Footer />
    </>
  )
}
