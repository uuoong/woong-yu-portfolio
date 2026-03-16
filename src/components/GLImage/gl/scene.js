import {
    createContext,
    useContext,
    useEffect,
    useRef,
    useMemo,
    useCallback,
} from "react"
import Lenis from "lenis"
import { Renderer, Camera, Transform } from "ogl"
import { initScroller } from "../../../base/scroll.js"

const SceneContext = createContext(null)

export function SceneProvider({ children, lenisOptions = {} }) {
    const S = useRef({
        ready: false,
        gl: null,
        renderer: null,
        scene: null,
        camera: null,
        lenis: null,
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

        item.geometry.remove?.()

        if (S.gl) {
            if (item.texture?.texture) S.gl.deleteTexture(item.texture.texture)

            if (item.program?.program) S.gl.deleteProgram(item.program.program)
        }

        S.shouldRender = true
    }, [])

    const scheduleRender = useCallback(() => {
        S.shouldRender = true
    }, [])

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
            zIndex: "100",
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

        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
            ...lenisOptions,
        })

        lenis.on("scroll", ({ scroll }) => {
            S.scroll = scroll
            const H = window.innerHeight,
                W = window.innerWidth
            for (const item of S.items) {
                item.mesh.position.y =
                    scroll + H / 2 - item.absTop - item.height / 2
                item.mesh.position.x = -W / 2 + item.left + item.width / 2
            }
            S.shouldRender = true
        })

        const tick = (time) => {
            S.rafId = requestAnimationFrame(tick)
            lenis.raf(time)
            if (S.shouldRender) {
                renderer.render({ scene, camera })
                S.shouldRender = false
            }
        }
        S.rafId = requestAnimationFrame(tick)

        const onResize = () => {
            syncCamera()

            const W = window.innerWidth
            const H = window.innerHeight

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
            cancelAnimationFrame(S.rafId)
            window.removeEventListener("resize", onResize)
            gl.canvas.remove()
            S.ready = false
        }
    }, [])

    const ctx = useMemo(
        () => ({ subscribe, addItem, removeItem, scheduleRender }),
        []
    )
    return <SceneContext.Provider value={ctx}>{children}</SceneContext.Provider>
}

export const useScene = () => useContext(SceneContext)
