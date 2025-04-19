type Props = React.DetailedHTMLProps<
  React.BlockquoteHTMLAttributes<HTMLQuoteElement>,
  HTMLQuoteElement
>

export function Blockquote({ children, ...rest }: Props) {
  return (
    <blockquote
      {...rest}
      className="relative border-l-2 border-l-gray-800/25 font-[weight:inherit] text-current
        dark:border-l-white/15"
    >
      {children}
    </blockquote>
  )
}
