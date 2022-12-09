'use client'

import Giscus from '@giscus/react'

type Props = {
  discussionNumber: number
}

export function PostComments({ discussionNumber }: Props) {
  return (
    <Giscus
      id="comments"
      repo="timomeh/timomeh.de"
      repoId="R_kgDOH6oEFg="
      mapping="number"
      term={discussionNumber.toString()}
      reactionsEnabled="1"
      emitMetadata="0"
      inputPosition="bottom"
      theme="light"
      lang="en"
      loading="lazy"
    />
  )
}
