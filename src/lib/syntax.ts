import path from 'node:path'
import type { Highlighter, Lang } from 'shiki'
import { renderToHtml, getHighlighter } from 'shiki'

const theme = 'tokyo-night'
const themesPath = path.resolve(process.cwd(), 'src/styles')
let highlighter: Highlighter

export async function highlight(code: string, lang: string) {
  highlighter ||= await getHighlighter({
    theme,
    paths: { themes: themesPath },
    langs: [lang as Lang],
  })

  const tokens = highlighter.codeToThemedTokens(code, lang)
  const html = renderToHtml(tokens, {
    fg: highlighter.getForegroundColor(theme),
    bg: highlighter.getBackgroundColor(theme),
    elements: {
      pre({ children }) {
        return children
      },
      code({ children }) {
        return `<code class="language-${lang}">${children}</code>`
      },
      line({ children }) {
        return `<span class="line">${children}</span>`
      },
    },
  })

  return html
}

require('shiki/languages/javascript.tmLanguage.json')
require('shiki/languages/jsx.tmLanguage.json')
require('shiki/languages/js.tmLanguage.json')
require('shiki/languages/typescript.tmLanguage.json')
require('shiki/languages/tsx.tmLanguage.json')
require('shiki/languages/ts.tmLanguage.json')
