'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

type Props = {
  children: React.ReactNode
  pos: 'top' | 'bottom'
}

const offsets = {
  top: ['start start' as const, 'end start' as const],
  bottom: ['end end' as const, 'start end' as const],
}

export function ScrollFade({ children, pos }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: offsets[pos],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.6, 0.4])

  return (
    <motion.div ref={ref} style={{ opacity }}>
      {children}
    </motion.div>
  )
}
