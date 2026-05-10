import { ArrowLeft } from 'lucide-react'

import { BackLink } from '../../../../../comps/back-link'

export default async function Page() {
  return (
    <div className="flex py-1 flex-nowrap space-x-4">
      <BackLink
        className="
          hover:underline hover:opacity-100
          opacity-70 transition-all back-link
        "
      >
        <ArrowLeft className="inline-block size-3 mr-1 -mt-0.5" />
        <span>Back to Posts</span>
      </BackLink>
    </div>
  )
}

export async function generateStaticParams() {
  return []
}
