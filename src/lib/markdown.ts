import { unified } from 'unified'
import remarkParse from 'remark-parse'
import rehypeGfm from 'remark-gfm'
import remarkBreaks from 'remark-breaks'
import remarkUnwrapImages from 'remark-unwrap-images'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import rehypePrismPlus from 'rehype-prism-plus'
import rehypeRaw from 'rehype-raw'
import rehypeSlug from 'rehype-slug'
import rehypeExternalImgSize from 'rehype-external-img-size'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'

export async function markdownToHtml(markdown: string) {
  const titleExp = /^# (.*$)/gim
  const bodyWithoutTitle = markdown.replace(titleExp, '').trim()

  const vfile = await unified()
    .use(remarkParse)
    .use(remarkBreaks)
    .use(remarkUnwrapImages)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeExternalImgSize)
    .use(rehypePrismPlus)
    .use(rehypeGfm)
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, {
      behavior: 'append',
    })
    .use(rehypeStringify)
    .process(bodyWithoutTitle)

  return vfile.value.toString()
}

export async function markdownTitleToHtml(markdown: string) {
  const vfile = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeStringify)
    .process(markdown)

  const h1Exp = /(<h1>|<\/h1>)/gim

  return vfile.value.toString().replace(h1Exp, '')
}
