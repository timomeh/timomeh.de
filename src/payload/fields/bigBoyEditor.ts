import {
  HTMLConverterFeature,
  UploadFeature,
  convertLexicalNodesToHTML,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { CodeBlockFeature } from 'payload-code-block-feature'

export function bigBoyEditor() {
  return lexicalEditor({
    features: ({ defaultFeatures }) => [
      ...defaultFeatures,
      HTMLConverterFeature({
        converters: ({ defaultConverters }) => [
          ...defaultConverters.filter((c) => !c.nodeTypes.includes('upload')),
          {
            converter: ({ node }) => {
              // @ts-expect-error
              const children = node.children as {
                type: string
                text: string
              }[]
              // @ts-expect-error
              const language = node.language as string

              const inner = children.reduce((acc, node) => {
                if (node.type === 'linebreak') return (acc += '\n')
                return (acc += node.text)
              }, '')
              return `<pre><code class="language-${language}">${inner}</code></pre>`
            },
            nodeTypes: ['code'],
          },
          {
            converter: async ({ node, parent }) => {
              const html = await convertLexicalNodesToHTML({
                converters: defaultConverters,
                lexicalNodes: [node],
                parent: { ...node, parent },
              })

              if ('fields' in node) {
                const fields = node.fields as { caption?: typeof node }
                if (fields?.caption) {
                  const figcaption = await convertLexicalNodesToHTML({
                    converters: defaultConverters,
                    // @ts-expect-error
                    lexicalNodes: fields.caption.root.children,
                    parent: {
                      // @ts-expect-error
                      ...fields.caption.root,
                      parent: fields.caption,
                    },
                  })

                  return `<figure>${html}<figcaption>${figcaption}</figcaption></figure>`
                }
              }

              return html
            },
            nodeTypes: ['upload'],
          },
        ],
      }),
      CodeBlockFeature(),
      UploadFeature({
        collections: {
          uploads: {
            fields: [
              {
                name: 'caption',
                type: 'richText',
                editor: lexicalEditor(),
              },
            ],
          },
        },
      }),
    ],
  })
}
