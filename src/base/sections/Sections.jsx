import React, { Fragment, useEffect, useMemo } from "react"
import SectionContainer from "../../base/section_container/SectionContainer.jsx"
import { ScrollContext } from "../../context/Scroll.js"
import useBreakpoint from "../../hooks/use_breakpoint.js"
import { buildIdFromText } from "../../utils/index.js"

/* INJECT_SECTIONS_IMPORT */
import WorksGL from "../../sections/GL/Worksgl.jsx"
import Footer from "../../sections/footer/Footer.jsx"

// _type string → Component map
const SECTIONS = {
    worksGL: WorksGL,
    // 새 섹션 추가: fourOhFour: FourOhFour,
}

const Sections = ({ sections, infiniteScroll, hasFooter, pageSlug }) => {
    const { initScroll } = React.useContext(ScrollContext)
    const { isMobile } = useBreakpoint()

    const _hasFooter = hasFooter || isMobile
    const _isInfiniteScroll =
        infiniteScroll && !isMobile && typeof isMobile === "boolean"

    const sectionsFiltered = useMemo(() => {
        const _sections = (sections || []).filter(
            (arr) => !arr?.section[0]?.cmsSettings?.isHidden && arr?.section
        )
        if (_isInfiniteScroll) _sections.push(_sections[0])
        return _sections
    }, [sections, _isInfiniteScroll])

    useEffect(() => {
        let isInfinite = Boolean(_isInfiniteScroll)
        if (isMobile) isInfinite = false
        initScroll({ options: { infinite: isInfinite, syncTouch: isInfinite } })
    }, [_isInfiniteScroll, initScroll, isMobile])

    if (!sectionsFiltered?.length) return null

    return (
        <>
            {sectionsFiltered.map((sectionArr, i) => {
                const sectionObj = sectionArr?.section[0]
                if (!sectionObj?._type) return null

                const SectionComponent = SECTIONS[sectionObj._type]
                if (!SectionComponent) {
                    console.warn("[Sections] Unknown _type:", sectionObj._type)
                    return null
                }

                const sectionAfter = sectionsFiltered[i + 1]?.section[0]
                let sectionTypeAfter = sectionAfter?._type
                if (i === sectionsFiltered.length - 2 && infiniteScroll) {
                    sectionTypeAfter = sectionsFiltered[0]?.section[0]?._type
                }

                const key = `${i}_${sectionObj._id}_${buildIdFromText(sectionObj?.cmsSettings?.cmsTitle || "")}`

                return (
                    <Fragment key={key}>
                        <SectionContainer
                            cmsTitle={sectionObj?.cmsSettings?.cmsTitle || ""}
                            _type={sectionObj._type}
                            sectionsLength={sectionsFiltered.length}
                            isFirst={i === 0}
                            isLast={i === sectionsFiltered.length - 1}
                            isInfiniteDuplicate={
                                i === sectionsFiltered.length - 1 &&
                                _isInfiniteScroll
                            }
                            nextSectionType={sectionTypeAfter}
                            hiddenOnMobile={
                                sectionObj?.cmsSettings?.disableOnMobile
                            }
                        >
                            <SectionComponent {...sectionObj} />
                        </SectionContainer>

                        {_hasFooter && i === sectionsFiltered.length - 1 && (
                            <Footer />
                        )}
                    </Fragment>
                )
            })}
        </>
    )
}

Sections.displayName = "Sections"
export default Sections
