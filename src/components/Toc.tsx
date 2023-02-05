'use client'

import * as React from 'react'
import { atom, useAtomValue, useSetAtom } from 'jotai'
import { useMeasure } from 'react-use'
import { motion } from 'framer-motion'
import { inViewAtom } from './InViewMarker'
import clsx from 'clsx'
import Link from 'next/link'

type Bounds = { top: number; bottom: number }
const boundsAtom = atom<{ [name: string]: Bounds }>({})

type Props = {
  children: React.ReactNode
}

export function Toc({ children }: Props) {
  return (
    <div className="flex justify-end sticky top-0 pt-2 pl-2 max-h-screen overflow-scroll">
      <div className="max-w-[240px] ml-2 relative">
        {children}
        <Highlighter />
      </div>
    </div>
  )
}

type EntryProps = {
  children: React.ReactNode
  name: string
}

export function TocEntry({ children, name }: EntryProps) {
  const [ref, { top, bottom }] = useMeasure<HTMLDivElement>()
  const setBounds = useSetAtom(boundsAtom)
  const highlighted = useHighlighted()

  React.useEffect(() => {
    setBounds((cur) => ({ ...cur, [name]: { top, bottom } }))
  }, [top, bottom, name, setBounds])

  return (
    <div ref={ref} className="not-prose">
      <div className="py-1 px-2">
        <a
          href={`#${name}`}
          className={clsx(
            'transition-colors text-[13px] leading-snug block',
            highlighted.includes(name) ? 'text-white' : 'text-white/70'
          )}
        >
          {children}
        </a>
      </div>
    </div>
  )
}

function Highlighter() {
  const inView = useAtomValue(inViewAtom)
  const bounds = useAtomValue(boundsAtom)
  const highlighted = useHighlighted()

  const firstIndex = inView.findIndex((view) => view.name === highlighted[0])
  const before = inView
    .filter((view, i) => !view.inView && i < firstIndex)
    .map(({ name }) => name)

  if (
    highlighted.length < 1 &&
    inView.at(-1) &&
    typeof window !== 'undefined'
  ) {
    highlighted.push(inView.at(-1)!.name)
  }

  const top = before.reduce((acc, name) => {
    return acc + (bounds[name] ? bounds[name].bottom - bounds[name].top : 0)
  }, 0)
  const height = highlighted.reduce((acc, name) => {
    return acc + (bounds[name] ? bounds[name].bottom - bounds[name].top : 0)
  }, 0)

  return (
    <>
      {height > 0 && (
        <motion.div
          className="absolute left-0 right-0 bg-white/5 rounded-md pointer-events-none z-[-1]"
          layout
          transition={{ ease: 'linear' }}
          initial={{ opacity: 0, height, top }}
          animate={{ opacity: 1, height, top }}
          style={{ top, height }}
        />
      )}
    </>
  )
}

function useHighlighted() {
  const inView = useAtomValue(inViewAtom)

  const highlighted = inView
    .filter((view, i) => {
      const isCurrentInView = view.inView
      const isNextInView = i < inView.length && inView[i + 1]?.inView
      return isCurrentInView || isNextInView
    })
    .map(({ name }) => name)

  return highlighted
}
