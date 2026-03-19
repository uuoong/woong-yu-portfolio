/**
 * Link.jsx — 범용 Link 컴포넌트
 *
 * ─── Framer canvas 호환 ────────────────────────────────────────────────────
 *
 *  - forwardRef 제거 (Framer canvas 직렬화 충돌)
 *  - default export 사용
 *  - ScrollContext를 optional하게 사용 (Provider 밖에서도 안전)
 */

import React, { useContext } from "react"
import { ScrollContext } from "https://framer.com/m/Scroll-szavc7.js@zOGCrgWorLBsFdQI7czl"

export default function Link({
    href,
    children,
    external = false,
    className,
    style,
    onClick,
    onMouseEnter,
    onMouseLeave,
    ariaLabel,
    disabled = false,
}) {
    // ScrollContext가 없어도 안전하게 동작
    const { scroll } = useContext(ScrollContext)

    if (!href) return null

    const isHash = href.startsWith("#")
    const isExternal =
        external || href.startsWith("http") || href.startsWith("//")

    const isSamePage = (() => {
        if (typeof window === "undefined") return false
        if (isHash || isExternal) return false
        return window.location.pathname === href
    })()

    const isInactive = disabled || isSamePage

    const handleClick = (e) => {
        onClick?.(e)

        if (isHash) {
            e.preventDefault()
            const target = document.querySelector(href)

            if (target && scroll) {
                const distance = Math.abs(target.offsetTop - window.scrollY)
                const duration = Math.max(
                    0.8,
                    Math.min(2.5, 1 + distance / 5000)
                )
                scroll.scrollTo(target, {
                    duration,
                    easing: (x) =>
                        x < 0.5
                            ? (1 - Math.sqrt(1 - Math.pow(2 * x, 2))) / 2
                            : (Math.sqrt(1 - Math.pow(-2 * x + 2, 2)) + 1) / 2,
                })
                history.pushState(null, "", href)
            } else if (target) {
                target.scrollIntoView({ behavior: "smooth" })
            }
        }
    }

    return (
        <a
            href={isInactive ? undefined : href}
            className={className}
            style={{
                cursor: isInactive ? "default" : undefined,
                pointerEvents: isInactive ? "none" : undefined,
                ...style,
            }}
            aria-label={ariaLabel}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noreferrer noopener" : undefined}
            onClick={handleClick}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            {children}
        </a>
    )
}

Link.displayName = "Link"
