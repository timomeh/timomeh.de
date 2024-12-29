'use client'

export function ThemeSwitcher() {
  return (
    <button
      title="Switch color mode"
      className="relative -m-1 block p-1 opacity-70 transition-opacity hover:opacity-100
        active:scale-95"
      value="light"
      type="button"
      onClick={() => {
        const currentTheme =
          document.documentElement.getAttribute('data-theme') || 'system'
        const prefersDark = window.matchMedia(
          '(prefers-color-scheme: dark)',
        ).matches
        const prefersDarkOrder = ['system', 'light', 'dark']
        const prefersLightOrder = ['system', 'dark', 'light']
        const order = prefersDark ? prefersDarkOrder : prefersLightOrder

        const newTheme = order[(order.indexOf(currentTheme) + 1) % order.length]

        document.documentElement.setAttribute('data-theme', newTheme)

        if (newTheme !== 'system') {
          localStorage.setItem('theme', newTheme)
        } else {
          localStorage.removeItem('theme')
        }
      }}
    >
      <div className="size-4">
        <svg
          width="72"
          height="48"
          viewBox="0 0 72 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="pointer-events-none relative -left-[100%] h-[200%] w-[300%] overflow-visible
            [&>*]:transition [&>*]:duration-1000
            group-data-[theme=system]/root:[&>*]:duration-300"
        >
          <g
            id="moon"
            className="-translate-x-[50%] translate-y-[50%] opacity-0
              group-data-[theme=dark]/root:translate-x-0
              group-data-[theme=dark]/root:translate-y-0
              group-data-[theme=dark]/root:opacity-100
              dark:group-data-[theme=system]/root:translate-x-0
              dark:group-data-[theme=system]/root:translate-y-0"
          >
            <path
              id="moon-path"
              d="M30 2H38V4H36V6H34V12H36V14H42V12H44V10H46V18H44V20H42V22H32V20H30V18H28V16H26V6H28V4H30V2Z"
              fill="currentColor"
            />
          </g>
          <g
            id="sun"
            className="translate-x-[50%] translate-y-[50%] opacity-0
              group-data-[theme=light]/root:translate-x-0
              group-data-[theme=light]/root:translate-y-0
              group-data-[theme=system]/root:translate-x-0
              group-data-[theme=system]/root:translate-y-0
              group-data-[theme=light]/root:opacity-100
              dark:group-data-[theme=system]/root:!translate-x-[50%]
              dark:group-data-[theme=system]/root:!translate-y-[50%]"
          >
            <g id="sun-path">
              <path d="M37 1H35V4H37V1Z" fill="currentColor" />
              <path d="M37 20H35V23H37V20Z" fill="currentColor" />
              <path
                d="M32 6H40V8H42V16H40V18H32V16H30V8H32V6Z"
                fill="currentColor"
              />
              <path d="M25 11H28V13H25V11Z" fill="currentColor" />
              <path d="M47 11H44V13H47V11Z" fill="currentColor" />
              <path d="M28 4H30V6H28V4Z" fill="currentColor" />
              <path d="M44 18H42V20H44V18Z" fill="currentColor" />
              <path d="M28 18H30V20H28V18Z" fill="currentColor" />
              <path d="M44 4H42V6H44V4Z" fill="currentColor" />
            </g>
          </g>
          <g
            id="sun-auto"
            className="translate-x-[50%] translate-y-[50%] opacity-0
              group-data-[theme=light]/root:translate-x-0
              group-data-[theme=light]/root:translate-y-0
              group-data-[theme=system]/root:translate-x-0
              group-data-[theme=system]/root:translate-y-0
              group-data-[theme=system]/root:opacity-100
              dark:group-data-[theme=system]/root:!translate-x-[50%]
              dark:group-data-[theme=system]/root:!translate-y-[50%]
              dark:group-data-[theme=system]/root:!opacity-0"
          >
            <path
              id="sun-auto-path"
              fillRule="evenodd"
              clipRule="evenodd"
              d="M25 15V23H27V21H29V23H31V15H25ZM29 19V17H27V19H29Z"
              fill="currentColor"
            />
            <g id="sun-half-path">
              <path d="M37 1H35V4H37V1Z" fill="currentColor" />
              <path d="M37 20H35V23H37V20Z" fill="currentColor" />
              <path
                d="M32 6H40V8H42V16H40V18H33V13H30V8H32V6Z"
                fill="currentColor"
              />
              <path d="M25 11H28V13H25V11Z" fill="currentColor" />
              <path d="M47 11H44V13H47V11Z" fill="currentColor" />
              <path d="M28 4H30V6H28V4Z" fill="currentColor" />
              <path d="M44 18H42V20H44V18Z" fill="currentColor" />
              <path d="M44 4H42V6H44V4Z" fill="currentColor" />
            </g>
          </g>
          <g
            id="moon-auto"
            className="-translate-x-[50%] translate-y-[50%] opacity-0
              group-data-[theme=dark]/root:translate-x-0
              group-data-[theme=dark]/root:translate-y-0
              dark:group-data-[theme=system]/root:translate-x-0
              dark:group-data-[theme=system]/root:translate-y-0
              dark:group-data-[theme=system]/root:opacity-100"
          >
            <path
              id="moon-half-path"
              d="M30 2H38V4H36V6H34V12H36V14H42V12H44V10H46V18H44V20H42V22H33V13H26V6H28V4H30V2Z"
              fill="currentColor"
            />
            <path
              id="moon-auto-path"
              fillRule="evenodd"
              clipRule="evenodd"
              d="M25 15V23H27V21H29V23H31V15H25ZM29 19V17H27V19H29Z"
              fill="currentColor"
            />
          </g>
        </svg>
      </div>
    </button>
  )
}
