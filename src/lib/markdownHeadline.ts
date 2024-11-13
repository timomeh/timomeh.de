export function markdownHeadline(md: string) {
  return md.trim().match(/^# (.+)/)?.[1]
}
