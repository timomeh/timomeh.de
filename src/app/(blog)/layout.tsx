import { Footer } from '@/comps/footer'
import { Header } from '@/comps/header'

type Props = {
  children: React.ReactNode
  backdrop?: React.ReactNode
  nextPost?: React.ReactNode
  prevPost?: React.ReactNode
}

export default function BlogLayout({
  children,
  backdrop,
  nextPost,
  prevPost,
}: Props) {
  return (
    <>
      {nextPost}
      <div className="flex min-h-dvh flex-col">
        <header className="relative w-full">
          <div className="relative z-10">
            <Header />
          </div>
          {backdrop}
        </header>
        <main className="relative z-30 w-full flex-1">{children}</main>
        <Footer />
      </div>
      {prevPost}
    </>
  )
}
