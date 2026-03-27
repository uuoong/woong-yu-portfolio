/**
 * useIsReducedMotion.js — prefers-reduced-motion 감지
 *
 * ImageReveal 레퍼런스에서 사용하는 훅.
 * 사용자가 애니메이션 축소를 설정한 경우 isReducedMotion = true.
 */

import React, { useState, useEffect } from "react"

export default function useIsReducedMotion() {
    const [isReducedMotion, setIsReducedMotion] = useState(false)

    useEffect(() => {
        const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
        setIsReducedMotion(mq.matches)

        const handler = (e) => setIsReducedMotion(e.matches)
        mq.addEventListener("change", handler)
        return () => mq.removeEventListener("change", handler)
    }, [])

    return { isReducedMotion }
}
