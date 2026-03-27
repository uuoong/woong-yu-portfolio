import React, { useEffect, useRef } from "react"
import gsap from "https://esm.sh/gsap"
import { useAppContext } from "../../context/App.js"
import useBreakpoint from "../../hooks/use_breakpoint.js"

const Cursor = ({ className }) => {
    const containerRef = useRef()
    const horizontalLineRef = useRef()
    const verticalLineRef = useRef()
    const textExploreRef = useRef()
    const textdblClickCloseRef = useRef()
    const textdblClickExpandRef = useRef()

    const { cursorState } = useAppContext()

    const { isMobile } = useBreakpoint()
    const showCursorRef = useRef(false)

    useEffect(() => {
        gsap.set(containerRef.current, { xPercent: -50, yPercent: -50 })

        const xTo = gsap.quickTo(containerRef.current, "x", {
            duration: 0.6,
            ease: "power3",
        })
        const yTo = gsap.quickTo(containerRef.current, "y", {
            duration: 0.6,
            ease: "power3",
        })

        const move = (e) => {
            xTo(e.clientX)
            yTo(e.clientY)

            if (e.clientX !== 0 && e.clientY !== 0 && !showCursorRef.current) {
                showCursorRef.current = true
                gsap.to(containerRef.current, {
                    autoAlpha: 1,
                    duration: 0.8,
                    delay: 0.2,
                })
            }
        }

        window.removeEventListener("mousemove", move)

        if (!isMobile) {
            window.addEventListener("mousemove", move)
        }
    }, [isMobile])

    useEffect(() => {
        if (isMobile) return

        gsap.killTweensOf([
            horizontalLineRef.current,
            verticalLineRef.current,
            textExploreRef.current,
            textdblClickCloseRef.current,
            textdblClickExpandRef.current,
        ])

        const duration = 0.2
        const ease = "Power3.easeOut"

        const showTextConfig = {
            y: 0,
            duration: 0.8,
            delay: 0.2,
            ease,
        }

        const hideTextConfig = {
            y: "105%",
            duration: 0.8,
            ease,
        }

        const focusBase = () => {
            gsap.to(horizontalLineRef.current, {
                scaleX: 0.5,
                duration,
                ease,
            })

            gsap.to(verticalLineRef.current, {
                scaleY: 0.5,
                duration,
                ease,
            })
        }

        const hideAllText = () => {
            gsap.to(
                [
                    textExploreRef.current,
                    textdblClickCloseRef.current,
                    textdblClickExpandRef.current,
                ],
                hideTextConfig
            )
        }

        switch (cursorState) {
            case "FOCUS":
                focusBase()
                hideAllText()
                break
            case "FOCUS_EXPLORE":
                focusBase()
                gsap.to(textExploreRef.current, showTextConfig)
                gsap.to(
                    [
                        textdblClickCloseRef.current,
                        textdblClickExpandRef.current,
                    ],
                    hideTextConfig
                )
                break
            case "FOCUS_DBL_CLICK_CLOSE":
                focusBase()
                gsap.to(textdblClickCloseRef.current, showTextConfig)
                gsap.to(
                    [textExploreRef.current, textdblClickExpandRef.current],
                    hideTextConfig
                )
                break
            case "FOCUS_DBL_CLICK_EXPAND":
                focusBase()
                gsap.to(textdblClickExpandRef.current, showTextConfig)
                gsap.to(
                    [textExploreRef.current, textdblClickCloseRef.current],
                    hideTextConfig
                )
                break
            case null:
                gsap.to(horizontalLineRef.current, {
                    scaleX: 1,
                    duration,
                    ease,
                })
                gsap.to(verticalLineRef.current, {
                    scaleY: 1,
                    duration,
                    ease,
                })
                hideAllText()
                break
            default:
                break
        }
    }, [cursorState, isMobile])

    if (isMobile) return null

    return (
        <div ref={containerRef} className="Cursor">
            <div className="Cursor_crosshair">
                <div
                    className="Cursor_crosshair__vertical"
                    ref={verticalLineRef}
                />
                <div
                    className="Cursor_crosshair__horizontal"
                    ref={horizontalLineRef}
                />
            </div>
            <p className="Cursor_text">
                <span className="Cursor_text__explore" ref={textExploreRef}>
                    Explore
                </span>
                <span
                    className="Cursor_text__dblClickClose"
                    ref={textdblClickCloseRef}
                >
                    Dbl-Click to Close
                </span>
                <span
                    className="Cursor_text__dblClickExpand"
                    ref={textdblClickExpandRef}
                >
                    Dbl-Click to Expand
                </span>
            </p>
        </div>
    )
}

Cursor.displayName = "Cursor"

export default Cursor
