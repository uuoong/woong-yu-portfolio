import { useEffect, useRef, useCallback } from "react"
import Core from "https://unpkg.com/smooothy"
import { marqueeData } from "./data.js"

const MIN_CLONES = 3

export default function Marquee({
    modalId,
    height = 60,
    speed = 0.8,
    gap = "var(--space-1)",
    snap = false,
    lerpFactor = 0.07,
}) {
    const containerRef = useRef(null)
    const trackRef = useRef(null)
    const sliderRef = useRef(null)
    const rafRef = useRef(null)
    const isDraggingRef = useRef(false)
    const autoSpeedRef = useRef(speed)

    useEffect(() => {
        autoSpeedRef.current = speed
    }, [speed])

    const images = marqueeData[modalId] ?? []

    const repeatedImages =
        images.length > 0
            ? Array.from(
                  { length: Math.ceil(MIN_CLONES * 1) },
                  () => images
              ).flat()
            : []

    const initSlider = useCallback(() => {
        if (!trackRef.current) return

        if (sliderRef.current) {
            sliderRef.current.destroy?.()
            sliderRef.current = null
        }
        cancelAnimationFrame(rafRef.current)

        const slider = new Core(trackRef.current, {
            infinite: true,
            snap,
            lerpFactor,
            dragSensitivity: 0.006,
            virtualScroll: {
                mouseMultiplier: 0.8,
                touchMultiplier: 1.4,
            },
        })
        sliderRef.current = slider

        const track = trackRef.current

        const onDragStart = () => {
            isDraggingRef.current = true
        }
        const onDragEnd = () => {
            isDraggingRef.current = false
        }

        track.addEventListener("mousedown", onDragStart)
        track.addEventListener("touchstart", onDragStart, { passive: true })
        window.addEventListener("mouseup", onDragEnd)
        window.addEventListener("touchend", onDragEnd)

        const animate = () => {
            if (sliderRef.current) {
                if (
                    !isDraggingRef.current &&
                    sliderRef.current.target !== undefined
                ) {
                    sliderRef.current.target += autoSpeedRef.current
                }
                sliderRef.current.update()
            }
            rafRef.current = requestAnimationFrame(animate)
        }
        rafRef.current = requestAnimationFrame(animate)

        return () => {
            cancelAnimationFrame(rafRef.current)
            track.removeEventListener("mousedown", onDragStart)
            track.removeEventListener("touchstart", onDragStart)
            window.removeEventListener("mouseup", onDragEnd)
            window.removeEventListener("touchend", onDragEnd)
            slider.destroy?.()
        }
    }, [snap, lerpFactor])

    useEffect(() => {
        const id = setTimeout(() => {
            const cleanup = initSlider()
            return cleanup
        }, 50)

        return () => {
            clearTimeout(id)
            cancelAnimationFrame(rafRef.current)
            sliderRef.current?.destroy?.()
        }
    }, [modalId, initSlider])

    if (images.length === 0) {
        return (
            <div className="marquee-empty">
                이미지 데이터를 찾을 수 없습니다: <code>{modalId}</code>
            </div>
        )
    }

    return (
        <div className="marquee-container" ref={containerRef}>
            <div
                className="marquee-track"
                ref={trackRef}
                style={{
                    "--marquee-gap": typeof gap === "number" ? `${gap}px` : gap,
                }}
            >
                {repeatedImages.map((img, i) => (
                    <div className="marquee-slide" key={`${modalId}-${i}`}>
                        <img
                            className="marquee-image"
                            src={img.src}
                            alt={img.alt}
                            draggable={false}
                            loading="lazy"
                            decoding="async"
                            style={{ height: `calc(var(--unit) * ${height})` }}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}
