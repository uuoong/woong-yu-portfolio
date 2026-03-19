/**
 * Layout.jsx — 전역 레이아웃 래퍼
 *
 * ─── 변경사항 ─────────────────────────────────────────────────────────────
 *
 *  - Navigation import + 자동 포함 (navigation prop 제거)
 *  - CSS 변수 <style> 태그 포함 (테마 변수, 페이지 거터 등)
 *  - showMainContent prop 제거 → GSAP fromTo로 자동 처리
 *
 * ─── CSS 변수 (data-theme 기반) ───────────────────────────────────────────
 *
 *  --bg, --fg, --bg-invert, --fg-invert, --page-gutter
 *  ThemeToggle이 document.body.dataset.theme = "dark"|"light" 설정
 *  data-themed 속성을 가진 요소들이 트랜지션으로 전환됨
 */

import React, { useEffect, useRef } from "react"
import gsap from "https://esm.sh/gsap"
import Navigation from "https://framer.com/m/Navigation-counjp.js@0NSHe2xolmhCFjjQNx5i"
import { SCROLL_CONTENT_CLASS } from "https://framer.com/m/Scroll-szavc7.js@zOGCrgWorLBsFdQI7czl"

const CSS_VARS = `
  /* ── 테마 변수 ─────────────────────────────────────────────────── */
  [data-theme="dark"] {
    --bg:         #0e0e0e;
    --fg:         #f0f0f0;
    --bg-invert:  #f0f0f0;
    --fg-invert:  #0e0e0e;
  }
  [data-theme="light"] {
    --bg:         #f0f0f0;
    --fg:         #0e0e0e;
    --bg-invert:  #0e0e0e;
    --fg-invert:  #f0f0f0;
  }

  /* ── 레이아웃 변수 ─────────────────────────────────────────────── */
  :root {
    --page-gutter: clamp(16px, 3vw, 40px);
  }

  /* ── 전역 리셋 ─────────────────────────────────────────────────── */
  *, *::before, *::after { box-sizing: border-box; }
  body { margin: 0; }
  button { padding: 0; margin: 0; font: inherit; }
  ul, li { list-style: none; padding: 0; margin: 0; }
  a { text-decoration: none; }
`

export default function Layout({
    children,
    navigationIsOpen = false,
    navigationDrawerHeight = 0,
    background = "var(--bg, #0e0e0e)",
    style = {},
}) {
    const mainRef = useRef(null)
    const contentRef = useRef(null)

    // 마운트 → fade-in
    useEffect(() => {
        if (!mainRef.current) return
        gsap.fromTo(
            mainRef.current,
            { autoAlpha: 0 },
            { autoAlpha: 1, duration: 0.8, ease: "power2.out", delay: 0.1 }
        )
    }, [])

    // navigationIsOpen → content y offset (데스크톱)
    useEffect(() => {
        if (!contentRef.current) return
        const isMobile = /Mobi|Android/i.test(navigator.userAgent)
        if (isMobile) return

        gsap.to(contentRef.current, {
            y: navigationIsOpen ? navigationDrawerHeight : 0,
            duration: navigationIsOpen ? 0.6 : 0.5,
            ease: navigationIsOpen ? "power3.inOut" : "power2.inOut",
        })
    }, [navigationIsOpen, navigationDrawerHeight])

    return (
        <>
            {/* CSS 변수 정의 */}
            <style>{CSS_VARS}</style>

            {/* Navigation (항상 포함) */}
            <Navigation />

            {/* 메인 스크롤 영역 */}
            <main
                id="main"
                ref={mainRef}
                style={{
                    position: "relative",
                    width: "100%",
                    background: background,
                    color: "var(--fg, #f0f0f0)",
                    ...style,
                }}
            >
                {/* SCROLL_CONTENT_CLASS: ResizeObserver 대상 + nav y offset 대상 */}
                <div ref={contentRef} className={SCROLL_CONTENT_CLASS}>
                    {children}
                </div>
            </main>
        </>
    )
}

Layout.displayName = "Layout"
