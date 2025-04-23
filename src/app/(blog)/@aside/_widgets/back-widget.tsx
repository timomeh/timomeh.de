import { BackLink } from '@/comps/back-link'

export function BackWidget() {
  return (
    <>
      <div>
        <BackLink className="group/btn">
          <Item>
            <div className="text-center text-xs font-medium">All posts</div>
          </Item>
        </BackLink>
      </div>
    </>
  )
}

function Item(props: { children: React.ReactNode }) {
  return (
    <div
      className="rounded-md border border-gray-900/10 bg-gray-900/2 text-gray-900/80 transition
        group-hover/btn:border-gray-900/10 group-hover/btn:bg-gray-900/5
        group-hover/btn:text-gray-900 in-data-[current=true]:!border-transparent
        in-data-[current=true]:!bg-transparent dark:border-white/10 dark:bg-white/2
        dark:text-white/80 dark:group-hover/btn:border-white/10
        dark:group-hover/btn:bg-white/5 dark:group-hover/btn:text-white"
    >
      <div className="@max-5xs:p-1 p-2">{props.children}</div>
    </div>
  )
}
