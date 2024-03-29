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
      transformerNotationDiff(),
      transformerNotationHighlight(),
      transformerNotationWordHighlight(),
      transformerNotationFocus(),
      transformerNotationErrorLevel(),
    ],
  })
  return html
}
