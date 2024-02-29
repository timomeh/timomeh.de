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
        className="-my-1 rounded-md border border-white/10 bg-[#121014] bg-opacity-70 px-1.5 py-1
          font-mono text-[0.9em] font-normal text-current shadow-purple-300/5
          before:content-none after:content-none"
      />
    )
  }

  if (!props.children || typeof props.children !== 'string') {
    return
  }

  let lang: string | undefined = props.className?.replace('language-', '')
  if (lang && ['plain'].includes(lang)) lang = 'text'
  const html = await syntax.highlight(props.children, lang || 'text')

  return <div dangerouslySetInnerHTML={{ __html: html }} />
}
