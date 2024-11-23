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
    'log',
  ]

  const colors: Record<string, string> = {
    css: 'bg-[rebeccapurple] text-[#d2b7ed]',
    html: 'bg-[#f06529]',
    js: 'bg-[#f7df1e]',
    jsx: 'bg-[#f7df1e]',
    ts: 'bg-[#f7df1e]',
    tsx: 'bg-[#f7df1e]',
    ruby: 'bg-[#A91401] text-[#f2d6d3]',
    rb: 'bg-[#A91401] text-[#f2d6d3]',
    elixir: 'bg-[#48205D] text-[#e1c5f0]',
  }

  return (
    <div
      className="not-prose relative my-8 rounded-md border border-white/10 text-sm font-normal
        shadow-purple-300/5 [box-shadow:0_0_24px_var(--tw-shadow-color)] md:-mx-4"
    >
      <div dangerouslySetInnerHTML={{ __html: html }} className="rounded-md" />
      {lang && !hiddenLangs.includes(lang) && (
        <span
          className={`absolute right-0 top-0 select-none rounded-bl rounded-tr px-1.5 pb-1 pt-1
          text-2xs font-bold uppercase leading-none text-[#1a1b26] ${ colors[lang] ||
          'bg-[#BB9AF7]/80' }`}
        >
          {lang}
        </span>
      )}
    </div>
  )
}
