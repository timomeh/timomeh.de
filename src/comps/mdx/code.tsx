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

  const hiddenLangs = [
    'text',
    'sh',
    'git-commit',
    'git-rebase',
    'plain',
    'txt',
    'console',
    'bash',
    'shellscript',
    'zsh',
    'shellsession',
  ]

  return (
    <div
      className="not-prose relative my-12 overflow-clip rounded-md border border-white/10 text-sm
        font-normal shadow-purple-300/5 [box-shadow:0_0_24px_var(--tw-shadow-color)]
        md:-mx-4"
    >
      <div dangerouslySetInnerHTML={{ __html: html }} />
      {lang && !hiddenLangs.includes(lang) && (
        <span
          className="absolute right-1 top-1 select-none font-pixel text-3xs font-bold text-[#a9b1d6]
            opacity-50"
        >
          {lang}
        </span>
      )}
    </div>
  )
}
