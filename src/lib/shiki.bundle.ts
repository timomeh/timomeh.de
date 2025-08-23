/* Generate by @shikijs/codegen */
import {
  createdBundledHighlighter,
  createSingletonShorthands,
} from '@shikijs/core'
import { createJavaScriptRegexEngine } from '@shikijs/engine-javascript'
import type {
  DynamicImportLanguageRegistration,
  DynamicImportThemeRegistration,
  HighlighterGeneric,
} from '@shikijs/types'

type BundledLanguage =
  | 'css'
  | 'docker'
  | 'dockerfile'
  | 'dotenv'
  | 'elixir'
  | 'fish'
  | 'git-commit'
  | 'git-rebase'
  | 'go'
  | 'graphql'
  | 'gql'
  | 'html'
  | 'javascript'
  | 'js'
  | 'json'
  | 'json5'
  | 'jsx'
  | 'markdown'
  | 'md'
  | 'mdx'
  | 'ruby'
  | 'rb'
  | 'shellscript'
  | 'bash'
  | 'sh'
  | 'shell'
  | 'zsh'
  | 'shellsession'
  | 'console'
  | 'toml'
  | 'tsx'
  | 'typescript'
  | 'ts'
  | 'yaml'
  | 'yml'
type BundledTheme = 'one-light' | 'tokyo-night'
type Highlighter = HighlighterGeneric<BundledLanguage, BundledTheme>

const bundledLanguages = {
  css: () => import('@shikijs/langs/css'),
  docker: () => import('@shikijs/langs/docker'),
  dockerfile: () => import('@shikijs/langs/docker'),
  dotenv: () => import('@shikijs/langs/dotenv'),
  elixir: () => import('@shikijs/langs/elixir'),
  fish: () => import('@shikijs/langs/fish'),
  'git-commit': () => import('@shikijs/langs/git-commit'),
  'git-rebase': () => import('@shikijs/langs/git-rebase'),
  go: () => import('@shikijs/langs/go'),
  graphql: () => import('@shikijs/langs/graphql'),
  gql: () => import('@shikijs/langs/graphql'),
  html: () => import('@shikijs/langs/html'),
  javascript: () => import('@shikijs/langs/javascript'),
  js: () => import('@shikijs/langs/javascript'),
  json: () => import('@shikijs/langs/json'),
  json5: () => import('@shikijs/langs/json5'),
  jsx: () => import('@shikijs/langs/jsx'),
  markdown: () => import('@shikijs/langs/markdown'),
  md: () => import('@shikijs/langs/markdown'),
  mdx: () => import('@shikijs/langs/mdx'),
  ruby: () => import('@shikijs/langs/ruby'),
  rb: () => import('@shikijs/langs/ruby'),
  shellscript: () => import('@shikijs/langs/shellscript'),
  bash: () => import('@shikijs/langs/shellscript'),
  sh: () => import('@shikijs/langs/shellscript'),
  shell: () => import('@shikijs/langs/shellscript'),
  zsh: () => import('@shikijs/langs/shellscript'),
  shellsession: () => import('@shikijs/langs/shellsession'),
  console: () => import('@shikijs/langs/shellsession'),
  toml: () => import('@shikijs/langs/toml'),
  tsx: () => import('@shikijs/langs/tsx'),
  typescript: () => import('@shikijs/langs/typescript'),
  ts: () => import('@shikijs/langs/typescript'),
  yaml: () => import('@shikijs/langs/yaml'),
  yml: () => import('@shikijs/langs/yaml'),
} as Record<BundledLanguage, DynamicImportLanguageRegistration>

const bundledThemes = {
  'one-light': () => import('@shikijs/themes/one-light'),
  'tokyo-night': () => import('@shikijs/themes/tokyo-night'),
} as Record<BundledTheme, DynamicImportThemeRegistration>

const createHighlighter = /* @__PURE__ */ createdBundledHighlighter<
  BundledLanguage,
  BundledTheme
>({
  langs: bundledLanguages,
  themes: bundledThemes,
  engine: () => createJavaScriptRegexEngine(),
})

const {
  codeToHtml,
  codeToHast,
  codeToTokensBase,
  codeToTokens,
  codeToTokensWithThemes,
  getSingletonHighlighter,
  getLastGrammarState,
} = /* @__PURE__ */ createSingletonShorthands<BundledLanguage, BundledTheme>(
  createHighlighter,
)

export {
  bundledLanguages,
  bundledThemes,
  codeToHast,
  codeToHtml,
  codeToTokens,
  codeToTokensBase,
  codeToTokensWithThemes,
  createHighlighter,
  getLastGrammarState,
  getSingletonHighlighter,
}
export type { BundledLanguage, BundledTheme, Highlighter }
