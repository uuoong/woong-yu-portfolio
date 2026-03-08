import { useEffect, useState } from 'react'

import styles from '@/styles/export-vars.module.scss'
import useWindowResize from '@/hooks/use-window-resize'
const { mobile, tablet, laptop, desktop, xl } = styles

const BREAKPOINTS = {
  mobile,
  tablet,
  laptop,
  desktop,
  xl,
}

export const getBreakpoint = windowWidth => {
  let breakpoint = null

  if (!windowWidth) return breakpoint

  Object.values(BREAKPOINTS).forEach((bpValue, i) => {
    const bp = parseInt(bpValue)
    const beginningSize = i === 0 ? 0 : parseInt(Object.values(BREAKPOINTS)[i - 1])
    const endingSize = i === Object.values(BREAKPOINTS).length - 1 ? 10000 : bp

    if (windowWidth > beginningSize && windowWidth <= endingSize) {
      breakpoint = {
        name: Object.keys(BREAKPOINTS)[i],
        width: windowWidth,
      }
    }
  })

  return breakpoint
}

export const getIsMobile = windowWidth => {
  const breakpoint = getBreakpoint(windowWidth)
  return breakpoint?.name === 'mobile' || breakpoint?.name === 'tablet'
}

function useBreakpoint() {
  const key = useWindowResize({ debounce: 100 })
  const [breakpoint, setBreakpoint] = useState(null)
  const [isMobile, setIsMobile] = useState(null)

  useEffect(() => {
    const bp = getBreakpoint(window.innerWidth)
    setBreakpoint(bp)
    setIsMobile(getIsMobile(window.innerWidth))
  }, [key])

  return {
    breakpoint,
    isMobile,
  }
}

export default useBreakpoint
