/**
 * MobileNav.jsx — 모바일 네비게이션
 *
 * 레퍼런스: sections/MobileNav/MobileNav.jsx
 * 변경: useRouter → window.location.pathname, useStore → useAppContext
 */

import React, { useEffect, useRef, useState } from "react"
import gsap from "https://esm.sh/gsap"
import ContentMask from "https://framer.com/m/ContentMask-SFhmmh.js@gyLq4kNUPMtuOB9HFX2T"
import Link from "https://framer.com/m/Link-WYbAN8.js@wnolvlc648LPw7gRt3YF"
import Clock from "https://framer.com/m/Clock-iOuEz9.js@T4Bgl9hp1tkjC4HGS5bR"
import ArrowRight from "https://framer.com/m/ArrowRight-0X33Uw.js@Nl5ZtegsmTHhiqauDWCA"
import { useAppContext } from "https://framer.com/m/App-bSRL7k.js@OSIlKrR0H91ZCA9r9DU7"

export default function MobileNav({ navData }) {
    const { navigationIsOpen, setNavigationIsOpen } = useAppContext()

    const bgRef = useRef(null)
    const navigationTitleRef = useRef(null)
    const aboutTitleRef = useRef(null)
    const locationTitleRef = useRef(null)
    const descriptionTitleRef = useRef(null)
    const descriptionContainerRef = useRef(null)
    const descriptionContainerInnerRef = useRef(null)
    const descriptionRef = useRef(null)
    const linkLineRefs = useRef([])
    const linkTitleRefs = useRef([])
    const linkIndexRefs = useRef([])
    const socialLinkMaskRefs = useRef([])

    const [descriptionIsOpen, setDescriptionIsOpen] = useState(false)
    const [currentPath, setCurrentPath] = useState("/")

    // 현재 경로 추적
    useEffect(() => {
        setCurrentPath(window.location.pathname)
    }, [])

    const drawerContent = navData?.drawerContent
    const mainLinks = navData?.mainLinks || []

    // ── animateIn ─────────────────────────────────────────────────────────
    const animateIn = () => {
        if (!bgRef.current) return
        const duration = 1.2
        const ease = "power3.inOut"

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

    // ── animateOut ────────────────────────────────────────────────────────
    const animateOut = () => {
        if (!bgRef.current) return
        const duration = 0.6
        const ease = "power3.out"

        gsap.killTweensOf(bgRef.current)
        gsap.to(bgRef.current, {
            "--left-y": "0%",
            "--right-y": "0%",
            duration,
            ease,
        })

        const maskDur = 0.6
        navigationTitleRef.current?.animateOut({ direction: "DOWN" })
        linkTitleRefs.current.forEach((r) =>
            r?.animateOut({ direction: "DOWN", duration: maskDur })
        )
        linkIndexRefs.current.forEach((r) =>
            r?.animateOut({ direction: "DOWN", duration: maskDur })
        )
        gsap.to(linkLineRefs.current, { scaleX: 0, duration, ease })
        socialLinkMaskRefs.current.forEach((r) =>
            r?.animateOut({ direction: "DOWN", duration: maskDur })
        )
        aboutTitleRef.current?.animateOut({
            direction: "DOWN",
            duration: maskDur,
        })
        locationTitleRef.current?.animateOut({
            direction: "DOWN",
            duration: maskDur,
        })

        setDescriptionIsOpen(false)
    }

    // ── description toggle ────────────────────────────────────────────────
    const animateInDescription = () => {
        const lastLine = linkLineRefs.current[mainLinks.length]
        const height = descriptionContainerInnerRef.current?.offsetHeight || 0
        const dur = 0.8
        const ease = "power3.out"

        descriptionTitleRef.current?.animateIn()
        gsap.killTweensOf([
            descriptionRef.current,
            descriptionContainerRef.current,
        ])
        gsap.to(descriptionRef.current, { autoAlpha: 1, duration: dur, ease })
        gsap.to(lastLine, { y: height, duration: dur, ease })
        gsap.to(descriptionContainerRef.current, {
            height,
            duration: dur,
            ease,
        })
    }

    const animateOutDescription = () => {
        const lastLine = linkLineRefs.current[mainLinks.length]
        const dur = 0.4
        const ease = "power3.out"

        descriptionTitleRef.current?.animateOut({ direction: "DOWN" })
        gsap.killTweensOf([
            descriptionRef.current,
            descriptionContainerRef.current,
        ])
        gsap.to(descriptionRef.current, { autoAlpha: 0, duration: dur, ease })
        gsap.to(lastLine, { y: 0, duration: dur, ease })
        gsap.to(descriptionContainerRef.current, {
            height: 0,
            duration: dur,
            ease,
        })
    }

    useEffect(() => {
        if (navigationIsOpen) animateIn()
        else animateOut()
    }, [navigationIsOpen]) // eslint-disable-line

    useEffect(() => {
        if (descriptionIsOpen) animateInDescription()
        else animateOutDescription()
    }, [descriptionIsOpen]) // eslint-disable-line

    return (
        <div
            style={{
                ...styles.wrap,
                pointerEvents: navigationIsOpen ? "all" : "none",
            }}
        >
            {/* 배경 컨테이너 */}
            <div ref={bgRef} style={styles.bg}>
                {/* 헤더 */}
                <div style={styles.header}>
                    <Link href="/" style={styles.title}>
                        {navData?.title}
                    </Link>
                    <div style={styles.topRight}>
                        <Clock
                            timeZone={navData?.timeZone}
                            location={navData?.location}
                        />
                        <button
                            style={styles.closeBtn}
                            onClick={() => setNavigationIsOpen(false)}
                        >
                            Close
                        </button>
                    </div>
                </div>

                {/* 네비게이션 링크 */}
                <div style={{ marginTop: 85 }}>
                    <ContentMask
                        element="div"
                        ref={navigationTitleRef}
                        style={{ marginBottom: 10 }}
                    >
                        <span style={{ opacity: 0.5, fontSize: "0.75rem" }}>
                            (Navigation)
                        </span>
                    </ContentMask>

                    <ul style={styles.linkList}>
                        {mainLinks.map((link, i) => {
                            const isActive =
                                currentPath === link.href && !descriptionIsOpen
                            return (
                                <li
                                    key={i}
                                    onClick={() => setNavigationIsOpen(false)}
                                >
                                    <Link
                                        href={link.href}
                                        style={{
                                            ...styles.linkItem,
                                            position: "relative",
                                        }}
                                    >
                                        <span
                                            ref={(r) => {
                                                linkLineRefs.current[i] = r
                                            }}
                                            style={styles.linkLine}
                                        />
                                        <ContentMask
                                            element="span"
                                            ref={(r) => {
                                                linkTitleRefs.current[i] = r
                                            }}
                                        >
                                            <span
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

                        {/* Information 토글 */}
                        {drawerContent && (
                            <li>
                                <button
                                    style={{
                                        ...styles.linkItem,
                                        background: "none",
                                        border: "none",
                                        width: "100%",
                                        cursor: "pointer",
                                        color: "inherit",
                                        font: "inherit",
                                    }}
                                    onClick={() =>
                                        setDescriptionIsOpen((p) => !p)
                                    }
                                >
                                    <span
                                        ref={(r) => {
                                            linkLineRefs.current[
                                                mainLinks.length
                                            ] = r
                                        }}
                                        style={styles.linkLine}
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
                                            style={{
                                                opacity: descriptionIsOpen
                                                    ? 1
                                                    : 0.4,
                                            }}
                                        >
                                            0{mainLinks.length + 1}
                                        </span>
                                    </ContentMask>
                                </button>

                                {/* Description 컨테이너 */}
                                <div
                                    ref={descriptionContainerRef}
                                    style={{ overflow: "hidden", height: 0 }}
                                >
                                    <div
                                        ref={descriptionContainerInnerRef}
                                        style={{ padding: "25px 0 12px" }}
                                    >
                                        <p>
                                            <ContentMask
                                                element="span"
                                                ref={descriptionTitleRef}
                                                text={
                                                    drawerContent.titleDescription
                                                }
                                            />
                                        </p>
                                        <p
                                            ref={descriptionRef}
                                            style={{
                                                lineHeight: 1.5,
                                                marginTop: 10,
                                                opacity: 0,
                                            }}
                                        >
                                            {drawerContent.description}
                                        </p>
                                    </div>
                                </div>
                            </li>
                        )}
                    </ul>
                </div>

                {/* 하단 영역 */}
                <div style={styles.bottom}>
                    {drawerContent?.socialLinks?.length > 0 && (
                        <ul
                            style={{
                                listStyle: "none",
                                padding: 0,
                                margin: "0 0 15px",
                                display: "flex",
                                gap: 24,
                            }}
                        >
                            {drawerContent.socialLinks.map((link, i) => (
                                <li key={i}>
                                    <ContentMask
                                        element="span"
                                        ref={(r) => {
                                            socialLinkMaskRefs.current[i] = r
                                        }}
                                    >
                                        <Link
                                            href={link.href}
                                            external
                                            style={{
                                                display: "inline-flex",
                                                alignItems: "center",
                                                gap: 4,
                                            }}
                                        >
                                            <span>{link.label}</span>
                                            <ArrowRight style={{ width: 6 }} />
                                        </Link>
                                    </ContentMask>
                                </li>
                            ))}
                        </ul>
                    )}
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                        }}
                    >
                        {drawerContent?.titleType && (
                            <ContentMask element="p" ref={aboutTitleRef}>
                                <span>{drawerContent.titleType}</span>
                            </ContentMask>
                        )}
                        {drawerContent?.titleLocation && (
                            <ContentMask element="p" ref={locationTitleRef}>
                                <span>{drawerContent.titleLocation}</span>
                            </ContentMask>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

MobileNav.displayName = "MobileNav"

const styles = {
    wrap: {
        position: "fixed",
        inset: 0,
        height: "100svh",
        zIndex: 300,
        color: "var(--fg-invert, #0e0e0e)",
    },
    bg: {
        position: "absolute",
        inset: 0,
        padding: "var(--page-gutter, 24px)",
        background: "var(--bg-invert, #f0f0f0)",
        clipPath:
            "polygon(0% 0%, 100% 0%, 100% var(--left-y), 0% var(--right-y))",
        "--left-y": "0%",
        "--right-y": "0%",
    },
    header: {
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
    },
    title: {
        textDecoration: "none",
        color: "inherit",
        textTransform: "uppercase",
        fontSize: "0.75rem",
    },
    topRight: { display: "flex", alignItems: "center", gap: 40 },
    closeBtn: {
        background: "none",
        border: "none",
        cursor: "pointer",
        color: "inherit",
        font: "inherit",
    },
    linkList: { listStyle: "none", padding: 0, margin: 0 },
    linkItem: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "10px 0",
        textDecoration: "none",
        color: "inherit",
    },
    linkLine: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: 1,
        background: "var(--fg-invert, #0e0e0e)",
        transform: "scaleX(0)",
        transformOrigin: "left",
    },
    bottom: {
        position: "absolute",
        bottom: 0,
        left: 0,
        width: "100%",
        padding: "var(--page-gutter, 24px)",
        zIndex: 2,
    },
}
