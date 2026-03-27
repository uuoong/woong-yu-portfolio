/**
 * ─── 사용법 ───
 *  const resizeKey = useWindowResize()
 *  const resizeKey = useWindowResize({ debounce: 200, detectHeightChange: true })
 *
 *  useEffect(() => {
 *    // resizeKey 변경 시 실행
 *  }, [resizeKey])
 */

import React, { useEffect, useState } from "react"

export const USE_WINDOW_RESIZE_DEFAULTS = {
    debounce: 300,
    detectHeightChange: false,
}

export default function useWindowResize(props) {
    const options = { ...USE_WINDOW_RESIZE_DEFAULTS, ...props }

    const [previousWidth, setPreviousWidth] = useState(null)
    const [previousHeight, setPreviousHeight] = useState(null)
    const [key, setKey] = useState(0)

    useEffect(() => {
        const isMobile = /Mobi|Android/i.test(navigator.userAgent)

        if (previousWidth === null) {
            setPreviousWidth(window.innerWidth)
            return
        }

        if (
            previousHeight === null &&
            options.detectHeightChange &&
            !isMobile
        ) {
            setPreviousHeight(window.innerHeight)
            return
        }

        let resizeTimeout = null

        function handleResize() {
            if (resizeTimeout) clearTimeout(resizeTimeout)

            resizeTimeout = setTimeout(() => {
                if (window.innerWidth !== previousWidth) {
                    setPreviousWidth(window.innerWidth)
                    setKey(Date.now())
                }
                if (
                    options.detectHeightChange &&
                    !isMobile &&
                    window.innerHeight !== previousHeight
                ) {
                    setPreviousHeight(window.innerHeight)
                    setKey(Date.now())
                }
            }, options.debounce)
        }

        window.addEventListener("resize", handleResize)
        return () => {
            window.removeEventListener("resize", handleResize)
            if (resizeTimeout) clearTimeout(resizeTimeout)
        }
    }, [
        previousWidth,
        previousHeight,
        options.debounce,
        options.detectHeightChange,
    ])

    // 탭 visibility 복귀 시 강제 갱신
    useEffect(() => {
        const handleVisibilityChange = () => {
            setTimeout(() => setKey(Date.now()), 50)
        }
        window.addEventListener("visibilitychange", handleVisibilityChange)
        return () =>
            window.removeEventListener(
                "visibilitychange",
                handleVisibilityChange
            )
    }, [])

    return key
}
