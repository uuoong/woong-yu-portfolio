/**
 * src/components/Toggle/Toggle.jsx
 *
 * Props:
 *   label    {string}   - 버튼 텍스트
 *   icon     {string}   - Icon 컴포넌트의 name prop (data/icons.js 키)
 *   isActive {boolean}  - 활성 상태 (Icon selected + 스타일 변경)
 *   onClick  {function} - 클릭 핸들러
 */

import { motion } from "framer-motion"
import Icon from "../Icon/Icon.jsx"

const Toggle = ({ label, icon, isActive = false, onClick }) => {
    return (
        <motion.button
            type="button"
            onClick={onClick}
            whileHover={{
                backgroundColor: "var(--button-hover)",
                transition: "var(--transition-fast)",
            }}
            style={{
                display: "flex",
                cursor: "pointer",
                alignItems: "center",
                gap: "var(--space-1)",
                padding: "var(--space-1)",
            }}
        >
            {icon && (
                <Icon name={icon} variant="outlined" selected={isActive} />
            )}
            <span style={{ whiteSpace: "nowrap" }}>{label}</span>
        </motion.button>
    )
}

export default Toggle
