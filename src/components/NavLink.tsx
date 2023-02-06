'use client'

import Link from 'next/link'
import { useSelectedLayoutSegments } from 'next/navigation'
import clsx from 'clsx'
import { motion } from 'framer-motion'

type Props = {
  children: React.ReactNode
  segment: string
  href: string
}

export function NavLink({ children, segment, href }: Props) {
  const segments = useSelectedLayoutSegments()
  const isActive = segments[0] === segment

  return (
    <Link
      href={href}
      className="flex py-1 items-center relative uppercase text-sm leading-none tracking-wide font-display font-bold"
    >
      <div
        className={clsx(
          isActive ? 'opacity-100' : 'opacity-50',
          'hover:opacity-80 transition-opacity'
        )}
      >
        {children}
      </div>
      {isActive && (
        <motion.div
          layoutId="activedot"
          className="hidden absolute lg:flex items-center justify-center w-[6px] h-[6px] rounded-full bg-violet-600 right-full mr-3"
        >
          <div className="absolute w-[18px] h-[18px] [background-image:radial-gradient(ellipse_closest-side,var(--tw-gradient-stops));] from-violet-600/50 to-transparent" />
        </motion.div>
      )}
    </Link>
  )
}
