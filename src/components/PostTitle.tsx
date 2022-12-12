import clsx from 'clsx'
import { markdownTitleToHtml } from '../lib/markdown'

type Props = {
  title: string
  className?: string
}

export async function PostTitle({ title, className }: Props) {
  const htmlTitle = await markdownTitleToHtml(title)

  return (
    <span
      className={clsx(
        'prose-base leading-tight [font-size:inherit] prose text-black',
        'prose-code:bg-fuchsia-100 prose-code:font-normal prose-code:text-fuchsia-900 prose-code:py-0.5 prose-code:px-2 prose-code:rounded-md prose-code:mx-0.5 prose-code:before:content-none prose-code:after:content-none',
        className
      )}
      dangerouslySetInnerHTML={{ __html: htmlTitle }}
    />
  )
}
