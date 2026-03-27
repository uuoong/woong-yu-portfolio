/**
 * PageHome.jsx — 홈 페이지 (무한 스크롤)
 *
 * ─── 원본 _app.js + index.js 통합 ────────────────────────────────────────
 *
 *  원본 _app.js:
 *    - <ScrollProvider>
 *    - <Layout>
 *    - useRemSizing → 제거 (CSS fluid system으로 대체)
 *    - globalData 설정 → useEffect + setNavData
 *
 *  원본 index.js:
 *    - <Sections pageType="page" pageSlug="home" sections={...} hasFooter infiniteScroll />
 *
 * ─── sections 데이터 구조 ─────────────────────────────────────────────────
 *
 *  원본은 Sanity CMS에서 sections 배열을 받아옴.
 *  현재: sections를 직접 데이터로 선언하여 사용.
 *
 *  sections 배열:
 *  [
 *    {
 *      section: [{
 *        _type:    "섹션타입",
 *        _id:      "고유ID",
 *        cmsSettings: { isHidden: false, cmsTitle: "섹션명", disableOnMobile: false },
 *        ...섹션 props
 *      }]
 *    }
 *  ]
 *
 * ─── GL 페이지 (SceneProvider) ────────────────────────────────────────────
 *
 *  WebGL이 필요한 페이지는 SceneProvider를 Providers에 추가.
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
    HOME_SECTIONS,
} from "https://framer.com/m/index-ShqOMv.js@anZZqReKgnlpL3Q2zV7o"
// ─── Home 페이지 섹션 데이터 ─────────────────────────────────────────────────
// 원본: Sanity CMS getStaticProps에서 sections 배열을 받음
// 현재: 직접 선언

// ─── Page Entry ───────────────────────────────────────────────────────────────
export default function PageHome() {
    return (
        <AppProvider>
            <AppInit>
                <Providers>
                    <HomeContent />
                </Providers>
            </AppInit>
        </AppProvider>
    )
}

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
        <ScrollProvider pathname="/">
            <SceneProvider>
                <Layout>{children}</Layout>
            </SceneProvider>
        </ScrollProvider>
    )
}

// ─── Content ─────────────────────────────────────────────────────────────────
function HomeContent() {
    return <Sections sections={HOME_SECTIONS} hasFooter infiniteScroll />
}
