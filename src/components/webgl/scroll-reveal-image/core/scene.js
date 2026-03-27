import React, { useCallback, useEffect, useMemo, useRef } from "react"
import { Renderer, Camera, Transform } from "https://esm.sh/ogl"
import { useScrollContext } from "../../../../context/Scroll.js"
import { useAppContext } from "../../../../context/App.js"

export const SceneContext = React.createContext(null)

export const useScene = () => {
    return React.useContext(SceneContext)
}

export const SceneProvider = ({ children }) => {
    const { onScrollCallback } = useScrollContext()
    const { navigationIsOpen } = useAppContext()

    const S = useRef({
        ready: false,
        gl: null,
        renderer: null,
        scene: null,
        camera: null,
        items: [],
        scroll: 0,
        shouldRender: true,
        rafId: null,
        pending: [],
    }).current

    const subscribe = useCallback((cb) => {
        if (S.ready) {
            cb(S)
        } else {
            S.pending.push(cb)
        }
        return () => {
            S.pending = S.pending.filter((x) => x !== cb)
        }
    }, [])

    const addItem = useCallback((item) => {
        S.items.push(item)
        item.mesh.setParent(S.scene)
        S.shouldRender = true
    }, [])

    const removeItem = useCallback((item) => {
        S.items = S.items.filter((i) => i !== item)
        if (S.scene) S.scene.removeChild(item.mesh)
        item.geometry?.remove?.()
        if (S.gl) {
            if (item.texture?.texture) S.gl.deleteTexture(item.texture.texture)
            if (item.program?.program) S.gl.deleteProgram(item.program.program)
        }
        S.shouldRender = true
    }, [])

    const scheduleRender = useCallback(() => {
        S.shouldRender = true
    }, [])

    const recomputeAllItems = useCallback(() => {
        if (!S.ready) return
        const W = window.innerWidth,
            H = window.innerHeight
        for (const item of S.items) {
            item.recompute()
            item.mesh.position.set(
                -W / 2 + item.left + item.width / 2,
                S.scroll + H / 2 - item.absTop - item.height / 2,
                0
            )
            item.mesh.scale.set(item.width, item.height, 1)
            item.program.uniforms.uElementSize.value[0] = item.width
            item.program.uniforms.uElementSize.value[1] = item.height
        }
        S.shouldRender = true
    }, [])

    useEffect(() => {
        if (!S.ready) return

        const DURATION_MS = 1500
        const endTime = Date.now() + DURATION_MS
        let rafId

        const refresh = () => {
            recomputeAllItems()
            if (Date.now() < endTime) {
                rafId = requestAnimationFrame(refresh)
            }
        }

        rafId = requestAnimationFrame(refresh)
        return () => cancelAnimationFrame(rafId)
    }, [navigationIsOpen])

    useEffect(() => {
        const renderer = new Renderer({
            dpr: Math.min(window.devicePixelRatio, 2),
            alpha: true,
            antialias: true,
        })
        const { gl } = renderer

        gl.clearColor(0, 0, 0, 0)
        Object.assign(gl.canvas.style, {
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            pointerEvents: "none",
            zIndex: "103",
        })
        document.body.appendChild(gl.canvas)

        const CAM_DIST = 600
        const camera = new Camera(gl, {
            fov: 70,
            aspect: window.innerWidth / window.innerHeight,
            near: 300,
            far: 1000,
        })
        camera.position.set(0, 0, CAM_DIST)
        camera.lookAt([0, 0, 0])

        const scene = new Transform()

        const syncCamera = () => {
            const W = window.innerWidth,
                H = window.innerHeight
            renderer.setSize(W, H)
            camera.perspective({
                fov: (2 * Math.atan(H / (2 * CAM_DIST)) * 180) / Math.PI,
                aspect: W / H,
                near: 300,
                far: 1000,
            })
        }
        syncCamera()

        onScrollCallback({
            key: "__glScene__",
            callback: ({ scroll }) => {
                S.scroll = scroll
                const H = window.innerHeight,
                    W = window.innerWidth
                for (const item of S.items) {
                    item.mesh.position.y =
                        scroll + H / 2 - item.absTop - item.height / 2
                    item.mesh.position.x = -W / 2 + item.left + item.width / 2
                }
                S.shouldRender = true
            },
        })

        const tick = () => {
            S.rafId = requestAnimationFrame(tick)
            if (S.shouldRender) {
                renderer.render({ scene, camera })
                S.shouldRender = false
            }
        }
        S.rafId = requestAnimationFrame(tick)

        const onResize = () => {
            syncCamera()
            const W = window.innerWidth,
                H = window.innerHeight
            for (const item of S.items) {
                item.recompute()
                item.mesh.position.set(
                    -W / 2 + item.left + item.width / 2,
                    S.scroll + H / 2 - item.absTop - item.height / 2,
                    0
                )
                item.mesh.scale.set(item.width, item.height, 1)
                item.program.uniforms.uElementSize.value[0] = item.width
                item.program.uniforms.uElementSize.value[1] = item.height
            }
            S.shouldRender = true
        }
        window.addEventListener("resize", onResize)

        Object.assign(S, { ready: true, gl, renderer, scene, camera })
        S.pending.forEach((cb) => cb(S))
        S.pending = []

        return () => {
            onScrollCallback({ key: "__glScene__", remove: true })
            cancelAnimationFrame(S.rafId)
            window.removeEventListener("resize", onResize)
            for (const item of S.items) {
                S.scene?.removeChild(item.mesh)
                item.geometry?.remove?.()
                if (gl) {
                    if (item.texture?.texture)
                        gl.deleteTexture(item.texture.texture)
                    if (item.program?.program)
                        gl.deleteProgram(item.program.program)
                }
            }
            S.items = []
            S.pending = []
            S.ready = false
            gl.canvas.remove()
        }
    }, [])

    const ctx = useMemo(
        () => ({ subscribe, addItem, removeItem, scheduleRender }),
        []
    )

    return <SceneContext.Provider value={ctx}>{children}</SceneContext.Provider>
}
