import React from "react"

import {
    AppProvider,
    useAppContext,
    ScrollProvider,
    SceneProvider,
    Layout,
    Home,
    Works,
} from "https://framer.com/m/index-ShqOMv.js@wtx0ZJw7K6wUaVRIWPTm"

export default function App() {
    return (
        <AppProvider>
            <AppRouter />
        </AppProvider>
    )
}

function AppRouter() {
    const { currentPath } = useAppContext()

    return (
        <ScrollProvider>
            <SceneProvider>
                <Layout>
                    {currentPath === "/" && <Home key="home" />}
                    {currentPath === "/works" && <Works key="works" />}
                </Layout>
            </SceneProvider>
        </ScrollProvider>
    )
}
