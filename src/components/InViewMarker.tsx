'use client'

import { useInView } from 'framer-motion'
import { atom, useSetAtom, createStore, Provider } from 'jotai'
import { useHydrateAtoms } from 'jotai/utils'
import * as React from 'react'

export const inViewAtom = atom<{ name: string; inView: boolean }[]>([])

type Props = {
  name: string
  children: React.ReactNode
}

export function InViewMarker({ name, children }: Props) {
  const ref = React.useRef(null)
  const isInView = useInView(ref, { amount: 'all' })
  const setInView = useSetAtom(inViewAtom)

  React.useEffect(() => {
    setInView((curs) =>
      curs.map((cur) => (cur.name === name ? { name, inView: isInView } : cur))
    )
  }, [name, isInView, setInView])

  return (
    <div ref={ref} id={name}>
      {children}
    </div>
  )
}

export function MarkerProvider({
  names,
  children,
}: {
  names: string[]
  children: React.ReactNode
}) {
  const store = React.useRef(createStore())
  const init = names.map((name) => ({ name, inView: false }))
  useHydrateAtoms([[inViewAtom, init] as const], {
    store: store.current,
  })
  return <Provider store={store.current}>{children}</Provider>
}
