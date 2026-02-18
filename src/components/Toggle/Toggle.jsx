import React from "react"
import { motion } from "framer-motion"

import Icon from "../Icon/Outlined/Icon.jsx"

export default function Toggle({ label, icon, isActive = false, onClick }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{
        backgroundColor: "var(--button-hover)",
        transition: "var(--transition-fast)",
      }}
      whileTap={{ backgroundColor: "var(--button-active)" }}
      style={{
        display: "flex",
        cursor: "pointer",
        alignItems: "center",
        gap: "var(--space-1)",
        padding: "var(--space-1)",
      }}
      >
      {icon && <Icon name={icon} selected={isActive} />}
      <span style={{ whiteSpace: "nowrap" }}>{label}</span>
      </motion.button>
  )
}
