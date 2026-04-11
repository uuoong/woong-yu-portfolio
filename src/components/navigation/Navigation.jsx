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

const navigationDrawerAnimationDistance = "52.2rem"

export const HEADER_ID = "site-header"
const SCROLL_CALLBACK_KEY = "scroll-key"

const Navigation = () => {
    const {
        navigationData,
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
            y: navigationIsOpen ? navigationDrawerAnimationDistance : "0rem",
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
                if (percent < 0) {
                    positivePercent = `-${positivePercent}`
                }
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
                    ref={(ref) => {
                        if (ref) drawerElementRef.current = ref.getElement()
                    }}
                />
            )}

            {isMobile && <MobileNav />}

            <header
                id={HEADER_ID}
                ref={navigationRef}
                className={`Navigation ${showMainContent ? "isVisible" : ""}`}
            >
                <nav className="Navigation_nav">
                    <div className="Navigation_left">
                        <Link
                            link={{
                                linkType: "internal",
                                href: "/",
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
