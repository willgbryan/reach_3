'use client'

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useState,
} from 'react'
import { AnimatePresence, motion, useWillChange } from 'framer-motion'

export type SizePresets =
  | 'reset'
  | 'empty'
  | 'default'
  | 'compact'
  | 'large'
  | 'long'
  | 'minimalLeading'
  | 'minimalTrailing'
  | 'compactMedium'
  | 'medium'
  | 'tall'
  | 'ultra'
  | 'massive'

const SIZE_PRESETS = {
  RESET: 'reset',
  EMPTY: 'empty',
  DEFAULT: 'default',
  COMPACT: 'compact',
  LARGE: 'large',
  LONG: 'long',
  MINIMAL_LEADING: 'minimalLeading',
  MINIMAL_TRAILING: 'minimalTrailing',
  COMPACT_MEDIUM: 'compactMedium',
  MEDIUM: 'medium',
  TALL: 'tall',
  ULTRA: 'ultra',
  MASSIVE: 'massive',
} as const

type Preset = {
  width: number
  height?: number
  aspectRatio: number
  borderRadius: number
}

const DynamicBlobSizePresets: Record<SizePresets, Preset> = {
  [SIZE_PRESETS.RESET]: {
    width: 150,
    aspectRatio: 1,
    borderRadius: 20,
  },
  [SIZE_PRESETS.EMPTY]: {
    width: 0,
    aspectRatio: 0,
    borderRadius: 0,
  },

  [SIZE_PRESETS.DEFAULT]: {
    width: 150,
    aspectRatio: 44 / 150,
    borderRadius: 46,
  },

  [SIZE_PRESETS.MINIMAL_LEADING]: {
    width: 52.33,
    aspectRatio: 44 / 52.33,
    borderRadius: 22,
  },
  [SIZE_PRESETS.MINIMAL_TRAILING]: {
    width: 52.33,
    aspectRatio: 44 / 52.33,
    borderRadius: 22,
  },
  [SIZE_PRESETS.COMPACT]: {
    width: 235,
    aspectRatio: 44 / 235,
    borderRadius: 46,
  },
  [SIZE_PRESETS.COMPACT_MEDIUM]: {
    width: 351,
    aspectRatio: 64 / 371,
    borderRadius: 44,
  },
  [SIZE_PRESETS.LONG]: {
    width: 371,
    aspectRatio: 84 / 371,
    borderRadius: 42,
  },
  [SIZE_PRESETS.MEDIUM]: {
    width: 371,
    aspectRatio: 250 / 371,
    borderRadius: 22,
  },
  [SIZE_PRESETS.LARGE]: {
    width: 371,
    aspectRatio: 84 / 371,
    borderRadius: 42,
  },
  [SIZE_PRESETS.TALL]: {
    width: 371,
    aspectRatio: 210 / 371,
    borderRadius: 42,
  },
  [SIZE_PRESETS.ULTRA]: {
    width: 630,
    aspectRatio: 630 / 800,
    borderRadius: 42,
  },
  [SIZE_PRESETS.MASSIVE]: {
    width: 891,
    height: 1900,
    aspectRatio: 891 / 891,
    borderRadius: 42,
  },
}

type BlobContextType = {
  state: BlobStateType
  dispatch: React.Dispatch<BlobAction>
  setSize: (size: SizePresets) => void
  scheduleAnimation: (animationSteps: Array<{ size: SizePresets; delay: number }>) => void
  presets: Record<SizePresets, Preset>
}

const BlobContext = createContext<BlobContextType>({
  state: {
    size: SIZE_PRESETS.EMPTY, // Initial size state
    previousSize: undefined, // Initial previous size state
    animationQueue: [],
  },
  scheduleAnimation: () => {},
  dispatch: () => {}, // Placeholder function for dispatch
  setSize: () => {}, // Placeholder function for setSize
  presets: DynamicBlobSizePresets, // Your defined presets
})

type BlobStateType = {
  size: SizePresets
  previousSize: SizePresets | undefined
  animationQueue: Array<{ size: SizePresets; delay: number }>
}

type BlobAction =
  | { type: 'SET_SIZE'; newSize: SizePresets }
  | { type: 'INITIALIZE'; firstState: SizePresets }
  | { type: 'SCHEDULE_ANIMATION'; animationSteps: Array<{ size: SizePresets; delay: number }> }

// Provider props
interface DynamicBlobProviderProps {
  children: React.ReactNode
  initialSize?: SizePresets | undefined
  initialAnimation?: Array<{ size: SizePresets; delay: number }>
}

const blobReducer = (state: BlobStateType, action: BlobAction): BlobStateType => {
  switch (action.type) {
    case 'SET_SIZE':
      if (action.newSize !== state.size) {
        return { ...state, size: action.newSize, previousSize: state.size }
      }
      return state

    case 'SCHEDULE_ANIMATION':
      return { ...state, animationQueue: action.animationSteps }

    case 'INITIALIZE':
      return { ...state, size: action.firstState, previousSize: SIZE_PRESETS.EMPTY }

    default:
      return state
  }
}

