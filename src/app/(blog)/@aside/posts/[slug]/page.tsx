import { Card } from '@/comps/card'
import { RandomDeco } from '@/comps/deco'
import { BackWidget } from '../../_widgets/back-widget'
import { LinksWidget } from '../../_widgets/links-widget'
import { PostNavigationWidget } from '../../_widgets/post-navigation-widget'
import { PostTagsWidget } from '../../_widgets/post-tags-widget'

type Props = {
  params: Promise<{ slug: string }>
}

export default async function Page({ params }: Props) {
  const slug = (await params).slug

  return (
    <div className="top-0 max-h-dvh sm:sticky">
      <div
        className="@container w-[220px] rounded-xl max-sm:bg-white/40
          max-sm:shadow-xl/20 max-sm:backdrop-blur-sm sm:w-[86px] sm:py-2
          lg:w-[220px] dark:max-sm:bg-black/40"
      >
        <div className="relative max-sm:hidden">
          <RandomDeco seed={`nav-${slug}`} />
        </div>
        <Card>
          <div>
            <section
              aria-label="Next and previous post"
              className="@max-5xs:p-1 p-2"
            >
              <PostNavigationWidget currentSlug={slug} />
            </section>
            <div
              className="@max-5xs:p-1 border-t border-gray-400/30 p-2
                dark:border-gray-600/30"
            >
              <section
                aria-label="Post’s Tags"
                className="@max-5xs:hidden mb-2"
              >
                <PostTagsWidget currentSlug={slug} />
              </section>
              <BackWidget />
            </div>
            <section
              aria-label="Site Links"
              className="@max-5xs:p-1 border-t border-gray-400/30 p-2
                dark:border-gray-600/30"
            >
              <LinksWidget />
            </section>
          </div>
        </Card>
      </div>
    </div>
  )
}

export async function generateStaticParams() {
  return []
}
