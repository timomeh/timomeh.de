type Props = {
  color: string
  title: React.ReactNode
  size?: 'normal' | 'smol'
}

export function Tag({ color, title, size = 'normal' }: Props) {
  return (
    <div style={{ color }}>
      <div
        data-size={size}
        className="group/tag relative isolate flex h-[23px] items-center rounded-full
          border-current font-mono font-semibold tracking-tight data-[size=smol]:h-[17px]
          data-[size=normal]:px-2 data-[size=smol]:px-1.5 data-[size=normal]:text-[12px]
          data-[size=smol]:text-[10px] dark:border dark:font-pixel dark:font-normal
          dark:tracking-normal dark:data-[size=normal]:text-[11px]
          dark:data-[size=smol]:text-[9px] dark:data-[size=normal]:antialiased
          dark:data-[size=normal]:[font-feature-settings:ss01]"
      >
        <div
          className="pointer-events-none absolute inset-0 rounded-full bg-current opacity-40
            dark:opacity-20"
        />
        <div
          className="pointer-events-none absolute inset-0 z-[-1] rounded-full bg-white/50
            dark:bg-black/50"
        />
        <div
          className="pointer-events-none absolute inset-0 hidden rounded-full opacity-0
            shadow-[0_0_6px_2px_color-mix(in_srgb,currentColor_50%,transparent)]
            transition-all duration-300 group-hover/tag-link:opacity-50
            group-data-[current=true]/tag-link:opacity-100 dark:block"
        />
        <div
          className="pointer-events-none absolute inset-0 rounded-full border
            border-[color-mix(in_srgb,currentColor_50%,black)] opacity-0 transition-all
            duration-300 group-hover/tag-link:opacity-50
            group-data-[current=true]/tag-link:opacity-100 dark:hidden"
        />
        <div
          className="relative z-10 text-nowrap text-[#333333] antialiased mix-blend-color-burn
            brightness-150 [font-feature-settings:'ss01']
            dark:text-[color-mix(in_srgb,currentColor_60%,white)] dark:mix-blend-normal"
        >
          {title}
        </div>
      </div>
    </div>
  )
}
