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
        className="group/tag relative flex rounded-full border border-current font-pixel
          font-normal leading-none data-[size=normal]:px-2 data-[size=normal]:py-[5px]
          data-[size=smol]:px-1.5 data-[size=smol]:py-[3px] data-[size=normal]:text-[11px]
          data-[size=smol]:text-[9px] data-[size=normal]:antialiased
          data-[size=normal]:[font-feature-settings:ss01]"
      >
        <div className="pointer-events-none absolute inset-0 rounded-full bg-current opacity-20" />
        <div
          className="pointer-events-none absolute inset-0 rounded-full opacity-0
            shadow-[0_0_6px_2px_color-mix(in_srgb,currentColor_50%,transparent)]
            transition-opacity duration-300 group-hover/tag-link:opacity-50
            group-data-[current=true]/tag-link:opacity-100"
        />
        <div
          className="relative text-nowrap text-[color-mix(in_srgb,currentColor_50%,white)]
            brightness-150"
        >
          {title}
        </div>
      </div>
    </div>
  )
}
