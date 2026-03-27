/**
 * hooks/use_breakpoint.js
 *
 * 레퍼런스: hooks/use-breakpoint.js
 *
 * ─── 변경사항 ─────────────────────────────────────────────────────────────
 *
 *  제거:
 *    - CSS module import (styles/export-vars.module.scss)
 *      → bp 값을 코드 내 상수로 직접 관리
 *
 *  유지:
 *    - getBreakpoint, getIsMobile 헬퍼 함수
 *    - useWindowResize dependency (key 기반 갱신)
 *    - { breakpoint, isMobile } 반환
 *
 * ─── BREAKPOINTS 커스터마이징 ────────────────────────────────────────────
 *
 *  프로젝트에 맞게 BREAKPOINTS 값 수정:
 *  const BREAKPOINTS = { mobile: 600, tablet: 768, laptop: 1024, desktop: 1280, xl: 1600 }
 *
 * ─── 사용법 ───────────────────────────────────────────────────────────────
 *
 *  const { isMobile, breakpoint } = useBreakpoint()
 *  // breakpoint: { name: "mobile" | "tablet" | "laptop" | "desktop" | "xl", width: number }
 */

import React, { useEffect, useState } from "react"
import useWindowResize from "./use_window_resize.js"

export const BREAKPOINTS = {
    mobile: 768,
    tablet: 967,
    laptop: 1200,
    desktop: 1512,
    xl: 1800,
}

export function getBreakpoint(windowWidth) {
    if (!windowWidth) return null

    const entries = Object.entries(BREAKPOINTS)

    for (let i = 0; i < entries.length; i++) {
        const [name, maxWidth] = entries[i]
        const prevMax = i === 0 ? 0 : entries[i - 1][1]
        const thisMax = i === entries.length - 1 ? Infinity : maxWidth

        if (windowWidth > prevMax && windowWidth <= thisMax) {
            return { name, width: windowWidth }
        }
    }

    return null
}

export function getIsMobile(windowWidth) {
    const bp = getBreakpoint(windowWidth)
    return bp?.name === "mobile" || bp?.name === "tablet"
}

export default function useBreakpoint() {
    const resizeKey = useWindowResize({ debounce: 100 })
    const [breakpoint, setBreakpoint] = useState(null)
    const [isMobile, setIsMobile] = useState(null)

    useEffect(() => {
        const bp = getBreakpoint(window.innerWidth)
        setBreakpoint(bp)
        setIsMobile(getIsMobile(window.innerWidth))
    }, [resizeKey])

    return { breakpoint, isMobile }
}
