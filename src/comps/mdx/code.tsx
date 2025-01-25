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
        className="bg-opacity-70 -my-1 rounded-md border border-gray-400/50 bg-white/30 px-1.5 py-1
          font-mono text-[0.9em] font-semibold text-current shadow-purple-300/5
          before:content-none after:content-none dark:border-white/10 dark:bg-[#121014]
          dark:font-normal"
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
      className="not-prose border-beige/30 shadow-beige/20 relative my-8 rounded-md border
        text-sm leading-6 font-normal [box-shadow:0_0_24px_var(--tw-shadow-color)]
        md:-mx-4 dark:border-white/10 dark:shadow-purple-300/5"
    >
      <div dangerouslySetInnerHTML={{ __html: html }} className="rounded-md" />
      {lang && !hiddenLangs.includes(lang) && (
        <span
          className={`text-2xs absolute top-0 right-0 rounded-tr rounded-bl px-1.5 pt-1 pb-1
          leading-none font-bold text-[#1a1b26] uppercase select-none ${ colors[lang] ||
          'bg-[#BB9AF7]/80' }`}
        >
          {lang}
        </span>
      )}
    </div>
  )
}
