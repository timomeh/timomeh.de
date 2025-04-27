'use client'

import { motion, MotionProps } from 'motion/react'
import { JSX } from 'react'

type Props = MotionProps & JSX.IntrinsicElements['div']

export function MotionDiv(props: Props) {
  return <motion.div {...props} />
}
