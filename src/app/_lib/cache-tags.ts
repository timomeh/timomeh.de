export const cacheTag = {
  discussions: {
    list: ({ label = 'all' } = {}) => [`github/discussions/list:${label}`],
    get: (slug: string) => [`github/discussion/slug:${slug}`],
  },
  labels: {
    list: () => ['github/labels/list'],
    get: (name: string) => [`github/label/name:${name}`],
  },
}
