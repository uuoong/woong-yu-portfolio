import React from "react"
import { AnimatePresence, motion } from "framer-motion"
import { useAppContext } from "../../context/App.js"
import { ScrollContext } from "../../context/Scroll.js"
import { TRANSITION_DURATION } from "../../data/index.js"

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

const PageTransition = ({ className, style, children }) => {
    const { currentPath, pageIsTransitioning, setPageIsTransitioning } =
        useAppContext()
    const { scroll } = React.useContext(ScrollContext)

    return (
        <div className="PageTransition">
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
                    key={currentPath}
                    className={`page ${pageIsTransitioning ? "pageIsTransitioning" : ""}`}
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
