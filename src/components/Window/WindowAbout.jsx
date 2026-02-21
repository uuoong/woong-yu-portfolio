/**
 * src/components/Window/WindowAbout.jsx
 */

import Window from "../Window/Window.jsx"
import Marquee from "../Marquee/Marquee.jsx"

const WindowAbout = ({ zIndex, onFocus, onClose }) => {
    return (
        <Window
            title="About"
            className="window-about"
            zIndex="8"
            onFocus={onFocus}
            onClose={onClose}
        >
            <p>
                Edo is a Senior Frontend Developer with nearly a decade of
                experience. An award-winning builder with a strong eye for
                detail, combining design sensibility with technical skill. He
                has worked with companies including Buck, Disney, Porsche, Red
                Bull, Le Labo Fragrances, and Getty. Based in Vienna and working
                worldwide, he builds with obsessive care for craft and quality.
            </p>
            <p>
                Available for freelance collaborations. Find him on
                <a
                    draggable="false"
                    style={{
                        userSelect: "none",
                        textDecorationLine: "underline",
                        textUnderlineOffset: "2px",
                    }}
                    target="_blank"
                    rel="noopener"
                    href="https://www.instagram.com/edo.tsx/"
                >
                    Instagram
                </a>
                or
                <a
                    draggable="false"
                    style={{
                        userSelect: "none",
                        textDecorationLine: "underline",
                        textUnderlineOffset: "2px",
                    }}
                    target="_blank"
                    rel="noopener"
                    href="https://www.linkedin.com/in/edoardolunardi/"
                >
                    Linkedin
                </a>
                , or
                <a
                    draggable="false"
                    style={{
                        userSelect: "none",
                        textDecorationLine: "underline",
                        textUnderlineOffset: "2px",
                    }}
                    target="_self"
                    rel=""
                    href="mailto:hello@edoardolunardi.dev"
                >
                    get in touch directly
                </a>
                .
            </p>

            <div style={{ marginTop: "1em" }}>
                <Marquee windowId="about" />
            </div>
        </Window>
    )
}

export default WindowAbout
