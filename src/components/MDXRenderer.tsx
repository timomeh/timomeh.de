import * as React from 'react'
import { MDXRemote, MDXRemoteProps } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'
import * as torchlight from '@/lib/torchlight'

type Props = {
  content: string
  shiftHeadings?: boolean
}

type MDXComponents = MDXRemoteProps['components']

export function MDXRenderer({ content, shiftHeadings }: Props) {
  return (
    <>
      {/* @ts-expect-error Server Component */}
      <MDXRemote
        source={content}
        compiledSource=""
        components={{
          // @ts-expect-error Server Component
          code: async (props) => {
            if (!props.className || typeof props.children !== 'string') {
              return <code {...props} />
            }

            const lang = props.className.replace('language-', '')
            const { code, style } = await torchlight.highlight({
              lang,
              code: props.children,
            })

            console.log(style)

            return (
              <code
                className="torchlight font-light"
                style={style}
                dangerouslySetInnerHTML={{ __html: code }}
              />
            )
          },
          ...(shiftHeadings ? shiftedHeadings : headings),
        }}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm],
          },
        }}
      />
    </>
  )
}

const shiftedHeadings: MDXComponents = {
  h1: (props) => <h2 {...props} />,
  h2: (props) => <h3 {...props} />,
  h3: (props) => <h4 {...props} />,
  h4: (props) => <h5 {...props} />,
  h5: (props) => <h6 {...props} />,
  h6: (props) => <h6 {...props} />,
}

const headings: MDXComponents = {
  h1: (props) => <h1 {...props} />,
  h2: (props) => <h2 {...props} />,
  h3: (props) => <h3 {...props} />,
  h4: (props) => <h4 {...props} />,
  h5: (props) => <h5 {...props} />,
  h6: (props) => <h6 {...props} />,
}
