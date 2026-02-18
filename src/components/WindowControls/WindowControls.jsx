import React from "react"
import { motion } from "framer-motion"
import Icon from "../Icon/Filled/Icon.jsx"

export function Close({ onClick }) {
    return (
        <motion.button
            type="button"
            onClick={onClick}
            aria-label="Close"
            whileHover={{
                borderColor: "var(--bg-inverse)",
                backgroundColor: "var(--button-hover)",
                color: "var(--text-primary)",
                transition: "var(--transition-fast)",
            }}
            whileTap={{ backgroundColor: "var(--button-active)" }}
            style={{
                display: "flex",
                width: "calc(var(--unit) * 13)",
                height: "calc(var(--unit) * 13)",
                cursor: "pointer",
                alignItems: "center",
                borderRadius: "var(--radius-full)",
                borderStyle: "solid",
                borderWidth: "1px",
                borderColor: "color-mix(in srgb, var(--black) 0%, transparent)",
                backgroundColor: "var(--bg-inverse)",
                color: "var(--text-inverse)",
            }}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#4D0000"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                style={{
                    width: "100%",
                    height: "100%",
                    flexShrink: "0",
                }}
            >
                <path d="M18 6 6 18M6 6l12 12" />
            </svg>
        </motion.button>
    )
}

// export function FullScreen({ isSelected, onClick }) {
//     return (
//         <button
//             onClick={onClick}
//             onPointerDown={(e) => e.stopPropagation()}
//             className="group flex size-13 cursor-pointer items-center justify-center rounded-full bg-[#28C840] outline-none transition-none"
//             aria-label={isSelected ? "Exit Full Screen" : "Enter Full Screen"}
//         >
//             <Icon
//                 name="fullScreen"
//                 selected={isSelected}
//                 isMacStyle={true}
//                 className="p-[3px] text-black/60"
//             />
//         </button>
//     )
// }
