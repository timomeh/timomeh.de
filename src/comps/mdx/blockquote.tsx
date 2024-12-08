type Props = React.DetailedHTMLProps<
  React.BlockquoteHTMLAttributes<HTMLQuoteElement>,
  HTMLQuoteElement
>

export function Blockquote({ children, ...rest }: Props) {
  return (
    <blockquote
      {...rest}
      className="relative my-10 rounded-lg border-none pl-5 pr-2 sm:pl-2"
    >
      {/* ∠ */}
      <div
        className="text-beige absolute -inset-y-4 inset-x-0 sm:-inset-x-4 sm:-inset-y-5
          dark:text-yellow-300 dark:shadow-xl"
      >
        <div className="absolute bottom-0 left-[1px] top-0 opacity-50">
          <div className="absolute bottom-0 top-0 w-0 border-l-[2px] border-current" />
          <div className="absolute right-full top-4 -mr-px w-[15px]">
            <div className="h-[3px] w-[15px] bg-current" />
            <div className="ml-[3px] h-[3px] w-[12px] bg-current" />
            <div className="ml-[6px] h-[3px] w-[9px] bg-current" />
            <div className="ml-[9px] h-[3px] w-[6px] bg-current" />
            <div className="ml-[12px] h-[3px] w-[3px] bg-current" />
          </div>
        </div>
        <div
          className="bg-beige/20 absolute inset-y-0 left-[1px] right-0 rounded-r-xl
            dark:bg-yellow-50/5"
        />
        <div
          className="absolute inset-y-0 left-[1px] right-0 hidden rounded-r-xl bg-crt-lines opacity-5
            dark:block"
        />
      </div>
      <div className="relative">{children}</div>
    </blockquote>
  )
}
