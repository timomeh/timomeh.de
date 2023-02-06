'use client'

import clsx from 'clsx'
import * as React from 'react'
import Prando from 'prando'

type Props = {
  id: string
  children: React.ReactNode
  scope?: number | string
}

export function FloatingFootnote({ id, children, scope }: Props) {
  const name = id.split('-').at(-1)!
  const rng = new Prando(`${scope}-${name}`)
  const number = rng.nextInt(0, 6)
  const [hovered, setHovered] = React.useState(false)

  const self = React.useRef<HTMLLIElement>(null!)
  const [ref, setRef] = React.useState<HTMLElement | undefined>(() =>
    typeof window !== 'undefined' ? getRef(id) : undefined
  )
  const [positioned, setPositioned] = React.useState(false)
  const [top, setTop] = React.useState(0)

  React.useEffect(() => {
    if (!ref) setRef(getRef(id))
  }, [ref, id])

  React.useEffect(() => () => setRef(undefined), [])

  React.useEffect(() => {
    // only handle footnotes in articles
    const article = self.current.closest('article')
    if (!article) return

    const calc = async () => {
      if (!ref) return
      setPositioned(false)

      if (window.innerWidth < 1111) return

      const relativePos = (pos: number) => {
        const articleTop = article.getBoundingClientRect().top + window.scrollY
        return pos + window.scrollY - articleTop
      }

      const prevNote = self.current.previousElementSibling as
        | HTMLLIElement
        | undefined
      const refTop = relativePos(ref.getBoundingClientRect().top)

      if (!prevNote && refTop > 0) {
        setTop(refTop)
        setPositioned(true)
        return
      }

      if (!prevNote) {
        return
      }

      // this is genius
      await waitForPositioned(prevNote)
      const prevBottom = relativePos(prevNote.getBoundingClientRect().bottom)
      const topWithoutOverlap = Math.max(0, refTop - prevBottom)
      setTop(topWithoutOverlap)
      setPositioned(true)
    }

    const resizeObserver = new ResizeObserver(() => calc())
    resizeObserver.observe(article)

    return () => {
      resizeObserver.unobserve(article)
    }
  }, [ref])

  React.useEffect(() => {
    if (!ref) return

    const handleOver = () => {
      setHovered(true)
    }

    const handleOut = () => {
      setHovered(false)
    }

    ref.addEventListener('mouseover', handleOver)
    ref.addEventListener('mouseout', handleOut)
    return () => {
      ref.removeEventListener('mouseover', handleOver)
      ref.removeEventListener('mouseout', handleOut)
    }
  }, [ref])

  return (
    <li
      id={id}
      ref={self}
      style={{ marginTop: top }}
      className={clsx(
        'pb-0.5 pl-3',
        positioned ? 'opacity-100' : 'opacity-0',
        'hidden alaaf:block',
        'relative transition text-[13px] leading-snug text-opacity-50 text-white hover:text-opacity-90 focus-within:text-opacity-90',
        hovered && 'text-opacity-90',
        'before:absolute before:content-[""] before:w-0.5 before:h-4 before:left-1 before:top-0 before:mix-blend-screen before:opacity-40',
        {
          'before:bg-blue-500': number === 0,
          'before:bg-amber-500': number === 1,
          'before:bg-yellow-300': number === 2,
          'before:bg-teal-400': number === 3,
          'before:bg-violet-400': number === 4,
          'before:bg-pink-500': number === 5,
          'before:bg-rose-400': number === 6,
        }
      )}
      data-positioned={positioned}
    >
      {children}
    </li>
  )
}

function getRef(id: string) {
  return (
    (document.querySelector(`a[href="#${id}"]`) as HTMLElement) || undefined
  )
}

async function waitForPositioned(el: HTMLElement) {
  return new Promise<void>((resolve) => {
    if (el.dataset.positioned === 'true') {
      return resolve()
    }

    const observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        if (
          mutation.type === 'attributes' &&
          mutation.attributeName === 'data-positioned' &&
          el.dataset.positioned === 'true'
        ) {
          observer.disconnect()
          return resolve()
        }
      })
    })

    observer.observe(el, {
      attributes: true,
    })
  })
}
