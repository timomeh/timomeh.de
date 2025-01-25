type Props = React.DetailedHTMLProps<
  React.BlockquoteHTMLAttributes<HTMLQuoteElement>,
  HTMLQuoteElement
>

export function Blockquote({ children, ...rest }: Props) {
  return (
    <blockquote
      {...rest}
      className="relative my-10 rounded-lg border-none pr-2 pl-5 sm:pl-2"
    >
      {/* ∠ */}
      <div
        className="text-beige absolute inset-x-0 -inset-y-4 sm:-inset-x-4 sm:-inset-y-5
          dark:text-yellow-300 dark:shadow-xl"
      >
        <div className="absolute top-0 bottom-0 left-[1px] opacity-50">
          <div className="absolute top-0 bottom-0 w-0 border-l-[2px] border-current" />
          <div className="absolute top-4 right-full -mr-px w-[15px]">
            <div className="h-[3px] w-[15px] bg-current" />
            <div className="ml-[3px] h-[3px] w-[12px] bg-current" />
            <div className="ml-[6px] h-[3px] w-[9px] bg-current" />
            <div className="ml-[9px] h-[3px] w-[6px] bg-current" />
            <div className="ml-[12px] h-[3px] w-[3px] bg-current" />
          </div>
        </div>
        <div
          className="bg-beige/20 absolute inset-y-0 right-0 left-[1px] rounded-r-xl
            dark:bg-yellow-50/5"
        />
        <div
          className="bg-crt-lines absolute inset-y-0 right-0 left-[1px] hidden rounded-r-xl opacity-5
            dark:block"
        />
      </div>
      <div className="relative">{children}</div>
    </blockquote>
  )
}
