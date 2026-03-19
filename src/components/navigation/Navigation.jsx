/**
 * Navigation.jsx — 헤더 네비게이션
 *
 * 레퍼런스: components/Navigation/Navigation.jsx
 *
 * ─── 변경사항 ─────────────────────────────────────────────────────────────
 *
 *  제거: useStore, CSS module, next/router, globalData (Sanity)
 *  유지: onScrollCallback 기반 스크롤 퍼센트, showMainContent fade-in,
 *        navigationIsOpen y offset (데스크톱), Clock, ThemeToggle,
 *        NavigationDrawer (데스크톱), MobileNav (모바일)
 *
 * ─── Props ────────────────────────────────────────────────────────────────
 *
 *  navData   AppContext의 navData (AppProvider 설정 시 자동)
 *            또는 직접 prop으로 전달 가능
 *
 * ─── 사용법 ───────────────────────────────────────────────────────────────
 *
 *  // Layout.jsx에서
 *  import Navigation from "./Navigation.jsx"
 *  <Layout navigation={<Navigation />}>...</Layout>
 *
 *  // AppProvider에서 navData 설정
 *  const { setNavData } = useAppContext()
 *  useEffect(() => { setNavData({ title: "...", mainLinks: [...] }) }, [])
 */

import React, { useContext, useEffect, useRef } from "react"
import gsap from "https://esm.sh/gsap"
import { ScrollContext } from "https://framer.com/m/Scroll-szavc7.js@zOGCrgWorLBsFdQI7czl"
import { useAppContext } from "https://framer.com/m/App-bSRL7k.js@OSIlKrR0H91ZCA9r9DU7"
import useBreakpoint from "https://framer.com/m/use-breakpoint-4NS6fo.js@5Zwmkgszp7ZMiYMHaXUS"
import Link from "https://framer.com/m/Link-WYbAN8.js@wnolvlc648LPw7gRt3YF"
import Clock from "https://framer.com/m/Clock-lam4um.js@Skw9n5H9vM3PG0oBiMbZ"
import ThemeToggle from "https://framer.com/m/ThemeToggle-icEqb2.js@QX7kNPzQNZ3NwWI2vc9L"
import NavigationDrawer, {
    DRAWER_ANIMATION_CONFIG,
    DRAWER_INNER_ID,
} from "https://framer.com/m/NavigationDrawer-fV7fqT.js@v0eTaRVMP4xsqdQUyetA"
import MobileNav from "https://framer.com/m/MobileNav-YSjf7H.js@Vb7J7DH3G4rCSQrHvHxo"

export const HEADER_ID = "site-header"

const SCROLL_CALLBACK_KEY = "__navigation_scroll__"

