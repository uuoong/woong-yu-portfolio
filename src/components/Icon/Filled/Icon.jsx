import { icons } from "../data.js"

export default function Icon({ name, selected, className = "" }) {
    const IconPath = icons.filled[name]
    if (!IconPath) return null

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
            aria-hidden="true"
            className={`${className}`}
            style={{ width: "100%", height: "100%", flexShrink: "0" }}
        >
            {IconPath(selected)}
        </svg>
    )
}
