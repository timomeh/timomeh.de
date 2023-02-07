'use client'

import Link from 'next/link'
import { useSelectedLayoutSegments } from 'next/navigation'
import clsx from 'clsx'
import { motion } from 'framer-motion'

type Props = {
  children: React.ReactNode
  segment: string
  href: string
  backDot?: boolean
}

export function NavLink({ children, segment, href, backDot }: Props) {
  const segments = useSelectedLayoutSegments()
  // Wouldn't be necessary with this fixed: // https://github.com/vercel/next.js/issues/40549
  const isFakeOfftopicHomePage =
    segment === 'offtopic' && segments[0] === undefined

  const isActive = segments[0] === segment || isFakeOfftopicHomePage

  return (
    <Link
      href={href}
      className="flex py-1 items-center relative justify-center uppercase text-sm leading-none tracking-wide font-display font-bold"
    >
      <div
        className={clsx(
          isActive ? 'opacity-100' : 'opacity-50',
          'hover:opacity-80 transition-opacity'
        )}
      >
        {children}
      </div>
      {isActive && !backDot && (
        <motion.div
          layoutId="activedot"
          className="hidden absolute lg:flex items-center justify-center w-[6px] h-[6px] rounded-full bg-violet-600 right-full mr-3"
        >
          <div className="absolute w-[18px] h-[18px] [background-image:radial-gradient(ellipse_closest-side,var(--tw-gradient-stops));] from-violet-600/50 to-transparent" />
        </motion.div>
      )}
      {isActive && backDot && (
        <motion.div
          layoutId="activedot"
          className="hidden lg:flex absolute w-[6px] h-[6px] bg-transparent rounded-full -z-[1] justify-center items-center"
        >
          <div className="absolute w-6 h-6 bg-violet-600/30 rounded-full" />
        </motion.div>
      )}
    </Link>
  )
}
