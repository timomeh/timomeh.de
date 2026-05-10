import { ArrowLeft } from 'lucide-react'

import { BackLink } from '../../../../../comps/back-link'

export default async function Page() {
  return (
    <div className="flex flex-nowrap space-x-4 py-1">
      <BackLink
        className="
          back-link opacity-70 transition-all
          hover:underline hover:opacity-100
        "
      >
        <ArrowLeft className="-mt-0.5 mr-1 inline-block size-3" />
        <span>Back to Posts</span>
      </BackLink>
    </div>
  )
}

export async function generateStaticParams() {
  return []
}
