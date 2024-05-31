'use client'

import { usePathname } from 'next/navigation'
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
  'a head full of oat milk cappuccinos by',
]

function randomSentence() {
  return sentences[Math.floor(Math.random() * (sentences.length - 1)) + 1]
}

export function RandomKicker() {
  const pathname = usePathname()
  const [sentence, setSentence] = useState(sentences[0])
  const prevPathname = useRef(pathname)

  useEffect(() => {
    if (pathname === prevPathname.current) {
      prevPathname.current = pathname
      return
    }

    prevPathname.current = pathname
    setSentence(randomSentence())
  }, [pathname])

  return <span>{sentence}</span>
}
