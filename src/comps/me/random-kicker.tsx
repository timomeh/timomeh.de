'use client'

import { usePathname } from 'next/navigation'
import Prando from 'prando'
import { useEffect, useRef, useState } from 'react'

const sentences = [
  'a head full of software engineering by',
  'a head full of dumb ideas by',
  'a head full of memes by',
  'a head full of incoherent words by',
  'a head full of memories by',
  'a head full of useless knowledge by',
  'a head full of music on repeat by',
  'a head full of caching issues by',
]

type Props = {
  seed: number
}

function randomSentence() {
  return new Prando().nextArrayItem(sentences)
}

export function RandomKicker({ seed }: Props) {
  const [sentence, setSentence] = useState(() =>
    new Prando(seed).nextArrayItem(sentences),
  )
  const pathname = usePathname()
  const prevPathname = useRef<string>(pathname)

  useEffect(() => {
    if (pathname === prevPathname.current) {
      prevPathname.current = pathname
      return
    }

    prevPathname.current = pathname
    setSentence(randomSentence())
  }, [pathname])

  return <>{sentence}</>
}
