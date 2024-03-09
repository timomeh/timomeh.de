import { BackTag } from '@/comps/back-tag'

export default function Loading() {
  return (
    <div className="mx-auto max-w-2xl px-4">
      <div className="mb-10 flex sm:pt-6">
        <BackTag />
      </div>

      <article className="prose prose-invert relative">
        <div className="mt-2 animate-pulse font-pixel text-xl font-semibold leading-tight sm:text-2xl">
          <span className="opacity-50">▙▚▛▞</span>
        </div>
      </article>
    </div>
  )
}
