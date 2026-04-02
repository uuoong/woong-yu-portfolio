import React, { forwardRef } from "react"
import { ScrollContext } from "../../context/Scroll.js"
import { useAppContext } from "../../context/App.js"
import { getUrlFromPageType } from "../../utils/index.js"

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

        // const isExternal = link?.isExternal || false

        if (linkType === "disabled") {
            return null
        }

        if (typeof url !== "string" && linkType === "external") {
            return null
        }

        if (typeof url !== "object" && linkType === "internal") {
            return null
        }

        const handleMouseEnter = (event) => {
            setCursorState("FOCUS")

            if (onMouseEnter) {
                onMouseEnter(event)
            }
        }

        const handleMouseLeave = (event) => {
            setCursorState(null)

            if (onMouseLeave) {
                onMouseLeave(event)
            }
        }

        const handleClick = (event) => {
            if (onClick) {
                onClick(event)
            }
        }

        if (linkType === "external") {
            return (
                <a
                    ref={ref}
                    aria-label={ariaLabel}
                    href={typeof url === "string" ? url : ""}
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
        } else if (linkType === "internal") {
            const urlObject = url
            const slug = typeof url === "object" ? url.slug : ""
            const path = getUrlFromPageType(urlObject?._type, slug)
            const goesToOtherPage = currentPath !== path
            const hasHashOnSamePage = !goesToOtherPage && hash
            const isCurrentPage = !hasHashOnSamePage && !goesToOtherPage

            const props = {
                "aria-label": ariaLabel,
                ref: ref,
                className:
                    `${className || ""} ${hasHashOnSamePage ? "hashLink" : ""} ${
                        isCurrentPage ? "inactive" : ""
                    }`.trim(),
                style: {
                    ...(hasHashOnSamePage && { cursor: "pointer" }),
                    ...(isCurrentPage && {
                        pointerEvents: "none",
                        cursor: "initial",
                    }),
                    ...style,
                },

                onClick: (e) => {
                    if (onClick) {
                        onClick(e)
                    }

                    if (hasHashOnSamePage) {
                        e.preventDefault()
                        const header = document.getElementById(HEADER_ID)
                        const id = document.getElementById(hash)

                        if (id && scroll && header) {
                            const distance = Math.abs(
                                id?.offsetTop - header.offsetTop
                            )
                            const duration = 1 + distance / 20000

                            scroll.scrollTo(id, {
                                offset: header.offsetHeight * 2 * -1,
                                //easeInOutCirc function
                                easing: (x) =>
                                    x < 0.5
                                        ? (1 -
                                              Math.sqrt(
                                                  1 - Math.pow(2 * x, 2)
                                              )) /
                                          2
                                        : (Math.sqrt(
                                              1 - Math.pow(-2 * x + 2, 2)
                                          ) +
                                              1) /
                                          2,
                                // immediate: true,
                                duration,
                            })
                        }
                    }
                },
                onMouseEnter: (event) => {
                    setCursorState("FOCUS")

                    if (onMouseEnter) {
                        onMouseEnter(event)
                    }
                },
                onMouseLeave: (event) => {
                    setCursorState(null)

                    if (onMouseLeave) {
                        onMouseLeave(event)
                    }
                },
            }

            if (!disableThemeAttribute) {
                props["data-themed"] = dataTheme || "color"
            }

            if (hasHashOnSamePage) {
                return (
                    <span {...props}>
                        {label && !children && <span>{label}</span>}
                        {children && children}
                    </span>
                )
            }

            props.scroll = false
            props.href = `${path}${hash ? `#${hash}` : ""}`

            return (
                <a {...props}>
                    {label && !children && <span>{label}</span>}
                    {children && children}
                </a>
            )
        }
    }
)

Link.displayName = "Link"

export default Link
