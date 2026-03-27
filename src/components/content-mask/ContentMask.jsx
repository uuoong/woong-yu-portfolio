import React, {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useRef,
} from "react"
import gsap from "https://esm.sh/gsap"
import useInView from "../../hooks/use_in_view.js"
import { useAppContext } from "../../context/App.js"

const EASE = "Power3.easeOut"
const DURATION = 1.2

const ContentMask = forwardRef(
    (
        {
            className,
            innerClassName,
            element,
            text,
            startPos = "DOWN",
            children,
            animateInView,
            delay = 0,
            onInView,
            duration,
            style,
            innerStyle,
        },
        ref
    ) => {
        const Element = element || "div"
        const innerRefs = useRef([])
        const containerRef = useRef()

        const { setElementToObserve, isInView } = useInView()
        const textLines = text?.split("\n")

        const { loaderAnimationComplete } = useAppContext()

        // 원본 animateIn — 그대로
        const animateIn = (options) => {
            if (!innerRefs.current?.length) return
            gsap.killTweensOf(innerRefs.current)

            const config = {
                y: 0,
                ease: EASE,
                duration: options?.duration || DURATION,
                delay: options?.delay || 0,
            }

            if (config?.stagger || innerRefs.current?.length > 1) {
                config.stagger = config?.stagger || 0.1
            }

            gsap.to(innerRefs.current, config)
        }

        // 원본 animateOut — 그대로
        const animateOut = (options) => {
            if (!innerRefs.current?.length) return
            gsap.killTweensOf(innerRefs.current)

            let y = "-105%"
            if (options?.direction === "DOWN") y = "105%"

            const config = {
                y,
                ease: EASE,
                duration: options?.duration || DURATION,
                delay: options?.delay || 0,
            }

            if (config?.stagger || innerRefs.current?.length > 1) {
                config.stagger = config?.stagger || 0.1
            }

            gsap.to(innerRefs.current, config)
        }

        // 원본 useEffect — 그대로
        useEffect(() => {
            if (isInView && animateInView && loaderAnimationComplete) {
                setTimeout(() => {
                    if (onInView) onInView()
                    animateIn({ duration: duration || DURATION })
                }, delay * 1000)
            }
        }, [
            isInView,
            animateInView,
            delay,
            onInView,
            duration,
            loaderAnimationComplete,
        ])

        useImperativeHandle(ref, () => ({ animateIn, animateOut }))

        // 원본 CSS: [data-start-pos='UP'] → translateY(-105%), DOWN → 105%
        const getInnerStyle = () => ({
            width: "100%",
            display: "block",
            transform:
                startPos === "UP" ? "translateY(-105%)" : "translateY(105%)",
            ...innerStyle,
        })

        return (
            <Element
                ref={(node) => {
                    containerRef.current = node
                    setElementToObserve(node)
                }}
                className={className}
                data-start-pos={startPos}
                style={{
                    // 원본 .ContentMask CSS
                    position: "relative",
                    overflow: "hidden",
                    display: "block",
                    ...style,
                }}
            >
                {/* 멀티라인 텍스트 */}
                {textLines?.length > 0 &&
                    textLines.map((line, i) => (
                        <span
                            key={i}
                            className={innerClassName}
                            ref={(node) => {
                                innerRefs.current[i] = node
                            }}
                            data-themed="color"
                            style={getInnerStyle()}
                        >
                            {line}
                        </span>
                    ))}

                {/* children (text 없을 때) */}
                {children && !text && (
                    <span
                        ref={(node) => {
                            innerRefs.current[0] = node
                        }}
                        className={innerClassName}
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
