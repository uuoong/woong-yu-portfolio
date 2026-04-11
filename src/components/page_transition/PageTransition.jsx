import React, { forwardRef, useState } from "react"
import { ScrollContext } from "../../context/Scroll.js"
import { useAppContext } from "../../context/App.js"
import { TRANSITION_DURATION_MS } from "../../data/index.js"

export const HEADER_ID = "site-header"

const Link = forwardRef(
    (
        {
            className,
            children,
            link,
            onMouseEnter,
            onMouseLeave,
            linkOnly,
            ariaLabel,
            onClick,
            disableOpenNewTab = false,
            disableThemeAttribute,
            dataTheme,
            style,
        },
        ref
    ) => {
        const { linkType, label, href, hash } = link
        const { scroll } = React.useContext(ScrollContext)
        const { currentPath, setCursorState, setPageIsTransitioning } =
            useAppContext()

        if (linkType === "disabled") {
            return null
        }

        if (!href && linkType === "external") {
            return null
        }

        if (!href && linkType === "internal") {
            return null
        }

        const handleMouseEnter = (e) => {
            setCursorState("FOCUS")
            onMouseEnter?.(e)
        }
        const handleMouseLeave = (e) => {
            setCursorState(null)
            onMouseLeave?.(e)
        }

        if (linkType === "external") {
            return (
                <a
                    ref={ref}
                    aria-label={ariaLabel}
                    href={href}
                    className={className}
                    style={style}
                    target={disableOpenNewTab ? "_self" : "_blank"}
                    rel="noreferrer"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    onClick={(e) => onClick?.(e)}
                    {...(!disableThemeAttribute && { "data-themed": "color" })}
                >
                    {label && !children && !linkOnly && (
                        <span data-themed="color">{label}</span>
                    )}
                    {children}
                </a>
            )
        }

        if (linkType === "internal") {
            const path = href
            const fullHref = `${path}${hash ? `#${hash}` : ""}`
            const goesToOtherPage = currentPath !== path
            const hasHashOnSamePage = !goesToOtherPage && !!hash
            const isCurrentPage = !goesToOtherPage && !hash

            const props = {
                ref,
                "aria-label": ariaLabel,
                className: [
                    className,
                    hasHashOnSamePage ? "hashLink" : "",
                    isCurrentPage ? "inactive" : "",
                ]
                    .filter(Boolean)
                    .join(" "),
                style: {
                    ...(hasHashOnSamePage && { cursor: "pointer" }),
                    ...(isCurrentPage && {
                        pointerEvents: "none",
                        cursor: "initial",
                    }),
                    ...style,
                },
                onMouseEnter: handleMouseEnter,
                onMouseLeave: handleMouseLeave,
                ...(!disableThemeAttribute && {
                    "data-themed": dataTheme || "color",
                }),
            }
            const handleClick = (e) => {
                onClick?.(e)

                // ── 해시 스크롤 (같은 페이지)
                if (hasHashOnSamePage) {
                    e.preventDefault()
                    const header = document.getElementById(HEADER_ID)
                    const target = document.getElementById(hash)
                    if (target && scroll && header) {
                        const distance = Math.abs(
                            target.offsetTop - header.offsetTop
                        )
                        scroll.scrollTo(target, {
                            offset: header.offsetHeight * 2 * -1,
                            easing: (x) =>
                                x < 0.5
                                    ? (1 - Math.sqrt(1 - Math.pow(2 * x, 2))) /
                                      2
                                    : (Math.sqrt(1 - Math.pow(-2 * x + 2, 2)) +
                                          1) /
                                      2,
                            duration: 1 + distance / 20000,
                        })
                    }
                    return
                }

                // ── 페이지 전환
                if (goesToOtherPage) {
                    e.preventDefault()

                    // 1. 현재 페이지에서 화면 덮기 시작
                    setPageIsTransitioning(true)

                    setTimeout(() => {
                        // AppContext가 변경을 감지하여 알맞은 Page 컴포넌트로 교체해 줍니다.
                        window.history.pushState(null, "", link.href)

                        // 3. 아주 짧은 딜레이 후 Wipe 애니메이션 해제 -> 위로 자연스럽게 사라짐
                        setTimeout(() => {
                            setPageIsTransitioning(false)
                        }, 50)
                    }, TRANSITION_DURATION_MS)
                }
            }

            if (hasHashOnSamePage) {
                return (
                    <span {...props} onClick={handleClick}>
                        {label && !children && <span>{label}</span>}
                        {children}
                    </span>
                )
            }

            props.scroll = false

            return (
                <a {...props} href={fullHref} onClick={handleClick}>
                    {label && !children && <span>{label}</span>}
                    {children}
                </a>
            )
        }

        return null
    }
)

Link.displayName = "Link"

export default Link