export default function Navigation() {
    const { onScrollCallback } = useContext(ScrollContext)
    const {
        navData,
        navigationIsOpen,
        setNavigationIsOpen,
        showMainContent,
        setCursorState,
    } = useAppContext()

    const { isMobile } = useBreakpoint()

    const navigationRef = useRef(null)
    const percentScrollRef = useRef(null)
    const drawerElRef = useRef(null)

    // ── showMainContent → header fade-in ──────────────────────────────────
    useEffect(() => {
        if (!navigationRef.current) return
        gsap.to(navigationRef.current, {
            autoAlpha: showMainContent ? 1 : 0,
            duration: 0.6,
        })
    }, [showMainContent])

    // ── navigationIsOpen → nav y offset (데스크톱만) ──────────────────────
    useEffect(() => {
        if (!navigationRef.current || isMobile) return

        const drawerHeight = drawerElRef.current?.offsetHeight || 0
        const config = DRAWER_ANIMATION_CONFIG[navigationIsOpen ? "IN" : "OUT"]

        gsap.killTweensOf(navigationRef.current)
        gsap.to(navigationRef.current, {
            y: navigationIsOpen ? drawerHeight : 0,
            ease: config.ease,
            duration: config.duration,
        })
    }, [navigationIsOpen, isMobile])

    // ── 스크롤 퍼센트 표시 ─────────────────────────────────────────────────
    useEffect(() => {
        onScrollCallback({
            key: SCROLL_CALLBACK_KEY,
            callback: (e) => {
                if (!percentScrollRef.current) return
                const pct = Math.floor((e.progress || 0) * 100)
                const abs = Math.abs(pct)
                const formatted = `${abs < 10 ? "0" + abs : abs}%`
                percentScrollRef.current.innerHTML =
                    pct < 0 ? `-${formatted}` : formatted
            },
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    if (!navData) return null

    const { title, timeZone, location, mainLinks = [], drawerContent } = navData

    return (
        <>
            {/* 데스크톱 드로어 */}
            {!isMobile && drawerContent && (
                <NavigationDrawer
                    drawerContent={drawerContent}
                    ref={(r) => {
                        if (r) drawerElRef.current = r.getElement()
                    }}
                />
            )}

            {/* 모바일 네비게이션 */}
            {isMobile && <MobileNav navData={navData} />}

            {/* 헤더 */}
            <header
                id={HEADER_ID}
                ref={navigationRef}
                style={{
                    ...navStyles.header,
                    opacity: 0.001, // showMainContent로 GSAP 제어
                }}
            >
                <nav style={navStyles.nav}>
                    {/* 좌측 */}
                    <div style={navStyles.left}>
                        <Link href="/" style={navStyles.title}>
                            {title}
                        </Link>

                        {!isMobile && (
                            <p style={{ margin: 0 }}>
                                <Clock
                                    timeZone={timeZone}
                                    location={location}
                                    style={{ fontSize: "0.75rem" }}
                                />
                            </p>
                        )}

                        <p
                            ref={percentScrollRef}
                            style={{ margin: 0, fontSize: "0.75rem" }}
                            data-themed="color"
                        >
                            00%
                        </p>
                    </div>

                    {/* 우측 */}
                    <div style={navStyles.right}>
                        {!isMobile &&
                            mainLinks.map((link, i) => (
                                <Link
                                    key={i}
                                    href={link.href}
                                    style={navStyles.navLink}
                                    onMouseEnter={() => setCursorState("FOCUS")}
                                    onMouseLeave={() => setCursorState(null)}
                                >
                                    <span
                                        style={{
                                            opacity: 0.5,
                                            fontVariant: "tabular-nums",
                                        }}
                                    >
                                        {i + 1}.
                                    </span>{" "}
                                    {link.label}
                                </Link>
                            ))}

                        {/* Information 버튼 (데스크톱) */}
                        {!isMobile && drawerContent && (
                            <button
                                style={navStyles.drawerBtn}
                                onClick={() => setNavigationIsOpen(true)}
                                onMouseEnter={() => setCursorState("FOCUS")}
                                onMouseLeave={() => setCursorState(null)}
                            >
                                <span style={{ opacity: 0.5 }}>
                                    {mainLinks.length + 1}.
                                </span>{" "}
                                {isMobile ? "Menu" : "Information"}
                            </button>
                        )}

                        {/* 모바일 햄버거 */}
                        {isMobile && (
                            <button
                                style={navStyles.drawerBtn}
                                onClick={() => setNavigationIsOpen(true)}
                            >
                                Menu
                            </button>
                        )}

                        <ThemeToggle />
                    </div>
                </nav>
            </header>
        </>
    )
}

Navigation.displayName = "Navigation"

const navStyles = {
    header: {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        zIndex: 100,
        paddingTop: "var(--page-gutter, 24px)",
    },
    nav: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 var(--page-gutter, 24px)",
        width: "100%",
    },
    left: {
        display: "flex",
        alignItems: "center",
        gap: 24,
    },
    title: {
        textDecoration: "none",
        color: "var(--fg, #f0f0f0)",
        textTransform: "uppercase",
        fontSize: "0.75rem",
    },
    right: {
        display: "flex",
        alignItems: "center",
        gap: 24,
    },
    navLink: {
        textDecoration: "none",
        color: "var(--fg, #f0f0f0)",
        fontSize: "0.75rem",
    },
    drawerBtn: {
        background: "none",
        border: "none",
        cursor: "pointer",
        color: "var(--fg, #f0f0f0)",
        font: "inherit",
        fontSize: "0.75rem",
    },
}
