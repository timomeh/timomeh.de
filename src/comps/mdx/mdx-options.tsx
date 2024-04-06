import remarkEmbedder, { TransformerInfo } from '@remark-embedder/core'
import oembedTransformer from '@remark-embedder/transformer-oembed'
import { SerializeOptions } from 'next-mdx-remote/dist/types'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'
import remarkUnwrapImages from 'remark-unwrap-images'

export const mdxOptions: SerializeOptions['mdxOptions'] = {
  format: 'md',
  remarkPlugins: [
    remarkGfm,
    remarkUnwrapImages,
    [
      // @ts-expect-error
      remarkEmbedder,
      {
        transformers: [oembedTransformer],
        handleHTML,
      },
    ],
  ],
  rehypePlugins: [rehypeRaw],
}

function handleHTML(html: string, info: TransformerInfo) {
  const { url, transformer } = info
  if (
    transformer.name === '@remark-embedder/transformer-oembed' ||
    url.includes('youtube.com')
  ) {
    const noCookieHtml = html.replace('youtube.com', 'youtube-nocookie.com')
    return `<div className="oembed oembed-youtube aspect-video rounded-lg overflow-hidden md:-mx-4">${noCookieHtml}</div>`
  }
  return html
}
