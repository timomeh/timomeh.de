'use cache'

import { PostTags } from '../post-tags'
import { Footer } from '@/comps/footer'

type Props = {
  children: React.ReactNode
}

export default async function Layout({ children }: Props) {
  return (
    <>
      <main className="relative z-30 mb-10 w-full flex-1">
        <nav className="mx-auto mb-16 max-w-2xl px-4 sm:mt-6">
          <PostTags />
        </nav>
        <div>{children}</div>
      </main>
      <Footer />
    </>
  )
}
