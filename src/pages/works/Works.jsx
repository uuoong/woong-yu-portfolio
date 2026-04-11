import React, { useEffect } from "react"
import { useAppContext } from "../../context/App.js"
import Sections from "../../base/sections/Sections.jsx"
import { WORKS_SECTIONS, NAV_DATA } from "../../data/index.js"

export default function Works() {
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

        return () => {
            clearTimeout(timer)
            setShowMainContent?.(false)
        }
    }, [setNavigationData, setLoaderAnimationComplete, setShowMainContent])

    return <Sections sections={WORKS_SECTIONS} hasFooter />
}
