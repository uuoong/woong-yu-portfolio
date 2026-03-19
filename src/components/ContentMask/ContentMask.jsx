/**
 * ContentMask.jsx — 텍스트/콘텐츠 마스크 슬라이드 인/아웃
 *
 * 레퍼런스: components/ContentMask/ContentMask.jsx
 *
 * ─── 변경사항 ─────────────────────────────────────────────────────────────
 *
 *  제거: CSS module, classnames, useStore
 *  유지: forwardRef + useImperativeHandle (내부 컴포넌트 → Framer canvas 문제 없음)
 *        animateIn / animateOut 명령형 API
 *        isInView + loaderAnimationComplete 연동
 *        startPos UP / DOWN
 *
 * ─── 사용법 ───────────────────────────────────────────────────────────────
 *
 *  const ref = useRef()
 *  <ContentMask ref={ref} text="Hello\nWorld" />
 *  ref.current.animateIn()
 *  ref.current.animateOut({ direction: "DOWN" })
 */

import React, {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useRef,
} from "react"
import gsap from "https://esm.sh/gsap"
import useInView from "https://framer.com/m/use-in-view-xncvJM.js@qHxupyUmAZKnO7gTx142"
import { useAppContext } from "https://framer.com/m/App-bSRL7k.js@OSIlKrR0H91ZCA9r9DU7"

const EASE = "power3.out"
const DURATION = 1.2

const ContentMask = forwardRef(
    (
        {
            element,
            text,
            startPos = "DOWN", // "UP" | "DOWN"
            children,
            animateInView,
            delay = 0,
            duration,
            onInView,
            style,
            innerStyle,
        },
        ref
    ) => {
        const Element = element || "div"
        const innerRefs = useRef([])
        const containerRef = useRef(null)

        const { setElementToObserve, isInView } = useInView({
            useIntersection: true,
            intersectionMargin: "-5%",
        })

        const { loaderAnimationComplete } = useAppContext()

        const textLines = typeof text === "string" ? text.split("\n") : null

        // ── animateIn ─────────────────────────────────────────────────────
        const animateIn = (options = {}) => {
            const els = innerRefs.current.filter(Boolean)
            if (!els.length) return
            gsap.killTweensOf(els)

            const cfg = {
                y: 0,
                ease: EASE,
                duration: options.duration ?? duration ?? DURATION,
                delay: options.delay ?? 0,
            }
            if (els.length > 1) cfg.stagger = 0.1

            gsap.to(els, cfg)
        }

        // ── animateOut ────────────────────────────────────────────────────
        const animateOut = (options = {}) => {
            const els = innerRefs.current.filter(Boolean)
            if (!els.length) return
            gsap.killTweensOf(els)

            const y = options.direction === "DOWN" ? "105%" : "-105%"

            const cfg = {
                y,
                ease: EASE,
                duration: options.duration ?? duration ?? DURATION,
                delay: options.delay ?? 0,
            }
            if (els.length > 1) cfg.stagger = 0.1

            gsap.to(els, cfg)
        }

        // ── animateInView 트리거 ──────────────────────────────────────────
        useEffect(() => {
            if (isInView && animateInView && loaderAnimationComplete) {
                setTimeout(() => {
                    onInView?.()
                    animateIn({ duration: duration ?? DURATION })
                }, delay * 1000)
            }
        }, [isInView, animateInView, loaderAnimationComplete]) // eslint-disable-line

        // ── 명령형 API 노출 ───────────────────────────────────────────────
        useImperativeHandle(ref, () => ({ animateIn, animateOut }))

        // ── 초기 y 위치 (startPos) ────────────────────────────────────────
        const initialY = startPos === "UP" ? "-105%" : "105%"

        const containerStyle = {
            position: "relative",
            overflow: "hidden",
            display: "block",
            ...style,
        }

        const getInnerStyle = () => ({
            width: "100%",
            display: "block",
            transform: `translateY(${initialY})`,
            ...innerStyle,
        })

        return (
            <Element
                ref={(node) => {
                    containerRef.current = node
                    setElementToObserve(node)
                }}
                style={containerStyle}
                data-start-pos={startPos}
            >
                {/* 멀티라인 텍스트 */}
                {textLines?.map((line, i) => (
                    <span
                        key={i}
                        ref={(node) => {
                            innerRefs.current[i] = node
                        }}
                        style={getInnerStyle()}
                    >
                        {line}
                    </span>
                ))}

                {/* children (text 없을 때) */}
                {children && !textLines && (
                    <span
                        ref={(node) => {
                            innerRefs.current[0] = node
                        }}
                        style={getInnerStyle()}
                    >
                        {children}
                    </span>
                )}
            </Element>
        )
    }
)

ContentMask.displayName = "ContentMask"
export default ContentMask
