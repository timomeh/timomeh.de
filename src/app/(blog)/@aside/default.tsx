import { Card } from '@/comps/card'

import { BackWidget } from './_widgets/back-widget'
import { LinksWidget } from './_widgets/links-widget'

export default function Default() {
  return (
    <aside className="sm:h-full" aria-label="Naviation" role="navigation">
      <div
        className="@container top-0 max-h-dvh w-[220px] rounded-xl max-sm:bg-white/40
          max-sm:shadow-xl/20 max-sm:backdrop-blur-sm sm:sticky sm:w-[86px] sm:py-2
          lg:w-[220px] dark:max-sm:bg-black/40"
      >
        <Card>
          <div>
            <div className="@max-5xs:p-1 p-2">
              <BackWidget />
            </div>
            <section
              aria-label="Site Links"
              className="@max-5xs:p-1 border-t border-gray-400/30 p-2 dark:border-gray-600/30"
            >
              <LinksWidget />
            </section>
          </div>
        </Card>
      </div>
    </aside>
  )
}
