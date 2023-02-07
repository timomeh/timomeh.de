'use client'

import { motion } from 'framer-motion'
import { usePathname } from 'next/navigation'

type Props = {
  forPath: string
}

export function IconDot({ forPath }: Props) {
  const pathname = usePathname()
  if (forPath !== pathname) return null

  return (
    <motion.div
      layoutId="activedot"
      className="absolute w-[6px] h-[6px] bg-transparent rounded-full -z-[1] flex justify-center items-center"
    >
      <div className="absolute w-6 h-6 bg-violet-600/30 rounded-full" />
    </motion.div>
  )
}
