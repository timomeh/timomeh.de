type Props = {
  color?: string
  title: React.ReactNode
  size?: 'normal' | 'smol'
  active?: boolean
}

export function Tag({ title, active }: Props) {
  return (
    <div
      data-active={active}
      className="max-w-full truncate rounded-full border border-gray-200
        bg-gray-500/3 px-2 py-1 text-xs leading-none font-medium text-gray-700
        transition group-hover/btn:border-gray-300 group-hover/btn:bg-gray-500/7
        group-hover/btn:shadow-md/5 data-[active=true]:border-gray-700
        data-[active=true]:bg-gray-700 data-[active=true]:text-gray-100
        dark:border-white/10 dark:bg-white/3 dark:text-gray-200
        dark:group-hover/btn:border-white/15 dark:group-hover/btn:bg-white/7
        dark:data-[active=true]:border-gray-200
        dark:data-[active=true]:bg-gray-200
        dark:data-[active=true]:text-gray-900"
    >
      {title}
    </div>
  )
}
