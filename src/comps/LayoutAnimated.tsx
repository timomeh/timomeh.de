'use client'

import { motion, MotionProps } from 'motion/react'
import { JSX } from 'react/jsx-runtime'

type Props = MotionProps & JSX.IntrinsicElements['div']

export function LayoutAnimated(props: Props) {
  return <motion.div {...props} />
}