interface DynamicBlobProviderProps {
  children: React.ReactNode
  initialSize?: SizePresets | undefined
  initialAnimation?: Array<{ size: SizePresets; delay: number }>
}

const DynamicBlobProvider: React.FC<DynamicBlobProviderProps> = ({
  children,
  initialSize = SIZE_PRESETS.DEFAULT,
  initialAnimation = [],
}) => {
  const initialState: BlobStateType = {
    size: initialSize,
    previousSize: SIZE_PRESETS.EMPTY,
    animationQueue: initialAnimation,
  }

  const [state, dispatch] = useReducer(blobReducer, initialState)

  useEffect(() => {
    // Process the animation queue
    const processQueue = async () => {
      for (const step of state.animationQueue) {
        await new Promise((resolve) => setTimeout(resolve, step.delay))
        dispatch({ type: 'SET_SIZE', newSize: step.size })
      }
      // Clear the queue once all animations are done
      dispatch({ type: 'SCHEDULE_ANIMATION', animationSteps: [] })
    }

    if (state.animationQueue?.length > 0) {
      processQueue()
    }
  }, [state.animationQueue])

  const setSize = useCallback(
    (newSize) => {
      if (state.previousSize !== newSize && newSize !== state.size) {
        dispatch({ type: 'SET_SIZE', newSize })
      }
    },
    [state, dispatch],
  )

  const contextValue = {
    state, // contains size and previousSize
    dispatch, // allows dispatching actions to update the state
    setSize, // provides a debounced method to update the size directly
    scheduleAnimation: (animationSteps) => dispatch({ type: 'SCHEDULE_ANIMATION', animationSteps }),
    presets: DynamicBlobSizePresets,
  }

  return <BlobContext.Provider value={contextValue}>{children}</BlobContext.Provider>
}

// Custom hook to access the context
const useDynamicBlobSize = () => {
  const context = useContext(BlobContext)
  if (!context) {
    throw new Error('useDynamicBlobSize must be used within a DynamicBlobProvider')
  }
  return context
}

const DynamicBlobWrapper = ({ children }) => {
  return (
    <div className="z-10 flex h-full w-full items-end justify-center bg-transparent">
      {children}
    </div>
  )
}

const DynamicBlob = ({ children, id, ...props }) => {
  const willChange = useWillChange()
  const [screenSize, setScreenSize] = useState('desktop')

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth <= 640) {
        setScreenSize('mobile')
      } else if (window.innerWidth <= 1024) {
        setScreenSize('tablet')
      } else {
        setScreenSize('desktop')
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <DynamicBlobWrapper>
      <DynamicBlobContent id={id} willChange={willChange} screenSize={screenSize} {...props}>
        {children}
      </DynamicBlobContent>
    </DynamicBlobWrapper>
  )
}

const stiffness = 400
const damping = 30
const MIN_WIDTH = 691
const MAX_HEIGHT_MOBILE_ULTRA = 400
const MAX_HEIGHT_MOBILE_MASSIVE = 700
// Helper function for minimum value
const min = (a, b) => (a < b ? a : b)

// Helper function to calculate dimensions
const calculateDimensions = (size, screenSize, currentSize) => {
  const isMassiveOnMobile = size === 'massive' && screenSize === 'mobile'
  const isUltraOnMobile = size === 'ultra' && screenSize === 'mobile'

  if (isMassiveOnMobile) {
    return { width: '350px', height: MAX_HEIGHT_MOBILE_MASSIVE }
  }

  if (isUltraOnMobile) {
    return { width: '350px', height: MAX_HEIGHT_MOBILE_ULTRA }
  }

  const width = min(currentSize.width, MIN_WIDTH)
  return { width, height: currentSize.aspectRatio * width }
}

const DynamicBlobContent = ({ children, id, willChange, screenSize, ...props }) => {
  const { state, presets } = useDynamicBlobSize() // Destructure state from the context
  const currentSize = presets[state.size] // Use size from the state
  const dimensions = calculateDimensions(state.size, screenSize, currentSize)

  return (
    <motion.div
      id={id}
      className="mx-auto h-0 w-0 items-center justify-center border border-black/10   text-center text-black transition duration-300 ease-in-out  hover:shadow-md dark:border dark:border-white/5 bg-black focus-within:bg-black"
      animate={{
        width: dimensions.width,
        height: dimensions.height,
        borderRadius: currentSize.borderRadius,
        transition: {
          type: 'spring',
          stiffness, // Stiffness and damping values
          damping,
        },
        clipPath: `none`,
        transitionEnd: {
          clipPath: `url(#squircle-${state.size})`, // Use size from the state
        },
      }}
      style={{ willChange }}
      {...props}
    >
      <AnimatePresence>{children}</AnimatePresence>
    </motion.div>
  )
}

