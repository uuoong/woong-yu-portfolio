import React, { useEffect, useRef } from "react"
import gsap from "https://esm.sh/gsap"
import { useAppContext } from "../../context/App.js"

const TRANSITION_DURATION = 1.2

const Wipe = ({ className }) => {
    const { pageIsTransitioning, setPageIsTransitioning, navigationData } =
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
        <div className={`Wipe ${className || ""}`}>
            <div className="wipeBg" ref={bgRef} />
            <span className="titleLeft">
                <span ref={textLeftRef}>{drawerData?.titleType}</span>
            </span>
            <span className="titleRight">
                <span ref={textRightRef}>{drawerData?.titleLocation}</span>
            </span>
        </div>
    )
}

Wipe.displayName = "Wipe"

export default Wipe
