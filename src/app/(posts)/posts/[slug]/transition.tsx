'use client'

import { motion } from 'framer-motion'

type Props = {
  children: React.ReactNode
}

export function Transition({ children }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.1 }}
    >
      {children}
    </motion.div>
  )
}
