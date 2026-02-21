/**
 * src/components/Window/WindowShowreel.jsx
 */

import Window from "../Window/Window.jsx"
import Marquee from "../Marquee/Marquee.jsx"

const WindowShowreel = ({ zIndex, onFocus, onClose }) => {
    return (
        <Window
            title="Showreel"
            className="window-showreel"
            zIndex="10"
            onFocus={onFocus}
            onClose={onClose}
        >
            <video
                preload="metadata"
                disablePictureInPicture=""
                controlsList="nodownload noplaybackrate"
                poster="data:image/jpeg;base64,/9j/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAALABQDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAj/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFAEBAAAAAAAAAAAAAAAAAAAAAP/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/AJ/AAAB//9k="
                autoPlay=""
                playsInline=""
                controls=""
                src="https://stream.mux.com/B1YpS1WQPab8Q71ed3fXj3LSnP02jsV700M46gBRenp01Y.m3u8"
                style={{ width: "100%", aspectRatio: "1.77778 / 1" }}
            ></video>
        </Window>
    )
}

export default WindowShowreel
