import React, { useEffect, useRef, useState } from "react"
import gsap from "gsap"

import { useAppContext } from "../../context/App.js"

import {
    DRAWER_ANIMATION_CONFIG,
    DRAWER_INNER_ID,
} from "../../components/navigation/drawer/Drawer.jsx"

import Navigation from "../../components/navigation/Navigation.jsx"
import Wipe from "../../components/wipe/Wipe.jsx"
import PageTransition from "../../components/page_transition/PageTransition.jsx"
import Cursor from "../../components/cursor/Cursor.jsx"

import useBreakpoint from "../../hooks/use_breakpoint.js"
import { TRANSITION_DURATION_MS } from "../../data/index.js"

export const SCROLL_CONTAINER_CLASS = "scrollContainer"
export const SCROLL_CONTENT_CLASS = "scrollContainerInner"
export const MAIN_FADE_IN_DURATION = 0.3

const Layout = ({ children }) => {
    const mainRef = useRef()
    const scrollContentRef = useRef()

    const { showMainContent, navigationIsOpen, currentPath } = useAppContext()

    const { isMobile } = useBreakpoint()

    useEffect(() => {
        if (!scrollContentRef.current || isMobile) return

        const config = DRAWER_ANIMATION_CONFIG[navigationIsOpen ? "IN" : "OUT"]
        const innerDrawerHeight =
            document.getElementById(DRAWER_INNER_ID)?.offsetHeight

        gsap.to(scrollContentRef.current, {
            y: navigationIsOpen ? innerDrawerHeight : 0,
            ease: config.ease,
            duration: config.duration,
        })
    }, [navigationIsOpen, isMobile])

    useEffect(() => {
        if (!showMainContent || !mainRef.current) return

        const duration = currentPath === "/" ? MAIN_FADE_IN_DURATION : 1.2

        if (showMainContent) {
            document.body.dataset.showMainContent = true
        }

        gsap.to(mainRef.current, {
            autoAlpha: 1,
            duration,
        })
    }, [showMainContent, currentPath])

    return (
        <>
            <Navigation />
            <main
                id="main"
                ref={mainRef}
                className={[SCROLL_CONTAINER_CLASS, "disableScroll"]
                    .filter(Boolean)
                    .join(" ")}
                data-themed="background-color"
            >
                <div
                    ref={scrollContentRef}
                    className={[SCROLL_CONTENT_CLASS, "hasNextItem"]
                        .filter(Boolean)
                        .join(" ")}
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
