import React, { useEffect, useRef, useState } from "react"
import gsap from "https://esm.sh/gsap"
import ContentMask from "../../content_mask/ContentMask.jsx"
import Link from "../../link/Link.jsx"
import Clock from "../../clock/Clock.jsx"
import ArrowRight from "../../_svg/ArrowRight.js"
import { useAppContext } from "../../../context/App.js"

const MobileNav = ({ className }) => {
    const {
        navigationData,
        navigationIsOpen,
        setNavigationIsOpen,
        currentPath,
    } = useAppContext()

    const drawerData = navigationData?.drawerContent

    const isActiveLink = (href) => {
        if (!href) return false

        const cleanHref = href.split("#")[0]
        return currentPath === cleanHref && !descriptionIsOpen
    }

    const linksLength = navigationData?.mainLinks?.length || 0

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

    const animateIn = () => {
        if (
            !aboutTitleRef?.current ||
            !socialLinkMaskRefs?.current?.length ||
            !locationTitleRef?.current ||
            !navigationTitleRef?.current ||
            !linkLineRefs?.current?.length ||
            !linkTitleRefs?.current?.length ||
            !linkIndexRefs?.current?.length ||
            !bgRef?.current
        ) {
            return null
        }

        gsap.killTweensOf([
            ...linkLineRefs?.current,
            navigationTitleRef.current,
        ])

        const duration = 1.2
        const ease = "Power3.easeInOut"

        gsap.killTweensOf(bgRef?.current)
        gsap.to(bgRef?.current, {
            "--left-y": "100%",
            "--right-y": "100%",
            duration,
            ease,
        })

        const titleDelay = duration * 0.4
        navigationTitleRef.current.animateIn({
            delay: titleDelay,
        })
        linkTitleRefs?.current.forEach((ref, i) => {
            if (!ref) return
            ref.animateIn({
                delay: titleDelay + i * 0.1,
            })
        })
        linkIndexRefs?.current.forEach((ref, i) => {
            if (!ref) return
            ref.animateIn({
                delay: titleDelay + 0.1 + i * 0.1,
            })
        })

        linkLineRefs.current.forEach((el, i) => {
            gsap.to(el, {
                scaleX: 1,
                duration,
                ease,
                delay: titleDelay * 0.75 + i * 0.1,
            })
        })

        // bottom
        socialLinkMaskRefs.current?.forEach((ref) => {
            if (!ref) return
            ref.animateIn({
                delay: duration * 0.8,
            })
        })

        const refs = [aboutTitleRef.current, locationTitleRef.current]
        refs.forEach((ref) => {
            if (!ref) return
            ref.animateIn({
                delay: duration * 0.8,
            })
        })
    }

    const animateOut = () => {
        if (
            !aboutTitleRef?.current ||
            !socialLinkMaskRefs?.current?.length ||
            !locationTitleRef?.current ||
            !navigationTitleRef?.current ||
            !linkLineRefs?.current?.length ||
            !linkTitleRefs?.current?.length ||
            !linkIndexRefs?.current?.length ||
            !bgRef?.current
        ) {
            return null
        }

        gsap.killTweensOf([
            ...linkLineRefs?.current,
            navigationTitleRef.current,
        ])

        const duration = 0.6
        const ease = "Power3.easeOut"

        gsap.killTweensOf(bgRef?.current)
        gsap.to(bgRef?.current, {
            "--left-y": "0%",
            "--right-y": "0%",
            duration,
            ease,
        })

        const maskOutDuration = 0.6
        navigationTitleRef.current.animateOut({
            direction: "DOWN",
        })
        linkTitleRefs?.current.forEach((ref) => {
            if (!ref) return
            ref.animateOut({
                direction: "DOWN",
                duration: maskOutDuration,
            })
        })
        linkIndexRefs?.current.forEach((ref) => {
            if (!ref) return
            ref.animateOut({
                direction: "DOWN",
                duration: maskOutDuration,
            })
        })
        gsap.to(linkLineRefs.current, {
            scaleX: 0,
            duration: duration,
            ease,
        })

        // bottom
        socialLinkMaskRefs.current?.forEach((ref) => {
            if (!ref) return
            ref.animateOut({
                direction: "DOWN",
                duration: maskOutDuration,
            })
        })

        const refs = [aboutTitleRef.current, locationTitleRef.current]
        refs.forEach((ref) => {
            if (!ref) return
            ref.animateOut({
                duration: maskOutDuration,
                direction: "DOWN",
            })
        })

        // Description
        setDescriptionIsOpen(false)
    }

    const animateInDescription = () => {
        const lastLine = linkLineRefs?.current[linkLineRefs?.current.length - 1]
        if (
            !descriptionTitleRef.current ||
            !descriptionRef.current ||
            !lastLine ||
            !descriptionContainerRef.current ||
            !descriptionContainerInnerRef.current
        ) {
            return
        }

        const duration = 0.8
        const ease = "Power3.easeOut"
        const height = descriptionContainerInnerRef.current.offsetHeight

        descriptionTitleRef.current.animateIn()
        gsap.killTweensOf([
            descriptionRef.current,
            descriptionContainerRef.current,
            descriptionContainerInnerRef.current,
        ])
        gsap.to(descriptionRef.current, {
            autoAlpha: 1,
            duration,
            ease,
        })
        gsap.to(lastLine, {
            y: height,
            duration,
            ease,
        })
        gsap.to(descriptionContainerRef.current, {
            height,
            duration,
            ease,
        })
    }

    const animateOutDescription = () => {
        const lastLine = linkLineRefs?.current[linkLineRefs?.current.length - 1]
        if (
            !descriptionTitleRef.current ||
            !descriptionRef.current ||
            !lastLine ||
            !descriptionContainerRef.current ||
            !descriptionContainerInnerRef.current
        ) {
            return
        }

        descriptionTitleRef.current.animateOut({
            direction: "DOWN",
        })
        const duration = 0.4
        const ease = "Power3.easeOut"
        gsap.killTweensOf([
            descriptionRef.current,
            descriptionContainerRef.current,
            descriptionContainerInnerRef.current,
        ])
        gsap.to(descriptionRef.current, {
            autoAlpha: 0,
            duration,
            ease,
        })
        gsap.to(lastLine, {
            y: 0,
            duration,
            ease,
        })
        gsap.to(descriptionContainerRef.current, {
            height: 0,
            duration,
            ease,
        })
    }

    useEffect(() => {
        if (navigationIsOpen) {
            animateIn()
        } else {
            animateOut()
        }
    }, [navigationIsOpen])

    useEffect(() => {
        if (descriptionIsOpen) {
            animateInDescription()
        } else {
            animateOutDescription()
        }
    }, [descriptionIsOpen])

    return (
        <div
            className={`MobileNav ${className || ""} ${navigationIsOpen ? "navIsOpen" : ""}`}
        >
            <div className="MobileNav_bgContainer" ref={bgRef}>
                <div className="MobileNav_header">
                    <Link
                        link={{ linkType: "internal", href: "/" }}
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
                        {navigationData?.mainLinks?.map((link, i) => {
                            const isActive = isActiveLink(link.href)

                            return (
                                <li
                                    key={i}
                                    onClick={() => setNavigationIsOpen(false)}
                                >
                                    <Link
                                        link={link}
                                        className={`MobileNav_linkList__link ${isActive ? "isActive" : ""}`}
                                    >
                                        <span
                                            className="MobileNav_linkList__link__line"
                                            ref={(ref) => {
                                                linkLineRefs.current[i] = ref
                                            }}
                                        />
                                        <ContentMask
                                            element="span"
                                            ref={(ref) => {
                                                linkTitleRefs.current[i] = ref
                                            }}
                                        >
                                            <span className="MobileNav_linkList__link__label">
                                                {link.label}
                                            </span>
                                        </ContentMask>
                                        <ContentMask
                                            element="span"
                                            ref={(ref) => {
                                                linkIndexRefs.current[i] = ref
                                            }}
                                        >
                                            <span className="MobileNav_linkList__link__number">
                                                0{i + 1}
                                            </span>
                                        </ContentMask>
                                    </Link>
                                </li>
                            )
                        })}
                    </ul>

                    <button
                        className={`MobileNav_informationButton ${descriptionIsOpen ? "isActive" : ""}`}
                        onClick={() => {
                            setDescriptionIsOpen((prev) => !prev)
                        }}
                    >
                        <span
                            className="MobileNav_linkList__link__line"
                            ref={(ref) => {
                                linkLineRefs.current[linksLength] = ref
                            }}
                        />
                        <ContentMask
                            element="span"
                            ref={(ref) => {
                                linkTitleRefs.current[
                                    navigationData?.mainLinks?.length
                                ] = ref
                            }}
                        >
                            <span
                                className="MobileNav_informationButton__label"
                                data-themed="color"
                            >
                                Information
                            </span>
                        </ContentMask>
                        <ContentMask
                            element="span"
                            ref={(ref) => {
                                linkIndexRefs.current[
                                    navigationData?.mainLinks?.length
                                ] = ref
                            }}
                        >
                            <span
                                className="MobileNav_informationButton__number"
                                data-themed="color"
                            >
                                0{navigationData?.mainLinks?.length + 1}
                            </span>
                        </ContentMask>
                        <span
                            className="MobileNav_linkList__link__line"
                            ref={(ref) => {
                                linkLineRefs.current[linksLength + 1] = ref
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
                                    text={drawerData.descriptionTitle}
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
                                        ref={(ref) => {
                                            socialLinkMaskRefs.current[i] = ref
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
