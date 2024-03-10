/* eslint-disable unused-imports/no-unused-vars */

// FIXME: The tags should be more unique for better caching and invalidation.
// But this causes issues with Vercel right now where deployments won't work.
// See https://github.com/orgs/vercel/discussions/6082

export const cacheTag = {
  discussions: {
    list: ({ label = '' } = {}) => ['github/discussions/list'],
    get: (slug: string) => ['github/discussion/single'],
  },
  labels: {
    list: () => ['github/labels/list'],
    get: (name: string) => ['github/label/single'],
  },
}
