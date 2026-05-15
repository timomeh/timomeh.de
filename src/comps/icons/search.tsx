export function SearchIcon() {
  return (
    <svg
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className="
        h-full w-full overflow-visible
        **:transition-[transform,translate,scale,rotate,opacity] **:duration-300
      "
    >
      <title>Magnifying Glass</title>
      <g className="">
        <mask
          id="glare-mask"
          maskUnits="userSpaceOnUse"
          x="2"
          y="2"
          width="20"
          height="20"
        >
          <rect x="2" y="2" width="20" height="20" fill="white" />
          <path d="M16 8H18V12H16V14H12V12H10V8H12V6H16V8Z" fill="black" />
          <path
            d="M16 8V10H18V12H16V14H12V12H10V8H16Z"
            fill="white"
            className="
              group-hover/btn:-translate-x-2 group-hover/btn:translate-y-2
            "
          />
        </mask>
        <g
          mask="url(#glare-mask)"
          className="origin-top-right group-hover/btn:scale-105"
        >
          <path
            d="M10 2V4H8V6H6V14H8V16H10V18H18V16H20V14H22V6H20V4H18V2H10Z"
            fill="currentColor"
          />
        </g>
        <g>
          <path d="M8 20H6V22H2V18H4V16H8V20Z" fill="currentColor" />
        </g>
      </g>
    </svg>
  )
}
