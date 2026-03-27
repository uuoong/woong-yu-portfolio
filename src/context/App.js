import React, { useState } from "react"

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
    const [theme, _setTheme] = useState(() => _getPersistedTheme() || "dark")

    const setTheme = (t) => {
        _persistTheme(t)
        _setTheme(t)
    }

    const [navData, setNavData] = useState(null)
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
        navData,
        setNavData,
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
            navData: null,
            setNavData: () => {},
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
