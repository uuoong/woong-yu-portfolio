/**
 * ThemeToggle.jsx — 다크/라이트 모드 토글
 *
 * 레퍼런스: components/ThemeToggle/ThemeToggle.jsx
 * 변경: useStore → useAppContext, CSS module → inline style
 *
 * ─── CSS 변수 ─────────────────────────────────────────────────────────────
 *
 *  document.body.dataset.theme = "dark" | "light"
 *
 *  [data-theme="dark"]  { --bg: #0e0e0e; --fg: #f0f0f0; ... }
 *  [data-theme="light"] { --bg: #f0f0f0; --fg: #0e0e0e; ... }
 *
 *  CSS 변수는 Layout.jsx의 <style> 태그에서 정의됨.
 */

import React, { useEffect, useRef } from "react"
import { useAppContext } from "https://framer.com/m/App-bSRL7k.js@OSIlKrR0H91ZCA9r9DU7"

const TRANSITION_DURATION = 0.4

export default function ThemeToggle({ style }) {
    const { theme, setTheme, setCursorState } = useAppContext()
    const timeoutRef = useRef(null)

    const inactiveTheme = theme === "light" ? "dark" : "light"

    // theme 변경 시 data-themed 속성 트랜지션
    const animateThemed = (reset = false) => {
        document.querySelectorAll("[data-themed]").forEach((el) => {
            if (reset) {
                el.style.removeProperty("transition")
            } else {
                const props = el.dataset.themed.split(",").map((p) => p.trim())
                el.style.transition = props
                    .map((p) => `${p} ${TRANSITION_DURATION}s`)
                    .join(", ")
            }
        })
    }

    useEffect(() => {
        if (!theme) return
        document.body.dataset.theme = theme
        clearTimeout(timeoutRef.current)
        animateThemed()
        timeoutRef.current = setTimeout(
            () => animateThemed(true),
            TRANSITION_DURATION * 1.1 * 1000
        )
    }, [theme])

    // 시스템 테마 초기값
    useEffect(() => {
        const prefersDark = window.matchMedia?.(
            "(prefers-color-scheme: dark)"
        ).matches
        setTheme(prefersDark ? "dark" : "light")
    }, [])

    return (
        <div style={{ position: "relative", ...style }}>
            {/* 크기 확보용 스페이서 */}
            <div style={{ minWidth: 10, minHeight: 10 }} />

            <button
                onClick={() => setTheme(inactiveTheme)}
                aria-label={`Turn on ${inactiveTheme} theme`}
                data-themed="background-color"
                onMouseEnter={() => setCursorState?.("FOCUS")}
                onMouseLeave={() => setCursorState?.(null)}
                style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    padding: 10,
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                }}
            >
                <div
                    style={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        backgroundColor: "var(--fg, #f0f0f0)",
                    }}
                />
            </button>
        </div>
    )
}

ThemeToggle.displayName = "ThemeToggle"
