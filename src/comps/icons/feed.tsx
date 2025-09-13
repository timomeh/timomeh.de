export function FeedIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-full overflow-visible *:transition-all *:duration-500
        *:ease-[cubic-bezier(.3,.2,.17,3)]"
    >
      <title>Feed</title>
      <g
        className="origin-bottom-left group-hover/btn:-translate-x-px
          group-hover/btn:translate-y-px"
      >
        <path
          id="l"
          d="M4 2H6H8H10V4H12H14V6H16V8H18V10H20V12V14H22V16V18V20V22H20H18V20V18V16V14H16V12H14V10H12V8H10V6H8H6H4H2V4V2H4Z"
          fill="currentColor"
        />
      </g>
      <g
        className="origin-bottom-left group-hover/btn:-translate-x-[0.5px]
          group-hover/btn:translate-y-[0.5px]"
      >
        <path
          id="m"
          d="M8 10H6H4H2V12V14H4H6V16H8V18H10V20V22H12H14V20V18H12V16V14H10V12H8V10Z"
          fill="currentColor"
        />
      </g>
      <g className="origin-bottom-left group-hover/btn:scale-90">
        <path id="s" d="M6 18H4H2V20V22H4H6V20V18Z" fill="currentColor" />
      </g>
    </svg>
  )
}
