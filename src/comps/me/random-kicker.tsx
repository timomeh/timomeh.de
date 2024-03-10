'use client'

import { usePathname } from 'next/navigation'
import Prando from 'prando'

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

export function RandomKicker() {
  const pathname = usePathname()
  const sentence = new Prando(
    pathname + new Date().toISOString().split('T')[0],
  ).nextArrayItem(sentences)

  return <div suppressHydrationWarning>{sentence}</div>
}
