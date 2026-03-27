/**
 * PageTransition.jsx
 *
 * 레퍼런스: PageTransition.jsx (원본)
 *
 * ─── 원본 구조 그대로 ─────────────────────────────────────────────────────
 *  AnimatePresence + motion.div (framer-motion)
 *  START_STATE / END_STATE / ANIMATION variants 원본과 동일
 *  onAnimationStart → exit 시 scroll.stop() + setPageIsTransitioning(true)
 *
 * ─── 원본 대비 변경사항 (최소화) ─────────────────────────────────────────
 *  useRouter().asPath   → pathname prop (페이지에서 전달)
 *  useStore             → useAppContext
 *  CSS module           → inline style
 *  classNames           → 제거
 *
 * ─── TRANSITION_DURATION ─────────────────────────────────────────────────
 *  원본: TRANSITION_DURATION = 1.2 (data.js에서 import)
 *  현재: data.js에 TRANSITION_DURATION 추가 → 동일
 */

import React from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ScrollContext } from "../../context/Scroll.js"
import { useAppContext } from "../../context/App.js"
import { TRANSITION_DURATION } from "../../data/index.js"

// ── 원본 상수 그대로 ──────────────────────────────────────────────────────────
const START_STATE = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    overflow: "hidden",
}

const END_STATE = {
    position: "relative",
    top: 0,
    left: 0,
    width: "100%",
    height: "auto",
    overflow: "visible",
}

// 원본 ANIMATION 그대로
const ANIMATION = {
    start: {
        opacity: 0,
        ...START_STATE,
        transition: { duration: 0, delay: TRANSITION_DURATION },
    },
    enter: {
        opacity: 1,
        ...END_STATE,
    },
    exit: {
        ...END_STATE,
        opacity: 1,
        transition: { delay: TRANSITION_DURATION },
    },
}

const PageTransition = ({ className, children, pathname = "/" }) => {
    const { setPageIsTransitioning, pageIsTransitioning } = useAppContext()
    const { scroll } = React.useContext(ScrollContext)

    return (
        <div
            className={["PageTransition", className].filter(Boolean).join(" ")}
        >
            <AnimatePresence mode="wait" initial={false}>
                <motion.div
                    onAnimationStart={(state) => {
                        if (state === "exit") {
                            scroll?.stop()
                            setPageIsTransitioning(true)
                        }
                    }}
                    initial="start"
                    animate="enter"
                    exit="exit"
                    variants={ANIMATION}
                    data-themed="background-color"
                    key={pathname}
                    className={[
                        "page",
                        pageIsTransitioning && "pageIsTransitioning",
                    ]
                        .filter(Boolean)
                        .join(" ")}
                    style={{ backgroundColor: "var(--bg)" }}
                >
                    {children}
                </motion.div>
            </AnimatePresence>
        </div>
    )
}

PageTransition.displayName = "PageTransition"

export default PageTransition
