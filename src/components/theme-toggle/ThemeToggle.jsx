import React, { useEffect, useRef } from "react"
import { useAppContext } from "../../context/App.js"

const THEME_TRANSITION_DURATION = 0.4

const ThemeToggle = () => {
    const { theme, setTheme, setCursorState } = useAppContext()
    const inactiveTheme = theme === "light" ? "dark" : "light"
    const timeoutRef = useRef()
    const buttonRef = useRef(null)

    const animateAllComponents = (reset = false) => {
        const themedElements = document.querySelectorAll("[data-themed]")
        const elements = []
        for (let i = 0; i < themedElements.length; i++) {
            elements.push(themedElements[i])
        }
        elements.forEach((element) => {
            if (!element) return
            if (reset && element) {
                element.style.removeProperty("transition")
                return
            }
            if (!element.dataset.themed) return
            const toTransition = element.dataset.themed.split(",")
            element.style.transition = toTransition
                .map((p) => `${p.trim()} ${THEME_TRANSITION_DURATION}s`)
                .join(", ")
        })
    }

    const handleClick = () => {
        setTheme(inactiveTheme)
    }

    useEffect(() => {
        if (!theme) return
        if (timeoutRef.current) clearTimeout(timeoutRef.current)
        animateAllComponents()
        timeoutRef.current = setTimeout(
            () => {
                animateAllComponents(true)
            },
            THEME_TRANSITION_DURATION * 1.1 * 1000
        )
    }, [theme])

    useEffect(() => {
        const saved = (() => {
            try {
                return localStorage.getItem("app-theme")
            } catch {
                return null
            }
        })()
        if (saved) return

        let isLight = true
        if (
            window.matchMedia &&
            window.matchMedia("(prefers-color-scheme: dark)").matches
        ) {
            isLight = false
        }
        setTheme(isLight ? "light" : "dark")
    }, [])

    useEffect(() => {
        if (!theme) return
        document.documentElement.dataset.theme = theme
    }, [theme])

    return (
        <div className="ThemeToggle_container">
            <div className="ThemeToggle_spacer" />
            <button
                ref={buttonRef}
                onClick={handleClick}
                className="ThemeToggle"
                aria-label={`Turn on ${inactiveTheme} theme.`}
                data-themed="background-color"
                onMouseEnter={() => {
                    setCursorState("FOCUS")
                }}
                onMouseLeave={() => {
                    setCursorState(null)
                }}
            >
                <div className="ThemeToggle_dot" />
            </button>
        </div>
    )
}

ThemeToggle.displayName = "ThemeToggle"

export default ThemeToggle
