'use client'

import * as React from 'react'

const useIsMobile = (mobileScreenSize = 768) => {
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    // Ensures this part of the hook only runs on the client side
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return
    }

    const mediaQueryList = window.matchMedia(`(max-width: ${mobileScreenSize}px)`)
    setIsMobile(mediaQueryList.matches) // Initialize state based on current screen size

    const checkIsMobile = (event) => {
      setIsMobile(event.matches)
    }

    // Try-catch for compatibility with all browsers
    try {
      mediaQueryList.addEventListener('change', checkIsMobile)
    } catch {
      mediaQueryList.addListener(checkIsMobile)
    }

    return () => {
      try {
        mediaQueryList.removeEventListener('change', checkIsMobile)
      } catch {
        mediaQueryList.removeListener(checkIsMobile)
      }
    }
  }, [mobileScreenSize])

  return isMobile
}

export default useIsMobile
