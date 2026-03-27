/**
 * Navigation.jsx
 *
 * 레퍼런스: Navigation.jsx (원본)
 *
 * ─── 원본 구조 그대로 ─────────────────────────────────────────────────────
 *  navigationData = navData (원본 globalData?.navigation)
 *  Clock — props 없이 AppContext에서 직접 읽음
 *  percentScrolled — 원본 scroll progress 로직 그대로
 *  debouncedProductHovering → 현재: debouncedWorkHovering (work로 변경)
 *  SCROLL_CALLBACK_KEY
 *
 * ─── 원본 대비 변경사항 (최소화) ─────────────────────────────────────────
 *  useStore            → useAppContext
 *  CSS module          → inline style + CSS transition (visibility 없음)
 *  DOC_TYPES + HOME_SLUG → Link link prop에 사용
 */

import React, { useEffect, useRef, useState } from "react"
import gsap from "https://esm.sh/gsap"
import { ScrollContext } from "../../context/Scroll.js"
import { useAppContext } from "../../context/App.js"
import useBreakpoint from "../../hooks/use_breakpoint.js"
import Clock from "../clock/Clock.jsx"
import Link from "../link/Link.jsx"
import ThemeToggle from "../theme_toggle/ThemeToggle.jsx"
import Drawer, { DRAWER_ANIMATION_CONFIG } from "./drawer/Drawer.jsx"
import MobileNav from "./mobile/MobileNav.jsx"
import { DOC_TYPES, HOME_SLUG } from "../../data/index.js"

export const HEADER_ID = "site-header"
const SCROLL_CALLBACK_KEY = "scrollkeeeeeee"

const Navigation = () => {
    const {
        navData: navigationData,
        navigationIsOpen,
        setNavigationIsOpen,
        showMainContent,
        setCursorState,
        workHovering,
    } = useAppContext()

    const { onScrollCallback } = React.useContext(ScrollContext)
    const percentScrolledRef = useRef()
    const navigationRef = useRef()
    const drawerElementRef = useRef()
    const debounceTimeoutRef = useRef()

    const { isMobile } = useBreakpoint()

    const [debouncedWorkHovering, setDebouncedWorkHovering] = useState(false)

    useEffect(() => {
        if (isMobile) return
        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current)
        }

        debounceTimeoutRef.current = setTimeout(() => {
            setDebouncedWorkHovering(workHovering)
        }, 100)
    }, [workHovering, isMobile])

    useEffect(() => {
        if (!navigationRef.current || isMobile) return
        const config = DRAWER_ANIMATION_CONFIG[navigationIsOpen ? "IN" : "OUT"]
        gsap.killTweensOf(navigationRef.current)
        gsap.to(navigationRef.current, {
            y: navigationIsOpen
                ? document.getElementById("drawer-innnnurrrrr")?.offsetHeight ||
                  0
                : 0,
            ease: config.ease,
            duration: config.duration,
        })
    }, [navigationIsOpen, isMobile])

    useEffect(() => {
        onScrollCallback({
            key: SCROLL_CALLBACK_KEY,
            callback: (e) => {
                const percent = Math.floor(e.progress * 100)
                let positivePercent = Math.abs(percent)
                if (positivePercent < 10)
                    positivePercent = `0${positivePercent}`
                positivePercent = `${positivePercent}%`
                if (percent < 0) positivePercent = `-${positivePercent}`
                if (percentScrolledRef.current) {
                    percentScrolledRef.current.innerHTML = positivePercent
                }
            },
        })
    }, [])

    if (!navigationData) return null

    return (
        <>
            {!isMobile && (
                <Drawer
                    ref={(r) => {
                        if (r) drawerElementRef.current = r.getElement()
                    }}
                />
            )}

            {isMobile && <MobileNav />}

            <header
                id={HEADER_ID}
                className="Navigation"
                ref={navigationRef}
                style={{
                    opacity: showMainContent ? 1 : 0.001,
                    transition: "opacity 0.6s",
                    visibility: "visible",
                }}
            >
                <nav className="Navigation_nav">
                    <div className="Navigation_left">
                        <Link
                            link={{
                                linkType: DOC_TYPES.PAGE,
                                link: HOME_SLUG,
                            }}
                            className="Navigation_title"
                            data-themed="color"
                        >
                            {navigationData?.title}
                        </Link>

                        <p className="Navigation_clock">
                            <Clock />
                        </p>

                        <p
                            className="Navigation_percentScrolled"
                            ref={percentScrolledRef}
                            data-themed="color"
                        >
                            00%
                        </p>

                        {debouncedWorkHovering && !isMobile && (
                            <p className="Navigation_hoveredProduct">
                                <span>{debouncedWorkHovering?.model}</span>
                                <span>{debouncedWorkHovering?.title}</span>
                            </p>
                        )}
                    </div>

                    <div className="Navigation_right">
                        {!isMobile &&
                            navigationData?.mainLinks?.map((link, i) => (
                                <Link
                                    link={link}
                                    key={i}
                                    className="Navigation_link"
                                >
                                    <span className="Navigation_link__number">
                                        {i + 1}.
                                    </span>
                                    <span className="Navigation_link__label">
                                        {link.label}
                                    </span>
                                </Link>
                            ))}

                        <button
                            className="Navigation_drawerButton"
                            onClick={() => setNavigationIsOpen(true)}
                            onMouseEnter={() => setCursorState?.("FOCUS")}
                            onMouseLeave={() => setCursorState?.(null)}
                        >
                            <span
                                className="Navigation_link__number"
                                data-themed="color"
                            >
                                {navigationData?.mainLinks?.length + 1}.
                            </span>
                            <span
                                className="Navigation_link__label"
                                data-themed="color"
                            >
                                {isMobile ? "Menu" : "Information"}
                            </span>
                        </button>

                        <ThemeToggle />
                    </div>
                </nav>
            </header>
        </>
    )
}

Navigation.displayName = "Navigation"

export default Navigation
