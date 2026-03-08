import { useState, useEffect, useRef } from 'react'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import gsap from 'gsap'
import useWindowResize, { USE_WINDOW_RESIZE_DEFAULTS } from '@/hooks/use-window-resize'
import useStore from '@/store'

ScrollTrigger.config({
  ignoreMobileResize: true,
})

gsap.registerPlugin(ScrollTrigger)

export const USE_IN_VIEW_DEFAULTS = {
  fireOnce: true,
  scrolltriggerStart: 'top bottom',
  scrolltriggerEnd: 'bottom top',
}

export default function useInView(props) {
  const options = { ...USE_IN_VIEW_DEFAULTS, ...props }
  const [elementToObserve, setElementToObserve] = useState(null)
  const [isInView, setIsInView] = useState(false)
  const hasFiredInView = useRef(false)
  const scrollTriggerRef = useRef()
  const resizeKey = useWindowResize({ debounce: USE_WINDOW_RESIZE_DEFAULTS.debounce + 100 })
  const remValueCalculated = useStore(state => state.remValueCalculated)
  const bodyHeightChangeKey = useStore(state => state.bodyHeightChangeKey)

  useEffect(() => {
    if (!remValueCalculated) return
    if (!elementToObserve || (hasFiredInView.current && options.fireOnce)) return

    if (scrollTriggerRef.current) {
      scrollTriggerRef.current.kill()
    }

    scrollTriggerRef.current = new ScrollTrigger({
      trigger: elementToObserve,
      start: options.scrolltriggerStart,
      end: options.scrolltriggerEnd,
      onEnter: () => {
        setIsInView(true)

        if (options.fireOnce && scrollTriggerRef.current) {
          scrollTriggerRef.current.kill()
        }
      },
      onEnterBack: () => {
        setIsInView(true)

        if (options.fireOnce && scrollTriggerRef.current) {
          scrollTriggerRef.current.kill()
        }
      },
      onLeave: () => {
        if (!options.fireOnce) {
          setIsInView(false)
        }
      },
      onLeaveBack: () => {
        if (!options.fireOnce) {
          setIsInView(false)
        }
      },
    })
  }, [
    elementToObserve,
    options.fireOnce,
    options.scrolltriggerStart,
    options.scrolltriggerEnd,
    resizeKey,
    remValueCalculated,
    bodyHeightChangeKey,
  ])

  useEffect(() => {
    return () => {
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill()
      }
    }
  }, [])

  return { setElementToObserve, isInView, setIsInView }
}
