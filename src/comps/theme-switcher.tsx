'use client'

export function ThemeSwitcher() {
  return (
    <button
      title="Switch color mode"
      className="group/btn relative -m-1 block p-1 opacity-70 transition-opacity
        hover:opacity-100 active:scale-95"
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
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="overflow-visible [&_*]:transition-[transform,opacity] [&_*]:duration-300"
        >
          <g className="origin-center scale-[0.6] dark:scale-100">
            <mask
              id="moon-mask"
              maskUnits="userSpaceOnUse"
              x="2"
              y="2"
              width="20"
              height="20"
            >
              <rect x="2" y="2" width="20" height="20" fill="white" />
              <path
                d="M2 16H4V18H6V20H8V22H2V16Z"
                fill="black"
                id="rotate"
                className="translate-y-1 dark:translate-y-0"
              />
              <path
                d="M14 2H22V10H20V12H18V14H12V12H10V6H12V4H14V2Z"
                fill="black"
                className="origin-top-right -translate-y-1 translate-x-3 dark:translate-x-0
                  dark:translate-y-0 dark:group-hover/btn:scale-90"
                id="crescent"
              />
              <rect
                id="auto"
                x="1"
                y="13"
                width="8"
                height="10"
                fill="black"
                className="-translate-x-3 translate-y-3 group-data-[theme=system]/root:-translate-x-0.5
                  group-data-[theme=system]/root:translate-y-0.5
                  dark:group-data-[theme=system]/root:translate-x-0
                  dark:group-data-[theme=system]/root:translate-y-0"
              />
            </mask>
            <g mask="url(#moon-mask)">
              <path
                d="M6 2V4H4V6H2V18H4V20H6V22H18V20H20V18H22V6H20V4H18V2H6Z"
                fill="currentColor"
              />
            </g>
          </g>
          <g
            id="rays"
            className="origin-center rotate-0 opacity-100 group-hover/btn:rotate-12 dark:rotate-45
              dark:opacity-0"
          >
            <path d="M13 1H11V4H13V1Z" fill="currentColor" />
            <path d="M13 20H11V23H13V20Z" fill="currentColor" />
            <path d="M1 11H4V13H1V11Z" fill="currentColor" />
            <path d="M23 11H20V13H23V11Z" fill="currentColor" />
            <path d="M4 4H6V6H4V4Z" fill="currentColor" />
            <path d="M20 18H18V20H20V18Z" fill="currentColor" />
            <path
              d="M4 18H6V20H4V18Z"
              fill="currentColor"
              className="group-data-[theme=system]/root:opacity-0"
            />
            <path d="M20 4H18V6H20V4Z" fill="currentColor" />
          </g>
          <path
            id="a-letter"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M1 15V23H3V21H5V23H7V15H1ZM5 19V17H3V19H5Z"
            fill="currentColor"
            className="origin-bottom-left scale-75 opacity-0 group-data-[theme=system]/root:scale-100
              group-data-[theme=system]/root:opacity-100"
          />
        </svg>
      </div>
    </button>
  )
}
