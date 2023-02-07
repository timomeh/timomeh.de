'use client'

import * as React from 'react'
import {
  autoUpdate,
  flip,
  FloatingFocusManager,
  FloatingPortal,
  offset,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
  useTransitionStyles,
} from '@floating-ui/react'
import clsx from 'clsx'
import Prando from 'prando'
import { Prose } from './Prose'
import { useMediaQuery } from '@/lib/useMediaQuery'

type Props = {
  id: string
  scope?: string | number
} & React.DetailedHTMLProps<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  HTMLAnchorElement
>

export function FootnoteRef({ id, scope, children, ...rest }: Props) {
  const name = id.split('-').at(-1)!
  const rng = new Prando(`${scope}-${name}`)
  const number = rng.nextInt(0, 6)
  const [isOpen, setIsOpen] = React.useState(false)
  const [footnote, setFoonote] = React.useState('')
  const alaaf = useMediaQuery('(min-width: 1111px)')

  React.useEffect(() => {
    const html =
      document.getElementById(rest.href!.replace('#', ''))?.innerHTML || ''
    setFoonote(html)
  }, [rest.href])

  const { x, y, refs, strategy, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [offset(15), flip(), shift()],
    whileElementsMounted: autoUpdate,
  })

  const click = useClick(context, {
    enabled: !alaaf,
  })
  const dismiss = useDismiss(context)
  const role = useRole(context)

  const { isMounted, styles } = useTransitionStyles(context, {
    initial: ({ side }) => ({
      transform: side === 'top' ? 'translateY(4px)' : 'translateY(-4px)',
      opacity: 0,
    }),
    open: { transform: 'translateY(0)', opacity: 1 },
    close: ({ side }) => ({
      transform: side === 'top' ? 'translateY(-4px)' : 'translateY(4px)',
      opacity: 0,
    }),
    duration: 200,
  })
  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
    role,
  ])

  return (
    <>
      <a
        {...rest}
        ref={refs.setReference}
        {...getReferenceProps()}
        id={id}
        className={clsx(
          'relative inline-block h-[1ch] alaaf:active:pointer-events-none group',
          {
            '!text-blue-500': number === 0,
            '!text-amber-500': number === 1,
            '!text-yellow-300': number === 2,
            '!text-teal-400': number === 3,
            '!text-violet-400': number === 4,
            '!text-pink-500': number === 5,
            '!text-rose-400': number === 6,
          }
        )}
      >
        <span
          className={clsx(
            'absolute h-6 -top-1 -right-[3px] bg-gradient-to-l to-transparent opacity-30 hover:opacity-60 mix-blend-screen w-20',
            'transition-opacity from-current'
          )}
        />
        <span className="block alaaf:hidden w-2 h-2 absolute -right-1.5 -top-1.5 rounded-full bg-current" />
        <span className="block alaaf:hidden w-3 h-3 absolute -right-2 -top-2 rounded-full bg-current opacity-30" />
        <span className="sr-only group-focus-visible:not-sr-only">
          {children}
        </span>
      </a>
      {isMounted && (
        <FloatingPortal>
          <FloatingFocusManager context={context} modal={false}>
            <div
              ref={refs.setFloating}
              className="alaaf:hidden"
              style={{
                position: strategy,
                top: y ?? 0,
                left: x ?? 0,
                width: 'max-content',
              }}
              {...getFloatingProps()}
            >
              <Prose size="smol">
                <div
                  className="px-3.5 py-2 border shadow-md rounded-sm border-white/10 bg-[#151516] bg-opacity-80 backdrop-blur-sm max-w-[240px]"
                  dangerouslySetInnerHTML={{ __html: footnote }}
                  style={{ ...styles }}
                />
              </Prose>
            </div>
          </FloatingFocusManager>
        </FloatingPortal>
      )}
    </>
  )
}
