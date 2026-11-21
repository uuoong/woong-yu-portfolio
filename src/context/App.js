import React, { useEffect, useState } from "react"

let _themeCache = null

function _getPersistedTheme() {
    if (_themeCache) return _themeCache
    try {
        return localStorage.getItem("app-theme") || null
    } catch {
        return null
    }
}

function _persistTheme(theme) {
    _themeCache = theme
    try {
        localStorage.setItem("app-theme", theme)
    } catch {}
}

const AppContext = React.createContext(null)

export function AppProvider({ children }) {
    const [theme, _setTheme] = useState(() => {
        if (typeof window === "undefined") return "dark"
        return _getPersistedTheme() || "dark"
    })

    const setTheme = (t) => {
        _persistTheme(t)
        _setTheme(t)
    }

    const [currentPath, setCurrentPath] = useState(
        typeof window !== "undefined" ? window.location.pathname : "/"
    )

    useEffect(() => {
        if (typeof window === "undefined") return

        // Initial route settings
        setCurrentPath(window.location.pathname)

        // 1. Back/Forward (popstate) detection
        const handlePopState = () => setCurrentPath(window.location.pathname)
        window.addEventListener("popstate", handlePopState)

        // 2. pushState detection (Monkey Patching)
        const originalPushState = history.pushState
        history.pushState = function (...args) {
            originalPushState.apply(this, args)
            setCurrentPath(window.location.pathname)
        }

        const originalReplaceState = history.replaceState
        history.replaceState = function (...args) {
            originalReplaceState.apply(this, args)
            setCurrentPath(window.location.pathname)
        }

        return () => {
            window.removeEventListener("popstate", handlePopState)

            history.pushState = originalPushState
            history.replaceState = originalReplaceState
        }
    }, [])

    const [navigationData, setNavigationData] = useState(null)
    const [navigationIsOpen, setNavigationIsOpen] = useState(false)
    const [drawerHeight, setDrawerHeight] = useState(0)
    const [pageIsTransitioning, setPageIsTransitioning] = useState(false)
    const [showMainContent, setShowMainContent] = useState(false)
    const [loaderAnimationComplete, setLoaderAnimationComplete] =
        useState(false)
    const [remValueCalculated, setRemValueCalculated] = useState(true)
    const [bodyHeightChangeKey, setBodyHeightChangeKey] = useState(null)
    const [workHovering, setWorkHovering] = useState(null)
    const [cursorState, setCursorState] = useState(null)
    const [enableInteraction, setEnableInteraction] = useState(true)

    const value = {
        theme,
        setTheme,
        currentPath,
        setCurrentPath,
        navigationData,
        setNavigationData,
        navigationIsOpen,
        setNavigationIsOpen,
        drawerHeight,
        setDrawerHeight,
        pageIsTransitioning,
        setPageIsTransitioning,
        showMainContent,
        setShowMainContent,
        loaderAnimationComplete,
        setLoaderAnimationComplete,
        remValueCalculated,
        setRemValueCalculated,
        bodyHeightChangeKey,
        setBodyHeightChangeKey,
        workHovering,
        setWorkHovering,
        cursorState,
        setCursorState,
        enableInteraction,
        setEnableInteraction,
    }

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useAppContext() {
    const ctx = React.useContext(AppContext)
    if (!ctx) {
        return {
            theme: _getPersistedTheme() || "dark",
            setTheme: () => {},
            currentPath: "/",
            setCurrentPath: () => {},
            navigationData: null,
            setNavigationData: () => {},
            navigationIsOpen: false,
            setNavigationIsOpen: () => {},
            drawerHeight: 0,
            setDrawerHeight: () => {},
            pageIsTransitioning: false,
            setPageIsTransitioning: () => {},
            showMainContent: false,
            setShowMainContent: () => {},
            loaderAnimationComplete: false,
            setLoaderAnimationComplete: () => {},
            remValueCalculated: true,
            setRemValueCalculated: () => {},
            bodyHeightChangeKey: null,
            setBodyHeightChangeKey: () => {},
            workHovering: null,
            setWorkHovering: () => {},
            cursorState: null,
            setCursorState: () => {},
            enableInteraction: true,
            setEnableInteraction: () => {},
        }
    }
    return ctx
}
