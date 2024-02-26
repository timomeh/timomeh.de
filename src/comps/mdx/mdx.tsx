import remarkEmbedder, { TransformerInfo } from '@remark-embedder/core'
import oembedTransformer from '@remark-embedder/transformer-oembed'
import { MDXRemote, MDXRemoteProps } from 'next-mdx-remote/rsc'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'
import remarkUnwrapImages from 'remark-unwrap-images'

import { Anchor } from './anchor'
import { Code } from './code'
import { Del } from './del'
import { Heading } from './heading'
import { Img } from './img'
import { Video } from './video'

type Props = {
  content: string
  inline?: boolean
}

type MDXComponents = MDXRemoteProps['components']

export function MDX({ content, inline }: Props) {
  return (
    <MDXRemote
      source={content}
      components={{
        ...components,
        ...(inline && inlineComponents),
      }}
      options={{
        mdxOptions: {
          format: 'md',
          remarkPlugins: [
            remarkGfm,
            remarkUnwrapImages,
            [
              remarkEmbedder,
              {
                transformers: [oembedTransformer],
                handleHTML,
              },
            ],
          ],
          rehypePlugins: [rehypeRaw],
        },
      }}
    />
  )
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

const components: MDXComponents = {
  img: Img,
  code: Code,
  video: Video,
  a: Anchor,
  del: Del,
  pre: (props) => <>{props.children}</>,
  h1: (props) => <Heading element="h1" {...props} />,
  h2: (props) => <Heading element="h2" {...props} />,
  h3: (props) => <Heading element="h3" {...props} />,
  h4: (props) => <Heading element="h4" {...props} />,
  h5: (props) => <Heading element="h5" {...props} />,
  h6: (props) => <Heading element="h6" {...props} />,
}

const inlineComponents: MDXComponents = {
  p: (props) => <>{props.children}</>,
}
