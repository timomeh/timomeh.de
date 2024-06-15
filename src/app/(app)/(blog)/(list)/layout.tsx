import { HeaderSpacer } from '@/app/_comps/header-spacer'
import { PostTags } from './post-tags'
import { Footer } from '@/app/_comps/footer'
import { HeaderBackdropHaze } from '@/app/_comps/header-backdrop-haze'

type Props = {
  children: React.ReactNode
}

export default async function Layout({ children }: Props) {
  return (
    <div className="flex min-h-dvh flex-col">
      <HeaderSpacer>
        <HeaderBackdropHaze />
      </HeaderSpacer>
      <main className="relative z-30 w-full flex-1">
        <nav className="mx-auto max-w-2xl px-4 sm:mt-6">
          <PostTags />
        </nav>
        {children}
      </main>
      <Footer />
    </div>
  )
}
