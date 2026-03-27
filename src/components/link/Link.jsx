/**
 * Link.jsx
 *
 * 레퍼런스: Link.jsx (원본)
 *
 * ─── DOC_TYPES + getUrlFromPageType 활용 ────────────────────────────────
 *
 *  원본:
 *    const path = getUrlFromPageType(urlObject?._type, slug)
 *    link prop: { linkType: 'internal', link: { _id, _type, slug } }  ← Sanity 객체
 *
 *  현재:
 *    link prop: { linkType: DOC_TYPES.PAGE, link: "slug" }  ← slug 문자열
 *    내부에서 getUrlFromPageType(linkType, link)로 URL 생성
 *
 *  장점:
 *    - WORKS_SLUG가 "works"에서 바뀌면 data.js 한 곳만 수정
 *    - DOC_TYPES.WORK → "/works/slug" 자동 생성
 *    - 원본의 getUrlFromPageType 사용 패턴 유지
 *
 * ─── link prop 사용법 ─────────────────────────────────────────────────────
 *
 *  // 내부 페이지 링크
 *  { linkType: DOC_TYPES.PAGE, link: "about" }     → "/about"
 *  { linkType: DOC_TYPES.PAGE, link: "home" }      → "/"
 *  { linkType: DOC_TYPES.WORK, link: "project-1" } → "/works/project-1"
 *
 *  // 외부 링크
 *  { linkType: "external", link: "https://..." }
 *
 *  // hash 앵커 (같은 페이지)
 *  { linkType: DOC_TYPES.PAGE, link: "home", hash: "section-id" }
 *
 *  // 비활성화
 *  { linkType: "disabled" }
 */

import React, { forwardRef } from "react"
import { ScrollContext } from "../../context/Scroll.js"
import { useAppContext } from "../../context/App.js"
import { getUrlFromPageType } from "../../data/index.js"

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
        const { linkType, label, link: url, hash } = link || {}
        const { scroll } = React.useContext(ScrollContext)
        const { setCursorState } = useAppContext()

        // 현재 경로
        const currentPath =
            typeof window !== "undefined" ? window.location.pathname : "/"

        if (linkType === "disabled") return null

        if (typeof url !== "string" && linkType === "external") return null

        if (typeof url !== "string" && linkType !== "external") return null

        const handleMouseEnter = (event) => {
            setCursorState?.("FOCUS")
            if (onMouseEnter) onMouseEnter(event)
        }

        const handleMouseLeave = (event) => {
            setCursorState?.(null)
            if (onMouseLeave) onMouseLeave(event)
        }

        const handleClick = (event) => {
            if (onClick) onClick(event)
        }

        // ── external ──────────────────────────────────────────────────────
        if (linkType === "external") {
            return (
                <a
                    ref={ref}
                    aria-label={ariaLabel}
                    {...(ariaLabel &&
                        !label &&
                        !children && { name: ariaLabel })}
                    href={url}
                    className={className}
                    style={style}
                    target={disableOpenNewTab ? "_self" : "_blank"}
                    rel="noreferrer"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    onClick={handleClick}
                    data-themed={disableThemeAttribute ? "" : "color"}
                >
                    {label && !children && !linkOnly && (
                        <span data-themed="color">{label}</span>
                    )}
                    {children && children}
                </a>
            )
        }

        // ── internal (DOC_TYPES.PAGE | DOC_TYPES.WORK) ────────────────────
        // 원본: getUrlFromPageType(urlObject?._type, slug)
        // 현재: getUrlFromPageType(linkType, url) — linkType이 _type 역할
        const path = getUrlFromPageType(linkType, url)
        const goesToOtherPage = currentPath !== path
        const hasHashOnSamePage = !goesToOtherPage && hash

        const props = {
            "aria-label": ariaLabel,
            ref,
            className,
            style: {
                ...(hasHashOnSamePage && { cursor: "pointer" }),
                ...(!hasHashOnSamePage &&
                    currentPath === path && {
                        pointerEvents: "none",
                        cursor: "initial",
                    }),
                ...style,
            },
            onClick: (e) => {
                if (onClick) onClick(e)

                if (hasHashOnSamePage) {
                    e.preventDefault()
                    const header = document.getElementById(HEADER_ID)
                    const target = document.getElementById(hash)

                    if (target && scroll && header) {
                        const distance = Math.abs(
                            target?.offsetTop - header.offsetTop
                        )
                        const duration = 1 + distance / 20000
                        scroll.scrollTo(target, {
                            offset: header.offsetHeight * 2 * -1,
                            // easeInOutCirc — 원본 그대로
                            easing: (x) =>
                                x < 0.5
                                    ? (1 - Math.sqrt(1 - Math.pow(2 * x, 2))) /
                                      2
                                    : (Math.sqrt(1 - Math.pow(-2 * x + 2, 2)) +
                                          1) /
                                      2,
                            duration,
                        })
                    }
                }
            },
            onMouseEnter: (event) => {
                setCursorState?.("FOCUS")
                if (onMouseEnter) onMouseEnter(event)
            },
            onMouseLeave: (event) => {
                setCursorState?.(null)
                if (onMouseLeave) onMouseLeave(event)
            },
        }

        if (!disableThemeAttribute) {
            props["data-themed"] = dataTheme || "color"
        }

        // hash가 같은 페이지: span으로 렌더링 (원본과 동일)
        if (hasHashOnSamePage) {
            return (
                <span {...props}>
                    {label && !children && <span>{label}</span>}
                    {children && children}
                </span>
            )
        }

        props.href = `${path}${hash ? `#${hash}` : ""}`

        return (
            <a {...props}>
                {label && !children && <span>{label}</span>}
                {children && children}
            </a>
        )
    }
)

Link.displayName = "Link"

export default Link
