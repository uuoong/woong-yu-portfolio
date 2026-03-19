/**
 * scene.js — OGL WebGL 싱글톤
 */

import { Renderer, Camera, Transform } from "ogl"

const _S = {
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
}

let _initialized = false

function _subscribe(cb) {
    if (_S.ready) {
        cb(_S)
    } else {
        _S.pending.push(cb)
    }
    return () => {
        _S.pending = _S.pending.filter((x) => x !== cb)
    }
}

function _addItem(item) {
    _S.items.push(item)
    item.mesh.setParent(_S.scene)
    _S.shouldRender = true
}

function _removeItem(item) {
    _S.items = _S.items.filter((i) => i !== item)
    if (_S.scene) _S.scene.removeChild(item.mesh)
    item.geometry?.remove?.()
    if (_S.gl) {
        if (item.texture?.texture) _S.gl.deleteTexture(item.texture.texture)
        if (item.program?.program) _S.gl.deleteProgram(item.program.program)
    }
    _S.shouldRender = true
}

function _scheduleRender() {
    _S.shouldRender = true
}

export const sceneCtx = {
    subscribe: _subscribe,
    addItem: _addItem,
    removeItem: _removeItem,
    scheduleRender: _scheduleRender,
}

export function useScene() {
    return sceneCtx
}

/**
 * initScene(onScrollCallback)
 *
 * GL이 있는 페이지에서 useEffect 내부에서 한 번만 호출.
 * onScrollCallback: Scroll.js의 onScrollCallback 함수
 *
 * 사용:
 *   const { onScrollCallback } = useScrollContext()
 *   useEffect(() => { initScene(onScrollCallback) }, [])
 */
export function initScene(onScrollCallback) {
    if (_initialized) return

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

    // Scroll.js onScrollCallback으로 스크롤 구독
    if (typeof onScrollCallback === "function") {
        onScrollCallback({
            key: "__glScene__",
            callback: ({ scroll }) => {
                _S.scroll = scroll
                const H = window.innerHeight,
                    W = window.innerWidth
                for (const item of _S.items) {
                    item.mesh.position.y =
                        scroll + H / 2 - item.absTop - item.height / 2
                    item.mesh.position.x = -W / 2 + item.left + item.width / 2
                }
                _S.shouldRender = true
            },
        })
    }

    const tick = () => {
        _S.rafId = requestAnimationFrame(tick)
        if (_S.shouldRender) {
            renderer.render({ scene, camera })
            _S.shouldRender = false
        }
    }
    _S.rafId = requestAnimationFrame(tick)

    window.addEventListener("resize", () => {
        syncCamera()
        const W = window.innerWidth,
            H = window.innerHeight
        for (const item of _S.items) {
            item.recompute()
            item.mesh.position.set(
                -W / 2 + item.left + item.width / 2,
                _S.scroll + H / 2 - item.absTop - item.height / 2,
                0
            )
            item.mesh.scale.set(item.width, item.height, 1)
            item.program.uniforms.uElementSize.value[0] = item.width
            item.program.uniforms.uElementSize.value[1] = item.height
        }
        _S.shouldRender = true
    })

    Object.assign(_S, { ready: true, gl, renderer, scene, camera })
    _S.pending.forEach((cb) => cb(_S))
    _S.pending = []

    _initialized = true
}
