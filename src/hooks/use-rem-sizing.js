import { useEffect } from 'react'
import useBreakpoint from '@/hooks/use-breakpoint'
import useWindowResize from './use-window-resize'
import useStore from '@/store'

const BASE_SIZE = {
  DESKTOP: 1400,
  MOBILE: 375,
}

const BASE_FONT_SIZE = 10

export default function useRemSizing() {
  const { isMobile } = useBreakpoint()
  const resizeKey = useWindowResize({ debounce: 10 })
  const setRemValueCalculated = useStore(state => state.setRemValueCalculated)

  useEffect(() => {
    const windowWidth = window.innerWidth
    const sizeToCompare = isMobile ? BASE_SIZE.MOBILE : BASE_SIZE.DESKTOP
    const size = windowWidth / sizeToCompare
    const remValue = size * BASE_FONT_SIZE
    document.documentElement.style.fontSize = `${remValue}px`

    setTimeout(() => {
      setRemValueCalculated(true)
    }, 10)
  }, [isMobile, resizeKey, setRemValueCalculated])

  return {}
}
