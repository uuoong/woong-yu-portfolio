import { icons } from "../data.js"

export default function Icon({ name, selected, className = "" }) {
    const IconPath = icons.outlined[name]
    if (!IconPath) return null

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            aria-hidden="true"
            className={`${className}`}
            style={{
                width: "1em",
                height: "1em",
                flexShrink: "0",
                fill: "var(--text-primary)",
            }}
        >
            {IconPath(selected)}
        </svg>
    )
}
