/**
 * src/pages/home/Home.jsx
 */

import { useState } from "react"
import { AnimatePresence } from "framer-motion"

import Layout from "../../components/Layout/Layout.jsx"
import WindowToggleList from "../../components/WindowToggleList/WindowToggleList.jsx"

import WindowAbout from "../../components/Window/WindowAbout.jsx"
import WindowWorks from "../../components/Window/WindowWorks.jsx"
import WindowLab from "../../components/Window/WindowLab.jsx"
import WindowShowreel from "../../components/Window/WindowShowreel.jsx"

import Background from "../../components/Background/Background.jsx"

const WINDOW_COMPONENTS = {
    about: WindowAbout,
    works: WindowWorks,
    lab: WindowLab,
    showreel: WindowShowreel,
}

export default function Home() {
    const [stack, setStack] = useState([])

    // 토글: 열려있으면 닫고, 닫혀있으면 최상단에 추가
    const toggleWindow = (id) => {
        setStack((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        )
    }

    // 포커스: 클릭한 모달을 스택 최상단으로 이동
    const focusWindow = (id) => {
        setStack((prev) => {
            if (prev.at(-1) === id) return prev
            return [...prev.filter((i) => i !== id), id]
        })
    }

    // 닫기
    const closeWindow = (id) => {
        setStack((prev) => prev.filter((i) => i !== id))
    }

    return (
        <Layout>
            <div
                style={{
                    position: "relative",
                    isolation: "isolate",
                    display: "flex",
                    width: "100%",
                    height: "100%",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    overflow: "hidden",
                    padding: "var(--space-1)",
                    boxShadow: "0 0 1px var(--border)",
                }}
            >
                <WindowToggleList
                    activeWindows={stack}
                    onToggleWindow={toggleWindow}
                />

                <AnimatePresence>
                    {stack.map((id, index) => {
                        const Window = WINDOW_COMPONENTS[id]

                        return (
                            <Window
                                key={id}
                                zIndex={100 + index}
                                onFocus={() => focusWindow(id)}
                                onClose={() => closeWindow(id)}
                            />
                        )
                    })}
                </AnimatePresence>

                <div
                    style={{
                        position: "absolute",
                        inset: "var(--space-0)",
                        zIndex: "-1",
                    }}
                >
                    <Background />
                </div>
            </div>
        </Layout>
    )
}
