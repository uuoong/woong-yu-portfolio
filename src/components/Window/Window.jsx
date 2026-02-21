/**
 * src/components/Window/Window.jsx
 *
 * 재사용 가능한 기본 Window 컴포넌트.
 */

import { motion, useDragControls } from "framer-motion"
import { Close } from "../WindowControls/WindowControls.jsx"

const Window = ({ title, className, children, onClose, onFocus, zIndex }) => {
    const controls = useDragControls()

    return (
        <motion.div
            drag
            dragControls={controls}
            dragListener={false}
            dragMomentum={false}
            initial={{ opacity: 0, scale: 0.9, x: "-50%", y: "-40%" }}
            animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
            onDragStart={onFocus}
            onPointerDown={onFocus}
            style={{
                display: "flex",
                flexDirection: "column",
                backgroundColor: "var(--bg-primary)",
                paddingInline: "var(--space-1)",
                paddingBottom: "var(--space-1)",
                border: "1px solid var(--border)",
                zIndex,
                willChange: "transform",
            }}
        >
            <div
                className="window__titlebar"
                onPointerDown={(e) => controls.start(e)}
                style={{
                    touchAction: "none",
                    cursor: "grab",
                }}
            >
                <div
                    className="font-mono"
                    style={{
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                    }}
                >
                    <h2>{title}</h2>
                </div>

                <Close onClick={onClose} />
            </div>

            <div className="window__content-area">{children}</div>
        </motion.div>
    )
}

export default Window
