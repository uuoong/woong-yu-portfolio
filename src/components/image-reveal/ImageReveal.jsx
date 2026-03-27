import React, { useEffect, useRef } from "react"
import gsap from "https://esm.sh/gsap"
import useInView from "../../hooks/use_in_view.js"
import useIsReducedMotion from "../../hooks/use_is_reduced_motion.js"

// ─── 인라인 스타일 상수 (원본 CSS 재현) ──────────────────────────────────────
const S = {
    // .ImageReveal
    root: {
        position: "relative",
        overflow: "hidden",
    },
    // .backgroundColor
    bgColor: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
    },
    // .imageContainer
    imageContainer: {
        height: "100%",
        width: "100%",
        position: "relative",
        opacity: 0.001, // 원본과 동일: opacity .001
        zIndex: 2,
    },
    // .showContent .imageContainer
    imageContainerVisible: {
        opacity: 1,
    },
}

const ImageReveal = ({
    className,
    children,
    direction = "FROM_TOP",
    delay = 0,
    id,
    showContent,
    backgroundColor,
    style,
}) => {
    const { isInView, setElementToObserve } = useInView()
    const containerRef = useRef(null)
    const imageRef = useRef(null)
    const { isReducedMotion } = useIsReducedMotion()

    // backgroundColor overlay CSS
    const bgColorStyle = backgroundColor
        ? { ...S.bgColor, backgroundColor, opacity: 0.5 }
        : S.bgColor

    useEffect(() => {
        if (!imageRef.current || !isInView) return

        // 원본: gsap.context(() => { ... }, containerRef.current)
        const ctx = gsap.context(() => {
            gsap.killTweensOf(imageRef.current)

            const duration = 0.6
            const ease = "Power3.easeInOut"

            // 원본: gsap.to(`.${styles.imageContainer}`, { autoAlpha: 1, ... })
            // ref로 직접 타겟팅 (CSS module class 대신)
            gsap.to(imageRef.current, {
                autoAlpha: 1,
                duration,
                ease,
                delay: delay || 0.1,
            })
        }, containerRef.current)

        return () => {
            ctx.revert()
        }
    }, [isInView, direction, delay, isReducedMotion])

    // imageContainer 스타일 — showContent 시 즉시 표시
    const imageContainerStyle = showContent
        ? { ...S.imageContainer, ...S.imageContainerVisible }
        : S.imageContainer

    return (
        <div
            ref={(node) => {
                setElementToObserve(node)
                containerRef.current = node
            }}
            id={id}
            className={className}
            style={{
                ...S.root,
                ...style,
            }}
        >
            {/* backgroundColor overlay (backgroundColor prop 있을 때만) */}
            {backgroundColor && <div style={bgColorStyle} />}

            {/* imageContainer */}
            <div ref={imageRef} style={imageContainerStyle}>
                {children}
            </div>
        </div>
    )
}

ImageReveal.displayName = "ImageReveal"
export default ImageReveal
