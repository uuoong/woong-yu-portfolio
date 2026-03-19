/**
 * ImageReveal.jsx — 표준 이미지 리빌 컴포넌트 (WebGL 아님)
 *
 * 일반 페이지에서 사용하는 CSS + GSAP 기반 이미지 리빌.
 * WebGL GLImage는 특정 페이지에서만 사용.
 *
 * ─── 효과 옵션 ────────────────────────────────────────────────────────────
 *
 *  "clip"    clip-path로 위→아래 또는 아래→위 리빌
 *  "fade"    opacity + translateY
 *  "wipe"    가로 방향 wipe (fill color 레이어 포함)
 *
 * ─── Props ────────────────────────────────────────────────────────────────
 *
 *  src          string
 *  alt          string
 *  effect       "clip" | "fade" | "wipe"  (기본값: "clip")
 *  direction    "up" | "down"             (clip 전용, 기본값: "up")
 *  delay        number  초 단위 딜레이 (기본값: 0)
 *  duration     number  초 단위 (기본값: 1.2)
 *  color        string  wipe 레이어 색상 (기본값: "#403fb7")
 *  priority     boolean
 *  className    string
 *  style        object
 *  onReveal     function  애니메이션 완료 콜백
 */

import React, { useEffect, useRef, useState } from "react"
import gsap from "https://esm.sh/gsap"
import Image from "https://framer.com/m/Image-1aJvvp.js@85k2DEO9lZcWxVeePb3z"

export default function ImageReveal({
    src,
    alt = "",
    effect = "clip",
    direction = "up",
    delay = 0,
    duration = 1.2,
    color = "#403fb7",
    priority = false,
    className,
    style,
    onReveal,
}) {
    const containerRef = useRef(null)
    const imageRef = useRef(null)
    const wipeRef = useRef(null)
    const [isInView, setIsInView] = useState(false)
    const [hasRevealed, setHasRevealed] = useState(false)

    useEffect(() => {
        const el = containerRef.current
        if (!el) return

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true)
                    observer.disconnect()
                }
            },
            { rootMargin: "-5% 0px" }
        )
        observer.observe(el)
        return () => observer.disconnect()
    }, [])

    // 입장 시 애니메이션
    useEffect(() => {
        if (!isInView || hasRevealed) return
        setHasRevealed(true)

        const img = imageRef.current
        if (!img) return

        const ease = "power3.out"

        if (effect === "clip") {
            const startClip =
                direction === "up"
                    ? "inset(100% 0% 0% 0%)"
                    : "inset(0% 0% 100% 0%)"

            gsap.fromTo(
                img,
                { clipPath: startClip, scale: 1.08 },
                {
                    clipPath: "inset(0% 0% 0% 0%)",
                    scale: 1,
                    duration,
                    delay,
                    ease,
                    onComplete: onReveal,
                }
            )
        }

        if (effect === "fade") {
            gsap.fromTo(
                img,
                { opacity: 0, y: direction === "up" ? 24 : -24 },
                {
                    opacity: 1,
                    y: 0,
                    duration,
                    delay,
                    ease,
                    onComplete: onReveal,
                }
            )
        }

        if (effect === "wipe") {
            const wipe = wipeRef.current
            if (!wipe) return

            gsap.timeline({ delay })
                // wipe layer in
                .fromTo(
                    wipe,
                    { scaleX: 0, transformOrigin: "left center" },
                    { scaleX: 1, duration: duration * 0.5, ease }
                )
                // 이미지 노출
                .set(img, { opacity: 1 }, "<+=" + duration * 0.45)
                // wipe layer out
                .to(wipe, {
                    scaleX: 0,
                    transformOrigin: "right center",
                    duration: duration * 0.5,
                    ease,
                    onComplete: onReveal,
                })
        }
    }, [isInView]) // eslint-disable-line

    const containerStyle = {
        position: "relative",
        overflow: "hidden",
        ...style,
    }

    // 초기 visibility 상태
    const imageStyle = {
        display: "block",
        width: "100%",
        height: "100%",
        opacity: effect === "wipe" ? 0 : 1,
        clipPath:
            effect === "clip"
                ? direction === "up"
                    ? "inset(100% 0% 0% 0%)"
                    : "inset(0% 0% 100% 0%)"
                : undefined,
    }

    return (
        <div ref={containerRef} className={className} style={containerStyle}>
            <Image
                ref={imageRef}
                src={src}
                alt={alt}
                priority={priority}
                style={imageStyle}
                objectFit="cover"
            />

            {/* wipe 레이어 */}
            {effect === "wipe" && (
                <div
                    ref={wipeRef}
                    style={{
                        position: "absolute",
                        inset: 0,
                        background: color,
                        transformOrigin: "left center",
                        transform: "scaleX(0)",
                        zIndex: 2,
                        pointerEvents: "none",
                    }}
                />
            )}
        </div>
    )
}

ImageReveal.displayName = "ImageReveal"
