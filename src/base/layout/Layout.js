/**
 * Layout.jsx — 전역 레이아웃 래퍼
 *
 * ─── 단순화 ───────────────────────────────────────────────────────────────
 *
 *  이전: SCROLL_CONTAINER_CLASS, SCROLL_CONTENT_CLASS 관리,
 *        isBodyScroller 분기, div scroll 조건부 스타일
 *
 *  현재: 항상 window scroll → 복잡한 scroll container 불필요
 *    - ResizeObserver는 #main을 직접 사용 (Scroll.js)
 *    - drawer y-offset: AppContext의 drawerHeight 참조
 *
 *  유지:
 *    - SCROLL_CONTENT_CLASS: scrollContentRef (drawer y-offset 대상)
 *    - showMainContent → autoAlpha 1
 *    - MAIN_FADE_IN_DURATION: home 0.3 / 그 외 1.2
 *
 * ─── WebGL 공존 ──────────────────────────────────────────────────────────
 *
 *  GLImage는 window.scrollY (= Lenis scroll)를 S.scroll로 사용.
 *  div wrapper가 없으므로 항상 window.scrollY가 정확한 스크롤 위치.
 */

import React, { useEffect, useRef } from "react"
import gsap from "https://esm.sh/gsap"
import Navigation from "../../components/navigation/Navigation.jsx"
import { useAppContext } from "../../context/App.js"
import {
    DRAWER_ANIMATION_CONFIG,
    DRAWER_INNER_ID,
} from "../../components/navigation/drawer/Drawer.jsx"
import useBreakpoint from "../../hooks/use_breakpoint.js"
import Cursor from "../../components/cursor/Cursor.jsx"
import PageTransition from "../../components/page_transition/PageTransition.jsx"

export const SCROLL_CONTENT_CLASS = "scrollContainerInner"
export const MAIN_FADE_IN_DURATION = 0.3

const Layout = ({ children }) => {
    const mainRef = useRef(null)
    const scrollContentRef = useRef(null)

    const { showMainContent, navigationIsOpen } = useAppContext()
    const { isMobile } = useBreakpoint()

    useEffect(() => {
        if (!scrollContentRef.current || isMobile) return

        const config = DRAWER_ANIMATION_CONFIG[navigationIsOpen ? "IN" : "OUT"]

        const innerDrawerHeight =
            document.getElementById(DRAWER_INNER_ID)?.offsetHeight || 0

        gsap.to(scrollContentRef.current, {
            y: navigationIsOpen ? innerDrawerHeight : 0,
            ease: config.ease,
            duration: config.duration,
        })
    }, [navigationIsOpen, isMobile])

    useEffect(() => {
        if (!showMainContent || !mainRef.current) return

        const duration = pathname === "/" ? MAIN_FADE_IN_DURATION : 1.2
        if (showMainContent) {
            document.body.dataset.showMainContent = true
        }
        gsap.to(mainRef.current, { autoAlpha: 1, duration })
    }, [showMainContent, pathname])

    return (
        <>
            <Navigation />
            <main id="main" ref={mainRef} data-themed="background-color">
                <div
                    ref={scrollContentRef}
                    className={`${SCROLL_CONTENT_CLASS}`}
                    style={{
                        display: "block",
                        zIndex: 2,
                        position: "relative",
                    }}
                >
                    <PageTransition>{children}</PageTransition>
                </div>
            </main>
            <Cursor />
        </>
    )
}

Layout.displayName = "Layout"

export default Layout
