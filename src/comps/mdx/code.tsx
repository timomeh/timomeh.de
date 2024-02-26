import * as syntax from '@/lib/syntax'

type Props = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLElement>,
  HTMLElement
>

export async function Code(props: Props) {
  const isInline = !props.className || typeof props.children !== 'string'
  if (isInline) {
    return (
      <code
        {...props}
        className="-mx-[3px] bg-emerald-400/10 px-[5px] py-[3px] font-mono font-bold
          text-emerald-50"
      />
    )
  }

  if (!props.children || typeof props.children !== 'string') {
    return
  }

  let lang: string | undefined = props.className?.replace('language-', '')
  if (lang && ['text', 'txt', 'plain'].includes(lang)) lang = undefined
  const html = await syntax.highlight(props.children, lang)

  return (
    <pre
      className="not-prose my-12 overflow-scroll rounded-lg border border-violet-400/10
        bg-[#1a1b26] bg-opacity-60 p-4 text-sm font-medium shadow-violet-300/10
        [box-shadow:0_0_24px_var(--tw-shadow-color)] md:-mx-4"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
