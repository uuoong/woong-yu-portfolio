/**
 * NavigationDrawer.jsx — 데스크톱 네비게이션 드로어
 *
 * 레퍼런스: NavigationDrawer.jsx
 * 변경: useStore → useAppContext, CSS module → inline styles, Link props 단순화
 */

import React, {
    forwardRef,
    useCallback,
    useEffect,
    useImperativeHandle,
    useRef,
} from "react"
import gsap from "https://esm.sh/gsap"
import ContentMask from "https://framer.com/m/ContentMask-SFhmmh.js@gyLq4kNUPMtuOB9HFX2T"
import NavigationDrawerImages from "https://framer.com/m/NavigationDrawerImages-piB9VF.js@LHDADXcDAuUjLkm9iSMZ"
import Link from "https://framer.com/m/Link-WYbAN8.js@wnolvlc648LPw7gRt3YF"
import ArrowRight from "https://framer.com/m/ArrowRight-0X33Uw.js@Nl5ZtegsmTHhiqauDWCA"
import { useAppContext } from "https://framer.com/m/App-bSRL7k.js@OSIlKrR0H91ZCA9r9DU7"

export const DRAWER_ANIMATION_CONFIG = {
    IN: { duration: 1.3, ease: "Power3.easeInOut" },
    OUT: { duration: 0.8, ease: "Power3.easeOut" },
}

export const DRAWER_INNER_ID = "nav-drawer-inner"

const NavigationDrawer = forwardRef(({ drawerContent }, ref) => {
    const { navigationIsOpen, setNavigationIsOpen, setCursorState } =
        useAppContext()

    const containerRef = useRef(null)
    const bgRef = useRef(null)
    const overlayRef = useRef(null)
    const descriptionRef = useRef(null)
    const productImagesRef = useRef(null)

    // ContentMask refs
    const closeButtonTextRef = useRef(null)
    const materialTitleRef = useRef(null)
    const descriptionTitleRef = useRef(null)
    const aboutTitleRef = useRef(null)
    const locationTitleRef = useRef(null)
    const contactTitleRef = useRef(null)
    const socialLinkMaskRefs = useRef([])

    const animateIn = useCallback(() => {
        const { duration, ease } = DRAWER_ANIMATION_CONFIG.IN
        gsap.killTweensOf([
            bgRef.current,
            descriptionRef.current,
            overlayRef.current,
        ])

        gsap.to(bgRef.current, { scaleY: 1, duration, ease })
        gsap.to(overlayRef.current, { autoAlpha: 0.5, duration, ease })
        gsap.to(descriptionRef.current, {
            autoAlpha: 1,
            duration,
            ease,
            delay: duration * 0.5,
        })

        const upperItems = [
            closeButtonTextRef.current,
            materialTitleRef.current,
            descriptionTitleRef.current,
        ].filter(Boolean)

        const bottomItems = [
            ...socialLinkMaskRefs.current.filter(Boolean),
            aboutTitleRef.current,
            locationTitleRef.current,
            contactTitleRef.current,
        ].filter(Boolean)

        upperItems.forEach((item) =>
            item.animateIn?.({ delay: duration * 0.3 })
        )
        bottomItems.forEach((item) =>
            item.animateIn?.({ delay: duration * 0.7 })
        )

        productImagesRef.current?.animateIn({
            duration: duration * 1.2,
            ease,
            delay: duration * 0.25,
        })
    }, [])

    const animateOut = useCallback(() => {
        const { duration, ease } = DRAWER_ANIMATION_CONFIG.OUT
        gsap.killTweensOf([
            bgRef.current,
            descriptionRef.current,
            overlayRef.current,
        ])

        gsap.to(bgRef.current, { scaleY: 0, duration, ease })
        gsap.to(overlayRef.current, { autoAlpha: 0, duration, ease })
        gsap.to(descriptionRef.current, {
            autoAlpha: 0,
            duration: duration * 0.5,
            ease,
        })

        const upperItems = [
            closeButtonTextRef.current,
            materialTitleRef.current,
            descriptionTitleRef.current,
        ].filter(Boolean)

        const bottomItems = [
            ...socialLinkMaskRefs.current.filter(Boolean),
            aboutTitleRef.current,
            locationTitleRef.current,
            contactTitleRef.current,
        ].filter(Boolean)

        upperItems.forEach((item) => item.animateOut?.({ duration }))
        bottomItems.forEach((item) => item.animateOut?.({ duration: 0.1 }))

        productImagesRef.current?.animateOut({
            duration: duration * 0.25,
            ease,
        })
    }, [])

    useImperativeHandle(ref, () => ({
        getElement: () => containerRef.current,
    }))

    useEffect(() => {
        if (navigationIsOpen) animateIn()
        else animateOut()
    }, [navigationIsOpen, animateIn, animateOut])

    if (!drawerContent) return null

    const {
        titleDescription,
        description,
        titleType,
        titleLocation,
        contactEmail,
        socialLinks = [],
        drawerImages = [],
    } = drawerContent

    return (
        <div
            ref={containerRef}
            style={{
                ...styles.drawer,
                pointerEvents: navigationIsOpen ? "all" : "none",
            }}
            aria-hidden={!navigationIsOpen}
        >
            <div id={DRAWER_INNER_ID} style={styles.drawerInner}>
                {/* 배경 */}
                <div ref={bgRef} style={styles.bg} />

                <div style={styles.drawerContent}>
                    {/* 닫기 버튼 */}
                    <button
                        style={styles.closeButton}
                        onClick={() => setNavigationIsOpen(false)}
                    >
                        <ContentMask element="span" ref={closeButtonTextRef}>
                            <span
                                onMouseEnter={() => setCursorState("FOCUS")}
                                onMouseLeave={() => setCursorState(null)}
                            >
                                (Close)
                            </span>
                        </ContentMask>
                    </button>

                    {/* 상단 영역 */}
                    <div style={styles.top}>
                        <div>
                            {/* 설명 타이틀 */}
                            <p style={styles.descriptionTitle}>
                                <ContentMask
                                    element="span"
                                    ref={descriptionTitleRef}
                                    text={titleDescription}
                                />
                            </p>
                            {/* 설명 본문 */}
                            <p
                                ref={descriptionRef}
                                style={{
                                    ...styles.descriptionText,
                                    opacity: 0,
                                }}
                            >
                                {description}
                            </p>
                        </div>

                        {/* 소재 타이틀 (이미지 있는 경우) */}
                        {drawerImages.length > 0 && (
                            <div>
                                <p>
                                    <ContentMask
                                        element="span"
                                        ref={materialTitleRef}
                                        text="Finishes"
                                    />
                                </p>
                            </div>
                        )}
                    </div>

                    {/* 하단 영역 */}
                    <div style={styles.bottom}>
                        {titleType && (
                            <p>
                                <ContentMask element="span" ref={aboutTitleRef}>
                                    <span>{titleType}</span>
                                </ContentMask>
                            </p>
                        )}
                        {titleLocation && (
                            <p>
                                <ContentMask
                                    element="span"
                                    ref={locationTitleRef}
                                >
                                    <span>{titleLocation}</span>
                                </ContentMask>
                            </p>
                        )}
                        {contactEmail && (
                            <p>
                                <ContentMask
                                    element="span"
                                    ref={contactTitleRef}
                                >
                                    <span style={{ display: "block" }}>
                                        Contact
                                    </span>
                                    <Link
                                        href={`mailto:${contactEmail}`}
                                        external
                                        style={{ display: "block" }}
                                    >
                                        {contactEmail}
                                    </Link>
                                </ContentMask>
                            </p>
                        )}
                        {socialLinks.length > 0 && (
                            <ul style={styles.socialList}>
                                {socialLinks.map((link, i) => (
                                    <li key={i}>
                                        <ContentMask
                                            element="span"
                                            ref={(r) => {
                                                socialLinkMaskRefs.current[i] =
                                                    r
                                            }}
                                        >
                                            <Link
                                                href={link.href}
                                                external
                                                style={styles.socialLink}
                                            >
                                                <span>{link.label}</span>
                                                <ArrowRight
                                                    style={{ width: 6 }}
                                                />
                                            </Link>
                                        </ContentMask>
                                    </li>
                                ))}
                            </ul>
                        )}

                        {/* 드로어 이미지 */}
                        <NavigationDrawerImages
                            ref={productImagesRef}
                            images={drawerImages}
                        />
                    </div>
                </div>
            </div>

            {/* 오버레이 (클릭 시 닫기) */}
            <div
                ref={overlayRef}
                onClick={() => setNavigationIsOpen(false)}
                style={styles.overlay}
            />
        </div>
    )
})

