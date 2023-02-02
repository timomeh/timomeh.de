import path from 'node:path'
import shiki from 'shiki'

const theme = 'tokyo-night'
const themesPath = path.resolve(process.cwd(), 'src/styles')
let highlighter: shiki.Highlighter

const supportedLangs = new Set<string | undefined>(
  shiki.BUNDLED_LANGUAGES.map((lang) => lang.embeddedLangs)
    .flat()
    .filter(Boolean)
)

export async function highlight(code: string, lang: string) {
  highlighter ||= await shiki.getHighlighter({
    theme,
    paths: { themes: themesPath },
  })
  const tokens = highlighter.codeToThemedTokens(
    code,
    supportedLangs.has(lang) ? lang : undefined
  )
  const html = shiki.renderToHtml(tokens, {
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
