// components/Modal/Modal.jsx
import React from "react"
import { motion, useDragControls } from "framer-motion"

import * as Controls from "../WindowControls/WindowControls.jsx"

export default function Modal({
    id,
    title,
    children,
    onClose,
    onFocus,
    zIndex,
}) {
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
                border: "1px solid",
                borderColor: "var(--border)",
                zIndex,
                willChange: "transform",
            }}
        >
            <div
                onPointerDown={(e) => {
                    controls.start(e)
                }}
                style={{
                    display: "flex",
                    height: "calc(var(--unit) * 26)",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "var(--space-1)",
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

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "var(--space-1)",
                    }}
                >
                    <Controls.Close onClick={onClose} />
                </div>
            </div>

            {/* Content Body Area */}
            <div
                style={{
                    position: "relative",
                    isolation: "isolate",
                    display: "flex",
                    height: "100%",
                    flex: "1",
                    flexDirection: "column",
                    gap: "var(--space-1)",
                    overflowY: "auto",
                    borderRadius: "var(--radius-sm)",
                    padding: "var(--space-1)",
                    border: "1px solid",
                    borderColor: "var(--border)",
                    scrollbarWidth: "none",
                }}
            >
                {children}
            </div>
        </motion.div>
    )
}
