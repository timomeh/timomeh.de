// extract the top h1 from a markdown document
export function markdownHeadline(md: string) {
  return md.trim().match(/^# (.+)/)?.[1]
}
