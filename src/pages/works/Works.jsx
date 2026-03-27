/**
 * PageAbout.jsx — About 페이지
 */

import React, { useEffect } from "react"

import {
    AppProvider,
    useAppContext,
    ScrollProvider,
    SceneProvider,
    Layout,
    Sections,
    NAV_DATA,
    WORKS_SECTIONS,
} from "https://framer.com/m/index-ShqOMv.js@anZZqReKgnlpL3Q2zV7o"

export default function PageWorks() {
    return (
        <AppProvider>
            <AppInit>
                <Providers>
                    <WorksContent />
                </Providers>
            </AppInit>
        </AppProvider>
    )
}

// ─── Providers ────────────────────────────────────────────────────────────────
function AppInit({ children }) {
    const { setNavData, setShowMainContent, setLoaderAnimationComplete } =
        useAppContext()

    useEffect(() => {
        setNavData(NAV_DATA)
        setTimeout(() => {
            setLoaderAnimationComplete(true)
            setShowMainContent(true)
        }, 300)
    }, []) // eslint-disable-line

    return children
}

function Providers({ children }) {
    return (
        <ScrollProvider pathname="/works">
            {/* SceneProvider: WorksGL 섹션이 GLImage를 사용 */}
            <SceneProvider>
                <Layout>{children}</Layout>
            </SceneProvider>
        </ScrollProvider>
    )
}

function WorksContent() {
    return (
        <Sections
            sections={WORKS_SECTIONS}
            hasFooter
            // infiniteScroll 없음 (home만 무한 스크롤)
        />
    )
}
