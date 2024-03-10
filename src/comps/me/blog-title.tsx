import Link from 'next/link'

export function BlogTitle() {
  return (
    <div className="group flex">
      {/* orbit */}
      <div
        className="pointer-events-none absolute -mt-1 ml-16 h-[40px] w-[100px] rotate-[35deg]
          transform-gpu rounded-[100%] border border-yellow-50/10 transition-transform
          duration-1000 ease-in-out motion-safe:group-hover:rotate-[30deg]
          motion-safe:group-hover:scale-125"
      >
        <div
          className="h-1 w-1 transform-gpu animate-[path_15s_infinite_linear] rounded-full
            bg-yellow-200/50 [offset-path:ellipse(49.5px_19.5px_at_50%_50%)]
            motion-reduce:hidden"
        />
      </div>

      <div
        className="font-display text-xs leading-none text-yellow-100
          [text-shadow:0px_0px_6px_rgba(0,0,0,0.3)] xs:text-sm"
      >
        <span>test</span>
        <span className="-mt-1 block xs:-mt-2">
          <Link
            href="/about"
            className="title-name inline-block text-nowrap text-xl font-semibold"
          >
            Timo Mämecke
          </Link>
        </span>
      </div>
    </div>
  )
}
