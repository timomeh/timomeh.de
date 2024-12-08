export function HeaderBackdropHaze() {
  return (
    <div
      className="pointer-events-none absolute left-0 right-0 top-0 z-0 flex items-center
        overflow-x-clip mix-blend-multiply sm:justify-center dark:mix-blend-difference"
    >
      <div
        className="absolute -ml-[40%] mt-40 hidden h-[400px] w-[600px] rotate-6 transform
          bg-gradient-radial from-purple-300 opacity-15 sm:ml-0 dark:block"
      />
      <div className="-ml-[240px] -mt-14 h-[272px] w-[600px] text-beige sm:ml-20 dark:hidden">
        <svg
          width="600"
          height="272"
          xmlns="http://www.w3.org/2000/svg"
          className="block"
        >
          <path
            d="M261.5 159c-22 0-85.5-17.5-80-36 4.459-15 46 0 80 0s59-15.5 84.5-21 11.891 18.76 0 29c-18 15.5-48 28-84.5 28Z"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeOpacity="0.2"
            fill="currentColor"
            fillOpacity=".1"
          />
          <path
            d="M180 166c-34-8.5-61.5-37-40-69 11.422-17 40-10.5 62 0s64 26 111 0 135-31 132-10.5-37.712 40.145-65.5 51C347.5 150 337 192 305 198s-91-23.5-125-32Z"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeOpacity="0.2"
            fill="currentColor"
            fillOpacity=".1"
          />
          <path
            d="M94.5 100C88 77 69 65 80.5 49.5 107.581 13 219.5 93 263.5 92s98-42.5 143.5-52.5 122.5 10 116.5 40-57 47.5-88.5 62S356.5 234 314 236s-88.5-28.5-112-36-87.5-11.5-107.5-24.5 6.5-52.5 0-75.5Z"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeOpacity="0.2"
            fill="currentColor"
            fillOpacity=".1"
          />
          <path
            d="M38 82.5C29.626 72.394-2 26 28 13.5c40.8-17 94.5 6 140 34S294.5 61 351.5 35 557-2 577 41.5s-20.5 69-69 86.5-66.5 76-76.5 92.5c-20.606 34-56.5 48.5-115 48.5-31.016 0-57-26.5-120-37-23.101-3.85-85.5 0-109-17.5-13.191-9.823-22.5-31-15.5-66s-19.5-48.5-34-66Z"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeOpacity="0.2"
            fill="currentColor"
            fillOpacity=".1"
          />
        </svg>
      </div>
    </div>
  )
}
