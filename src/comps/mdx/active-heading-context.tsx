'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'

type Heading = { text: string; element: HTMLElement }

type Register = (heading: Heading) => () => void

const ActiveHeadingContext = createContext<string | null>(null)
const RegisterHeadingContext = createContext<Register | null>(null)

type Props = {
  children: React.ReactNode
  navOffset?: number
}

export function ActiveHeadingProvider({ children, navOffset = 40 }: Props) {
  const [active, setActive] = useState<string | null>(null)
  const activeRef = useRef<string | null>(null)
  const headingsRef = useRef<Heading[]>([])

  const compute = useCallback(() => {
    let current: Heading | null = null
    for (const h of headingsRef.current) {
      if (h.element.getBoundingClientRect().top <= navOffset) {
        current = h
      } else {
        break
      }
    }
    const next = current?.text ?? null
    if (activeRef.current === next) return
    activeRef.current = next
    setActive(next)
  }, [navOffset])

  useEffect(() => {
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(compute)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    compute()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [compute])

  const register = useCallback<Register>((heading) => {
    const arr = headingsRef.current
    arr.push(heading)
    arr.sort((a, b) =>
      a.element.compareDocumentPosition(b.element) &
      Node.DOCUMENT_POSITION_FOLLOWING
        ? -1
        : 1,
    )
    return () => {
      const i = arr.indexOf(heading)
      if (i >= 0) arr.splice(i, 1)
    }
  }, [])

  return (
    <RegisterHeadingContext.Provider value={register}>
      <ActiveHeadingContext.Provider value={active}>
        {children}
      </ActiveHeadingContext.Provider>
    </RegisterHeadingContext.Provider>
  )
}

export function useActiveHeading() {
  return useContext(ActiveHeadingContext)
}

export function useRegisterHeading() {
  return useContext(RegisterHeadingContext)
}
