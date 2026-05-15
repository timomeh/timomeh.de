import { PageFooter } from '@/comps/layout/page-footer'
import { PageMain } from '@/comps/layout/page-main'
import { PageNav } from '@/comps/layout/page-nav'

import { PostsList } from './posts-list'

export default async function Page() {
  return (
    <>
      <PageNav />
      <PageMain>
        <PostsList />
      </PageMain>
      <PageFooter />
    </>
  )
}

export async function generateMetadata() {
  return {
    description: `About blog about software development, music, my life, and other random thoughts I wanted to elaborate on.`,
  }
}
