import { BackTag } from '@/comps/back-tag'
import { Footer } from '@/comps/footer'

type Props = {
  children: React.ReactNode
}

export default async function Layout({ children }: Props) {
  return (
    <>
      <main className="relative z-30 w-full flex-1">
        <div className="wrapper">
          <div className="mb-10 flex sm:pt-6">
            <BackTag />
          </div>
        </div>
        {children}
      </main>
      <Footer />
    </>
  )
}
