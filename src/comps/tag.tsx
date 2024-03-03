import clsx from 'clsx'

type Props = {
  color: string
  name: React.ReactNode
  highlight?: boolean
  clickable?: boolean
  size?: 'normal' | 'smol'
}

export function Tag({
  color,
  name,
  highlight,
  clickable,
  size = 'normal',
}: Props) {
  return (
    <div style={{ color }}>
      <div
        className={clsx(
          `group/tag relative flex rounded-full border border-current font-pixel
          font-normal leading-none`,
          size === 'normal' &&
            'px-2 py-[5px] text-[11px] antialiased [font-feature-settings:ss01]',
          size === 'smol' && 'px-1.5 py-[3px] text-[9px]',
        )}
      >
        <div className="pointer-events-none absolute inset-0 rounded-full bg-current opacity-20" />
        <div
          className={clsx(
            `pointer-events-none absolute inset-0 rounded-full
            shadow-[0_0_6px_2px_color-mix(in_srgb,currentColor_50%,transparent)]
            transition-opacity duration-500`,
            highlight ? 'opacity-100' : 'opacity-0',
            clickable && !highlight && 'group-hover/tag:opacity-50',
          )}
        />
        <div
          className="relative text-nowrap text-[color-mix(in_srgb,currentColor_50%,white)]
            brightness-150"
        >
          {name}
        </div>
      </div>
    </div>
  )
}
