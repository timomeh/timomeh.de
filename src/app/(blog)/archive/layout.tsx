import { Footer } from '@/comps/footer'

import { PostTags } from '../post-tags'

type Props = {
  children: React.ReactNode
}

export default async function Layout({ children }: Props) {
  return (
    <>
      <main className="relative z-30 w-full flex-1">
        <nav className="mx-auto max-w-2xl px-4 sm:mt-6">
          <PostTags scope="/archive" />
        </nav>
        <div className="mx-auto max-w-2xl px-4">{children}</div>
      </main>
      <Footer />
    </>
  )
}
