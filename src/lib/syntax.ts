import {
  transformerNotationDiff,
  transformerNotationErrorLevel,
  transformerNotationFocus,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
  transformerRenderWhitespace,
} from '@shikijs/transformers'
import { memoize } from 'nextjs-better-unstable-cache'
import { codeToHtml } from 'shiki'

// basically smol wrapper around shiki

export async function highlight(code: string, lang: string) {
  const html = codeToHtml(code, {
    lang,
    themes: {
      dark: 'tokyo-night',
      light: 'one-light',
    },
    transformers: [
      transformerNotationDiff({
        matchAlgorithm: 'v3',
      }),
      transformerNotationHighlight({
        matchAlgorithm: 'v3',
      }),
      transformerNotationWordHighlight({
        matchAlgorithm: 'v3',
      }),
      transformerNotationFocus({
        matchAlgorithm: 'v3',
      }),
      transformerNotationErrorLevel({
        matchAlgorithm: 'v3',
      }),
      transformerRenderWhitespace({ position: 'boundary' }),
    ],
  })
  return html
}

export const highlightCached = memoize(
  async (code: string, lang: string) => {
    const html = await highlight(code, lang)
    return html
  },
  {
    revalidateTags: (_code, lang) => ['shiki', `shiki-lang:${lang}`],
  },
)
