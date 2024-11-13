export function parseMdTitle(markdown: string) {
  const lines = markdown.split('\n')

  for (const line of lines) {
    const trimmedLine = line.trim()

    if (trimmedLine === '') continue

    if (trimmedLine.startsWith('# ') && !trimmedLine.startsWith('##')) {
      return trimmedLine
    }

    break // Stop if the first non-blank line isn't an H1
  }

  return null
}
