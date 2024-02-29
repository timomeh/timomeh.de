import {
  transformerNotationDiff,
  transformerNotationErrorLevel,
  transformerNotationFocus,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
} from '@shikijs/transformers'
import { codeToHtml } from 'shiki'

export async function highlight(code: string, lang: string) {
  const html = codeToHtml(code, {
    lang,
    theme: 'tokyo-night',
    colorReplacements: {
      '#1a1b26': 'transparent',
    },
    transformers: [
      {
        pre(node) {
          this.addClassToHast(
            node,
            `not-prose my-12 overflow-scroll rounded-md border border-white/10 p-4 text-sm font-normal shadow-purple-300/5 [box-shadow:0_0_24px_var(--tw-shadow-color)] md:-mx-4`,
          )
        },
      },
      transformerNotationDiff(),
      transformerNotationHighlight(),
      transformerNotationWordHighlight(),
      transformerNotationFocus(),
      transformerNotationErrorLevel(),
    ],
  })
  return html
}
