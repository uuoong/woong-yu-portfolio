/**
 * MobileNav.jsx
 *
 * 레퍼런스: MobileNav.jsx (원본)
 *
 * ─── 원본 구조 그대로 ─────────────────────────────────────────────────────
 *  animateIn / animateOut — GSAP + CSS custom properties
 *  animateInDescription / animateOutDescription
 *  ContentMask refs (linkLineRefs, linkTitleRefs, linkIndexRefs)
 *  descriptionContainer height 토글
 *
 * ─── 원본 대비 변경사항 (최소화) ─────────────────────────────────────────
 *  useStore      → useAppContext
 *  CSS module    → inline style
 *  useRouter     → window.location.pathname
 *  drawerData 경로: navigationDrawerContent → drawerContent
 */

import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import ContentMask from "../../content_mask/ContentMask.jsx"
import Link from "../../link/Link.jsx"
import Clock from "../../clock/Clock.jsx"
import ArrowRight from "../../_svg/ArrowRight.js"
import { useAppContext } from "../../../context/App.js"
import { getUrlFromPageType } from "../../../data/index.js"

const MobileNav = ({ className }) => {
    const { navData, navigationIsOpen, setNavigationIsOpen } = useAppContext()

    const navigationData = navData
    const drawerData = navData?.drawerContent

    // refs
    const socialLinkMaskRefs = useRef([])
    const aboutTitleRef = useRef()
    const bgRef = useRef()
    const locationTitleRef = useRef()
    const navigationTitleRef = useRef()
    const linkLineRefs = useRef([])
    const linkTitleRefs = useRef([])
    const linkIndexRefs = useRef([])
    const descriptionTitleRef = useRef()
    const descriptionContainerRef = useRef()
    const descriptionContainerInnerRef = useRef()
    const descriptionRef = useRef()

    const [descriptionIsOpen, setDescriptionIsOpen] = useState(false)

    const [currentPath, setCurrentPath] = useState("/")
    useEffect(() => {
        setCurrentPath(window.location.pathname)
    }, [])

    const mainLinks = navigationData?.mainLinks || []

    const animateIn = () => {
        if (!bgRef.current) return

        const duration = 1.2
        const ease = "Power3.easeInOut"

        gsap.killTweensOf([...linkLineRefs.current, navigationTitleRef.current])
        gsap.killTweensOf(bgRef.current)
        gsap.to(bgRef.current, {
            "--left-y": "100%",
            "--right-y": "100%",
            duration,
            ease,
        })

        const titleDelay = duration * 0.4
        navigationTitleRef.current?.animateIn({ delay: titleDelay })
        linkTitleRefs.current.forEach((r, i) =>
            r?.animateIn({ delay: titleDelay + i * 0.1 })
        )
        linkIndexRefs.current.forEach((r, i) =>
            r?.animateIn({ delay: titleDelay + 0.1 + i * 0.1 })
        )
        linkLineRefs.current.forEach((el, i) => {
            if (!el) return
            gsap.to(el, {
                scaleX: 1,
                duration,
                ease,
                delay: titleDelay * 0.75 + i * 0.1,
            })
        })

        const bottomDelay = duration * 0.8
        socialLinkMaskRefs.current.forEach((r) =>
            r?.animateIn({ delay: bottomDelay })
        )
        aboutTitleRef.current?.animateIn({ delay: bottomDelay })
        locationTitleRef.current?.animateIn({ delay: bottomDelay })
    }

    const animateOut = () => {
        if (!bgRef.current) return

        const duration = 0.6
        const ease = "Power3.easeOut"
        const maskOutDur = 0.6

        gsap.killTweensOf([...linkLineRefs.current, navigationTitleRef.current])
        gsap.killTweensOf(bgRef.current)
        gsap.to(bgRef.current, {
            "--left-y": "0%",
            "--right-y": "0%",
            duration,
            ease,
        })

        navigationTitleRef.current?.animateOut({ direction: "DOWN" })
        linkTitleRefs.current.forEach((r) =>
            r?.animateOut({ direction: "DOWN", duration: maskOutDur })
        )
        linkIndexRefs.current.forEach((r) =>
            r?.animateOut({ direction: "DOWN", duration: maskOutDur })
        )
        gsap.to(linkLineRefs.current, { scaleX: 0, duration, ease })
        socialLinkMaskRefs.current.forEach((r) =>
            r?.animateOut({ direction: "DOWN", duration: maskOutDur })
        )
        aboutTitleRef.current?.animateOut({
            direction: "DOWN",
            duration: maskOutDur,
        })
        locationTitleRef.current?.animateOut({
            direction: "DOWN",
            duration: maskOutDur,
        })

        setDescriptionIsOpen(false)
    }

    const animateInDescription = () => {
        const lastLine = linkLineRefs.current[linkLineRefs.current.length - 1]
        if (
            !descriptionTitleRef.current ||
            !descriptionRef.current ||
            !lastLine ||
            !descriptionContainerRef.current ||
            !descriptionContainerInnerRef.current
        )
            return

        const duration = 0.8
        const ease = "Power3.easeOut"
        const height = descriptionContainerInnerRef.current.offsetHeight

        descriptionTitleRef.current.animateIn()
        gsap.killTweensOf([
            descriptionRef.current,
            descriptionContainerRef.current,
        ])
        gsap.to(descriptionRef.current, { autoAlpha: 1, duration, ease })
        gsap.to(lastLine, { y: height, duration, ease })
        gsap.to(descriptionContainerRef.current, { height, duration, ease })
    }

    const animateOutDescription = () => {
        const lastLine = linkLineRefs.current[linkLineRefs.current.length - 1]
        if (
            !descriptionTitleRef.current ||
            !descriptionRef.current ||
            !lastLine ||
            !descriptionContainerRef.current
        )
            return

        const duration = 0.4
        const ease = "Power3.easeOut"

        descriptionTitleRef.current.animateOut({ direction: "DOWN" })
        gsap.killTweensOf([
            descriptionRef.current,
            descriptionContainerRef.current,
        ])
        gsap.to(descriptionRef.current, { autoAlpha: 0, duration, ease })
        gsap.to(lastLine, { y: 0, duration, ease })
        gsap.to(descriptionContainerRef.current, { height: 0, duration, ease })
    }

    useEffect(() => {
        if (navigationIsOpen) animateIn()
        else animateOut()
    }, [navigationIsOpen])

    useEffect(() => {
        if (descriptionIsOpen) animateInDescription()
        else animateOutDescription()
    }, [descriptionIsOpen])

    return (
        <div
            className="MobileNav"
            style={{
                pointerEvents: navigationIsOpen ? "all" : "none",
            }}
        >
            <div className="MobileNav_bgContainer" ref={bgRef}>
                <div className="MobileNav_header">
                    <Link
                        link={{ linkType: "page", link: "home" }}
                        className="MobileNav_title"
                        data-themed="color"
                    >
                        {navigationData?.title}
                    </Link>
                    <div className="MobileNav_topRight">
                        <Clock className="MobileNav_clock" />
                        <button
                            className="MobileNav_close"
                            onClick={() => setNavigationIsOpen(false)}
                        >
                            <span className="MobileNav_close__text">Close</span>
                            <span className="MobileNav_close__line" />
                        </button>
                    </div>
                </div>

                <div className="MobileNav_navigationContainer">
                    <ContentMask
                        element="div"
                        ref={navigationTitleRef}
                        className="MobileNav_navigationContainer__titleContainer"
                    >
                        <span className="MobileNav_navigationContainer__title">
                            (Navigation)
                        </span>
                    </ContentMask>

                    <ul className="MobileNav_linkList">
                        {mainLinks.map((link, i) => {
                            const linkPath = getUrlFromPageType(
                                link.linkType,
                                link.link
                            )
                            const isActive =
                                currentPath === linkPath && !descriptionIsOpen

                            return (
                                <li
                                    key={i}
                                    onClick={() => setNavigationIsOpen(false)}
                                >
                                    <Link
                                        link={link}
                                        className="MobileNav_linkList__link"
                                    >
                                        <span
                                            className="MobileNav_linkList__link__line"
                                            ref={(el) => {
                                                linkLineRefs.current[i] = el
                                            }}
                                        />
                                        <ContentMask
                                            element="span"
                                            ref={(r) => {
                                                linkTitleRefs.current[i] = r
                                            }}
                                        >
                                            <span
                                                className="MobileNav_linkList__link__label"
                                                style={{
                                                    opacity: isActive ? 1 : 0.4,
                                                }}
                                            >
                                                {link.label}
                                            </span>
                                        </ContentMask>
                                        <ContentMask
                                            element="span"
                                            ref={(r) => {
                                                linkIndexRefs.current[i] = r
                                            }}
                                        >
                                            <span
                                                className="MobileNav_linkList__link__number"
                                                style={{
                                                    opacity: isActive ? 1 : 0.4,
                                                }}
                                            >
                                                0{i + 1}
                                            </span>
                                        </ContentMask>
                                    </Link>
                                </li>
                            )
                        })}

                        {drawerData && (
                            <li>
                                <button
                                    className="MobileNav_informationButton"
                                    onClick={() =>
                                        setDescriptionIsOpen((p) => !p)
                                    }
                                >
                                    <span
                                        className="MobileNav_linkList__link__line"
                                        ref={(el) => {
                                            linkLineRefs.current[
                                                mainLinks.length
                                            ] = el
                                        }}
                                    />
                                    <ContentMask
                                        element="span"
                                        ref={(r) => {
                                            linkTitleRefs.current[
                                                mainLinks.length
                                            ] = r
                                        }}
                                    >
                                        <span
                                            className="MobileNav_informationButton__label"
                                            data-themed="color"
                                            style={{
                                                opacity: descriptionIsOpen
                                                    ? 1
                                                    : 0.4,
                                            }}
                                        >
                                            Information
                                        </span>
                                    </ContentMask>
                                    <ContentMask
                                        element="span"
                                        ref={(r) => {
                                            linkIndexRefs.current[
                                                mainLinks.length
                                            ] = r
                                        }}
                                    >
                                        <span
                                            className="MobileNav_informationButton__number"
                                            data-themed="color"
                                            style={{
                                                opacity: descriptionIsOpen
                                                    ? 1
                                                    : 0.4,
                                            }}
                                        >
                                            0{mainLinks.length + 1}
                                        </span>
                                    </ContentMask>
                                    <span
                                        className="MobileNav_linkList__link__line"
                                        ref={(el) => {
                                            linkLineRefs.current[
                                                mainLinks.length
                                            ] = el
                                        }}
                                    />
                                </button>

                                <div
                                    className="MobileNav_descriptionContainer"
                                    ref={descriptionContainerRef}
                                >
                                    <div
                                        className="MobileNav_descriptionContainer__inner"
                                        ref={descriptionContainerInnerRef}
                                    >
                                        <p className="MobileNav_descriptionContainer__title">
                                            <ContentMask
                                                element="span"
                                                ref={descriptionTitleRef}
                                                text={
                                                    drawerData.titleDescription
                                                }
                                            />
                                        </p>
                                        <p
                                            className="MobileNav_descriptionContainer__description"
                                            ref={descriptionRef}
                                        >
                                            {drawerData.description}
                                        </p>
                                    </div>
                                </div>
                            </li>
                        )}
                    </ul>
                </div>

                <div className="MobileNav_bottomContainer">
                    {drawerData?.socialLinks?.length > 0 && (
                        <ul className="MobileNav_socialLinks">
                            {drawerData.socialLinks.map((link, i) => (
                                <li
                                    className="MobileNav_socialLinks__item"
                                    key={i}
                                >
                                    <ContentMask
                                        element="span"
                                        ref={(r) => {
                                            socialLinkMaskRefs.current[i] = r
                                        }}
                                        innerClassName={
                                            "MobileNav_socialLinks__linkMask"
                                        }
                                    >
                                        <Link
                                            className="MobileNav_socialLinks__link"
                                            link={link}
                                        >
                                            <span className="MobileNav_socialLinks__linkLabel">
                                                {link.label}
                                            </span>
                                            <ArrowRight className="MobileNav_socialLinks__arrow" />
                                        </Link>
                                    </ContentMask>
                                </li>
                            ))}
                        </ul>
                    )}
                    <div className="MobileNav_bottomTitles">
                        <p className="MobileNav_aboutTitle">
                            <ContentMask element="span" ref={aboutTitleRef}>
                                <span>{drawerData?.titleType}</span>
                            </ContentMask>
                        </p>
                        <p className="MobileNav_locationTitle">
                            <ContentMask element="span" ref={locationTitleRef}>
                                <span>{drawerData?.titleLocation}</span>
                            </ContentMask>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

MobileNav.displayName = "MobileNav"

export default MobileNav
