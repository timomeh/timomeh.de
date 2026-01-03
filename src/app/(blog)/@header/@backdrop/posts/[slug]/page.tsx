import { Suspense } from 'react'

import { HeaderBackdropEmpty } from '@/comps/header-backdrop-empty'
import { HeaderBackdropImage } from '@/comps/header-backdrop-image'
import { ShowPostBackdrop } from './data'

type Props = {
  params: Promise<{ slug: string }>
}

export default async function Page(props: Props) {
  const params = await props.params
  const backdrop = await ShowPostBackdrop.invoke(params.slug)

  return (
    <>
      {backdrop.lightCover || backdrop.darkCover ? (
        <div className="static">
          <div className="header-backdrop-signal" />
          <Suspense
            fallback={
              <div
                className="aspect-[3/2] h-auto max-h-[356px] min-h-[156px]
                  w-full max-w-[1024px]"
              />
            }
          >
            <HeaderBackdropImage
              lightSrc={backdrop.lightCover}
              darkSrc={backdrop.darkCover}
            />
          </Suspense>
        </div>
      ) : (
        <HeaderBackdropEmpty />
      )}
      {backdrop.lightBgColor && (
        <div
          style={{ background: backdrop.lightBgColor }}
          className="absolute inset-0 -z-10 mix-blend-multiply dark:hidden"
        />
      )}
      {backdrop.darkBgColor && (
        <div
          style={{ background: backdrop.darkBgColor }}
          className="absolute inset-0 -z-10 hidden mix-blend-exclusion
            dark:block"
        />
      )}
    </>
  )
}

export async function generateStaticParams() {
  return []
}
