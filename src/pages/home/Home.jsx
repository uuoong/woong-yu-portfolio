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
} from "https://framer.com/m/index-ShqOMv.js@qSKteEoI1TQ5w9xyL5Pd"

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
    const {
        setNavigationData,
        setShowMainContent,
        setLoaderAnimationComplete,
    } = useAppContext()

    useEffect(() => {
        setNavigationData(NAV_DATA)
        const timer = setTimeout(() => {
            setLoaderAnimationComplete?.(true)
            setShowMainContent?.(true)
        }, 300)
        return () => clearTimeout(timer)
    }, [setNavigationData, setLoaderAnimationComplete, setShowMainContent])

    return children
}

function Providers({ children }) {
    return (
        <ScrollProvider>
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
