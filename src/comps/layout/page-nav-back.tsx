import { BackLink } from '@/comps/back-link'
import { ArrowLeftIcon } from '@/comps/icons/arrow-left'

export function PageNavBack({ href }: { href?: string }) {
  return (
    <div className="md:absolute md:top-1/2 md:right-full md:mr-4 md:-translate-y-1/2">
      <BackLink href={href}>
        <div className="flex items-center gap-0.5 opacity-70 transition-all hover:opacity-100">
          <div className="relative top-[0.5px] size-4" aria-hidden>
            <ArrowLeftIcon />
          </div>
          <div className="leading-none font-semibold">Back</div>
        </div>
      </BackLink>
    </div>
  )
}
