import {
  BlocksFeature,
  HTMLConverterFeature,
  UploadFeature,
  convertLexicalNodesToHTML,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { Block } from 'payload/types'

export const TypescriptCode: Block = {
  slug: 'typescript-code',
  fields: [
    {
      name: 'code',
      type: 'code',
      label: 'Code',
      admin: {
        language: 'typescript',
      },
    },
  ],
}

export function bigBoyEditor() {
  return lexicalEditor({
    features: ({ defaultFeatures }) => [
      ...defaultFeatures,
      BlocksFeature({
        blocks: [TypescriptCode],
      }),
      HTMLConverterFeature({
        converters: ({ defaultConverters }) => [
          ...defaultConverters.filter((c) => !c.nodeTypes.includes('upload')),
          {
            converter: ({ node }) => {
              if (!('fields' in node)) return ''

              // @ts-expect-error
              if (node.fields.blockType.endsWith('-code')) {
                // @ts-expect-error
                const language = node.fields.blockType.replace('-code', '')
                // @ts-expect-error
                const code = `<pre><code class="language-${language}">${node.fields.code}</code></pre>`

                // @ts-expect-error
                if (node.fields.blockName) {
                  // @ts-expect-error
                  return `<figure>${code}<figcaption>${node.fields.blockName}</figcaption></figure>`
                }

                return code
              }

              return ''
            },
            nodeTypes: ['block'],
          },
          {
            converter: async ({ node, payload }) => {
              if (!payload) return ''

              const upload = await payload.findByID({
                // @ts-expect-error
                id: node.value,
                // @ts-expect-error
                collection: node.relationTo,
              })
              if (!upload) return ''

              const html = `<img src="${upload.url}" alt="${upload.alt || ''}" width="${upload.width}" height="${upload.height}"/>`

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
                    payload: null,
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
