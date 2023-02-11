'use client'

import { atom, useAtom, useSetAtom } from 'jotai'
import * as React from 'react'
import { orderBy } from 'lodash'
import { useInView, motion } from 'framer-motion'
import clsx from 'clsx'
import Balancer from 'react-wrap-balancer'

const tocMarkerAtom = atom<[string, DOMRect][]>([])
const inViewAtom = atom<Record<string, boolean>>({})

type MarkerProps = {
  name: string
  children: React.ReactNode
}

export function TocMarker({ name, children }: MarkerProps) {
  const ref = React.useRef<HTMLDivElement>(null!)
  const inViewRef = React.useRef<HTMLDivElement>(null!)
  const [markers, setMarkers] = useAtom(tocMarkerAtom)
  const [dimens, setDimens] = React.useState<{ top: number; height: number }>({
    top: 0,
    height: 0,
  })

  React.useEffect(() => {
    function calc() {
      const rect = ref.current.getBoundingClientRect()
      setMarkers((markers) => {
        const others = markers.filter((marker) => marker[0] !== name)
        const newMarkers = orderBy([...others, [name, rect]], [1, 'y']) as [
          string,
          DOMRect
        ][]
        return newMarkers
      })
    }

    calc()
    window.addEventListener('resize', calc)

    return () => {
      window.removeEventListener('resize', calc)
      setMarkers((markers) => markers.filter((marker) => marker[0] !== name))
    }
  }, [name, setMarkers])

  const i = markers.findIndex((marker) => marker[0] === name)

  React.useEffect(() => {
    const thisMarker = markers[i]
    const nextMarker = markers[i + 1]

    if (!thisMarker) return

    const top = thisMarker[1].y + window.scrollY
    const nextTop = nextMarker
      ? nextMarker[1].y + window.scrollY
      : document.body.clientHeight

    const height = nextTop - top
    setDimens({ top, height })
  }, [i, markers])

  const isInView = useInView(inViewRef)
  const setInView = useSetAtom(inViewAtom)
  React.useEffect(() => {
    setInView((cur) => ({ ...cur, [name]: isInView }))

    return () => {
      setInView(({ [name]: _, ...rest }) => ({ ...rest }))
    }
  }, [name, setInView, isInView])

  return (
    <div ref={ref} className="relative" id={name}>
      <div
        ref={inViewRef}
        className="absolute w-0 top-[10px]"
        style={{ height: dimens.height - 40 }}
      />
      {children}
    </div>
  )
}

type TocProps = {
  children: React.ReactNode
}

export function Toc({ children }: TocProps) {
  return <Highlighted>{children}</Highlighted>
}

type EntryProps = {
  children: React.ReactNode
  name: string
}

export function TocEntry({ children, name }: EntryProps) {
  const [inViews] = useAtom(inViewAtom)
  const inView = inViews[name]

  return (
    <div
      className={clsx(
        'transition-colors text-white text-[13px] px-1 py-1.5 hover:text-opacity-70',
        'font-medium max-w-full',
        inView ? 'text-opacity-80' : 'text-opacity-50'
      )}
      data-toc-entry={name}
    >
      <a href={`#${name}`} className="inline-block">
        <Balancer>{children}</Balancer>
      </a>
    </div>
  )
}

type HighlightedProps = {
  children: React.ReactNode
}

function Highlighted({ children }: HighlightedProps) {
  const [markers] = useAtom(tocMarkerAtom)
  const [inViews] = useAtom(inViewAtom)
  const ref = React.useRef<HTMLDivElement>(null!)
  const [dimens, setDimens] = React.useState<{
    top: number
    height: number
    calced: boolean
  }>({
    top: 0,
    height: 0,
    calced: false,
  })

  const markersInView = React.useMemo(
    () => markers.map(([name]) => [name, inViews[name]]),
    [markers, inViews]
  )

  React.useEffect(() => {
    const firstMarker = markersInView.find((marker) => marker[1] === true)?.[0]
    const lastMarker = markersInView
      .reverse()
      .find((marker) => marker[1] === true)?.[0]

    if (firstMarker && lastMarker) {
      const firstEl = ref.current.querySelector(
        `[data-toc-entry="${firstMarker}"]`
      )
      const lastEl = ref.current.querySelector(
        `[data-toc-entry="${lastMarker}"]`
      )

      if (!firstEl || !lastEl) return

      const refTop = ref.current.getBoundingClientRect().top
      const top = firstEl.getBoundingClientRect().top - refTop
      const height = lastEl.getBoundingClientRect().bottom - refTop - top

      setDimens({ top, height, calced: true })
    }
  }, [markersInView])

  return (
    <div
      ref={ref}
      className="sticky top-0 py-2 max-w-[240px] max-h-screen overflow-scroll hide-scrollbars flex flex-col"
    >
      {children}
      {dimens.calced && (
        <motion.div
          className="absolute z-[-1] bg-[#29292a] bg-opacity-30 left-0 right-0 rounded"
          initial={{ opacity: 0, top: dimens.top, height: dimens.height }}
          animate={{ opacity: 1, top: dimens.top, height: dimens.height }}
          transition={{ ease: 'linear' }}
          layout
        />
      )}
    </div>
  )
}
