/**
 * src/components/Window/WindowLab.jsx
 */

import Window from "../Window/Window.jsx"
import Marquee from "../Marquee/Marquee.jsx"

const WindowLab = ({ zIndex, onFocus, onClose }) => {
    return (
        <Window
            title="Featured Experiment"
            className="window-lab"
            zIndex="5"
            onFocus={onFocus}
            onClose={onClose}
        >
            <a
                draggable="false"
                style={{ userSelect: "none" }}
                aria-label="Infinite Canvas"
                href=""
            >
                <Marquee windowId="lab" />
            </a>
        </Window>
    )
}

export default WindowLab
