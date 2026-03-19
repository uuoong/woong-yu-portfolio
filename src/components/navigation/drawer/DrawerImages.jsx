/**
 * NavigationDrawerImages.jsx — 네비게이션 드로어 이미지 스택
 *
 * 레퍼런스: NavigationDrawerImages.jsx
 * 변경: SanityImage → Image.jsx (URL 배열 직접 사용), useStore → props
 */

import React, { forwardRef, useImperativeHandle, useRef } from "react"
import gsap from "https://esm.sh/gsap"
import Image from "https://framer.com/m/Image-1aJvvp.js@85k2DEO9lZcWxVeePb3z"

const NavigationDrawerImages = forwardRef(({ images = [] }, ref) => {
    const containerRef = useRef(null)

    const animateIn = (options = {}) => {
        if (!containerRef.current) return
        gsap.killTweensOf(containerRef.current)
        gsap.to(containerRef.current, {
            "--left-y": "100%",
            "--right-y": "100%",
            duration: options.duration ?? 1.8,
            ease: options.ease ?? "power3.inOut",
            delay: options.delay ?? 0,
        })
    }

    const animateOut = (options = {}) => {
        if (!containerRef.current) return
        gsap.killTweensOf(containerRef.current)
        gsap.to(containerRef.current, {
            "--left-y": "0%",
            "--right-y": "0%",
            duration: options.duration ?? 1.8,
            ease: options.ease ?? "power3.inOut",
            delay: options.delay ?? 0,
        })
    }

    useImperativeHandle(ref, () => ({ animateIn, animateOut }))

    if (!images?.length) return null

    return (
        <div
            ref={containerRef}
            style={{
                position: "absolute",
                bottom: 0,
                right: 0,
                width: 191,
                clipPath:
                    "polygon(0% 0%, 100% 0%, 100% var(--left-y), 0% var(--right-y))",
                // CSS custom properties via style (GSAP tweens these)
                "--left-y": "0%",
                "--right-y": "0%",
            }}
        >
            <div
                style={{
                    display: "grid",
                    gridTemplateAreas: "'a'",
                }}
            >
                {images.map((src, i) => (
                    <DrawerImage key={i} src={src} />
                ))}
            </div>
        </div>
    )
})

// 개별 이미지 — clip-path 트랜지션으로 순차 표시
function DrawerImage({ src }) {
    const ref = useRef(null)

    // 마운트 후 짧은 딜레이로 clip-path 리셋 (isActive 패턴)
    const handleRef = (node) => {
        ref.current = node
        if (node) {
            setTimeout(() => {
                node.style.setProperty("--left-y", "0%")
                node.style.setProperty("--right-y", "0%")
            }, 5)
        }
    }

    return (
        <div
            ref={handleRef}
            style={{
                gridArea: "a",
                position: "relative",
                aspectRatio: "191/260",
                clipPath:
                    "polygon(0% var(--left-y), 100% var(--right-y), 100% 100%, 0% 100%)",
                transition: "clip-path 1.2s cubic-bezier(0.16, 1, 0.3, 1)",
                "--left-y": "100%",
                "--right-y": "100%",
            }}
        >
            <Image
                src={src}
                alt=""
                priority
                objectFit="cover"
                style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                }}
            />
        </div>
    )
}

NavigationDrawerImages.displayName = "NavigationDrawerImages"
export default NavigationDrawerImages
