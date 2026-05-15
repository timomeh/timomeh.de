import { BackLink } from '@/comps/back-link'
import { ArrowLeftIcon } from '@/comps/icons/arrow-left'

export function PageNavBack({ href }: { href?: string }) {
  return (
    <BackLink href={href}>
      <div className="flex items-center gap-0.5 opacity-70 transition-all hover:opacity-100">
        <div className="size-4" aria-hidden>
          <ArrowLeftIcon />
        </div>
        <div className="-mt-px leading-none font-semibold">Back</div>
      </div>
    </BackLink>
  )
}
