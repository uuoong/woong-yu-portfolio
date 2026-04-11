/**
 * Scroll.js — Lenis + GSAP 전역 스크롤
 *
 * ─── Scroll.js API ───────────────────────────────────────────────────────
 *
 *  initScroll 호출 방법 (Sections에서 직접 옵션 설정):
 *    initScroll({ options: { infinite: true } })  ← home 무한 스크롤
 *    initScroll()                                 ← 기본 스크롤
 */

import React, { useCallback, useEffect, useRef, useState } from "react"
import Lenis from "lenis"
import gsap from "https://esm.sh/gsap"
import { ScrollTrigger } from "https://esm.sh/gsap/ScrollTrigger"
import useWindowResize, {
    USE_WINDOW_RESIZE_DEFAULTS,
} from "../hooks/use_window_resize.js"

import { useAppContext } from "./App.js"

export const ScrollContext = React.createContext({
    scroll: null,
    initScroll: () => {},
    onScrollCallback: () => {},
})

export const useScrollContext = () => {
    return React.useContext(ScrollContext)
}

export const ScrollProvider = ({ children }) => {
    const scrollRef = useRef(null)
    const scrollRaf = useRef(0)
    const [scrollInstance, setScrollInstance] = useState(null)
    const resizeKey = useWindowResize({
        debounce: USE_WINDOW_RESIZE_DEFAULTS.debounce + 75,
    })

    const { currentPath, navigationIsOpen, setBodyHeightChangeKey } =
        useAppContext()

    const resizeObserverRef = useRef(null)
    const heightChangeTimeoutRef = useRef(null)
    const onScrollCallbacksRef = useRef({})

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

    // navigationIsOpen → stop/start
    useEffect(() => {
        if (!scrollInstance) return

        scrollInstance[navigationIsOpen ? "stop" : "start"]()
    }, [navigationIsOpen, scrollInstance])

    // currentPath → scroll to top
    useEffect(() => {
        if (!scrollInstance) return

        scrollInstance.scrollTo(0, { immediate: true })
        scrollInstance?.resize()
    }, [currentPath, scrollInstance])

    // initScroll({ options: { infinite: true } })  ← home
    const initScroll = useCallback((params) => {
        ScrollTrigger.config({
            ignoreMobileResize: true,
        })

        gsap.registerPlugin(ScrollTrigger)

        gsap.config({ nullTargetWarn: false })

        // 기존 인스턴스 정리
        const options = params?.options || {}

        if (scrollRef.current) {
            scrollRef.current.destroy()
        }

        setScrollInstance(null)

        if (scrollRaf.current) {
            cancelAnimationFrame(scrollRaf.current)
        }
        if (scrollRef.current) {
            scrollRef.current.destroy()
            scrollRef.current = null
        }

        // ── 항상 window wrapper ───────────────────────────────────────────
        // 이유:
        //   1. WebGL: window.scrollY = Lenis scroll → GLImage 위치 정확
        //   2. Infinite scroll: Lenis infinite 옵션은 window wrapper 필요
        //   3. SSR 안전: module-level window 접근 없음 (여기는 useCallback)
        //   4. 모바일 주소창: syncTouch: true로 대응

        let wrapperOptions = {
            wrapper: window,
            content: document.documentElement,
        }

        const lenisOptions = {
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
            syncTouch: true,
            touchMultiplier: 2,
            autoResize: false,
            ...wrapperOptions,
            ...options,
        }

        scrollRef.current = new Lenis(lenisOptions)

        scrollRef.current.on("scroll", (scroll) => {
            ScrollTrigger.update()

            Object.values(onScrollCallbacksRef.current).forEach((callback) => {
                if (callback) {
                    callback(scroll)
                }
            })
        })

        gsap.ticker.add((time) => {
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

    // resizeKey → resize + ST refresh
    useEffect(() => {
        if (!scrollInstance) return

        scrollInstance.resize()
        setTimeout(() => {
            ScrollTrigger.refresh()
        }, 20)
    }, [resizeKey, scrollInstance])

    // ResizeObserver: #main으로 범위 좁힘 (Framer DOM 안정성)
    useEffect(() => {
        const target =
            document.getElementById("main") ||
            document.body ||
            document.documentElement

        if (resizeObserverRef.current) {
            resizeObserverRef.current.unobserve(target)
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

        resizeObserverRef.current.observe(target)
    }, [scrollInstance, setBodyHeightChangeKey])

    // useEffect(() => {
    //     initScroll()

    //     return () => {
    //         if (scrollRaf.current) gsap.ticker.remove(scrollRaf.current)
    //         if (scrollRef.current) scrollRef.current.destroy()
    //     }
    // }, [])

    return (
        <ScrollContext.Provider
            value={{ scroll: scrollInstance, initScroll, onScrollCallback }}
        >
            {children}
        </ScrollContext.Provider>
    )
}
