import { Card } from '@/comps/card'

import { BackWidget } from '../../_widgets/back-widget'
import { LinksWidget } from '../../_widgets/links-widget'
import { PostNavigationWidget } from '../../_widgets/post-navigation-widget'

type Props = {
  params: Promise<{ slug: string }>
}

export default async function Page({ params }: Props) {
  const slug = (await params).slug

  return (
    <div
      className="@container top-0 max-h-dvh w-[220px] rounded-xl max-sm:bg-white/40
        max-sm:shadow-xl/20 max-sm:backdrop-blur-sm sm:sticky sm:w-[86px] sm:py-2
        lg:w-[220px] dark:max-sm:bg-black/40"
    >
      <Card>
        <div className="divide-y divide-gray-400/30 dark:divide-gray-600/30">
          <BackWidget />
          <section aria-label="Post Navigation">
            <PostNavigationWidget currentSlug={slug} />
          </section>
          <section aria-label="Site Links">
            <LinksWidget />
          </section>
        </div>
      </Card>
    </div>
  )
}

export async function generateStaticParams() {
  return []
}
