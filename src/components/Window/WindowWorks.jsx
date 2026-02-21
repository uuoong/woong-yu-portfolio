/**
 * src/components/Window/WindowWorks.jsx
 */

import Window from "../Window/Window.jsx"
import Marquee from "../Marquee/Marquee.jsx"

const WindowWorks = ({ zIndex, onFocus, onClose }) => {
    return (
        <Window
            title="Works"
            className="window-works"
            zIndex="7"
            onFocus={onFocus}
            onClose={onClose}
        >
            <Marquee windowId="works" />
        </Window>
    )
}

export default WindowWorks
