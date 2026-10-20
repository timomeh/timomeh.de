import { PageFooter } from './page-footer'
import { PageMain } from './page-main'
import { PageNav } from './page-nav'

type Props = {
  chrome?: boolean
  variant?: 'article' | 'list'
}

export function PageLoading({ chrome = false, variant = 'article' }: Props) {
  const content = (
    <PageMain>
      <div
        aria-busy="true"
        aria-label="Loading page"
        className="mx-auto max-w-2xl p-4 py-12! sm:p-6 md:p-8"
      >
        <div className="animate-pulse space-y-6">
          <div className="h-4 w-1/3 rounded bg-current/10" />
          <div className="h-10 w-3/4 rounded bg-current/10" />
          <div className="space-y-3">
            {Array.from({ length: variant === 'article' ? 12 : 8 }, (_, i) => (
              <div
                key={i}
                className={`h-4 rounded bg-current/10 ${
                  i % 4 === 3 ? 'w-2/3' : 'w-full'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </PageMain>
  )

  if (!chrome) return content

  return (
    <>
      <PageNav />
      {content}
      <PageFooter />
    </>
  )
}
