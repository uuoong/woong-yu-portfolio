/**
 * src/components/Marquee/Marquee.jsx
 *
 * framer-motion 기반 infinite marquee.
 *
 * - useMotionValue    : React 리렌더 없이 GPU transform 직접 제어
 * - useAnimationFrame : framer 내장 RAF (캔버스와 동일한 루프 공유)
 * - 포인터 이벤트     : drag 중 autoplay 일시 정지 + 관성 감속
 *
 * Props:
 *   windowId {string}        - data/marquee.js 키
 *   height  {number}        - 이미지 높이 배수 (calc(var(--unit) * height))
 *   speed   {number}        - autoplay 속도 px/frame (기본 1)
 *   gap     {string|number} - CSS 값 문자열 or 숫자(px)
 */

import { useRef } from "react"
import { motion, useMotionValue, useAnimationFrame } from "framer-motion"
import { marqueeData } from "../../data/_index.js"

const Marquee = ({
    windowId,
    height = 60,
    speed = 1,
    gap = "var(--space-1)",
}) => {
    const images = marqueeData[windowId] ?? []
    const items = images.length > 0 ? [...images, ...images] : []

    const trackRef = useRef(null)
    const x = useMotionValue(0) // GPU 가속 transform 제어
    const isDragging = useRef(false)
    const velocity = useRef(0) // 드래그 종료 후 관성 초기값
    const prevPointer = useRef(0)

    useAnimationFrame(() => {
        if (!trackRef.current || items.length === 0 || isDragging.current)
            return

        const totalWidth = trackRef.current.scrollWidth
        const halfWidth = totalWidth / 2

        // 관성 및 자동 재생 로직
        if (Math.abs(velocity.current) > 0.1) {
            velocity.current *= 0.95
            x.set(x.get() + velocity.current)
        } else {
            velocity.current = 0
            x.set(x.get() - speed)
        }

        // 루프 포인트 리셋
        const currentX = x.get()
        if (currentX <= -halfWidth) x.set(currentX + halfWidth)
        if (currentX > 0) x.set(currentX - halfWidth)
    })

    const onPointerDown = (e) => {
        isDragging.current = true
        velocity.current = 0
        prevPointer.current = e.clientX
        e.currentTarget.setPointerCapture(e.pointerId)
    }

    const onPointerMove = (e) => {
        if (!isDragging.current) return
        const delta = e.clientX - prevPointer.current
        velocity.current = delta
        prevPointer.current = e.clientX
        x.set(x.get() + delta)
    }

    const onPointerUp = () => {
        isDragging.current = false
    }

    if (images.length === 0) return null

    return (
        <div>
            <div className="marquee-container">
                <motion.div
                    ref={trackRef}
                    className="marquee-track"
                    style={{
                        x,
                        gap: typeof gap === "number" ? `${gap}px` : gap,
                    }}
                    onPointerDown={onPointerDown}
                    onPointerMove={onPointerMove}
                    onPointerUp={onPointerUp}
                    onPointerLeave={onPointerUp}
                >
                    {items.map((img, i) => (
                        <div className="marquee-slide" key={`${windowId}-${i}`}>
                            <img
                                className="marquee-image"
                                src={img.src}
                                alt={img.alt || ""}
                                draggable={false}
                                loading="eager"
                                decoding="async"
                                style={{
                                    display: "block",
                                    height: `calc(var(--unit) * ${height})`,
                                }}
                            />
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    )
}

export default Marquee
