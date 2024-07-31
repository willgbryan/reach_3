'use client'

import type { PropsWithChildren } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

interface MotionProps extends PropsWithChildren {
  className?: string
  delay?: number
}

const FadeIn = (props: MotionProps) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, type: 'spring', delay: props.delay ?? 0.3 }}
    {...props}
  >
    {props.children}
  </motion.div>
)

FadeIn.displayName = 'FadeOut'

const FadeInOut = (props: MotionProps) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, type: 'spring', delay: props.delay ?? 0.3 }}
    {...props}
  >
    {props.children}
  </motion.div>
)

FadeInOut.displayName = 'FadeInOut'

const FadeInSmall = (props: MotionProps) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, type: 'spring', delay: props.delay ?? 0.1 }}
    {...props}
  >
    {props.children}
  </motion.div>
)

FadeInSmall.displayName = 'FadeInSmall'
export { FadeIn, FadeInSmall, FadeInOut }
