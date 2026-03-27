import React, { cloneElement, useRef } from "react"
import { buildIdFromText } from "../../utils/index.js"
import useBreakpoint from "../../hooks/use_breakpoint.js"

const SectionContainer = ({
    _type,
    children,
    cmsTitle,
    sectionsLength,
    isInfiniteDuplicate,
    nextSectionType,
    hiddenOnMobile,
    isFirst = false,
    isLast = false,
}) => {
    const containerRef = useRef(null)
    const id = buildIdFromText(cmsTitle || "")
    const { isMobile } = useBreakpoint()

    const newElement = cloneElement(children, { sectionId: id })

    // const sectionStyle = {
    //     color: "var(--fg-primary)",

    //     margin: "calc(var(--section-spacing) * 0.5) 0",

    //     ...(isFirst && {
    //         marginTop: 0,
    //         paddingTop: "var(--section-spacing)",
    //     }),

    //     ...(isLast && {
    //         marginBottom: 0,
    //         paddingBottom: "calc(var(--section-spacing) * 0.5)",
    //     }),

    //     ...(isInfiniteDuplicate && {
    //         height: "100svh",
    //         overflow: "hidden",
    //         position: "relative",
    //         marginTop: 0,
    //         paddingTop: "var(--section-spacing)",
    //     }),

    //     ...(hiddenOnMobile &&
    //         isMobile && {
    //             display: "none",
    //         }),
    // }

    return (
        <section
            id={id}
            ref={containerRef}
            data-component={_type}
            className={[
                "SectionContainer",
                isInfiniteDuplicate && "isInfiniteDuplicate",
                hiddenOnMobile && "hiddenOnMobile",
            ]
                .filter(Boolean)
                .join(" ")}
            data-sections-length={sectionsLength}
            data-next-section-type={nextSectionType}
        >
            {newElement}
        </section>
    )
}

SectionContainer.displayName = "SectionContainer"

export default SectionContainer
