export function pluralizePosts(count: number) {
  if (count === 1) return '1 Post'
  return `${count} Posts`
}
