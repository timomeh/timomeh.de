'use client'

import { motion } from 'motion/react'
import React, { useState } from 'react'

export function BackdropAnimate({ children }: { children: React.ReactNode }) {
  const [height, setHeight] = useState<number | 'auto'>('auto')

  return (
    <motion.div
      className="static"
      animate={{ height }}
      transition={{ type: 'spring', stiffness: 200, damping: 30 }}
    >
      <div
        className="static"
        ref={($ref) => {
          if (!$ref) return

          const resize = () => {
            setHeight(Math.max(0, $ref.scrollHeight - 144))
          }

          resize()
          const observer = new ResizeObserver(resize)
          observer.observe($ref)

          return () => observer.disconnect()
        }}
      >
        {children}
      </div>
    </motion.div>
  )
}
