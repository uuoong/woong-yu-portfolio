/**
 * Scroll.js — Lenis + GSAP 전역 스크롤
 *
 * ─── Window 전용 (div wrapper 제거) ──────────────────────────────────────
 *
 *  이전: 모바일(div wrapper) / 데스크톱(window wrapper) 분기
 *
 *  이유를 제거하는 근거:
 *    1. SSR: module-level의 window 접근 → Framer 서버 렌더링 크래시
 *    2. WebGL: div wrapper 시 window.scrollY = 0 → GLImage 위치 오류
 *    3. Infinite scroll: Lenis `infinite: true`는 window wrapper 필요
 *    4. Framer는 CSR이지만 모듈 평가는 서버에서도 발생
 *
 *  결론: 항상 window wrapper 사용.
 *    - 모바일 iOS 주소창 jitter는 `syncTouch: true`로 대응
 *    - WebGL S.scroll = window.scrollY와 일치 → 정확한 위치 계산
 *    - Infinite scroll은 Lenis options로 제어
 *
 * ─── SCROLL_CONTAINER_CLASS export 여부 ─────────────────────────────────
 *
 *  원본 구조: Layout.jsx에서 export → Scroll.js에서 import
 *  현재: Layout.jsx를 단순화하고 ResizeObserver는 #main을 직접 사용
 *  → SCROLL_CONTAINER_CLASS import 불필요
 *
 * ─── Scroll.js API ───────────────────────────────────────────────────────
 *
 *  <ScrollProvider pathname={path} lenisOptions={{...}}>
 *  useScrollContext() → { scroll, initScroll, onScrollCallback }
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

export const ScrollProvider = ({ children, pathname = "/" }) => {
    const scrollRef = useRef(null)
    const tickerFnRef = useRef(null)
    const [scrollInstance, setScrollInstance] = useState(null)
    const resizeObserverRef = useRef(null)
    const heightChangeTimeoutRef = useRef(null)
    const onScrollCallbacksRef = useRef({})

    const { navigationIsOpen, setBodyHeightChangeKey } = useAppContext()

    // 원본 패턴: debounce + 75
    const resizeKey = useWindowResize({
        debounce: USE_WINDOW_RESIZE_DEFAULTS.debounce + 75,
    })

    // 원본 onScrollCallback — 그대로
    const onScrollCallback = useCallback(({ key, callback, remove }) => {
        if (!key) return
        const callbacks = { ...onScrollCallbacksRef.current }
        if (remove) {
            delete callbacks[key]
        } else if (callback) {
            callbacks[key] = callback
        }
        onScrollCallbacksRef.current = callbacks
    }, [])

    // navigationIsOpen → stop/start
    useEffect(() => {
        if (!scrollInstance) return
        scrollInstance[navigationIsOpen ? "stop" : "start"]()
    }, [navigationIsOpen, scrollInstance])

    // pathname → scroll to top
    useEffect(() => {
        if (!scrollInstance) return
        scrollInstance.scrollTo(0, { immediate: true })
        scrollInstance?.resize()
    }, [pathname, scrollInstance])

    // ── initScroll ────────────────────────────────────────────────────────
    // Sections 컴포넌트에서 infinite 옵션 등을 직접 전달 가능
    // initScroll({ options: { infinite: true } })  ← home 페이지
    const initScroll = useCallback((params) => {
        // GSAP 등록: useEffect 내부에서 호출되므로 브라우저 환경 보장
        gsap.registerPlugin(ScrollTrigger)
        ScrollTrigger.config({ ignoreMobileResize: true })
        gsap.config({ nullTargetWarn: false })

        // 기존 인스턴스 정리
        if (tickerFnRef.current) gsap.ticker.remove(tickerFnRef.current)
        if (scrollRef.current) scrollRef.current.destroy()
        setScrollInstance(null)

        const options = params?.options || {}

        // ── 항상 window wrapper ───────────────────────────────────────────
        // 이유:
        //   1. WebGL: window.scrollY = Lenis scroll → GLImage 위치 정확
        //   2. Infinite scroll: Lenis infinite 옵션은 window wrapper 필요
        //   3. SSR 안전: module-level window 접근 없음 (여기는 useCallback)
        //   4. 모바일 주소창: syncTouch: true로 대응
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
            syncTouch: true, // 모바일 주소창 show/hide 대응
            touchMultiplier: 2,
            autoResize: false,
            wrapper: window,
            content: document.documentElement,
            ...options,
        })

        lenis.on("scroll", (scroll) => {
            ScrollTrigger.update()
            Object.values(onScrollCallbacksRef.current).forEach((cb) => {
                if (cb) cb(scroll)
            })
        })

        const tickerFn = (time) => {
            if (scrollRef.current) scrollRef.current.raf(time * 1000)
        }
        gsap.ticker.add(tickerFn)
        gsap.ticker.lagSmoothing(0)
        tickerFnRef.current = tickerFn

        scrollRef.current = lenis
        setScrollInstance(lenis)

        setTimeout(() => {
            lenis.resize()
            setTimeout(() => ScrollTrigger.refresh(), 50)
        }, 100)
    }, [])

    // resizeKey → resize + ST refresh
    useEffect(() => {
        if (!scrollInstance) return
        scrollInstance.resize()
        setTimeout(() => ScrollTrigger.refresh(), 20)
    }, [resizeKey, scrollInstance])

    // ResizeObserver: #main으로 범위 좁힘 (Framer DOM 안정성)
    useEffect(() => {
        const refresh = () => {
            ScrollTrigger.refresh()
            if (scrollInstance) scrollInstance.resize()
        }

        refresh()

        if (resizeObserverRef.current) {
            resizeObserverRef.current.disconnect()
        }

        resizeObserverRef.current = new ResizeObserver(() => {
            if (heightChangeTimeoutRef.current)
                clearTimeout(heightChangeTimeoutRef.current)
            heightChangeTimeoutRef.current = setTimeout(() => {
                refresh()
                setBodyHeightChangeKey(Date.now())
            }, 300)
        })

        const target =
            document.getElementById("main") ||
            document.querySelector(".scroll-content") ||
            document.documentElement

        resizeObserverRef.current.observe(target)

        return () => {
            resizeObserverRef.current?.disconnect()
            clearTimeout(heightChangeTimeoutRef.current)
        }
    }, [scrollInstance, setBodyHeightChangeKey])

    // 마운트 시 자동 초기화
    useEffect(() => {
        initScroll()
        return () => {
            if (tickerFnRef.current) gsap.ticker.remove(tickerFnRef.current)
            if (scrollRef.current) scrollRef.current.destroy()
        }
    }, []) // eslint-disable-line

    // 뒤로가기 overlay
    useEffect(() => {
        let overlay = null
        const getOverlay = () => {
            if (overlay) return overlay
            overlay = document.createElement("div")
            Object.assign(overlay.style, {
                position: "fixed",
                inset: "0",
                background: "var(--bg, #0e0e0e)",
                zIndex: "9998",
                opacity: "0",
                pointerEvents: "none",
            })
            document.body.appendChild(overlay)
            return overlay
        }

        const handlePopState = () => {
            const el = getOverlay()
            gsap.fromTo(
                el,
                { opacity: 0, pointerEvents: "all" },
                {
                    opacity: 1,
                    duration: 0.25,
                    ease: "power2.in",
                    onComplete: () => {
                        setTimeout(() => {
                            gsap.to(el, {
                                opacity: 0,
                                duration: 0.3,
                                ease: "power2.out",
                                onComplete: () => {
                                    el.style.pointerEvents = "none"
                                },
                            })
                        }, 500)
                    },
                }
            )
        }

        window.addEventListener("popstate", handlePopState)
        return () => {
            window.removeEventListener("popstate", handlePopState)
            overlay?.remove()
        }
    }, [])

    return (
        <ScrollContext.Provider
            value={{ scroll: scrollInstance, initScroll, onScrollCallback }}
        >
            {children}
        </ScrollContext.Provider>
    )
}
