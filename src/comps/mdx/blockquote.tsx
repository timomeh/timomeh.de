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
      <div className="absolute -inset-y-4 inset-x-0 shadow-xl sm:-inset-x-4 sm:-inset-y-5">
        <div className="absolute bottom-0 left-[1px] top-0 opacity-50">
          <div className="size-3 rounded-tl-full border-l-[2px] border-t-[2px] border-yellow-300" />
          <div className="absolute bottom-3 top-3 w-0 border-l-[2px] border-yellow-300" />
          <div
            className="absolute right-full top-4 size-0 border-x-[4px] border-y-[5px]
              border-transparent border-r-transparent border-r-yellow-300 border-t-yellow-300"
          />
          <div
            className="absolute bottom-0 size-3 rounded-bl-full border-b-[2px] border-l-[2px]
              border-yellow-300"
          />
        </div>
        <div className="absolute inset-y-0 left-[1px] right-0 rounded-xl bg-yellow-50/5" />
        <div className="absolute inset-y-0 left-[1px] right-0 rounded-xl bg-crt-lines opacity-5" />
      </div>
      <div className="relative">{children}</div>
    </blockquote>
  )
}
