import PostsPage from './page/[page]/page'

// This file wouldn't be necessary if rewrites would be working:
// https://github.com/vercel/next.js/issues/40549

export default function Posts() {
  // @ts-expect-error Server Component
  return <PostsPage params={{ page: '1' }} />
}