/**
 * Creates an animation step for the DynamicBlob.
 * @param {string} size - The target size for the blob.
 * @param {number} delay - The delay in milliseconds before transitioning to the size.
 * @returns {Object} An object representing an animation step.
 */

type DynamicContainerProps = {
  // id?: string
  className?: string
  // size: DynamicBlobSizePresetsType | string
  children?: React.ReactNode
}

const DynamicContainer = ({ className, children }: DynamicContainerProps) => {
  const willChange = useWillChange()

  const { state, presets } = useDynamicBlobSize() // Destructure state from the context
  const { size, previousSize } = state

  // const previousSize = usePrevious(size);

  const isSizeChanged = size !== previousSize

  const initialState = {
    // Determines the visibility of the component.
    // If size hasn't changed, component remains fully visible (opacity: 1).
    // If size has changed, component starts as invisible (opacity: 0).
    opacity: size === previousSize ? 1 : 0,

    // Controls the size of the component.
    // If size hasn't changed, component stays at its normal size (scale: 1).
    // If size has changed, component starts slightly smaller (scale: 0.9), adding a zoom-in effect.
    scale: size === previousSize ? 1 : 0.9,

    // Adjusts the vertical position of the component.
    // If size hasn't changed, component stays in its original position (y: 0).
    // If size has changed, component starts 5 pixels down (y: 5), creating a slide-up effect.
    y: size === previousSize ? 0 : 5,
  }

  // Determine the final state for animation.
  const animateState = {
    // Component should always animate to being fully visible (opacity: 1).
    opacity: 1,

    // Component should animate to its full size (scale: 1), whether it started smaller or not.
    scale: 1,

    // Component should animate to its final vertical position (y: 0).
    y: 0,

    // Transition settings for the animation.
    transition: {
      type: 'spring',
      stiffness: stiffness,
      damping: damping,

      // Adjust the duration of the animation based on the size.
      // If size hasn't changed, use a shorter duration (0.5).
      // If size has changed, use a longer duration (0.8) for the transition.
      duration: isSizeChanged ? 0.1 : 0.8,
    },
  }

  return (
    <motion.div
      initial={initialState}
      animate={animateState}
      exit={{ opacity: 0, filter: 'blur(10px)', scale: 0.95, y: 20 }}
      style={{ willChange }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

type DynamicChildrenProps = {
  className?: string
  children?: React.ReactNode
}

const DynamicDiv = ({ className, children }: DynamicChildrenProps) => {
  const { state } = useDynamicBlobSize()
  const { size, previousSize } = state
  const willChange = useWillChange()

  // Determine if the size has changed
  const isSizeChanged = size !== previousSize

  // Define the animation styles dynamically based on size change
  const dynamicStyles = {
    initial: {
      opacity: isSizeChanged ? 0 : 1,
      scale: isSizeChanged ? 0.9 : 1,
    },
    animate: {
      opacity: isSizeChanged ? 1 : 0,
      scale: isSizeChanged ? 1 : 0.9,
      transition: {
        type: 'spring',
        stiffness: stiffness,
        damping: damping,
      },
    },
    exit: {
      opacity: 0,
      filter: 'blur(10px)',
      scale: 0,
    },
  }

  return (
    <motion.div
      initial={dynamicStyles.initial}
      animate={dynamicStyles.animate}
      exit={dynamicStyles.exit}
      style={{ willChange }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

const DynamicTitle = ({ className, children }) => {
  const { state } = useDynamicBlobSize()
  const { size, previousSize } = state
  const willChange = useWillChange()

  return (
    <motion.h3
      className={className}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: size === previousSize ? 0 : 1,
        scale: size === previousSize ? 0.9 : 1,
        transition: { type: 'spring', stiffness: stiffness, damping: damping },
      }}
      style={{ willChange }}
    >
      {children}
    </motion.h3>
  )
}

const DynamicDescription = ({ className, children }) => {
  const { state } = useDynamicBlobSize()
  const { size, previousSize } = state
  const willChange = useWillChange()

  return (
    <motion.p
      className={className}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: size === previousSize ? 0 : 1,
        scale: size === previousSize ? 0.9 : 1,
        transition: { type: 'spring', stiffness: stiffness, damping: damping },
      }}
      style={{ willChange }}
    >
      {children}
    </motion.p>
  )
}

export {
  DynamicContainer,
  DynamicTitle,
  DynamicDescription,
  DynamicBlob,
  SIZE_PRESETS,
  stiffness,
  DynamicDiv,
  damping,
  DynamicBlobSizePresets,
  BlobContext,
  useDynamicBlobSize,
  DynamicBlobProvider,
}
