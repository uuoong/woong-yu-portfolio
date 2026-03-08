'use client'

import Lenis from 'lenis'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import useWindowResize, { USE_WINDOW_RESIZE_DEFAULTS } from '@/hooks/use-window-resize'
import { SCROLL_CONTAINER_CLASS, SCROLL_CONTENT_CLASS } from '@/components/Layout/Layout'
import useStore from '@/store'
import { useRouter } from 'next/router'
import { deviceInfo } from '@/utils'

ScrollTrigger.config({
  ignoreMobileResize: true,
})

gsap.registerPlugin(ScrollTrigger)

gsap.config({ nullTargetWarn: false })

export const ScrollContext = React.createContext({
  scroll: null,
  initScroll: () => {},
  onScrollCallback: () => {},
})

export const ScrollProvider = ({ children }) => {
  const scrollRef = useRef(null)
  const scrollRaf = useRef(0)
  const [scrollInstance, setScrollInstance] = useState(null)
  const resizeKey = useWindowResize({ debounce: USE_WINDOW_RESIZE_DEFAULTS.debounce + 75 })
  const router = useRouter()
  const resizeObserverRef = useRef(null)
  const heightChangeTimeoutRef = useRef(null)
  const navigationIsOpen = useStore(state => state.navigationIsOpen)
  const setBodyHeightChangeKey = useStore(state => state.setBodyHeightChangeKey)
  const onScrollCallbacksRef = useRef({})
  const pathname = router.pathname

  const onScrollCallback = useCallback(({ key, callback, remove }) => {
    if (!key) return

    const callbacks = {
      ...onScrollCallbacksRef.current,
    }

    if (remove) {
      delete callbacks[key]
    } else {
      if (callback) {
        callbacks[key] = callback
      }
    }

    onScrollCallbacksRef.current = callbacks
  }, [])

  useEffect(() => {
    if (!scrollInstance) return
    scrollInstance[navigationIsOpen ? 'stop' : 'start']()
  }, [navigationIsOpen, scrollInstance])

  useEffect(() => {
    if (!scrollInstance) return
    scrollInstance.scrollTo(0, { immediate: true })
    scrollInstance?.resize()
  }, [pathname, scrollInstance])

  const initScroll = useCallback(params => {
    const options = params?.options || {}

    if (scrollRef.current) {
      scrollRef.current.destroy()
    }

    const scrollContainer = document.querySelectorAll(`.${SCROLL_CONTAINER_CLASS}`)[0]
    const scrollContent = document.querySelectorAll(`.${SCROLL_CONTENT_CLASS}`)[0]

    if (!scrollContainer || !scrollContent) return

    setScrollInstance(null)

    if (scrollRaf.current) {
      cancelAnimationFrame(scrollRaf.current)
    }
    if (scrollRef.current) {
      scrollRef.current.destroy()
      scrollRef.current = null
    }

    const isMobileChrome = deviceInfo.device.type === 'mobile' && deviceInfo.browser.chrome
    const isDesktop = deviceInfo.device.isDesktop || isMobileChrome

    let wrapperOptions = {
      wrapper: scrollContainer,
      content: scrollContent,
    }

    if (isDesktop) {
      wrapperOptions = {
        wrapper: window,
        content: document.documentElement,
      }
    }

    document.body.dataset.isBodyScroller = `${isDesktop}`

    const finalOptions = {
      duration: 1.2,
      autoResize: false,
      ...wrapperOptions,
      ...options,
    }

    scrollRef.current = new Lenis(finalOptions)

    scrollRef.current.on('scroll', scroll => {
      ScrollTrigger.update()

      Object.values(onScrollCallbacksRef.current).forEach(callback => {
        if (callback) {
          callback(scroll)
        }
      })
    })

    if (!isDesktop) {
      ScrollTrigger.defaults({
        scroller: wrapperOptions.wrapper,
      })
    }

    gsap.ticker.add(time => {
      if (scrollRef.current) {
        scrollRef.current.raf(time * 1000)
      }
    })

    gsap.ticker.lagSmoothing(0)

    setScrollInstance(scrollRef.current)

    setTimeout(() => {
      scrollRef.current.resize()
      setTimeout(() => {
        ScrollTrigger.refresh()
      }, 50)
    }, 100)
  }, [])

  useEffect(() => {
    if (!scrollInstance) return
    scrollInstance.resize()
    setTimeout(() => {
      ScrollTrigger.refresh()
    }, 20)
  }, [resizeKey, scrollInstance])

  useEffect(() => {
    if (resizeObserverRef.current) {
      resizeObserverRef.current.unobserve(document.body)
    }

    const refresh = () => {
      ScrollTrigger.refresh()
      if (scrollInstance) scrollInstance.resize()
    }

    refresh()

    // create an Observer instance
    resizeObserverRef.current = new ResizeObserver(() => {
      if (heightChangeTimeoutRef.current) {
        clearTimeout(heightChangeTimeoutRef.current)
      }

      heightChangeTimeoutRef.current = setTimeout(() => {
        refresh()
        setBodyHeightChangeKey(Date.now())
      }, 300)
    })

    // start observing a DOM node
    resizeObserverRef.current.observe(document.body)
  }, [scrollInstance, setBodyHeightChangeKey])

  return (
    <ScrollContext.Provider
      value={{
        scroll: scrollInstance,
        initScroll,
        onScrollCallback,
      }}
    >
      {children}
    </ScrollContext.Provider>
  )
}
