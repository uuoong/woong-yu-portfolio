import React, { useState, useRef, useEffect } from "react"
import gsap from "https://esm.sh/gsap"

import { useAppContext } from "../../context/App.js"

import { TRANSITION_DURATION } from "../../data/index.js"

const Wipe = ({ className }) => {
    const { navigationData, setPageIsTransitioning, pageIsTransitioning } =
        useAppContext()

    const drawerData = navigationData?.drawerContent

    const bgRef = useRef()
    const textLeftRef = useRef()
    const textRightRef = useRef()
    const allowPageTransitionsRef = useRef(false)

    const resetAnimation = () => {
        gsap.set(bgRef.current, {
            "--left-y": "100%",
            "--right-y": "100%",
            y: 0,
        })

        gsap.set([textLeftRef.current, textRightRef.current], {
            y: 40,
            autoAlpha: 0,
        })
    }

    const animateIn = (callback) => {
        if (!bgRef.current || !textLeftRef.current || !textRightRef.current)
            return

        gsap.killTweensOf([
            bgRef.current,
            textLeftRef.current,
            textRightRef.current,
        ])

        gsap.to(bgRef.current, {
            "--left-y": "0%",
            "--right-y": "0%",
            duration: TRANSITION_DURATION,
            ease: "Power3.easeInOut",
        })

        gsap.to([textLeftRef.current, textRightRef.current], {
            y: 0,
            autoAlpha: 1,
            duration: TRANSITION_DURATION,
            ease: "Power3.easeInOut",
            onComplete: () => {
                if (callback) callback()
            },
        })
    }

    const animateOut = (callback) => {
        if (!bgRef.current || !textLeftRef.current || !textRightRef.current)
            return

        gsap.killTweensOf([
            bgRef.current,
            textLeftRef.current,
            textRightRef.current,
        ])

        gsap.to(bgRef.current, {
            y: "-100%",
            duration: TRANSITION_DURATION,
            ease: "Power3.easeInOut",
            onComplete: () => {
                if (callback) callback()
            },
        })

        gsap.to([textLeftRef.current, textRightRef.current], {
            y: -40,
            autoAlpha: 0,
            duration: TRANSITION_DURATION * 0.75,
            ease: "Power3.easeInOut",
        })
    }

    useEffect(() => {
        setTimeout(() => {
            resetAnimation()
            allowPageTransitionsRef.current = true
        }, 500)
    }, [])

    useEffect(() => {
        if (!allowPageTransitionsRef.current || pageIsTransitioning === false)
            return

        animateIn(() => {
            animateOut(() => {
                setPageIsTransitioning(false)
                resetAnimation()
            })
        })
    }, [pageIsTransitioning, setPageIsTransitioning])

    if (!drawerData) return null

    return (
        <div className="Wipe">
            <div className="Wipe_wipeBg" ref={bgRef} />
            <span className="Wipe_titleLeft">
                <span className="Wipe_titleLeft__inner" ref={textLeftRef}>
                    {drawerData?.titleType}
                </span>
            </span>
            <span className="Wipe_titleRight">
                <span className="Wipe_titleRight__inner" ref={textRightRef}>
                    {drawerData?.titleLocation}
                </span>
            </span>
        </div>
    )
}

Wipe.displayName = "Wipe"
export default Wipe