NavigationDrawer.displayName = "NavigationDrawer"
export default NavigationDrawer

const styles = {
    drawer: {
        position: "fixed",
        left: 0,
        top: 0,
        width: "100%",
        height: "100%",
        zIndex: 200,
    },
    drawerInner: {
        width: "100%",
        padding: "var(--page-gutter, 24px)",
        position: "relative",
        zIndex: 2,
        color: "var(--fg-invert, #0e0e0e)",
    },
    bg: {
        position: "absolute",
        inset: 0,
        background: "var(--bg-invert, #f0f0f0)",
        transform: "scaleY(0)",
        transformOrigin: "top",
    },
    drawerContent: {
        position: "relative",
        zIndex: 3,
        height: 300,
        display: "flex",
        justifyContent: "space-between",
        flexDirection: "column",
    },
    closeButton: {
        background: "none",
        border: "none",
        cursor: "pointer",
        position: "absolute",
        top: 0,
        right: 0,
        zIndex: 5,
        font: "inherit",
        color: "inherit",
    },
    top: {
        display: "grid",
        gridTemplateColumns: "449px 1fr",
        gap: "106px",
    },
    descriptionTitle: {
        opacity: 0.5,
        marginBottom: 20,
    },
    descriptionText: {
        lineHeight: 1.5,
    },
    bottom: {
        display: "grid",
        gridTemplateColumns: "240px 185px 587px 1fr",
        alignItems: "flex-end",
        position: "relative",
    },
    socialList: {
        listStyle: "none",
        padding: 0,
        margin: 0,
    },
    socialLink: {
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        textDecoration: "none",
        color: "inherit",
    },
    overlay: {
        position: "absolute",
        inset: 0,
        background: "var(--bg, #0e0e0e)",
        zIndex: 1,
        opacity: 0,
        cursor: "pointer",
    },
}
